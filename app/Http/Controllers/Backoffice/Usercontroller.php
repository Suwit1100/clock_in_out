<?php

namespace App\Http\Controllers\Backoffice;

use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class Usercontroller extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:user.index')->only('index');
        $this->middleware('permission:user.create')->only(['create', 'store']);
        $this->middleware('permission:user.edit')->only(['edit', 'update']);
        $this->middleware('permission:user.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->select('id', 'employee_code', 'name', 'email', 'display_name')
            ->with('roles:id,name') // โหลด roles ด้วย
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('employee_code', 'like', "%{$search}%");
                });
            })
            ->when($request->order, function ($query, $order) {
                $orderBy = match ($order) {
                    'name_asc' => ['name', 'asc'],
                    'name_desc' => ['name', 'desc'],
                    'code_asc' => ['employee_code', 'asc'],
                    'code_desc' => ['employee_code', 'desc'],
                    default => ['id', 'desc'],
                };

                $query->orderBy(...$orderBy);
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => $request->only('search', 'order'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('users/create', [
            'availableRoles' => Role::select('id', 'name')->get(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|unique:users',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'display_name' => 'nullable|string',
            'password' => 'required|min:8',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        // สร้าง user โดยไม่ใส่ role_id ลง DB โดยตรง
        $user = User::create($validated);

        // sync role ด้วย id เดียว
        $user->syncRoles(Role::findById($validated['role_id']));

        return redirect()->route('backoffice.users.index')->with('success', 'User created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // โหลดความสัมพันธ์ roles และ permissions (ของ user ตรง ๆ)
        $user->load(['roles', 'permissions']);

        // รวม permissions ทั้งหมด = จาก roles + ที่ assign โดยตรง
        $allPermissions = $user->getAllPermissions();

        // dd($user, $allPermissions);

        return Inertia::render('users/show', [
            'user' => $user,
            'roles' => $user->roles,
            'permissions' => $allPermissions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $user->load('roles');

        return Inertia::render('users/edit', [
            'user' => $user,
            'availableRoles' => Role::select('id', 'name')->get(),
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|unique:users,employee_code,' . $user->id,
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'display_name' => 'nullable|string',
            'password' => 'nullable|min:8',
            'role_id' => 'nullable|integer|exists:roles,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);


        if ($request->filled('role_id')) {
            $user->syncRoles(Role::findById($request->input('role_id')));
        } else {
            $user->syncRoles([]);
        }

        return redirect()->route('backoffice.users.index')->with('success', 'User updated.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('backoffice.users.index')->with('success', 'User deleted.');
    }
}
