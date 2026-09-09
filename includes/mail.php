<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

// ============================================================
// EMAIL CONFIGURATION
//
// This file sends:
// 1. Customer confirmation email
// 2. Website owner lead email
//
// IMPORTANT FOR FUTURE CLIENTS:
// - Change SMTP settings in config.local.php
// - Change CLIENT_EMAIL for the business owner
// - Do NOT hardcode a customer email
// - Customer email always comes from the submitted form
// ============================================================

function createMailer(): PHPMailer
{
    // Load PHPMailer installed by Composer.
    $autoload = __DIR__ . '/../vendor/autoload.php';

    if (!is_file($autoload)) {
        throw new RuntimeException(
            'PHPMailer is not installed. Run composer install.'
        );
    }

    require_once $autoload;

    $mail = new PHPMailer(true);

    // --------------------------------------------------------
    // SMTP SETTINGS
    // Change these values in config.local.php for a new client.
    // --------------------------------------------------------
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->Port = SMTP_PORT;

    if (SMTP_ENCRYPTION === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }

    $mail->CharSet = 'UTF-8';
    $mail->SMTPDebug = 0;

    // --------------------------------------------------------
    // SENDER
    // This is the business email used to send the message.
    // Never use the customer's submitted email as From.
    // --------------------------------------------------------
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);

    return $mail;
}


// ============================================================
// CUSTOMER CONFIRMATION EMAIL
//
// PURPOSE:
// Sends a confirmation directly to the customer.
//
// IMPORTANT:
// The recipient MUST come from $lead['email'].
// Never replace this with CLIENT_EMAIL.
// ============================================================
function sendCustomerConfirmationEmail(array $lead): bool
{
    $customerEmail = trim((string)($lead['email'] ?? ''));

    if (
        $customerEmail === '' ||
        !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)
    ) {
        throw new InvalidArgumentException(
            'Invalid customer email address.'
        );
    }

    $mail = createMailer();

    $customerName = htmlspecialchars(
        (string)$lead['fullName'],
        ENT_QUOTES,
        'UTF-8'
    );

    $subjectLabel = htmlspecialchars(
        (string)$lead['subjectLabel'],
        ENT_QUOTES,
        'UTF-8'
    );

    $message = nl2br(
        htmlspecialchars(
            (string)$lead['message'],
            ENT_QUOTES,
            'UTF-8'
        )
    );

    // CUSTOMER RECIPIENT
    // Always use the email entered by the customer.
    $mail->addAddress(
        $customerEmail,
        (string)$lead['fullName']
    );

    // Customer should not reply to the customer address.
    $mail->addReplyTo(
        MAIL_NO_REPLY,
        MAIL_FROM_NAME
    );

    $mail->Subject =
        'We received your enquiry - Vimana Construction Chemicals';

    $mail->isHTML(true);

    $mail->Body = "
        <h2>Thank you, {$customerName}</h2>

        <p>
            We received your enquiry regarding
            <strong>{$subjectLabel}</strong>.
        </p>

        <p>
            <strong>Your message:</strong><br>
            {$message}
        </p>

        <p>
            Our team will contact you shortly.
        </p>
    ";

    $mail->AltBody =
        "Thank you, {$lead['fullName']}\n\n" .
        "We received your enquiry regarding {$lead['subjectLabel']}.\n\n" .
        "Your message:\n{$lead['message']}\n\n" .
        "Our team will contact you shortly.";

    try {
        return $mail->send();
    } catch (Exception $exception) {
        throw new RuntimeException(
            'Customer email failed: ' . $mail->ErrorInfo,
            0,
            $exception
        );
    }
}


// ============================================================
// WEBSITE OWNER LEAD EMAIL
//
// PURPOSE:
// Sends the submitted lead to the business owner.
//
// IMPORTANT:
// Recipient = CLIENT_EMAIL
// Reply-To = customer's submitted email
// ============================================================
function sendOwnerLeadEmail(array $lead): bool
{
    $mail = createMailer();

    $customerEmail = trim((string)$lead['email']);

    $name = htmlspecialchars(
        (string)$lead['fullName'],
        ENT_QUOTES,
        'UTF-8'
    );

    $email = htmlspecialchars(
        $customerEmail,
        ENT_QUOTES,
        'UTF-8'
    );

    $phone = htmlspecialchars(
        (string)$lead['phone'],
        ENT_QUOTES,
        'UTF-8'
    );

    $subjectLabel = htmlspecialchars(
        (string)$lead['subjectLabel'],
        ENT_QUOTES,
        'UTF-8'
    );

    $message = nl2br(
        htmlspecialchars(
            (string)$lead['message'],
            ENT_QUOTES,
            'UTF-8'
        )
    );

    // WEBSITE OWNER
    // Change CLIENT_EMAIL for another client.
    $mail->addAddress(CLIENT_EMAIL);

    // When the owner clicks Reply, reply directly to the customer.
    $mail->addReplyTo(
        $customerEmail,
        (string)$lead['fullName']
    );

    $mail->Subject = 'New Website Contact Lead';

    $mail->isHTML(true);

    // IMPORTANT:
    // Only Name, Email, Phone, Subject and Message.
    // Do not include IP, date, user agent or debug information.
    $mail->Body = "
        <h2>New Website Contact Lead</h2>

        <p>
            <strong>Name:</strong> {$name}<br>
            <strong>Email:</strong> {$email}<br>
            <strong>Phone:</strong> {$phone}<br>
            <strong>Subject:</strong> {$subjectLabel}<br>
            <strong>Message:</strong><br>
            {$message}
        </p>
    ";

    $mail->AltBody =
        "Name: {$lead['fullName']}\n" .
        "Email: {$customerEmail}\n" .
        "Phone: {$lead['phone']}\n" .
        "Subject: {$lead['subjectLabel']}\n" .
        "Message: {$lead['message']}";

    try {
        return $mail->send();
    } catch (Exception $exception) {
        throw new RuntimeException(
            'Owner email failed: ' . $mail->ErrorInfo,
            0,
            $exception
        );
    }
}