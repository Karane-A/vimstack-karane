---
name: Vimstack Rebranding & Uganda Customization
overview: Complete rebranding from StoreGo to Vimstack with full Uganda localization including currency (UGX), payment gateways (Mobile Money, Flutterwave, Paystack), language support, and tax/shipping configurations for Uganda.
todos:
  - id: rebrand-core
    content: Replace all StoreGo references with Vimstack in config files, helper functions, and default settings
    status: completed
  - id: rebrand-ui
    content: Update all UI components, landing pages, and brand settings to use Vimstack branding
    status: completed
    dependencies:
      - rebrand-core
  - id: rebrand-assets
    content: Replace logos, favicons, and visual assets with Vimstack branding
    status: completed
  - id: currency-ugx
    content: Set UGX as default currency and configure currency formatting for Ugandan Shilling
    status: completed
  - id: payment-gateways
    content: Enable and prioritize Flutterwave and Paystack for Uganda market
    status: pending
  - id: mobile-money
    content: Research and implement MTN Mobile Money and Airtel Money payment integrations
    status: pending
    dependencies:
      - payment-gateways
  - id: localization
    content: Add Luganda and Swahili language support with Uganda-specific translations
    status: completed
  - id: tax-config
    content: Configure Uganda tax rates (18% VAT) and tax calculation system
    status: completed
  - id: shipping-zones
    content: Create Uganda shipping zones with districts and cities, configure shipping rates
    status: completed
  - id: timezone-config
    content: Set default timezone to Africa/Kampala and update date/time formats
    status: completed
  - id: testing
    content: Test all rebranded elements, payment gateways, currency, tax, and shipping configurations
    status: completed
    dependencies:
      - rebrand-ui
      - currency-ugx
      - payment-gateways
      - tax-config
      - shipping-zones
  - id: documentation
    content: Update all documentation files with Vimstack branding and create Uganda-specific guides
    status: completed
    dependencies:
      - rebrand-core
---

# Vimstack Rebranding & Uganda Customization Roadmap

## Overview

Transform the StoreGo SaaS platform into Vimstack, a Uganda-focused multi-store e-commerce platform with complete rebranding and local market customizations.

## Phase 1: Core Rebranding (Week 1-2)

### 1.1 Application Name & Branding

**Files to modify:**

- `config/app.php` - Change `APP_NAME` default from "Laravel" to "Vimstack"
- `app/Helpers/helper.php` (lines 1047-1048) - Update `titleText` and `footerText` in `defaultSettings()`
- `resources/js/pages/settings/components/brand-settings.tsx` (lines 40-41) - Update `DEFAULT_BRAND_SETTINGS`
- `README.md` - Update all references from "StoreGo" to "Vimstack"
- `composer.json` - Update package name and description

**Changes:**

- Replace "StoreGo" → "Vimstack" in all visible text
- Update footer text: "© 2025 Vimstack. All rights reserved."
- Update meta titles and descriptions

### 1.2 Logo & Visual Assets

**Files to replace:**

- `public/images/logos/logo-dark.png` - Replace with Vimstack logo
- `public/images/logos/logo-light.png` - Replace with Vimstack logo
- `public/favicon.ico` - Replace with Vimstack favicon
- `public/logo.svg` - Replace with Vimstack SVG logo

**Update references in:**

- `app/Helpers/helper.php` (lines 1044-1046)
- `resources/js/pages/settings/components/brand-settings.tsx` (lines 37-39)

### 1.3 Code References

**Search and replace across codebase:**

- "StoreGo" → "Vimstack" (case-sensitive search)
- "storego" → "vimstack" (lowercase)
- "Store Go" → "Vimstack"
- Update package.json name field
- Update any copyright notices

## Phase 2: Uganda Currency Configuration (Week 2)

### 2.1 Set UGX as Default Currency

**Files to modify:**

- `database/seeders/CurrencySeeder.php` (line 98) - Set UGX as default:
  ```php
  ['name' => 'Ugandan Shilling', 'code' => 'UGX', 'symbol' => 'USh', 'description' => 'Ugandan Shilling', 'is_default' => true],
  ```

- `app/Helpers/helper.php` (line 1035) - Update `defaultCurrency` to 'ugx'
- Create migration to update existing currency records

### 2.2 Currency Formatting

**Files to create/modify:**

- `resources/js/utils/currency.ts` - Add UGX formatting rules
- Update currency display components to show "USh" symbol properly
- Configure decimal places (UGX typically uses 0 decimals)

## Phase 3: Uganda Payment Gateways (Week 2-3)

### 3.1 Enable Uganda-Relevant Gateways

**Priority gateways for Uganda:**

1. **Flutterwave** - Already integrated, enable by default
2. **Paystack** - Already integrated, enable by default  
3. **Mobile Money** - Custom integration needed (see 3.2)
4. **Bank Transfer** - Already available, configure for Uganda banks

**Files to modify:**

- `database/seeders/PaymentGatewaySeeder.php` (if exists) - Set Flutterwave and Paystack as default enabled
- `app/Helpers/helper.php` (line 596) - Ensure Flutterwave and Paystack are in enabled methods list
- `resources/js/pages/settings/components/payment-settings.tsx` - Prioritize Uganda gateways in UI

### 3.2 Mobile Money Integration (New Feature)

**Uganda Mobile Money providers:**

- MTN Mobile Money
- Airtel Money

**Implementation:**

- Create new payment gateway controllers:
  - `app/Http/Controllers/MTNMobileMoneyController.php`
  - `app/Http/Controllers/AirtelMoneyController.php`
