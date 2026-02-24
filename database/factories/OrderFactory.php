<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'       => User::factory(),
            'customer_name' => $this->faker->name(),
            'phone'         => $this->faker->phoneNumber(),
            'status'        => $this->faker->randomElement(['pending', 'confirmed', 'fulfilled', 'cancelled']),
            'total'         => 0.00,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    public function confirmed(): static
    {
        return $this->state(fn () => ['status' => 'confirmed']);
    }

    public function fulfilled(): static
    {
        return $this->state(fn () => ['status' => 'fulfilled']);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => ['status' => 'cancelled']);
    }
}
