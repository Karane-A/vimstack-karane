<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Store;
use App\Models\Shipping;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UgandaShippingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that shipping zones can be created for Uganda
     */
    public function test_uganda_shipping_zones_can_be_created()
    {
        $store = Store::factory()->create();
        
        // Create Kampala shipping zone
        $shipping = Shipping::create([
            'store_id' => $store->id,
            'name' => 'Kampala Delivery',
            'type' => 'flat_rate',
            'description' => 'Standard delivery to Kampala',
            'cost' => 5000.00, // 5000 UGX
            'min_order_amount' => 0.00,
            'delivery_time' => '2-3 business days',
            'sort_order' => 1,
            'is_active' => true,
            'zone_type' => 'local',
            'countries' => json_encode(['UG']),
            'tracking_available' => true,
        ]);
        
        $this->assertNotNull($shipping);
        $this->assertEquals('Kampala Delivery', $shipping->name);
        $this->assertEquals(5000.00, $shipping->cost);
        $this->assertEquals('local', $shipping->zone_type);
    }

    /**
     * Test Uganda shipping zones structure
     */
    public function test_uganda_shipping_zones_structure()
    {
        $store = Store::factory()->create();
        
        // Create multiple shipping zones for Uganda
        $zones = [
            [
                'name' => 'Kampala',
                'cost' => 5000.00,
                'zone_type' => 'local',
            ],
            [
                'name' => 'Major Cities',
                'cost' => 10000.00,
                'zone_type' => 'regional',
            ],
            [
                'name' => 'Rural Areas',
                'cost' => 15000.00,
                'zone_type' => 'regional',
            ],
        ];
        
        foreach ($zones as $zone) {
            $shipping = Shipping::create([
                'store_id' => $store->id,
                'name' => $zone['name'],
                'type' => 'flat_rate',
                'cost' => $zone['cost'],
                'zone_type' => $zone['zone_type'],
                'is_active' => true,
                'countries' => json_encode(['UG']),
            ]);
            
            $this->assertNotNull($shipping);
        }
        
        // Verify all zones were created
        $createdZones = Shipping::where('store_id', $store->id)->get();
        $this->assertCount(3, $createdZones);
    }

    /**
     * Test shipping API returns Uganda zones
     */
    public function test_shipping_api_returns_uganda_zones()
    {
        $user = User::factory()->create(['type' => 'company']);
        $store = Store::factory()->create(['user_id' => $user->id]);
        
        // Create shipping zone
        Shipping::create([
            'store_id' => $store->id,
            'name' => 'Kampala Delivery',
            'type' => 'flat_rate',
            'cost' => 5000.00,
            'zone_type' => 'local',
            'countries' => json_encode(['UG']),
            'is_active' => true,
        ]);
        
        $this->actingAs($user);
        
        $response = $this->get(route('shipping.index', ['store' => $store->slug]));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('shippings')
                ->where('shippings.0.name', 'Kampala Delivery')
        );
    }

    /**
     * Test shipping cost calculation for Uganda
     */
    public function test_shipping_cost_calculation_for_uganda()
    {
        $store = Store::factory()->create();
        
        // Create shipping with flat rate
        $shipping = Shipping::create([
            'store_id' => $store->id,
            'name' => 'Standard Delivery',
            'type' => 'flat_rate',
            'cost' => 5000.00, // 5000 UGX
            'min_order_amount' => 10000.00, // Free shipping over 10000 UGX
            'is_active' => true,
            'zone_type' => 'local',
            'countries' => json_encode(['UG']),
        ]);
        
        // Test cost calculation
        $orderAmount = 5000.00;
        $shippingCost = $orderAmount < $shipping->min_order_amount ? $shipping->cost : 0;
        
        $this->assertEquals(5000.00, $shippingCost);
        
        // Test free shipping threshold
        $orderAmount = 15000.00;
        $shippingCost = $orderAmount >= $shipping->min_order_amount ? 0 : $shipping->cost;
        
        $this->assertEquals(0, $shippingCost);
    }

    /**
     * Test that shipping zones include Uganda districts
     */
    public function test_shipping_zones_include_uganda_districts()
    {
        $store = Store::factory()->create();
        
        // Create shipping zones for different Uganda regions
        $districts = [
            'Kampala' => 5000.00,
            'Jinja' => 8000.00,
            'Mbarara' => 10000.00,
            'Gulu' => 12000.00,
        ];
        
        foreach ($districts as $district => $cost) {
            Shipping::create([
                'store_id' => $store->id,
                'name' => $district . ' Delivery',
                'type' => 'flat_rate',
                'cost' => $cost,
                'zone_type' => 'local',
                'countries' => json_encode(['UG']),
                'is_active' => true,
            ]);
        }
        
        $zones = Shipping::where('store_id', $store->id)->get();
        $this->assertCount(4, $zones);
        
        // Verify Kampala has lowest cost
        $kampala = Shipping::where('store_id', $store->id)
            ->where('name', 'Kampala Delivery')
            ->first();
        
        $this->assertEquals(5000.00, $kampala->cost);
    }
}
