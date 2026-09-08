<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

// ============================================================
// IMPORTANT: Install PHPMailer with Composer before deployment.
// SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD and the
// encryption setting belong in server-side environment variables.
// The customer's address is never used as From.
// ============================================================
function createMailer(): PHPMailer
{
    // Composer's autoloader must remain server-side and must never be exposed.
    $autoload = __DIR__ . '/../vendor/autoload.php';
    if (!is_file($autoload)) throw new RuntimeException('PHPMailer is not installed.');
    require_once $autoload;

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->Port = SMTP_PORT;
    $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = 'UTF-8';
    $mail->SMTPDebug = 0;
    return $mail;
}

function send_lead_email(array $lead, bool $customerMessage): bool
{
    // Both email flows use the same authenticated PHPMailer SMTP factory.
    $mail = createMailer();

    $safeName = htmlspecialchars($lead['fullName'], ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($lead['email'], ENT_QUOTES, 'UTF-8');
    $safePhone = htmlspecialchars($lead['phone'], ENT_QUOTES, 'UTF-8');
    $safeSubject = htmlspecialchars($lead['subjectLabel'], ENT_QUOTES, 'UTF-8');
    $safeMessage = nl2br(htmlspecialchars($lead['message'], ENT_QUOTES, 'UTF-8'));

    if ($customerMessage) {
        // IMPORTANT: Reply remains no-reply as requested; never use the
        // submitted customer email as From or Reply-To for this message.
        $mail->addAddress($lead['email'], $lead['fullName']);
        $mail->addReplyTo(MAIL_NO_REPLY, MAIL_FROM_NAME);
        $mail->Subject = 'We received your enquiry - Vimana Construction Chemicals';
        $mail->Body = "<h2>Thank you, {$safeName}</h2><p>We received your enquiry about <strong>{$safeSubject}</strong>.</p><p><strong>Your message:</strong><br>{$safeMessage}</p><p>Our technical team will review your request and contact you shortly.</p><p>Vimana Construction Chemicals<br>Phone: +91 78454 01301<br>Email: " . htmlspecialchars(MAIL_FROM, ENT_QUOTES, 'UTF-8') . '</p>';
    } else {
        // The lead email is replyable: customer email is validated before
        // being used only as Reply-To, never as the sender.
        $mail->addAddress(CLIENT_EMAIL);
        $mail->addReplyTo($lead['email'], $lead['fullName']);
        $mail->Subject = 'New Website Contact Lead';
        $mail->Body = "<h2>New Website Contact Lead</h2><p><strong>Name:</strong> {$safeName}<br><strong>Email:</strong> {$safeEmail}<br><strong>Phone:</strong> {$safePhone}<br><strong>Subject:</strong> {$safeSubject}<br><strong>Message:</strong><br>{$safeMessage}<br><strong>Date:</strong> " . htmlspecialchars($lead['submittedAt'], ENT_QUOTES, 'UTF-8') . '<br><strong>IP Address:</strong> ' . htmlspecialchars($lead['ipAddress'], ENT_QUOTES, 'UTF-8') . '</p>';
    }
    $mail->isHTML(true);
    $mail->AltBody = strip_tags($mail->Body);
    try {
        return $mail->send();
    } catch (Exception $exception) {
        // The API logs this server-side and returns only a generic response.
        throw new RuntimeException('PHPMailer send failed: ' . $mail->ErrorInfo, 0, $exception);
    }
}
