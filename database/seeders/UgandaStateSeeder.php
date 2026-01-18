<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;

class UgandaStateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create Uganda country
        $uganda = Country::firstOrCreate(
            ['code' => 'UGA'],
            ['name' => 'Uganda', 'status' => true]
        );
        
        // Major districts/states of Uganda
        $districts = [
            ['name' => 'Kampala', 'code' => 'KLA'],
            ['name' => 'Wakiso', 'code' => 'WAK'],
            ['name' => 'Mukono', 'code' => 'MUK'],
            ['name' => 'Jinja', 'code' => 'JIN'],
            ['name' => 'Mbarara', 'code' => 'MBA'],
            ['name' => 'Gulu', 'code' => 'GUL'],
            ['name' => 'Mbale', 'code' => 'MBA'],
            ['name' => 'Masaka', 'code' => 'MAS'],
            ['name' => 'Entebbe', 'code' => 'ENT'],
            ['name' => 'Fort Portal', 'code' => 'FTP'],
            ['name' => 'Arua', 'code' => 'ARU'],
            ['name' => 'Lira', 'code' => 'LIR'],
            ['name' => 'Soroti', 'code' => 'SOR'],
            ['name' => 'Kabale', 'code' => 'KAB'],
            ['name' => 'Hoima', 'code' => 'HOI'],
            ['name' => 'Tororo', 'code' => 'TOR'],
            ['name' => 'Iganga', 'code' => 'IGA'],
            ['name' => 'Busia', 'code' => 'BUS'],
            ['name' => 'Mityana', 'code' => 'MIT'],
            ['name' => 'Mubende', 'code' => 'MUB'],
        ];
        
        foreach ($districts as $district) {
            State::firstOrCreate(
                [
                    'country_id' => $uganda->id,
                    'name' => $district['name'],
                ],
                [
                    'code' => $district['code'],
                    'status' => true,
                ]
            );
        }
        
        $this->command->info('Created ' . count($districts) . ' Uganda districts.');
    }
}
