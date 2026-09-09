<?php
declare(strict_types=1);

// ============================================================
// GOOGLE SHEETS WEBHOOK
// This sends the lead to the client's Google Sheet using a simple
// server-side POST request. Keep the webhook URL in config.php.
// For another client, replace GOOGLE_SHEET_WEBHOOK and ensure the
// sheet tab name still matches the Apps Script logic.
// ============================================================
function sendToGoogleSheet(array $lead): bool
{
    if (!defined('GOOGLE_SHEET_WEBHOOK') || trim((string) GOOGLE_SHEET_WEBHOOK) === '') {
        return false;
    }

    $payload = json_encode([
        'fullName' => $lead['fullName'],
        'email' => $lead['email'],
        'phone' => $lead['phone'],
        'subject' => $lead['subjectLabel'],
        'message' => $lead['message'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $ch = curl_init(GOOGLE_SHEET_WEBHOOK);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
    ]);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        throw new RuntimeException('Google Sheets webhook failed: HTTP ' . $httpCode . ' | ' . $error);
    }

    return true;
}
