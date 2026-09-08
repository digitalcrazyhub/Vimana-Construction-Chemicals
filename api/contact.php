<?php
declare(strict_types=1);

// ============================================================
// IMPORTANT: This API always returns JSON and never exposes PHP
// warnings, credentials, stack traces, or infrastructure details.
// ============================================================
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/includes/security.php';
require_once dirname(__DIR__) . '/includes/db.php';
require_once dirname(__DIR__) . '/includes/mail.php';
require_once dirname(__DIR__) . '/includes/google-sheets.php';

function log_contact_error(string $message, ?Throwable $exception = null): void
{
    $line = '[' . gmdate('c') . '] ' . $message;
    if ($exception) $line .= ' | ' . $exception->getMessage();
    @file_put_contents(CONTACT_LOG_FILE, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) return false;
    log_contact_error('PHP runtime warning: ' . $message . ' at line ' . $line);
    return true;
});
set_exception_handler(static function (Throwable $exception): void {
    log_contact_error('Unhandled exception', $exception);
    json_response(['success' => false, 'message' => 'We could not process your enquiry right now. Please try again later.'], 500);
});

function json_response(array $payload, int $status): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (APP_SECRET === 'CHANGE_THIS_TO_A_LONG_RANDOM_SECRET') {
    log_contact_error('Contact API is not configured: CONTACT_APP_SECRET is still a placeholder.');
    json_response(['success' => false, 'message' => 'We could not process your enquiry right now. Please try again later.'], 500);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['action'] ?? '') === 'csrf') {
    json_response(['success' => true, 'token' => issue_csrf_token()], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
}

// ============================================================
// SECURITY: Verify the signed CSRF token before processing any
// form data. Static HTML obtains it with the GET action above.
// ============================================================
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? (string) ($_POST['csrf_token'] ?? '');
if (!verify_csrf_token($csrfToken)) {
    json_response(['success' => false, 'message' => 'Your secure session has expired. Please refresh and try again.'], 403);
}

$ipAddress = client_ip();
if (!enforce_rate_limit($ipAddress)) {
    json_response(['success' => false, 'message' => 'Please wait a few minutes before sending another enquiry.'], 429);
}

// ============================================================
// IMPORTANT: The honeypot is intentionally not shown to people.
// A filled honeypot is treated like a normal generic failure.
// ============================================================
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    json_response(['success' => false, 'message' => 'We could not process your enquiry right now. Please try again later.'], 400);
}

$rawCaptcha = (string) ($_POST['g-recaptcha-response'] ?? '');
if (RECAPTCHA_SECRET_KEY === '') {
    log_contact_error('Contact API is not configured: RECAPTCHA_SECRET_KEY is missing.');
    json_response(['success' => false, 'message' => 'We could not process your enquiry right now. Please try again later.'], 500);
}
if (!verify_recaptcha($rawCaptcha, $ipAddress)) {
    json_response(['success' => false, 'message' => 'Please complete the security verification and try again.'], 400);
}

// ============================================================
// IMPORTANT: Validate every field on the server. Browser checks
// improve usability but are never a security boundary.
// ============================================================
$lead = [
    // Keep one extra character so overlong input is rejected, not silently truncated.
    'fullName' => clean_text($_POST['fullName'] ?? '', 101),
    'email' => clean_text($_POST['email'] ?? '', 151),
    'phone' => clean_text($_POST['phone'] ?? '', 21),
    'subject' => clean_text($_POST['subject'] ?? '', 100),
    'message' => clean_text($_POST['message'] ?? '', 2001, true),
];
$allowedSubjects = [
    'waterproofing' => 'Waterproofing Solutions',
    'concrete-admixtures' => 'Concrete Admixtures',
    'protective-coatings' => 'Protective Coatings',
    'structural-repair' => 'Structural Repair & Grouting',
    'technical-consultation' => 'Technical & Project Consultation',
    'dealership' => 'Dealership & Distribution',
];
$errors = [];
$nameLength = function_exists('mb_strlen') ? mb_strlen($lead['fullName'], 'UTF-8') : strlen($lead['fullName']);
$messageLength = function_exists('mb_strlen') ? mb_strlen($lead['message'], 'UTF-8') : strlen($lead['message']);
if ($nameLength < 2 || $nameLength > 100 || !preg_match("/^[\\p{L}\\p{M}][\\p{L}\\p{M} .'-]*$/u", $lead['fullName'])) $errors['fullName'] = 'Please enter your full name';
if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL) || strlen($lead['email']) > 150) $errors['email'] = 'Please enter a valid email address';
$phoneDigits = preg_replace('/\D+/', '', $lead['phone']);
if (!preg_match('/^[0-9+()\-\s]{7,20}$/', $lead['phone']) || strlen($phoneDigits) < 7 || strlen($phoneDigits) > 15) $errors['phone'] = 'Please enter a valid phone number';
if (!array_key_exists($lead['subject'], $allowedSubjects)) $errors['subject'] = 'Please select a subject area';
if ($messageLength < 10 || $messageLength > 2000) $errors['message'] = 'Please enter your message (at least 10 characters)';
if ($errors) json_response(['success' => false, 'message' => 'Please correct the highlighted fields.', 'errors' => $errors], 400);

