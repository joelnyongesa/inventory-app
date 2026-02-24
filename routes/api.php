<?php

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products/{sku}', [ProductController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
});
