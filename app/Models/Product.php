<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'price',
        'stock_count',
        'reorder_level',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'        => 'decimal:2',
            'stock_count'  => 'integer',
            'reorder_level'=> 'integer',
            'is_active'    => 'boolean',
        ];
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_items')
            ->withPivot(['quantity', 'unit_price', 'line_total'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock_count', '<', 'reorder_level');
    }

    public function isLowStock(): bool
    {
        return $this->stock_count < $this->reorder_level;
    }

    public function isOutOfStock(): bool
    {
        return $this->stock_count === 0;
    }
}
