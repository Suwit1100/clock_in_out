<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create([
            'name' => 'เจนบรรเจิด เมืองทอง',
            'latitude' => 13.9192663,
            'longitude' => 100.5374425,
            'radius_meters' => 3000,
            'work_start_time' => '08:30:00',
            'work_end_time' => '17:30:00',
        ]);

        Branch::create([
            'name' => 'เจนบรรเจิด วังน้อย',
            'latitude' => 14.1947401,
            'longitude' => 100.6443442,
            'radius_meters' => 3000,
            'work_start_time' => '08:00:00',
            'work_end_time' => '17:00:00',
        ]);
    }
}
