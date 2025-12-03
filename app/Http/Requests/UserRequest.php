<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Role;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : null;
        
        return [
            'name'             => 'required|string',
            'email'            => 'required|email|unique:users,email' . ($userId ? ',' . $userId : ''),
            'password'         => $this->isMethod('POST') ? 'required|string|min:6' : 'nullable|string|min:6',
            'password_confirmation' => $this->isMethod('POST') ? 'required|same:password' : 'nullable|same:password',
            'roles'            => 'required'
        ];
    }
}
