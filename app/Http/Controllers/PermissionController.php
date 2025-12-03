<?php
namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PermissionController extends BaseController
{
    /**
     * Constructor to apply middleware
     */

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::withPermissionCheck()->latest()->paginate(10);
        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request)
    {
        $permission = Permission::create([
            'module'      => $request->module,
            'label'       => $request->label,
            'name'        => Str::slug($request->label),
            'description' => $request->description,
            'created_by'  => Auth::id(),
        ]);

        if ($permission) {
            return redirect()->route('permissions.index')->with('success', __('Permission created successfully!'));
        }
        return redirect()->back()->with('error', __('Unable to create Permission. Please try again!'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionRequest $request, Permission $permission)
    {
        if ($permission) {
            $permission->module      = $request->module;
            $permission->label       = $request->label;
            $permission->name        = Str::slug($request->label);
            $permission->description = $request->description;

            $permission->save();
            return redirect()->route('permissions.index')->with('success', __('Permission updated successfully!'));
        }
        return redirect()->back()->with('error', __('Unable to update Permission. Please try again!'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        if ($permission) {
            $permission->delete();
            return redirect()->route('permissions.index')->with('success', __('Permission deleted successfully!'));
        }

        return redirect()->back()->with('error', __('Unable to delete Permission. Please try again!'));
    }
}