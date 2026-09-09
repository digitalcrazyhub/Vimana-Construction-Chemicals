<?php
declare(strict_types=1);

// ============================================================
// CENTRAL CONFIGURATION
// ============================================================

function env_value(string $name, string $default = ''): string
{
    $value = getenv($name);

    if ($value === false || trim((string)$value) === '') {
        return $default;
    }

    return trim((string)$value);
}


// ============================================================
// LOCAL CONFIG
//
// For XAMPP, actual client credentials should be stored in:
// config/config.local.php
//
// Do NOT commit config.local.php to Git.
// ============================================================

$localConfig = __DIR__ . '/config.local.php';

if (is_file($localConfig)) {
    require_once $localConfig;
}


// ============================================================
// DATABASE
// ============================================================

if (!defined('DB_HOST')) {
    define('DB_HOST', env_value('DB_HOST', '127.0.0.1'));
}

if (!defined('DB_PORT')) {
    define('DB_PORT', env_value('DB_PORT', '3306'));
}

if (!defined('DB_NAME')) {
    define('DB_NAME', env_value('DB_NAME', 'vimana'));
}

if (!defined('DB_USER')) {
    define('DB_USER', env_value('DB_USER', 'root'));
}

if (!defined('DB_PASS')) {
    define('DB_PASS', env_value('DB_PASS', ''));
}


// ============================================================
// EMAIL
//
// CHANGE THESE FOR EVERY NEW CLIENT.
// Actual values should be in config.local.php.
// ============================================================

if (!defined('SMTP_HOST')) {
    define('SMTP_HOST', env_value('SMTP_HOST', 'smtp.gmail.com'));
}

if (!defined('SMTP_PORT')) {
    define('SMTP_PORT', (int)env_value('SMTP_PORT', '587'));
}

if (!defined('SMTP_USERNAME')) {
    define('SMTP_USERNAME', env_value('SMTP_USERNAME'));
}

if (!defined('SMTP_PASSWORD')) {
    define('SMTP_PASSWORD', env_value('SMTP_PASSWORD'));
}

if (!defined('SMTP_ENCRYPTION')) {
    define(
        'SMTP_ENCRYPTION',
        strtolower(env_value('SMTP_ENCRYPTION', 'tls'))
    );
}

if (!defined('MAIL_FROM')) {
    define('MAIL_FROM', env_value('MAIL_FROM'));
}

if (!defined('MAIL_FROM_NAME')) {
    define(
        'MAIL_FROM_NAME',
        env_value('MAIL_FROM_NAME', 'Vimana Construction Chemicals')
    );
}

if (!defined('MAIL_NO_REPLY')) {
    define('MAIL_NO_REPLY', env_value('MAIL_NO_REPLY'));
}

if (!defined('CLIENT_EMAIL')) {
    define('CLIENT_EMAIL', env_value('CLIENT_EMAIL'));
}


// ============================================================
// GOOGLE SHEETS
// ============================================================

if (!defined('GOOGLE_SHEET_WEBHOOK')) {
    define(
        'GOOGLE_SHEET_WEBHOOK',
        env_value('GOOGLE_SHEET_WEBHOOK')
    );
}


// ============================================================
// reCAPTCHA V3
// ============================================================

if (!defined('RECAPTCHA_SITE_KEY')) {
    define(
        'RECAPTCHA_SITE_KEY',
        env_value('RECAPTCHA_SITE_KEY')
    );
}

if (!defined('RECAPTCHA_SECRET_KEY')) {
    define(
        'RECAPTCHA_SECRET_KEY',
        env_value('RECAPTCHA_SECRET_KEY')
    );
}

if (!defined('RECAPTCHA_MIN_SCORE')) {
    define(
        'RECAPTCHA_MIN_SCORE',
        (float)env_value('RECAPTCHA_MIN_SCORE', '0.5')
    );
}


// ============================================================
// LOGGING
// ============================================================

if (!defined('CONTACT_LOG_FILE')) {
    define(
        'CONTACT_LOG_FILE',
        dirname(__DIR__) . '/logs/contact_errors.log'
    );
}

if (!defined('CONTACT_RATE_DIR')) {
    define(
        'CONTACT_RATE_DIR',
        dirname(__DIR__) . '/logs/rate-limit'
    );
}