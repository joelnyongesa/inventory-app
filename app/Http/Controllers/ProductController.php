<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\AuditLog;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $this->resolvePerPage($request, default: 15);

        $products = Product::query()
            ->when($request->search, fn ($q, $s) =>
                $q->where('name', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%")
            )
            ->when($request->status === 'active',   fn ($q) => $q->active())
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters'  => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::create($request->validated());

        AuditLog::record('product.created', $product);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        AuditLog::record('product.updated', $product, null, $request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->orderItems()->exists()) {
            return back()->with('error', 'Cannot delete a product that has existing order items.');
        }

        AuditLog::record('product.deleted', $product, null, $product->toArray());

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted.');
    }

    public function lowStock(Request $request): Response
    {
        $perPage = $this->resolvePerPage($request, default: 10);

        $products = Product::active()
            ->lowStock()
            ->orderByRaw('(reorder_level - stock_count) DESC')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Products/LowStock', ['products' => $products]);
    }

    private function resolvePerPage(Request $request, int $default): int
    {
        return max(5, min((int) $request->input('per_page', $default), 100));
    }
}
