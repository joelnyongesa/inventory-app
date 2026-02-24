<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity  = $this->faker->numberBetween(1, 10);
        $unitPrice = $this->faker->randomFloat(2, 5.00, 500.00);

        return [
            'order_id'   => Order::factory(),
            'product_id' => Product::factory(),
            'quantity'   => $quantity,
            'unit_price' => $unitPrice,
            'line_total' => round($quantity * $unitPrice, 2),
        ];
    }
}
