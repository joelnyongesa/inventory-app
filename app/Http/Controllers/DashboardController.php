<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalProducts'  => Product::active()->count(),
            'activeOrders'   => Order::whereIn('status', ['pending', 'confirmed'])->count(),
            'lowStockItems'  => Product::active()->lowStock()->count(),
            'monthlyRevenue' => (float) Order::where('status', 'fulfilled')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total'),
        ];

        $recentOrders = Order::latest()
            ->limit(5)
            ->get(['id', 'customer_name', 'status', 'total', 'created_at']);

        $lowStockAlerts = Product::active()
            ->lowStock()
            ->orderBy('stock_count')
            ->limit(6)
            ->get(['id', 'name', 'sku', 'stock_count', 'reorder_level']);

        return Inertia::render('Dashboard', compact('stats', 'recentOrders', 'lowStockAlerts'));
    }
}