$lead['subjectLabel'] = $allowedSubjects[$lead['subject']];
$lead['ipAddress'] = $ipAddress;
$lead['submittedAt'] = gmdate('c');
$userAgent = clean_text($_SERVER['HTTP_USER_AGENT'] ?? '', 500);

try {
    $pdo = database();
    // Duplicate protection is checked server-side using the validated values.
    $duplicate = $pdo->prepare('SELECT id FROM contact_leads WHERE email = :email AND message = :message AND created_at >= (UTC_TIMESTAMP() - INTERVAL 10 MINUTE) LIMIT 1');
    $duplicate->execute(['email' => $lead['email'], 'message' => $lead['message']]);
    if ($duplicate->fetch()) json_response(['success' => false, 'message' => 'This enquiry was already received.'], 429);

    // ============================================================
    // IMPORTANT: Store the lead before calling email or Google Sheets.
    // External services must never cause the lead to be lost.
    // ============================================================
    $insert = $pdo->prepare('INSERT INTO contact_leads (full_name, email, phone, subject, message, ip_address, user_agent) VALUES (:full_name, :email, :phone, :subject, :message, :ip_address, :user_agent)');
    $insert->execute([
        'full_name' => $lead['fullName'], 'email' => $lead['email'], 'phone' => $lead['phone'],
        'subject' => $lead['subjectLabel'], 'message' => $lead['message'], 'ip_address' => $ipAddress, 'user_agent' => $userAgent,
    ]);
    $leadId = (int) $pdo->lastInsertId();
} catch (Throwable $exception) {
    log_contact_error('Database connection or insert failure', $exception);
    json_response(['success' => false, 'message' => 'We could not process your enquiry right now. Please try again later.'], 500);
}

$customerEmailStatus = 0;
$clientEmailStatus = 0;
$googleSheetStatus = 0;
try {
    $customerEmailStatus = send_lead_email($lead, true) ? 1 : 0;
} catch (Throwable $exception) {
    log_contact_error('Customer confirmation email failure for lead ' . $leadId, $exception);
}
try {
    $clientEmailStatus = send_lead_email($lead, false) ? 1 : 0;
} catch (Throwable $exception) {
    log_contact_error('Client lead email failure for lead ' . $leadId, $exception);
}
try {
    $googleSheetStatus = send_to_google_sheet($lead) ? 1 : 0;
    if (!$googleSheetStatus) log_contact_error('Google Sheets webhook is not configured for lead ' . $leadId);
} catch (Throwable $exception) {
    log_contact_error('Google Sheets failure for lead ' . $leadId, $exception);
}

try {
    $statusUpdate = $pdo->prepare('UPDATE contact_leads SET email_customer_status = :customer, email_client_status = :client, google_sheet_status = :sheet WHERE id = :id');
    $statusUpdate->execute(['customer' => $customerEmailStatus, 'client' => $clientEmailStatus, 'sheet' => $googleSheetStatus, 'id' => $leadId]);
} catch (Throwable $exception) {
    log_contact_error('Status update failure for lead ' . $leadId, $exception);
}

json_response(['success' => true, 'message' => 'Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.'], 200);

function verify_recaptcha(string $token, string $ipAddress): bool
{
    if ($token === '' || !function_exists('curl_init')) return false;
    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['secret' => RECAPTCHA_SECRET_KEY, 'response' => $token, 'remoteip' => $ipAddress]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);
    $body = curl_exec($ch);
    curl_close($ch);
    $result = is_string($body) ? json_decode($body, true) : null;
    return is_array($result) && ($result['success'] ?? false) === true;
}
