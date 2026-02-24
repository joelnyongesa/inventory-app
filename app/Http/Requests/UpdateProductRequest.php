<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'sku'           => [
                'required', 'string', 'max:100',
                Rule::unique('products', 'sku')->ignore($this->route('product')),
            ],
            'price'         => ['required', 'numeric', 'min:0'],
            'stock_count'   => ['required', 'integer', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            'is_active'     => ['boolean'],
        ];
    }
}