- Add to payment methods list in `resources/js/utils/payment.ts`
- Create payment settings UI components
- Add webhook handlers for mobile money callbacks
- Update `app/Models/PaymentSetting.php` to include mobile money fields

**API Integration:**

- Research MTN Mobile Money API documentation
- Research Airtel Money API documentation
- Implement payment initiation and verification

## Phase 4: Language & Localization (Week 3)

### 4.1 Add Local Languages

**Languages to support:**

- English (already exists)
- Luganda (add)
- Swahili (add if not exists)
- Runyoro-Rutooro (optional)

**Files to create:**

- `resources/lang/lug.json` - Luganda translations
- `resources/lang/sw.json` - Swahili translations (if needed)

**Files to modify:**

- `resources/js/i18n.js` - Add new language resources
- `config/app.php` - Update supported locales
- Language selector component - Add new languages

### 4.2 Uganda-Specific Translations

**Content to translate:**

- Payment method names
- Currency labels
- Tax and shipping terms
- Error messages
- Email templates

## Phase 5: Tax & Shipping for Uganda (Week 3-4)

### 5.1 Uganda Tax Configuration

**Tax rates to configure:**

- VAT: 18% (Uganda standard VAT rate)
- Withholding Tax: Various rates
- Import duties (if applicable)

**Files to modify:**

- `database/seeders/TaxSeeder.php` (create if doesn't exist) - Add Uganda tax rates
- `app/Http/Controllers/TaxController.php` - Ensure tax calculation supports Uganda
- `resources/js/pages/tax/` - Update tax management UI

### 5.2 Uganda Shipping Zones

**Shipping configuration:**

- Create Uganda regions/districts as shipping zones
- Configure shipping rates for:
  - Kampala (capital)
  - Major cities (Jinja, Mbarara, Gulu, etc.)
  - Rural areas
- Add local courier services (if applicable)

**Files to create/modify:**

- `database/seeders/ShippingZoneSeeder.php` - Add Uganda shipping zones
- `database/seeders/StateSeeder.php` - Add Uganda districts as states
- `database/seeders/CitySeeder.php` - Add major Uganda cities
- Update shipping calculation logic for Uganda regions

## Phase 6: UI/UX Customization (Week 4)

### 6.1 Uganda Market Preferences

**Customizations:**

- Color scheme adjustments (if needed for brand)
- Payment method display order (prioritize Mobile Money)
- Currency symbol placement
- Date/time formats (Uganda timezone: Africa/Kampala)

**Files to modify:**

- `config/app.php` - Set timezone to 'Africa/Kampala'
- `config/timeformat.php` - Uganda date/time preferences
- `resources/js/pages/store/checkout.tsx` - Reorder payment methods
- Theme color customization in brand settings

### 6.2 Mobile-First Optimization

**Focus areas:**

- Mobile Money payment flow optimization
- Mobile checkout experience
- Responsive design for Uganda's mobile-heavy market

## Phase 7: Testing & Validation (Week 5)

### 7.1 Functional Testing

- Test all rebranded elements
- Verify UGX currency formatting
- Test payment gateways (Flutterwave, Paystack)
- Test Mobile Money integration (if implemented)
- Validate tax calculations
- Test shipping zone configurations

### 7.2 Localization Testing

- Test all language translations
- Verify date/time formats
- Check currency display across all pages
- Validate email templates in local languages

## Phase 8: Documentation Update (Week 5)

### 8.1 Update All Documentation

**Files to update:**

- `README.md` - Rebrand to Vimstack
- `PROJECT_DOCUMENTATION.md` - Update with Vimstack branding
- All setup guides - Update references
- Create `VIMSTACK_UGANDA_GUIDE.md` - Uganda-specific setup guide

### 8.2 Uganda-Specific Documentation

- Payment gateway setup for Uganda
- Mobile Money integration guide
- Tax configuration for Uganda
- Shipping zone setup

## Implementation Priority

**High Priority (Must Have):**

1. Core rebranding (StoreGo → Vimstack)
2. UGX currency as default
3. Flutterwave & Paystack enabled
4. Uganda timezone configuration
5. Basic tax rates (18% VAT)

**Medium Priority (Should Have):**

1. Mobile Money integration
2. Local language support (Luganda)
3. Uganda shipping zones
4. Uganda-specific payment method ordering

**Low Priority (Nice to Have):**

1. Additional local languages
2. Advanced tax configurations
3. Local courier integrations
4. Uganda-specific store themes

## Technical Considerations

### Payment Gateway APIs

- **Flutterwave**: Already integrated, needs API keys configuration
- **Paystack**: Already integrated, needs API keys configuration  
- **Mobile Money**: Requires API research and custom integration
  - MTN Mobile Money API documentation needed
  - Airtel Money API documentation needed

### Database Changes

- Currency default update (migration needed)
- New payment settings fields (migration for mobile money)
- Shipping zones data (seeder needed)
- Tax rates data (seeder needed)

### Code Structure

- Maintain existing payment gateway architecture
- Follow existing pattern for new mobile money gateways
- Use existing localization system for new languages

## Estimated Timeline

- **Week 1-2**: Core rebranding
- **Week 2**: Currency & basic payment setup
- **Week 3**: Mobile Money integration (if APIs available)
- **Week 3-4**: Language & tax/shipping
- **Week 4**: UI customizations
- **Week 5**: Testing & documentation

**Total: 4-5 weeks for complete rebranding and Uganda customization**

## Next Steps After Plan Approval

1. Create detailed task breakdown
2. Set up development branch
3. Begin Phase 1 implementation
4. Research Mobile Money APIs
5. Create Uganda-specific seeders