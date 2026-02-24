<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $reorderLevel = $this->faker->numberBetween(5, 20);

        return [
            'name'          => ucwords($this->faker->words(3, true)),
            'sku'           => 'SKU-' . strtoupper($this->faker->unique()->lexify('??????')),
            'price'         => $this->faker->randomFloat(2, 5.00, 999.99),
            'stock_count'   => $this->faker->numberBetween($reorderLevel + 5, 200),
            'reorder_level' => $reorderLevel,
            'is_active'     => true,
        ];
    }

    public function lowStock(): static
    {
        return $this->state(function (array $attrs) {
            return [
                'stock_count' => $this->faker->numberBetween(1, $attrs['reorder_level'] - 1),
            ];
        });
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => ['stock_count' => 0]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
