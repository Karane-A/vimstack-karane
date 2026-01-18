<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Currency;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

class UgandaCurrencyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that UGX currency exists in database
     */
    public function test_ugx_currency_exists()
    {
        // Seed currencies
        $this->artisan('db:seed', ['--class' => 'CurrencySeeder']);
        
        $ugx = Currency::where('code', 'UGX')->first();
        
        $this->assertNotNull($ugx);
        $this->assertEquals('UGX', $ugx->code);
        $this->assertEquals('Ugandan Shilling', $ugx->name);
        $this->assertEquals('USh', $ugx->symbol);
    }

    /**
     * Test that UGX is set as default currency
     */
    public function test_ugx_is_default_currency()
    {
        // Seed currencies
        $this->artisan('db:seed', ['--class' => 'CurrencySeeder']);
        
        // Run migration to set UGX as default
        $this->artisan('migrate', ['--path' => 'database/migrations/2025_12_20_000001_update_ugx_as_default_currency.php']);
        
        $defaultCurrency = Currency::where('is_default', true)->first();
        
        $this->assertNotNull($defaultCurrency);
        $this->assertEquals('UGX', $defaultCurrency->code);
    }

    /**
     * Test that default settings use UGX
     */
    public function test_default_settings_use_ugx()
    {
        $defaultSettings = defaultSettings();
        
        $this->assertEquals('ugx', $defaultSettings['defaultCurrency']);
        $this->assertEquals('0', $defaultSettings['decimalFormat']); // UGX typically uses 0 decimals
    }

    /**
     * Test UGX currency formatting
     */
    public function test_ugx_currency_formatting()
    {
        $user = User::factory()->create(['type' => 'superadmin']);
        $this->actingAs($user);

        // Set UGX as default currency with 0 decimals
        updateSetting('defaultCurrency', 'ugx');
        updateSetting('decimalFormat', '0');
        updateSetting('currencySymbolPosition', 'before');
        updateSetting('currencySymbolSpace', false);

        // Test formatting
        $amount = 1000;
        $formatted = formatCurrency($amount);
        
        // Should format as USh1000 (no decimals, symbol before)
        $this->assertStringContainsString('USh', $formatted);
        $this->assertStringContainsString('1000', $formatted);
    }

    /**
     * Test currency settings API returns UGX as default
     */
    public function test_currency_settings_api_returns_ugx()
    {
        $user = User::factory()->create(['type' => 'superadmin']);
        $this->actingAs($user);

        // Seed currencies and set UGX as default
        $this->artisan('db:seed', ['--class' => 'CurrencySeeder']);
        $this->artisan('migrate', ['--path' => 'database/migrations/2025_12_20_000001_update_ugx_as_default_currency.php']);
        
        updateSetting('defaultCurrency', 'ugx');

        $response = $this->get(route('settings.currency'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('systemSettings')
                ->where('systemSettings.defaultCurrency', 'ugx')
        );
    }
}
