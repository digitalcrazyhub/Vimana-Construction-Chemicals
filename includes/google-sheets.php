<?php
declare(strict_types=1);

// ============================================================
// IMPORTANT: Google Sheets is external. A webhook failure must
// never delete or invalidate the MySQL lead already stored.
// ============================================================
function send_to_google_sheet(array $lead): bool
{
    if (GOOGLE_SHEET_WEBHOOK === '') return false;
    $payload = json_encode([
        'fullName' => $lead['fullName'],
        'email' => $lead['email'],
        'phone' => $lead['phone'],
        'subject' => $lead['subjectLabel'],
        'message' => $lead['message'],
        'submittedAt' => $lead['submittedAt'],
        'ipAddress' => $lead['ipAddress'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ch = curl_init(GOOGLE_SHEET_WEBHOOK);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    if ($body === false || $status < 200 || $status >= 300) {
        throw new RuntimeException('Google Sheets webhook failed: HTTP ' . $status . ' ' . $error);
    }
    return true;
}
