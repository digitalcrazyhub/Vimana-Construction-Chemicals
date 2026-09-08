<?php
declare(strict_types=1);

// ============================================================
// IMPORTANT: This endpoint serves a static HTML page, so CSRF is
// protected with a short-lived HMAC token instead of a PHP-rendered
// session token. APP_SECRET stays server-side.
// ============================================================
function issue_csrf_token(): string
{
    $issuedAt = time();
    $payload = $issuedAt . '.' . bin2hex(random_bytes(16));
    $signature = hash_hmac('sha256', $payload, APP_SECRET);
    return base64_encode($payload . '.' . $signature);
}

function verify_csrf_token(string $token): bool
{
    $decoded = base64_decode($token, true);
    if ($decoded === false) return false;
    $parts = explode('.', $decoded);
    if (count($parts) !== 3 || !ctype_digit($parts[0])) return false;
    if (time() - (int) $parts[0] > 1800 || (int) $parts[0] > time() + 60) return false;
    $payload = $parts[0] . '.' . $parts[1];
    return hash_equals(hash_hmac('sha256', $payload, APP_SECRET), $parts[2]);
}

function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

function clean_text($value, int $maxLength, bool $preserveNewlines = false): string
{
    if (!is_string($value)) return '';
    $value = trim($value);
    $pattern = $preserveNewlines ? '/[^\P{C}\r\n\t]/u' : '/[^\P{C}\t]/u';
    $value = preg_replace($pattern, '', $value) ?? '';
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength, 'UTF-8') : substr($value, 0, $maxLength);
}

function enforce_rate_limit(string $ip): bool
{
    if (!is_dir(CONTACT_RATE_DIR)) @mkdir(CONTACT_RATE_DIR, 0700, true);
    $file = CONTACT_RATE_DIR . '/' . hash('sha256', $ip) . '.json';
    $handle = @fopen($file, 'c+');
    if (!$handle) return true; // Do not reject legitimate leads if storage is unavailable.
    flock($handle, LOCK_EX);
    $data = json_decode(stream_get_contents($handle) ?: '{}', true) ?: [];
    $now = time();
    $recent = array_values(array_filter($data, static fn($timestamp): bool => $timestamp > $now - 900));
    $allowed = count($recent) < 5;
    if ($allowed) $recent[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($recent));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}
