<?php
declare(strict_types=1);

// ============================================================
// SIMPLE CONTACT API
// This endpoint accepts only POST requests, validates input,
// verifies reCAPTCHA v3, stores the lead in MySQL, sends emails,
// pushes the result to Google Sheets, and returns a JSON response.
// ============================================================
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/mail.php';
require_once __DIR__ . '/../includes/google-sheets.php';

function logContactError(string $message, ?Throwable $exception = null): void
{
    if (!defined('CONTACT_LOG_FILE')) {
        return;
    }

    $line = '[' . gmdate('c') . '] ' . $message;
    if ($exception instanceof Throwable) {
        $line .= ' | ' . $exception->getMessage();
    }

    @file_put_contents(CONTACT_LOG_FILE, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sanitizeText($value, int $maxLength, bool $preserveNewlines = false): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);

    if (!$preserveNewlines) {
        $value = str_replace(["\r", "\n"], ' ', $value);
    }

    $value = preg_replace('/[\x00-\x1F\x7F]+/', '', $value) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function verifyRecaptcha(string $token, string $ipAddress): bool
{
    if (trim($token) === '' || !function_exists('curl_init')) {
        return false;
    }

    $secret = defined('RECAPTCHA_SECRET_KEY') ? (string) RECAPTCHA_SECRET_KEY : '';
    if ($secret === '') {
        logContactError('reCAPTCHA secret key is missing.');
        return false;
    }

    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $ipAddress,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
    ]);

    $body = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body === false || $httpCode < 200 || $httpCode >= 300) {
        logContactError('reCAPTCHA verification request failed. HTTP code: ' . $httpCode);
        return false;
    }

    $result = json_decode((string) $body, true);
    if (!is_array($result)) {
        logContactError('reCAPTCHA response was not valid JSON.');
        return false;
    }

    $success = ($result['success'] ?? false) === true;
    $action = (string) ($result['action'] ?? '');
    $score = isset($result['score']) ? (float) $result['score'] : 0.0;
    $minScore = defined('RECAPTCHA_MIN_SCORE') ? (float) RECAPTCHA_MIN_SCORE : 0.5;

    if (!$success || $action !== 'contact' || $score < $minScore) {
        logContactError('reCAPTCHA validation failed: ' . json_encode($result));
        return false;
    }

    return true;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$fullName = sanitizeText($_POST['fullName'] ?? '', 100);
$email = sanitizeText($_POST['email'] ?? '', 150);
$phone = sanitizeText($_POST['phone'] ?? '', 20);
$subject = sanitizeText($_POST['subject'] ?? '', 100);
$message = sanitizeText($_POST['message'] ?? '', 2000, true);
$captcha = trim((string) ($_POST['g-recaptcha-response'] ?? ''));
$honeypot = trim((string) ($_POST['website'] ?? ''));
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$userAgent = sanitizeText($_SERVER['HTTP_USER_AGENT'] ?? '', 500);

if ($honeypot !== '') {
    jsonResponse(['success' => false, 'message' => 'Unable to process your enquiry. Please try again.'], 400);
}

if ($fullName === '' || $email === '' || $phone === '' || $subject === '' || $message === '') {
    jsonResponse(['success' => false, 'message' => 'Please complete all required fields.'], 400);
}

if (!preg_match('/^[\p{L}\p{M}][\p{L}\p{M} .\'-]{1,99}$/u', $fullName)) {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid full name.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid email address.'], 400);
}

if (!preg_match('/^[0-9+()\-\s]{7,20}$/', $phone) || preg_replace('/\D+/', '', $phone) === '') {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid phone number.'], 400);
}

$messageLength = function_exists('mb_strlen') ? mb_strlen($message, 'UTF-8') : strlen($message);
if ($message === '' || $messageLength < 10) {
    jsonResponse(['success' => false, 'message' => 'Please enter a message with at least 10 characters.'], 400);
}

if (!verifyRecaptcha($captcha, $ipAddress)) {
    jsonResponse(['success' => false, 'message' => 'Security verification failed. Please try again.'], 400);
}

$allowedSubjects = [
    'waterproofing' => 'Waterproofing Solutions',
    'concrete-admixtures' => 'Concrete Admixtures',
    'protective-coatings' => 'Protective Coatings',
    'structural-repair' => 'Structural Repair & Grouting',
    'technical-consultation' => 'Technical & Project Consultation',
    'dealership' => 'Dealership & Distribution',
];

if (!isset($allowedSubjects[$subject])) {
    jsonResponse(['success' => false, 'message' => 'Please select a valid subject.'], 400);
}

$lead = [
    'fullName' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'subject' => $subject,
    'subjectLabel' => $allowedSubjects[$subject],
    'message' => $message,
];

try {
    $pdo = getDatabase();
    $stmt = $pdo->prepare('INSERT INTO contact_leads (full_name, email, phone, subject, message) VALUES (:full_name, :email, :phone, :subject, :message)');
    $stmt->execute([
        'full_name' => $lead['fullName'],
        'email' => $lead['email'],
        'phone' => $lead['phone'],
        'subject' => $lead['subjectLabel'],
        'message' => $lead['message'],
    ]);
    $leadId = (int) $pdo->lastInsertId();
} catch (Throwable $exception) {
    logContactError('Database insert failed.', $exception);
    jsonResponse(['success' => false, 'message' => 'We could not process your enquiry right now. Please try again later.'], 500);
}

$customerEmailStatus = 0;
$clientEmailStatus = 0;
$googleSheetStatus = 0;

try {
    $customerEmailStatus = sendCustomerConfirmationEmail($lead) ? 1 : 0;
} catch (Throwable $exception) {
    logContactError('Customer confirmation email failed for lead ' . $leadId, $exception);
}

try {
    $clientEmailStatus = sendOwnerLeadEmail($lead) ? 1 : 0;
} catch (Throwable $exception) {
    logContactError('Client lead email failed for lead ' . $leadId, $exception);
}

try {
    $googleSheetStatus = sendToGoogleSheet($lead) ? 1 : 0;
} catch (Throwable $exception) {
    logContactError('Google Sheets webhook failed for lead ' . $leadId, $exception);
}

try {
    $update = $pdo->prepare('UPDATE contact_leads SET email_customer_status = :customer_status, email_client_status = :client_status, google_sheet_status = :sheet_status WHERE id = :id');
    $update->execute([
        'customer_status' => $customerEmailStatus,
        'client_status' => $clientEmailStatus,
        'sheet_status' => $googleSheetStatus,
        'id' => $leadId,
    ]);
} catch (Throwable $exception) {
    logContactError('Status update failed for lead ' . $leadId, $exception);
}

jsonResponse(['success' => true, 'message' => 'Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.'], 200);
