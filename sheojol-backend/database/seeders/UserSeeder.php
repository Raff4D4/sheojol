<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@sheojol.local'],
            [
                'name' => 'Administrator',
                'phone' => '0812000001',
                'password' => 'Admin123',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'driver@sheojol.local'],
            [
                'name' => 'Driver Demo',
                'phone' => '0812000002',
                'password' => 'Driver123',
                'role' => 'driver',
            ]
        );
    }
}