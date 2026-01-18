# Vimstack Feature Tests

This directory contains comprehensive feature tests for the Vimstack platform, including rebranding, Uganda-specific configurations, payment gateways, currency, tax, and shipping.

## Test Files

### VimstackRebrandingTest.php
Tests for Vimstack rebranding elements:
- Logo file existence
- Default settings using Vimstack branding
- Brand settings configuration
- Logo paths validation
- SVG logo content verification
- Application name verification

### UgandaCurrencyTest.php
Tests for Uganda currency (UGX) configuration:
- UGX currency existence in database
- UGX as default currency
- Default settings using UGX
- Currency formatting (0 decimals, USh symbol)
- Currency settings API

### UgandaPaymentGatewaysTest.php
Tests for Uganda payment gateways:
- Flutterwave payment gateway configuration
- Paystack payment gateway configuration
- Payment gateway availability
- Payment processing routes

### UgandaTaxTest.php
Tests for Uganda tax configuration:
- Uganda tax seeder (VAT 18%, Withholding Tax 6%)
- Tax calculation
- Tax API responses
- Tax rate validation

### UgandaShippingTest.php
Tests for Uganda shipping zones:
- Shipping zone creation
- Uganda shipping zones structure
- Shipping API responses
- Shipping cost calculation
- Uganda districts coverage

## Running Tests

### Run All Tests
```bash
php artisan test
```

### Run Specific Test File
```bash
php artisan test --filter VimstackRebrandingTest
php artisan test --filter UgandaCurrencyTest
php artisan test --filter UgandaPaymentGatewaysTest
php artisan test --filter UgandaTaxTest
php artisan test --filter UgandaShippingTest
```

### Run Specific Test Method
```bash
php artisan test --filter test_vimstack_logo_files_exist
php artisan test --filter test_ugx_is_default_currency
```

## Test Prerequisites

Before running tests, ensure:

1. **Database Setup**: Tests use `RefreshDatabase` trait, so they will create a fresh database for each test
2. **Seeders**: Some tests require seeders to be run:
   ```bash
   php artisan db:seed --class=CurrencySeeder
   php artisan db:seed --class=UgandaTaxSeeder
   ```
3. **Migrations**: Ensure all migrations are up to date:
   ```bash
   php artisan migrate
   ```

## Test Coverage

These tests cover:
- ✅ Rebranding elements (logos, settings, text)
- ✅ Currency configuration (UGX as default)
- ✅ Payment gateways (Flutterwave, Paystack)
- ✅ Tax rates (Uganda VAT, Withholding Tax)
- ✅ Shipping zones (Kampala, major cities, rural areas)

## Continuous Integration

These tests are designed to run in CI/CD pipelines. Ensure your CI environment has:
- PHP 8.2+
- MySQL/PostgreSQL database
- Composer dependencies installed
- Node.js and npm (for frontend assets if needed)

## Notes

- Tests use factories for creating test data
- All tests use `RefreshDatabase` to ensure clean state
- Payment gateway tests use mock/test API keys
- Shipping tests create test stores and shipping zones
- Tax tests verify Uganda-specific tax rates
