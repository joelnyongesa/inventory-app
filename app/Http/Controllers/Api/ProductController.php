<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * GET /api/products/{sku}
     *
     * Returns current stock info for a product identified by SKU.
     */
    public function show(string $sku): JsonResponse
    {
        $product = Product::where('sku', strtoupper($sku))->first();

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json([
            'data' => [
                'id'            => $product->id,
                'name'          => $product->name,
                'sku'           => $product->sku,
                'price'         => (float) $product->price,
                'stock_count'   => $product->stock_count,
                'reorder_level' => $product->reorder_level,
                'is_active'     => $product->is_active,
                'is_low_stock'  => $product->isLowStock(),
            ],
        ]);
    }
}
