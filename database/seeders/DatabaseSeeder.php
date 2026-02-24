<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Primary admin — login: joel@inventoryapp.com / Inventory@2025
        User::firstOrCreate(
            ['email' => 'joel@inventoryapp.com'],
            [
                'name'              => 'Joel Nyongesa',
                'password'          => Hash::make('Inventory@2025'),
                'email_verified_at' => now(),
            ],
        );

        // Second staff account — login: amara@inventoryapp.com / Inventory@2025
        User::firstOrCreate(
            ['email' => 'amara@inventoryapp.com'],
            [
                'name'              => 'Amara Waweru',
                'password'          => Hash::make('Inventory@2025'),
                'email_verified_at' => now(),
            ],
        );

        $this->call([
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
