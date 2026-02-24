<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;

class OrderService
{
    public function createOrder(array $data, int $userId): Order
    {
        $order = Order::create([
            'user_id'       => $userId,
            'customer_name' => $data['customer_name'],
            'phone'         => $data['phone'],
            'status'        => 'pending',
            'total'         => 0,
        ]);

        $total = 0;

        $productIds = array_column($data['items'], 'product_id');
        $products   = Product::findMany($productIds)->keyBy('id');

        foreach ($data['items'] as $item) {
            $product   = $products->get($item['product_id']);
            $lineTotal = round((float) $product->price * $item['quantity'], 2);

            $order->items()->create([
                'product_id' => $product->id,
                'quantity'   => $item['quantity'],
                'unit_price' => $product->price,
                'line_total' => $lineTotal,
            ]);

            $total += $lineTotal;
        }

        $order->update(['total' => round($total, 2)]);

        AuditLog::record('order.created', $order->refresh(), $userId);

        return $order->refresh();
    }
}
