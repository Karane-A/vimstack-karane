<?php

namespace App\Http\Controllers;

use App\Models\State;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StateController extends Controller
{
    public function index(Request $request)
    {
        $query = State::with('country')->withCount('cities');
        
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status == '1');
        }
        
        if ($request->filled('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        $states = $query->orderBy('name')->paginate($request->get('per_page', 10));
        $countries = Country::where('status', true)->orderBy('name')->get();
        
        return Inertia::render('states/index', [
            'states' => $states,
            'countries' => $countries,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function create()
    {
        $countries = Country::active()->orderBy('name')->get();
        
        return Inertia::render('states/create', [
            'countries' => $countries
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10',
            'status' => 'boolean'
        ]);

        State::create($request->all());

        return redirect()->route('states.index')->with('success', 'State created successfully.');
    }

    public function show(State $state)
    {
        $state->load(['country', 'cities']);

        return Inertia::render('states/show', [
            'state' => $state
        ]);
    }

    public function edit(State $state)
    {
        $countries = Country::active()->orderBy('name')->get();
        
        return Inertia::render('states/edit', [
            'state' => $state,
            'countries' => $countries
        ]);
    }

    public function update(Request $request, State $state)
    {
        $request->validate([
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10',
            'status' => 'boolean'
        ]);

        $state->update($request->all());

        return redirect()->route('states.index')->with('success', 'State updated successfully.');
    }

    public function destroy(State $state)
    {
        $state->delete();

        return redirect()->route('states.index')->with('success', 'State deleted successfully.');
    }

    /**
     * Get states by country for API
     */
    public function getByCountry($countryId)
    {
        $states = State::where('country_id', $countryId)
                      ->where('status', true)
                      ->orderBy('name')
                      ->get(['id', 'name']);
        
        return response()->json([
            'states' => $states
        ]);
    }
}