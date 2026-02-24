<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    /**
     * POST /api/orders
     *
     * Creates an order with items. Reuses the same validation and business
     * logic as the web controller via OrderService.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createOrder($request->validated(), auth()->id());

        // N+1 guard: eager-load relationships before serialising the JSON response.
        $order->load(['items.product:id,name,sku', 'user:id,name']);

        return response()->json(['data' => $order], 201);
    }
}
