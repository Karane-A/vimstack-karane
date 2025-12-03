<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    public function index(Request $request)
    {
        $query = Country::withCount('states');
        
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status == '1');
        }
        
        $countries = $query->orderBy('name')->paginate($request->get('per_page', 10));
        
        return Inertia::render('countries/index', [
            'countries' => $countries,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('countries/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:3|unique:countries',
            'status' => 'boolean'
        ]);

        Country::create($request->all());

        return redirect()->route('countries.index')->with('success', 'Country created successfully.');
    }

    public function show(Country $country)
    {
        $country->load(['states' => function($query) {
            $query->withCount('cities');
        }]);

        return Inertia::render('countries/show', [
            'country' => $country
        ]);
    }

    public function edit(Country $country)
    {
        return Inertia::render('countries/edit', [
            'country' => $country
        ]);
    }

    public function update(Request $request, Country $country)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:3|unique:countries,code,' . $country->id,
            'status' => 'boolean'
        ]);

        $country->update($request->all());

        return redirect()->route('countries.index')->with('success', 'Country updated successfully.');
    }

    public function destroy(Country $country)
    {
        $country->delete();

        return redirect()->route('countries.index')->with('success', 'Country deleted successfully.');
    }
}