<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;
use App\Models\City;

class UgandaCitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Uganda country
        $uganda = Country::where('code', 'UGA')->first();
        
        if (!$uganda) {
            $this->command->warn('Uganda country not found. Please run UgandaStateSeeder first.');
            return;
        }
        
        // Major cities in Uganda by district
        $citiesByDistrict = [
            'Kampala' => ['Kampala Central', 'Nakawa', 'Makindye', 'Rubaga', 'Kawempe'],
            'Wakiso' => ['Entebbe', 'Kajjansi', 'Kira', 'Nansana', 'Wakiso Town'],
            'Mukono' => ['Mukono Town', 'Lugazi', 'Ntinda'],
            'Jinja' => ['Jinja Town', 'Njeru', 'Buwenge'],
            'Mbarara' => ['Mbarara Town', 'Ibanda', 'Bushenyi'],
            'Gulu' => ['Gulu Town', 'Laroo'],
            'Mbale' => ['Mbale Town', 'Bungokho'],
            'Masaka' => ['Masaka Town', 'Lukaya'],
            'Fort Portal' => ['Fort Portal Town', 'Kabarole'],
            'Arua' => ['Arua Town', 'Rhino Camp'],
            'Lira' => ['Lira Town', 'Oyam'],
            'Soroti' => ['Soroti Town', 'Serere'],
            'Kabale' => ['Kabale Town', 'Rukungiri'],
            'Hoima' => ['Hoima Town', 'Kigorobya'],
            'Tororo' => ['Tororo Town', 'Malaba'],
            'Iganga' => ['Iganga Town', 'Bugiri'],
            'Busia' => ['Busia Town', 'Namataba'],
            'Mityana' => ['Mityana Town', 'Mubende'],
        ];
        
        $totalCities = 0;
        
        foreach ($citiesByDistrict as $districtName => $cities) {
            $state = State::where('country_id', $uganda->id)
                ->where('name', $districtName)
                ->first();
            
            if (!$state) {
                $this->command->warn("District '{$districtName}' not found. Skipping cities.");
                continue;
            }
            
            foreach ($cities as $cityName) {
                City::firstOrCreate(
                    [
                        'state_id' => $state->id,
                        'name' => $cityName,
                    ],
                    [
                        'status' => true,
                    ]
                );
                $totalCities++;
            }
        }
        
        $this->command->info("Created {$totalCities} Uganda cities.");
    }
}
