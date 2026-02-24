<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop Pro X',           'sku' => 'TECH-LPX-001', 'price' => 1299.99, 'stock_count' => 45,  'reorder_level' => 10, 'is_active' => true],
            ['name' => 'Monitor 27" 4K',          'sku' => 'TECH-MON-005', 'price' =>  499.99, 'stock_count' => 22,  'reorder_level' =>  5, 'is_active' => true],
            ['name' => 'Bluetooth Headphones',    'sku' => 'TECH-BTH-007', 'price' =>  149.99, 'stock_count' => 35,  'reorder_level' => 10, 'is_active' => true],
            ['name' => 'External SSD 1TB',        'sku' => 'TECH-SSD-008', 'price' =>   89.99, 'stock_count' => 60,  'reorder_level' => 15, 'is_active' => true],
            ['name' => 'USB-C Hub 7-in-1',        'sku' => 'TECH-UCH-003', 'price' =>   54.99, 'stock_count' => 80,  'reorder_level' => 20, 'is_active' => true],
            ['name' => 'LED Desk Lamp',           'sku' => 'DESK-LDL-009', 'price' =>   34.99, 'stock_count' => 100, 'reorder_level' => 25, 'is_active' => true],
            ['name' => 'Adjustable Phone Stand',  'sku' => 'DESK-APS-010', 'price' =>   12.99, 'stock_count' => 150, 'reorder_level' => 30, 'is_active' => true],
            ['name' => 'Wireless Mouse',          'sku' => 'TECH-WM-002',  'price' =>   29.99, 'stock_count' =>  3,  'reorder_level' => 15, 'is_active' => true],
            ['name' => 'Webcam HD 1080p',         'sku' => 'TECH-WC-006',  'price' =>   79.99, 'stock_count' =>  4,  'reorder_level' => 10, 'is_active' => true],
            ['name' => 'Cable Management Kit',    'sku' => 'DESK-CMK-011', 'price' =>   19.99, 'stock_count' =>  6,  'reorder_level' => 20, 'is_active' => true],
            ['name' => 'Mechanical Keyboard TKL', 'sku' => 'TECH-MKT-004', 'price' =>  119.99, 'stock_count' =>  0,  'reorder_level' =>  8, 'is_active' => true],
            ['name' => 'Power Bank 20000mAh',     'sku' => 'TECH-PB-012',  'price' =>   59.99, 'stock_count' =>  0,  'reorder_level' => 12, 'is_active' => false],
        ];

        foreach ($products as $data) {
            Product::firstOrCreate(['sku' => $data['sku']], $data);
        }

        $this->command->info('Products seeded: ' . count($products) . ' records.');
    }
}
