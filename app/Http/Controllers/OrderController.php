<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->input('per_page', 15), 100));

        $orders = Order::with('user:id,name')
            ->when($request->status, fn ($q, $s) => $q->byStatus($s))
            ->when($request->search, fn ($q, $s) =>
                $q->where('customer_name', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%")
            )
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders'  => $orders,
            'filters' => $request->only(['status', 'search', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $products = Product::active()
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'price', 'stock_count']);

        return Inertia::render('Orders/Create', ['products' => $products]);
    }

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $order = $this->orderService->createOrder($request->validated(), auth()->id());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order created successfully.');
    }

    public function show(Order $order): Response
    {
        $order->load(['items.product:id,name,sku', 'user:id,name']);

        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,confirmed,fulfilled,cancelled'],
        ]);

        $previous = $order->status;
        $order->update(['status' => $request->status]);

        AuditLog::record('order.status_updated', $order, null, [
            'from' => $previous,
            'to'   => $request->status,
        ]);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order status updated.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        if (! $order->isCancellable()) {
            return back()->with('error', 'Only pending or confirmed orders can be deleted.');
        }

        AuditLog::record('order.deleted', $order, null, $order->toArray());

        $order->delete();

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted.');
    }
}
