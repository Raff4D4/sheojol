<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShelterResource;
use App\Models\Shelter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminShelterController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Shelter::query()->with('user');

        if ($request->filled('region')) {
            $query->where('region', $request->query('region'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('q')) {
            $query->where('name', 'like', '%'.$request->query('q').'%');
        }

        $query->orderBy('updated_at', 'desc');

        return ShelterResource::collection($query->paginate($request->integer('per_page', 50)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules(false));

        $shelter = Shelter::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'region' => $validated['region'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address' => $validated['address'] ?? $validated['name'],
            'capacity' => $validated['capacity'] ?? 0,
            'current_occupancy' => 0,
            'facilities' => $validated['facilities'] ?? [],
            'status' => $validated['status'] ?? 'active',
            'is_approved' => $validated['is_approved'] ?? true,
        ]);

        return (new ShelterResource($shelter->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, Shelter $shelter): ShelterResource
    {
        $validated = $request->validate($this->rules(true));

        $shelter->fill(array_merge($validated, [
            'is_approved' => $validated['is_approved'] ?? $shelter->is_approved,
        ]))->save();

        return new ShelterResource($shelter->load('user'));
    }

    public function destroy(Request $request, Shelter $shelter): JsonResponse
    {
        $shelter->delete();

        return response()->json(['message' => 'Shelter dihapus']);
    }

    private function rules(bool $partial): array
    {
        $required = $partial ? 'sometimes|' : 'required|';

        return [
            'name' => $required.'string|max:255',
            'type' => $required.'string|in:official,verified,warning',
            'region' => $required.'string|max:100',
            'latitude' => $required.'numeric|between:-90,90',
            'longitude' => $required.'numeric|between:-180,180',
            'address' => 'nullable|string|max:1000',
            'capacity' => 'nullable|integer|min:0',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:50',
            'status' => 'nullable|string|in:active,inactive,maintenance',
            'is_approved' => 'nullable|boolean',
        ];
    }
}