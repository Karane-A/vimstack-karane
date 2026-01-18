<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if currency data already exists, if yes then skip
        if (Currency::count() > 0) {
            $this->command->info('Currency data already exists. Skipping seeder to preserve existing data.');
            return;
        }


        $currencies = [
            ['name' => 'US Dollar', 'code' => 'USD', 'symbol' => '$', 'description' => 'United States Dollar', 'is_default' => false],
            ['name' => 'Euro', 'code' => 'EUR', 'symbol' => '€', 'description' => 'Euro', 'is_default' => false],
            ['name' => 'British Pound', 'code' => 'GBP', 'symbol' => '£', 'description' => 'British Pound Sterling', 'is_default' => false],
            ['name' => 'Japanese Yen', 'code' => 'JPY', 'symbol' => '¥', 'description' => 'Japanese Yen', 'is_default' => false],
            ['name' => 'Canadian Dollar', 'code' => 'CAD', 'symbol' => 'C$', 'description' => 'Canadian Dollar', 'is_default' => false],
            ['name' => 'Australian Dollar', 'code' => 'AUD', 'symbol' => 'A$', 'description' => 'Australian Dollar', 'is_default' => false],
            ['name' => 'Swiss Franc', 'code' => 'CHF', 'symbol' => 'CHF', 'description' => 'Swiss Franc', 'is_default' => false],
            ['name' => 'Chinese Yuan', 'code' => 'CNY', 'symbol' => '¥', 'description' => 'Chinese Yuan', 'is_default' => false],
            ['name' => 'Swedish Krona', 'code' => 'SEK', 'symbol' => 'kr', 'description' => 'Swedish Krona', 'is_default' => false],
            ['name' => 'New Zealand Dollar', 'code' => 'NZD', 'symbol' => 'NZ$', 'description' => 'New Zealand Dollar', 'is_default' => false],
            ['name' => 'Mexican Peso', 'code' => 'MXN', 'symbol' => '$', 'description' => 'Mexican Peso', 'is_default' => false],
            ['name' => 'Singapore Dollar', 'code' => 'SGD', 'symbol' => 'S$', 'description' => 'Singapore Dollar', 'is_default' => false],
            ['name' => 'Hong Kong Dollar', 'code' => 'HKD', 'symbol' => 'HK$', 'description' => 'Hong Kong Dollar', 'is_default' => false],
            ['name' => 'Norwegian Krone', 'code' => 'NOK', 'symbol' => 'kr', 'description' => 'Norwegian Krone', 'is_default' => false],
            ['name' => 'South Korean Won', 'code' => 'KRW', 'symbol' => '₩', 'description' => 'South Korean Won', 'is_default' => false],
            ['name' => 'Turkish Lira', 'code' => 'TRY', 'symbol' => '₺', 'description' => 'Turkish Lira', 'is_default' => false],
            ['name' => 'Russian Ruble', 'code' => 'RUB', 'symbol' => '₽', 'description' => 'Russian Ruble', 'is_default' => false],
            ['name' => 'Indian Rupee', 'code' => 'INR', 'symbol' => '₹', 'description' => 'Indian Rupee', 'is_default' => false],
            ['name' => 'Brazilian Real', 'code' => 'BRL', 'symbol' => 'R$', 'description' => 'Brazilian Real', 'is_default' => false],
            ['name' => 'South African Rand', 'code' => 'ZAR', 'symbol' => 'R', 'description' => 'South African Rand', 'is_default' => false],
            ['name' => 'Polish Zloty', 'code' => 'PLN', 'symbol' => 'zł', 'description' => 'Polish Zloty', 'is_default' => false],
            ['name' => 'Israeli Shekel', 'code' => 'ILS', 'symbol' => '₪', 'description' => 'Israeli Shekel', 'is_default' => false],
            ['name' => 'Danish Krone', 'code' => 'DKK', 'symbol' => 'kr', 'description' => 'Danish Krone', 'is_default' => false],
            ['name' => 'Czech Koruna', 'code' => 'CZK', 'symbol' => 'Kč', 'description' => 'Czech Koruna', 'is_default' => false],
            ['name' => 'Hungarian Forint', 'code' => 'HUF', 'symbol' => 'Ft', 'description' => 'Hungarian Forint', 'is_default' => false],
            ['name' => 'Romanian Leu', 'code' => 'RON', 'symbol' => 'lei', 'description' => 'Romanian Leu', 'is_default' => false],
            ['name' => 'Croatian Kuna', 'code' => 'HRK', 'symbol' => 'kn', 'description' => 'Croatian Kuna', 'is_default' => false],
            ['name' => 'Bulgarian Lev', 'code' => 'BGN', 'symbol' => 'лв', 'description' => 'Bulgarian Lev', 'is_default' => false],
            ['name' => 'Thai Baht', 'code' => 'THB', 'symbol' => '฿', 'description' => 'Thai Baht', 'is_default' => false],
            ['name' => 'Malaysian Ringgit', 'code' => 'MYR', 'symbol' => 'RM', 'description' => 'Malaysian Ringgit', 'is_default' => false],
            ['name' => 'Indonesian Rupiah', 'code' => 'IDR', 'symbol' => 'Rp', 'description' => 'Indonesian Rupiah', 'is_default' => false],
            ['name' => 'Philippine Peso', 'code' => 'PHP', 'symbol' => '₱', 'description' => 'Philippine Peso', 'is_default' => false],
            ['name' => 'Vietnamese Dong', 'code' => 'VND', 'symbol' => '₫', 'description' => 'Vietnamese Dong', 'is_default' => false],
            ['name' => 'Argentine Peso', 'code' => 'ARS', 'symbol' => '$', 'description' => 'Argentine Peso', 'is_default' => false],
            ['name' => 'Chilean Peso', 'code' => 'CLP', 'symbol' => '$', 'description' => 'Chilean Peso', 'is_default' => false],
            ['name' => 'Colombian Peso', 'code' => 'COP', 'symbol' => '$', 'description' => 'Colombian Peso', 'is_default' => false],
            ['name' => 'Peruvian Sol', 'code' => 'PEN', 'symbol' => 'S/', 'description' => 'Peruvian Sol', 'is_default' => false],
            ['name' => 'Uruguayan Peso', 'code' => 'UYU', 'symbol' => '$U', 'description' => 'Uruguayan Peso', 'is_default' => false],
            ['name' => 'Egyptian Pound', 'code' => 'EGP', 'symbol' => '£', 'description' => 'Egyptian Pound', 'is_default' => false],
            ['name' => 'Nigerian Naira', 'code' => 'NGN', 'symbol' => '₦', 'description' => 'Nigerian Naira', 'is_default' => false],
            ['name' => 'Kenyan Shilling', 'code' => 'KES', 'symbol' => 'KSh', 'description' => 'Kenyan Shilling', 'is_default' => false],
            ['name' => 'Moroccan Dirham', 'code' => 'MAD', 'symbol' => 'DH', 'description' => 'Moroccan Dirham', 'is_default' => false],
            ['name' => 'Tunisian Dinar', 'code' => 'TND', 'symbol' => 'د.ت', 'description' => 'Tunisian Dinar', 'is_default' => false],
            ['name' => 'UAE Dirham', 'code' => 'AED', 'symbol' => 'د.إ', 'description' => 'UAE Dirham', 'is_default' => false],
            ['name' => 'Saudi Riyal', 'code' => 'SAR', 'symbol' => '﷼', 'description' => 'Saudi Riyal', 'is_default' => false],
            ['name' => 'Qatari Riyal', 'code' => 'QAR', 'symbol' => '﷼', 'description' => 'Qatari Riyal', 'is_default' => false],
            ['name' => 'Kuwaiti Dinar', 'code' => 'KWD', 'symbol' => 'د.ك', 'description' => 'Kuwaiti Dinar', 'is_default' => false],
            ['name' => 'Bahraini Dinar', 'code' => 'BHD', 'symbol' => '.د.ب', 'description' => 'Bahraini Dinar', 'is_default' => false],
            ['name' => 'Omani Rial', 'code' => 'OMR', 'symbol' => '﷼', 'description' => 'Omani Rial', 'is_default' => false],
            ['name' => 'Jordanian Dinar', 'code' => 'JOD', 'symbol' => 'د.ا', 'description' => 'Jordanian Dinar', 'is_default' => false],
            ['name' => 'Lebanese Pound', 'code' => 'LBP', 'symbol' => '£', 'description' => 'Lebanese Pound', 'is_default' => false],
            ['name' => 'Pakistani Rupee', 'code' => 'PKR', 'symbol' => '₨', 'description' => 'Pakistani Rupee', 'is_default' => false],
            ['name' => 'Bangladeshi Taka', 'code' => 'BDT', 'symbol' => '৳', 'description' => 'Bangladeshi Taka', 'is_default' => false],
            ['name' => 'Sri Lankan Rupee', 'code' => 'LKR', 'symbol' => '₨', 'description' => 'Sri Lankan Rupee', 'is_default' => false],
            ['name' => 'Nepalese Rupee', 'code' => 'NPR', 'symbol' => '₨', 'description' => 'Nepalese Rupee', 'is_default' => false],
            ['name' => 'Myanmar Kyat', 'code' => 'MMK', 'symbol' => 'K', 'description' => 'Myanmar Kyat', 'is_default' => false],
            ['name' => 'Cambodian Riel', 'code' => 'KHR', 'symbol' => '៛', 'description' => 'Cambodian Riel', 'is_default' => false],
            ['name' => 'Laotian Kip', 'code' => 'LAK', 'symbol' => '₭', 'description' => 'Laotian Kip', 'is_default' => false],
            ['name' => 'Mongolian Tugrik', 'code' => 'MNT', 'symbol' => '₮', 'description' => 'Mongolian Tugrik', 'is_default' => false],
            ['name' => 'Kazakhstani Tenge', 'code' => 'KZT', 'symbol' => '₸', 'description' => 'Kazakhstani Tenge', 'is_default' => false],
            ['name' => 'Uzbekistani Som', 'code' => 'UZS', 'symbol' => 'лв', 'description' => 'Uzbekistani Som', 'is_default' => false],
            ['name' => 'Ukrainian Hryvnia', 'code' => 'UAH', 'symbol' => '₴', 'description' => 'Ukrainian Hryvnia', 'is_default' => false],
            ['name' => 'Belarusian Ruble', 'code' => 'BYN', 'symbol' => 'Br', 'description' => 'Belarusian Ruble', 'is_default' => false],
            ['name' => 'Moldovan Leu', 'code' => 'MDL', 'symbol' => 'L', 'description' => 'Moldovan Leu', 'is_default' => false],
            ['name' => 'Georgian Lari', 'code' => 'GEL', 'symbol' => '₾', 'description' => 'Georgian Lari', 'is_default' => false],
            ['name' => 'Armenian Dram', 'code' => 'AMD', 'symbol' => '֏', 'description' => 'Armenian Dram', 'is_default' => false],
            ['name' => 'Azerbaijani Manat', 'code' => 'AZN', 'symbol' => '₼', 'description' => 'Azerbaijani Manat', 'is_default' => false],
            ['name' => 'Icelandic Krona', 'code' => 'ISK', 'symbol' => 'kr', 'description' => 'Icelandic Krona', 'is_default' => false],
            ['name' => 'Albanian Lek', 'code' => 'ALL', 'symbol' => 'L', 'description' => 'Albanian Lek', 'is_default' => false],
            ['name' => 'Serbian Dinar', 'code' => 'RSD', 'symbol' => 'дин', 'description' => 'Serbian Dinar', 'is_default' => false],
            ['name' => 'Bosnian Mark', 'code' => 'BAM', 'symbol' => 'KM', 'description' => 'Bosnian Mark', 'is_default' => false],
            ['name' => 'North Macedonian Denar', 'code' => 'MKD', 'symbol' => 'ден', 'description' => 'North Macedonian Denar', 'is_default' => false],
            ['name' => 'Ethiopian Birr', 'code' => 'ETB', 'symbol' => 'Br', 'description' => 'Ethiopian Birr', 'is_default' => false],
            ['name' => 'Ghanaian Cedi', 'code' => 'GHS', 'symbol' => '₵', 'description' => 'Ghanaian Cedi', 'is_default' => false],
            ['name' => 'Tanzanian Shilling', 'code' => 'TZS', 'symbol' => 'TSh', 'description' => 'Tanzanian Shilling', 'is_default' => false],
            ['name' => 'Ugandan Shilling', 'code' => 'UGX', 'symbol' => 'USh', 'description' => 'Ugandan Shilling', 'is_default' => true],
            ['name' => 'Zambian Kwacha', 'code' => 'ZMW', 'symbol' => 'ZK', 'description' => 'Zambian Kwacha', 'is_default' => false],
            ['name' => 'Botswana Pula', 'code' => 'BWP', 'symbol' => 'P', 'description' => 'Botswana Pula', 'is_default' => false],
            ['name' => 'Namibian Dollar', 'code' => 'NAD', 'symbol' => 'N$', 'description' => 'Namibian Dollar', 'is_default' => false],
            ['name' => 'Mauritian Rupee', 'code' => 'MUR', 'symbol' => '₨', 'description' => 'Mauritian Rupee', 'is_default' => false],
            ['name' => 'Seychellois Rupee', 'code' => 'SCR', 'symbol' => '₨', 'description' => 'Seychellois Rupee', 'is_default' => false],
            ['name' => 'Maldivian Rufiyaa', 'code' => 'MVR', 'symbol' => '.ރ', 'description' => 'Maldivian Rufiyaa', 'is_default' => false],
            ['name' => 'Fijian Dollar', 'code' => 'FJD', 'symbol' => 'FJ$', 'description' => 'Fijian Dollar', 'is_default' => false],
            ['name' => 'Papua New Guinean Kina', 'code' => 'PGK', 'symbol' => 'K', 'description' => 'Papua New Guinean Kina', 'is_default' => false],
            ['name' => 'Tongan Paʻanga', 'code' => 'TOP', 'symbol' => 'T$', 'description' => 'Tongan Paʻanga', 'is_default' => false],
            ['name' => 'Samoan Tala', 'code' => 'WST', 'symbol' => 'T', 'description' => 'Samoan Tala', 'is_default' => false],
            ['name' => 'Vanuatu Vatu', 'code' => 'VUV', 'symbol' => 'VT', 'description' => 'Vanuatu Vatu', 'is_default' => false],
            ['name' => 'Solomon Islands Dollar', 'code' => 'SBD', 'symbol' => 'SI$', 'description' => 'Solomon Islands Dollar', 'is_default' => false],
            ['name' => 'Brunei Dollar', 'code' => 'BND', 'symbol' => 'B$', 'description' => 'Brunei Dollar', 'is_default' => false],
            ['name' => 'East Caribbean Dollar', 'code' => 'XCD', 'symbol' => 'EC$', 'description' => 'East Caribbean Dollar', 'is_default' => false],
            ['name' => 'Barbadian Dollar', 'code' => 'BBD', 'symbol' => 'Bds$', 'description' => 'Barbadian Dollar', 'is_default' => false],
            ['name' => 'Jamaican Dollar', 'code' => 'JMD', 'symbol' => 'J$', 'description' => 'Jamaican Dollar', 'is_default' => false],
            ['name' => 'Trinidad and Tobago Dollar', 'code' => 'TTD', 'symbol' => 'TT$', 'description' => 'Trinidad and Tobago Dollar', 'is_default' => false],
            ['name' => 'Bahamian Dollar', 'code' => 'BSD', 'symbol' => 'B$', 'description' => 'Bahamian Dollar', 'is_default' => false],
            ['name' => 'Belize Dollar', 'code' => 'BZD', 'symbol' => 'BZ$', 'description' => 'Belize Dollar', 'is_default' => false],
            ['name' => 'Costa Rican Colon', 'code' => 'CRC', 'symbol' => '₡', 'description' => 'Costa Rican Colon', 'is_default' => false],
            ['name' => 'Guatemalan Quetzal', 'code' => 'GTQ', 'symbol' => 'Q', 'description' => 'Guatemalan Quetzal', 'is_default' => false],
            ['name' => 'Honduran Lempira', 'code' => 'HNL', 'symbol' => 'L', 'description' => 'Honduran Lempira', 'is_default' => false],
            ['name' => 'Nicaraguan Cordoba', 'code' => 'NIO', 'symbol' => 'C$', 'description' => 'Nicaraguan Cordoba', 'is_default' => false],
            ['name' => 'Panamanian Balboa', 'code' => 'PAB', 'symbol' => 'B/.', 'description' => 'Panamanian Balboa', 'is_default' => false],
            ['name' => 'Dominican Peso', 'code' => 'DOP', 'symbol' => 'RD$', 'description' => 'Dominican Peso', 'is_default' => false],
            ['name' => 'Haitian Gourde', 'code' => 'HTG', 'symbol' => 'G', 'description' => 'Haitian Gourde', 'is_default' => false],
            ['name' => 'Cuban Peso', 'code' => 'CUP', 'symbol' => '₱', 'description' => 'Cuban Peso', 'is_default' => false],
            ['name' => 'Bolivian Boliviano', 'code' => 'BOB', 'symbol' => '$b', 'description' => 'Bolivian Boliviano', 'is_default' => false],
            ['name' => 'Paraguayan Guarani', 'code' => 'PYG', 'symbol' => 'Gs', 'description' => 'Paraguayan Guarani', 'is_default' => false],
            ['name' => 'Guyanese Dollar', 'code' => 'GYD', 'symbol' => 'G$', 'description' => 'Guyanese Dollar', 'is_default' => false],
            ['name' => 'Surinamese Dollar', 'code' => 'SRD', 'symbol' => 'Sr$', 'description' => 'Surinamese Dollar', 'is_default' => false],
            ['name' => 'Venezuelan Bolivar', 'code' => 'VES', 'symbol' => 'Bs.S', 'description' => 'Venezuelan Bolivar', 'is_default' => false],
            ['name' => 'Ecuadorian Sucre', 'code' => 'ECS', 'symbol' => 'S/.', 'description' => 'Ecuadorian Sucre', 'is_default' => false],
        ];

        foreach ($currencies as $currency) {
            Currency::firstOrCreate(
                ['code' => $currency['code'], 'name' => $currency['name']],
                $currency
            );
        }
    }
}
