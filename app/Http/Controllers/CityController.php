<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\State;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $query = City::with(['state.country']);
        
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status == '1');
        }
        
        $cities = $query->orderBy('name')->paginate($request->get('per_page', 10));
        $countries = Country::where('status', true)->orderBy('name')->get();
        
        return Inertia::render('cities/index', [
            'cities' => $cities,
            'countries' => $countries,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function create()
    {
        $countries = Country::active()->orderBy('name')->get();
        
        return Inertia::render('cities/create', [
            'countries' => $countries
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'state_id' => 'required|exists:states,id',
            'name' => 'required|string|max:255',
            'status' => 'boolean'
        ]);

        City::create($request->all());

        return redirect()->route('cities.index')->with('success', 'City created successfully.');
    }

    public function show(City $city)
    {
        $city->load(['state.country']);

        return Inertia::render('cities/show', [
            'city' => $city
        ]);
    }

    public function edit(City $city)
    {
        $countries = Country::active()->orderBy('name')->get();
        $states = State::where('country_id', $city->state->country_id)->active()->orderBy('name')->get();
        
        return Inertia::render('cities/edit', [
            'city' => $city,
            'countries' => $countries,
            'states' => $states
        ]);
    }

    public function update(Request $request, City $city)
    {
        $request->validate([
            'state_id' => 'required|exists:states,id',
            'name' => 'required|string|max:255',
            'status' => 'boolean'
        ]);

        $city->update($request->all());

        return redirect()->route('cities.index')->with('success', 'City updated successfully.');
    }

    public function destroy(City $city)
    {
        $city->delete();

        return redirect()->route('cities.index')->with('success', 'City deleted successfully.');
    }
}