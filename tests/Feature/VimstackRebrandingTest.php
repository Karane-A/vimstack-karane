<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

class VimstackRebrandingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that Vimstack logo files exist
     */
    public function test_vimstack_logo_files_exist()
    {
        // Check SVG logo files
        $this->assertFileExists(public_path('logo.svg'));
        $this->assertFileExists(public_path('images/logos/logo-light.svg'));
        $this->assertFileExists(public_path('images/logos/logo-dark.svg'));
        $this->assertFileExists(public_path('images/logos/favicon.svg'));
        $this->assertFileExists(public_path('favicon.svg'));
    }

    /**
     * Test that default settings use Vimstack branding
     */
    public function test_default_settings_use_vimstack_branding()
    {
        $defaultSettings = defaultSettings();
        
        $this->assertEquals('Vimstack', $defaultSettings['titleText']);
        $this->assertStringContainsString('Vimstack', $defaultSettings['footerText']);
        $this->assertEquals('© 2025 Vimstack. All rights reserved.', $defaultSettings['footerText']);
    }

    /**
     * Test that brand settings default to Vimstack
     */
    public function test_brand_settings_default_to_vimstack()
    {
        $user = User::factory()->create(['type' => 'superadmin']);
        $this->actingAs($user);

        $response = $this->get(route('settings.brand'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('globalSettings')
                ->where('globalSettings.titleText', 'Vimstack')
                ->where('globalSettings.footerText', '© 2025 Vimstack. All rights reserved.')
        );
    }

    /**
     * Test that logo paths point to correct locations
     */
    public function test_logo_paths_are_correct()
    {
        $defaultSettings = defaultSettings();
        
        $this->assertEquals('/images/logos/logo-dark.png', $defaultSettings['logoDark']);
        $this->assertEquals('/images/logos/logo-light.png', $defaultSettings['logoLight']);
        $this->assertEquals('/images/logos/favicon.ico', $defaultSettings['favicon']);
    }

    /**
     * Test that SVG logos contain Vimstack branding
     */
    public function test_svg_logos_contain_vimstack_text()
    {
        $logoContent = File::get(public_path('logo.svg'));
        $this->assertStringContainsString('Vimstack', $logoContent);
        
        $logoLightContent = File::get(public_path('images/logos/logo-light.svg'));
        $this->assertStringContainsString('Vimstack', $logoLightContent);
        
        $logoDarkContent = File::get(public_path('images/logos/logo-dark.svg'));
        $this->assertStringContainsString('Vimstack', $logoDarkContent);
    }

    /**
     * Test that application name is Vimstack
     */
    public function test_application_name_is_vimstack()
    {
        $appName = config('app.name');
        $this->assertEquals('Vimstack', $appName);
    }
}
