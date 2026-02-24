<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if (! $user) {
            $this->command->warn('Skipping OrderSeeder: test@example.com user not found.');
            return;
        }

        $this->createOrder($user->id, 'Jane Doe', '+254 712 345 678', 'confirmed', [
            ['sku' => 'TECH-LPX-001', 'qty' => 1],
            ['sku' => 'TECH-WM-002',  'qty' => 2],
            ['sku' => 'TECH-UCH-003', 'qty' => 1],
        ]);

        $this->createOrder($user->id, 'John Smith', '+254 798 765 432', 'pending', [
            ['sku' => 'TECH-BTH-007', 'qty' => 1],
            ['sku' => 'TECH-SSD-008', 'qty' => 2],
        ]);

        $this->command->info('Orders seeded: 2 sample orders created.');
    }

    private function createOrder(
        int    $userId,
        string $customerName,
        string $phone,
        string $status,
        array  $lines,
    ): Order {
        $order = Order::create([
            'user_id'       => $userId,
            'customer_name' => $customerName,
            'phone'         => $phone,
            'status'        => $status,
            'total'         => 0,
        ]);

        $total = 0;

        foreach ($lines as $line) {
            $product = Product::where('sku', $line['sku'])->first();

            if (! $product) {
                $this->command->warn("Product {$line['sku']} not found — skipping line.");
                continue;
            }

            $lineTotal = round($product->price * $line['qty'], 2);

            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $product->id,
                'quantity'   => $line['qty'],
                'unit_price' => $product->price,
                'line_total' => $lineTotal,
            ]);

            $total += $lineTotal;
        }

        $order->update(['total' => round($total, 2)]);

        return $order;
    }
}
