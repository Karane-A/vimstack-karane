<?php

namespace Database\Seeders;

use App\Models\MediaItem;
use Illuminate\Database\Seeder;

class MediaItemSeeder extends Seeder
{
    public function run(): void
    {
        // Create a sample media item for demonstration
        MediaItem::create([
            'name' => 'Sample Image',
            'description' => 'This is a sample media item for demonstration purposes',
        ]);
    }
}