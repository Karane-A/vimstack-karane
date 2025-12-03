<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getCountries()
    {
        $countries = Country::active()->orderBy('name')->get(['id', 'name', 'code']);
        
        return response()->json([
            'countries' => $countries
        ]);
    }

    public function getStatesByCountry($countryId)
    {
        $states = State::where('country_id', $countryId)
            ->active()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);
        
        return response()->json([
            'states' => $states
        ]);
    }

    public function getCitiesByState($stateId)
    {
        $cities = City::where('state_id', $stateId)
            ->active()
            ->orderBy('name')
            ->get(['id', 'name']);
        
        return response()->json([
            'cities' => $cities
        ]);
    }
}