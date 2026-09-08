<?php
declare(strict_types=1);

// ============================================================
// IMPORTANT: Keep this file outside the public web root when the
// hosting provider supports it. Otherwise protect /config with
// the included web-server rules and never commit real credentials.
// Environment variables are preferred for production deployments.
// ============================================================

function env_value(string $name, string $default = ''): string
{
    $value = getenv($name);
    return $value === false ? $default : trim((string) $value);
}

define('APP_SECRET', env_value('CONTACT_APP_SECRET', 'CHANGE_THIS_TO_A_LONG_RANDOM_SECRET'));
define('DB_HOST', env_value('DB_HOST', 'localhost'));
define('DB_NAME', env_value('DB_NAME', 'vimana'));
define('DB_USER', env_value('DB_USER', 'change_me'));
define('DB_PASS', env_value('DB_PASS', 'change_me'));

define('CLIENT_EMAIL', env_value('CLIENT_EMAIL', 'leads@yourdomain.com'));
define('MAIL_FROM', env_value('MAIL_FROM', 'website@yourdomain.com'));
define('MAIL_FROM_NAME', env_value('MAIL_FROM_NAME', 'Vimana Construction Chemicals'));
define('MAIL_NO_REPLY', env_value('MAIL_NO_REPLY', 'no-reply@yourdomain.com'));

// SMTP credentials must be supplied by environment variables or an
// equivalent secret store. They must never be sent to the browser.
define('SMTP_HOST', env_value('SMTP_HOST', 'smtp.yourdomain.com'));
define('SMTP_PORT', (int) env_value('SMTP_PORT', '587'));
define('SMTP_USERNAME', env_value('SMTP_USERNAME', ''));
define('SMTP_PASSWORD', env_value('SMTP_PASSWORD', ''));
define('SMTP_ENCRYPTION', env_value('SMTP_ENCRYPTION', 'tls'));

define('GOOGLE_SHEET_WEBHOOK', env_value('GOOGLE_SHEET_WEBHOOK', ''));

// IMPORTANT: The site key may appear in HTML; the secret key must not.
define('RECAPTCHA_SITE_KEY', env_value('RECAPTCHA_SITE_KEY', 'YOUR_RECAPTCHA_SITE_KEY'));
define('RECAPTCHA_SECRET_KEY', env_value('RECAPTCHA_SECRET_KEY', ''));

define('CONTACT_LOG_FILE', dirname(__DIR__) . '/logs/contact_errors.log');
define('CONTACT_RATE_DIR', dirname(__DIR__) . '/logs/rate-limit');
