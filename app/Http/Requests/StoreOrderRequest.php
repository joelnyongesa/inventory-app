<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name'          => ['required', 'string', 'max:255'],
            'phone'                  => ['required', 'string', 'max:30'],
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'       => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'            => 'At least one order item is required.',
            'items.min'                 => 'At least one order item is required.',
            'items.*.product_id.exists' => 'The selected product does not exist.',
            'items.*.quantity.min'      => 'Quantity must be at least 1.',
        ];
    }
}
