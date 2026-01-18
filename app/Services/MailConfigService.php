<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;

class MailConfigService
{
    public static function setDynamicConfig()
    {
        $settings = [
            'driver' => getSetting('email_driver', 'smtp'),
            'host' => getSetting('email_host', 'smtp.example.com'),
            'port' => getSetting('email_port', '587'),
            'username' => getSetting('email_username', ''),
            'password' => getSetting('email_password', ''),
            'encryption' => getSetting('email_encryption', 'tls'),
            'fromAddress' => getSetting('email_from_address', 'noreply@example.com'),
            'fromName' => getSetting('email_from_name', 'Vimstack System')
        ];

        Config::set([
            'mail.default' => $settings['driver'],
            'mail.mailers.smtp.host' => $settings['host'],
            'mail.mailers.smtp.port' => $settings['port'],
            'mail.mailers.smtp.encryption' => $settings['encryption'] === 'none' ? null : $settings['encryption'],
            'mail.mailers.smtp.username' => $settings['username'],
            'mail.mailers.smtp.password' => $settings['password'],
            'mail.from.address' => $settings['fromAddress'],
            'mail.from.name' => $settings['fromName'],
        ]);
    }
}