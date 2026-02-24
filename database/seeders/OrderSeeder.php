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
        // Idempotent — skip entirely if orders already exist
        if (Order::count() > 0) {
            $this->command->info('Orders already exist — skipping OrderSeeder.');
            return;
        }

        $joel  = User::where('email', 'joel@inventoryapp.com')->first();
        $amara = User::where('email', 'amara@inventoryapp.com')->first();

        if (! $joel) {
            $this->command->warn('Primary user not found — skipping OrderSeeder.');
            return;
        }

        // Fall back to Joel if Amara's account wasn't created yet
        $amara = $amara ?? $joel;

        // ── Orders processed by Joel ─────────────────────────────────────────
        $this->createOrder($joel->id, 'Wanjiku Kamau',    '+254 712 304 891', 'fulfilled', [
            ['sku' => 'TECH-LPX-001', 'qty' => 1],
            ['sku' => 'TECH-UCH-003', 'qty' => 1],
            ['sku' => 'TECH-WM-002',  'qty' => 1],
        ]);

        $this->createOrder($joel->id, 'Brian Otieno',     '+254 722 819 473', 'confirmed', [
            ['sku' => 'TECH-BTH-007', 'qty' => 2],
            ['sku' => 'TECH-SSD-008', 'qty' => 1],
        ]);

        $this->createOrder($joel->id, 'Amina Hassan',     '+254 733 560 218', 'pending', [
            ['sku' => 'TECH-WC-006',  'qty' => 1],
            ['sku' => 'DESK-LDL-009', 'qty' => 1],
        ]);

        $this->createOrder($joel->id, 'Peter Mutua',      '+254 798 147 362', 'fulfilled', [
            ['sku' => 'TECH-MKT-004', 'qty' => 1],
            ['sku' => 'TECH-WM-002',  'qty' => 1],
            ['sku' => 'DESK-APS-010', 'qty' => 2],
        ]);

        $this->createOrder($joel->id, 'Grace Achieng',    '+254 710 983 641', 'cancelled', [
            ['sku' => 'TECH-MON-005', 'qty' => 1],
        ]);

        $this->createOrder($joel->id, 'David Omondi',     '+254 721 275 830', 'confirmed', [
            ['sku' => 'TECH-UCH-003', 'qty' => 3],
            ['sku' => 'DESK-CMK-011', 'qty' => 2],
        ]);

        // ── Orders processed by Amara ────────────────────────────────────────
        $this->createOrder($amara->id, 'Kevin Mwangi',    '+254 701 438 592', 'pending', [
            ['sku' => 'TECH-LPX-001', 'qty' => 1],
            ['sku' => 'TECH-BTH-007', 'qty' => 1],
        ]);

        $this->createOrder($amara->id, 'Sarah Njeri',     '+254 714 762 045', 'fulfilled', [
            ['sku' => 'TECH-SSD-008', 'qty' => 2],
            ['sku' => 'DESK-LDL-009', 'qty' => 1],
            ['sku' => 'DESK-CMK-011', 'qty' => 1],
        ]);

        $this->createOrder($amara->id, 'James Kipchoge',  '+254 725 391 708', 'confirmed', [
            ['sku' => 'TECH-WC-006',  'qty' => 1],
            ['sku' => 'DESK-APS-010', 'qty' => 1],
        ]);

        $this->createOrder($amara->id, 'Fatuma Omar',     '+254 736 084 157', 'pending', [
            ['sku' => 'TECH-BTH-007', 'qty' => 1],
            ['sku' => 'TECH-UCH-003', 'qty' => 1],
            ['sku' => 'DESK-LDL-009', 'qty' => 2],
        ]);

        $this->createOrder($amara->id, 'Michael Njoroge', '+254 707 512 936', 'fulfilled', [
            ['sku' => 'TECH-MON-005', 'qty' => 1],
            ['sku' => 'TECH-UCH-003', 'qty' => 1],
        ]);

        $this->createOrder($amara->id, 'Mercy Adhiambo',  '+254 718 647 283', 'confirmed', [
            ['sku' => 'TECH-WM-002',  'qty' => 2],
            ['sku' => 'DESK-APS-010', 'qty' => 1],
            ['sku' => 'DESK-CMK-011', 'qty' => 1],
        ]);

        $count = Order::count();
        $this->command->info("Orders seeded: {$count} orders created.");
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
