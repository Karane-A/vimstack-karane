<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserLanguageController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'language' => 'required|string|max:5'
        ]);

        $user = Auth::user();
        if ($user) {
            // In demo mode, store language in session instead of database
            if (config('app.is_demo', false)) {
                session(['demo_language' => $request->language]);
                return back();
            }
            
            // Normal mode: update database
            $user->update(['lang' => $request->language]);
            return back();
        }

        return back()->withErrors(['error' => 'Unauthorized']);
    }
}