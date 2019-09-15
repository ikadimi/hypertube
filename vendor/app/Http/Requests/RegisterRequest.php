<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|alpha_num|min:3|max:20',
            'first_name' => 'required|alpha|min:3|max:20',
            'last_name' => 'required|alpha|min:3|max:20',
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                'min:5',           
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ];
    }
}
