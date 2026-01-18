<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Store;
use App\Models\Tax;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UgandaTaxTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that Uganda tax seeder creates correct tax rates
     */
    public function test_uganda_tax_seeder_creates_correct_rates()
    {
        // Create a store first
        $store = Store::factory()->create();
        
        // Run Uganda tax seeder
        $this->artisan('db:seed', ['--class' => 'UgandaTaxSeeder']);
        
        // Check VAT tax (18%)
        $vat = Tax::where('name', 'Uganda VAT')
            ->where('store_id', $store->id)
            ->first();
        
        $this->assertNotNull($vat);
        $this->assertEquals(18.0, $vat->rate);
        $this->assertEquals('percentage', $vat->type);
        $this->assertEquals('Uganda', $vat->region);
        $this->assertTrue($vat->is_active);
        
        // Check Withholding Tax (6%)
        $withholding = Tax::where('name', 'Withholding Tax')
            ->where('store_id', $store->id)
            ->first();
        
        $this->assertNotNull($withholding);
        $this->assertEquals(6.0, $withholding->rate);
        $this->assertEquals('percentage', $withholding->type);
        $this->assertEquals('Uganda', $withholding->region);
        $this->assertTrue($withholding->is_active);
    }

    /**
     * Test VAT tax calculation
     */
    public function test_vat_tax_calculation()
    {
        $store = Store::factory()->create();
        
        // Create VAT tax
        $vat = Tax::create([
            'name' => 'Uganda VAT',
            'rate' => 18.0,
            'type' => 'percentage',
            'region' => 'Uganda',
            'priority' => 1,
            'compound' => false,
            'is_active' => true,
            'store_id' => $store->id,
        ]);
        
        // Test calculation: 18% of 1000 = 180
        $amount = 1000;
        $taxAmount = ($amount * $vat->rate) / 100;
        
        $this->assertEquals(180.0, $taxAmount);
    }

    /**
     * Test tax API returns Uganda taxes
     */
    public function test_tax_api_returns_uganda_taxes()
    {
        $user = User::factory()->create(['type' => 'company']);
        $store = Store::factory()->create(['user_id' => $user->id]);
        
        // Create Uganda taxes
        Tax::create([
            'name' => 'Uganda VAT',
            'rate' => 18.0,
            'type' => 'percentage',
            'region' => 'Uganda',
            'priority' => 1,
            'compound' => false,
            'is_active' => true,
            'store_id' => $store->id,
        ]);
        
        $this->actingAs($user);
        
        $response = $this->get(route('taxes.index', ['store' => $store->slug]));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('taxes')
                ->where('taxes.0.name', 'Uganda VAT')
                ->where('taxes.0.rate', 18.0)
        );
    }

    /**
     * Test that tax rates are correct for Uganda
     */
    public function test_uganda_tax_rates_are_correct()
    {
        $store = Store::factory()->create();
        
        $this->artisan('db:seed', ['--class' => 'UgandaTaxSeeder']);
        
        $vat = Tax::where('name', 'Uganda VAT')
            ->where('store_id', $store->id)
            ->first();
        
        // Uganda standard VAT rate is 18%
        $this->assertEquals(18.0, $vat->rate);
        
        $withholding = Tax::where('name', 'Withholding Tax')
            ->where('store_id', $store->id)
            ->first();
        
        // Common withholding tax rate is 6%
        $this->assertEquals(6.0, $withholding->rate);
    }
}
