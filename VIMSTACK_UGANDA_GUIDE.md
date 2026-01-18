# Vimstack Uganda Setup & Configuration Guide

This guide provides comprehensive instructions for setting up and configuring Vimstack specifically for the Uganda market.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Currency Configuration](#currency-configuration)
3. [Payment Gateways](#payment-gateways)
4. [Tax Configuration](#tax-configuration)
5. [Shipping Zones](#shipping-zones)
6. [Timezone & Localization](#timezone--localization)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Vimstack has been customized for the Uganda market with:
- **UGX (Ugandan Shilling)** as the default currency
- **Flutterwave** and **Paystack** payment gateways enabled
- **Uganda tax rates** (18% VAT, 6% Withholding Tax)
- **Uganda shipping zones** (Kampala, major cities, rural areas)
- **Africa/Kampala timezone**
- **Local language support** (English, Luganda, Swahili)

---

## Currency Configuration

### Default Currency: UGX

Vimstack is pre-configured with **UGX (Ugandan Shilling)** as the default currency.

#### Currency Settings

- **Currency Code**: UGX
- **Currency Symbol**: USh
- **Currency Name**: Ugandan Shilling
- **Decimal Places**: 0 (UGX typically doesn't use decimals)
- **Symbol Position**: Before amount (USh 1000)
- **Symbol Space**: No space between symbol and amount

#### Setting Up Currency

1. **Run Currency Seeder**:
   ```bash
   php artisan db:seed --class=CurrencySeeder
   ```

2. **Set UGX as Default**:
   ```bash
   php artisan migrate
   ```
   This will run the migration that sets UGX as the default currency.

3. **Verify Currency Settings**:
   - Navigate to Settings → Currency Settings
   - Verify that UGX is selected as the default currency
   - Confirm decimal format is set to 0
   - Verify symbol position and spacing

#### Currency Formatting

UGX amounts are formatted as:
- **USh 1,000** (with thousands separator)
- **USh 10000** (without decimals)

Example formatting in code:
```php
formatCurrency(1000); // Returns "USh 1,000"
formatCurrency(50000); // Returns "USh 50,000"
```

---

## Payment Gateways

### Supported Payment Gateways for Uganda

Vimstack supports the following payment gateways that are popular in Uganda:

#### 1. Flutterwave

Flutterwave is widely used across Africa, including Uganda.

**Setup Steps**:

1. **Get API Keys**:
   - Sign up at [Flutterwave Dashboard](https://dashboard.flutterwave.com)
   - Get your Public Key and Secret Key
   - Use test keys for development

2. **Configure in Vimstack**:
   - Navigate to Settings → Payment Settings
   - Enable Flutterwave
   - Enter your Public Key and Secret Key
   - Save settings

3. **Test Configuration**:
   ```bash
   php artisan test --filter UgandaPaymentGatewaysTest::test_flutterwave_payment_configuration
   ```

#### 2. Paystack

Paystack is another popular payment gateway in Africa.

**Setup Steps**:

1. **Get API Keys**:
   - Sign up at [Paystack Dashboard](https://dashboard.paystack.com)
   - Get your Public Key and Secret Key
   - Use test keys for development

2. **Configure in Vimstack**:
   - Navigate to Settings → Payment Settings
   - Enable Paystack
   - Enter your Public Key and Secret Key
   - Save settings

3. **Test Configuration**:
   ```bash
   php artisan test --filter UgandaPaymentGatewaysTest::test_paystack_payment_configuration
   ```

#### 3. Bank Transfer

Bank transfer is available as a manual payment method.

**Setup Steps**:
- Navigate to Settings → Payment Settings
- Enable Bank Transfer
- Configure bank account details
- Set up payment instructions for customers

#### 4. Mobile Money (Future)

Mobile Money integration for MTN Mobile Money and Airtel Money is planned for future releases.

---

## Tax Configuration

### Uganda Tax Rates

Vimstack includes pre-configured tax rates for Uganda:

#### 1. Uganda VAT (Value Added Tax)
- **Rate**: 18%
- **Type**: Percentage
- **Region**: Uganda
- **Priority**: 1 (applied first)
- **Compound**: No

#### 2. Withholding Tax
- **Rate**: 6%
- **Type**: Percentage
- **Region**: Uganda
- **Priority**: 2 (applied after VAT)
- **Compound**: No

### Setting Up Taxes

1. **Run Uganda Tax Seeder**:
   ```bash
   php artisan db:seed --class=UgandaTaxSeeder
   ```

2. **Verify Tax Rates**:
   - Navigate to your store → Taxes
   - Verify "Uganda VAT" at 18%
   - Verify "Withholding Tax" at 6%

3. **Test Tax Calculation**:
   ```bash
   php artisan test --filter UgandaTaxTest
   ```

### Tax Calculation Example

For an order of **USh 10,000**:
- **Subtotal**: USh 10,000
- **VAT (18%)**: USh 1,800
- **Total**: USh 11,800

### Customizing Tax Rates

To modify tax rates:
1. Navigate to your store → Taxes
2. Edit the tax rate
3. Update the percentage
4. Save changes

---

## Shipping Zones

### Uganda Shipping Configuration

Vimstack supports shipping zones for different regions of Uganda.

#### Pre-configured Shipping Zones

1. **Kampala** (Capital)
   - Delivery time: 1-2 business days
   - Cost: USh 5,000 (typical)

2. **Major Cities** (Jinja, Mbarara, Gulu, etc.)
   - Delivery time: 2-3 business days
   - Cost: USh 10,000 (typical)

3. **Rural Areas**
   - Delivery time: 3-5 business days
   - Cost: USh 15,000 (typical)

### Setting Up Shipping Zones

1. **Run Uganda State Seeder** (Districts):
   ```bash
   php artisan db:seed --class=UgandaStateSeeder
   ```

2. **Run Uganda City Seeder**:
   ```bash
   php artisan db:seed --class=UgandaCitySeeder
   ```

3. **Create Shipping Zones**:
   - Navigate to your store → Shipping
   - Click "Add New Shipping"
   - Configure:
     - **Name**: e.g., "Kampala Delivery"
     - **Type**: Flat Rate
     - **Cost**: USh 5,000
     - **Zone Type**: Local
     - **Countries**: Uganda (UG)
     - **Delivery Time**: 1-2 business days

4. **Test Shipping Configuration**:
   ```bash
   php artisan test --filter UgandaShippingTest
   ```

### Shipping Cost Examples

**Kampala**:
- Order < USh 10,000: USh 5,000 shipping
- Order ≥ USh 10,000: Free shipping (if configured)

**Major Cities**:
- Standard: USh 10,000
- Express: USh 15,000

**Rural Areas**:
- Standard: USh 15,000
- Express: USh 20,000

---

## Timezone & Localization

### Timezone Configuration

Vimstack is configured to use **Africa/Kampala** timezone by default.

**Verify Timezone**:
- Check `config/app.php`: `'timezone' => 'Africa/Kampala'`
- Or in Settings → System Settings

### Language Support

Vimstack supports multiple languages:

1. **English** (Default)
   - Already configured
   - Full translation available

2. **Luganda** (Planned)
   - Translation files: `resources/lang/lug.json`
   - Enable in Settings → Language Settings

3. **Swahili** (Planned)
   - Translation files: `resources/lang/sw.json`
   - Enable in Settings → Language Settings

### Date & Time Format

- **Date Format**: Y-m-d (2025-01-31)
- **Time Format**: H:i (14:30)
- **Timezone**: Africa/Kampala (EAT - East Africa Time)

---

## Testing

### Running Uganda-Specific Tests

Vimstack includes comprehensive tests for Uganda configurations:

```bash
# Run all Uganda tests
php artisan test --filter Uganda

# Run specific test suites
php artisan test --filter UgandaCurrencyTest
php artisan test --filter UgandaPaymentGatewaysTest
php artisan test --filter UgandaTaxTest
php artisan test --filter UgandaShippingTest

# Run rebranding tests
php artisan test --filter VimstackRebrandingTest
```

### Test Coverage

- ✅ Currency configuration (UGX)
- ✅ Payment gateways (Flutterwave, Paystack)
- ✅ Tax rates (VAT, Withholding Tax)
- ✅ Shipping zones (Kampala, major cities, rural)
- ✅ Rebranding elements (Vimstack logos, settings)

---

## Troubleshooting

### Currency Issues

**Problem**: Currency not showing as UGX
- **Solution**: Run `php artisan db:seed --class=CurrencySeeder` and `php artisan migrate`

**Problem**: Currency formatting incorrect
- **Solution**: Check Settings → Currency Settings, ensure decimal format is 0

### Payment Gateway Issues

**Problem**: Flutterwave/Paystack not working
- **Solution**: 
  1. Verify API keys are correct
  2. Check if gateway is enabled in settings
  3. Ensure you're using test keys in development
  4. Check payment gateway logs

### Tax Calculation Issues

**Problem**: Tax not calculating correctly
- **Solution**:
  1. Run `php artisan db:seed --class=UgandaTaxSeeder`
  2. Verify tax rates in store settings
  3. Check tax priority settings

### Shipping Zone Issues

**Problem**: Shipping zones not appearing
- **Solution**:
  1. Run `php artisan db:seed --class=UgandaStateSeeder`
  2. Run `php artisan db:seed --class=UgandaCitySeeder`
  3. Create shipping zones manually in store settings

---

## Additional Resources

### Documentation
- [Main Documentation](PROJECT_DOCUMENTATION.md)
- [Setup Guide](SETUP_LOCALHOST.md)
- [Quick Start](QUICK_START.md)

### Payment Gateway Documentation
- [Flutterwave API Docs](https://developer.flutterwave.com/docs)
- [Paystack API Docs](https://paystack.com/docs/api)

### Uganda-Specific Information
- [Uganda Revenue Authority](https://ura.go.ug) - Tax information
- [Bank of Uganda](https://www.bou.or.ug) - Currency information

---

## Support

For Uganda-specific issues or questions:
1. Check this guide first
2. Review test files in `tests/Feature/`
3. Check application logs: `storage/logs/laravel.log`
4. Run tests to verify configuration

---

**Last Updated**: January 2025
**Version**: 1.0.0
