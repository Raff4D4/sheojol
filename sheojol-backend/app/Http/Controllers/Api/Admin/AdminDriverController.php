<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminDriverController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->string('search')->trim()->toString();

        $sortMap = [
            'name' => 'name',
            'reports' => 'reported_shelters_count',
            'joined' => 'created_at',
        ];

        $sortKey = (string) $request->query('sort', 'joined');
        $direction = $request->query('direction', 'desc') === 'asc' ? 'asc' : 'desc';

        $drivers = User::query()
            ->withCount('reportedShelters')
            ->where('role', 'driver')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(isset($sortMap[$sortKey]), function ($query) use ($sortMap, $sortKey, $direction) {
                $query->orderBy($sortMap[$sortKey], $direction);
            }, function ($query) {
                $query->orderByDesc('created_at');
            })
            ->paginate(10)
            ->withQueryString();

        return response()->json([
            'data' => collect($drivers->items())->map(fn (User $driver) => $this->driverPayload($driver)),
            'meta' => [
                'total' => $drivers->total(),
                'per_page' => $drivers->perPage(),
                'current_page' => $drivers->currentPage(),
                'last_page' => $drivers->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'vehicle_type' => 'nullable|string|max:100',
            'app_type' => 'nullable|string|max:50',
            'password' => 'required|string|min:6',
        ]);

        $driver = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'vehicle' => $validated['vehicle_type'] ?? null,
            'app' => $validated['app_type'] ?? null,
            'password' => $validated['password'],
            'role' => 'driver',
        ]);

        return response()->json([
            'data' => $this->driverPayload($driver->loadCount('reportedShelters')),
        ], 201);
    }

    public function resetPassword(Request $request, User $driver): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $driver->update(['password' => $validated['password']]);

        return response()->json(['message' => 'Password driver berhasil direset']);
    }

    private function driverPayload(User $driver): array
    {
        return [
            'id' => $driver->id,
            'name' => $driver->name,
            'email' => $driver->email,
            'phone' => $driver->phone,
            'vehicle' => $driver->vehicle,
            'app' => $driver->app,
            'shelters_count' => $driver->reported_shelters_count,
            'joined_at' => $driver->created_at?->toISOString(),
        ];
    }
}