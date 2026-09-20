<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShelterResource;
use App\Models\Shelter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShelterController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Shelter::query()->where('is_approved', true);

        if ($request->filled('region')) {
            $query->where('region', $request->query('region'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled(['lat', 'lng'])) {
            $lat = (float) $request->query('lat');
            $lng = (float) $request->query('lng');
            $radius = (float) $request->query('radius', 10);

            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))";
            $query->selectRaw("*, {$haversine} AS distance", [$lat, $lng, $lat])
                ->having('distance', '<=', $radius)
                ->orderBy('distance');
        } else {
            $query->orderBy('name');
        }

        return ShelterResource::collection($query->paginate(100));
    }

    public function show(Shelter $shelter): ShelterResource
    {
        abort_unless($shelter->is_approved, 404);

        return new ShelterResource($shelter);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:official,verified,warning',
            'region' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'nullable|string|max:1000',
            'capacity' => 'nullable|integer|min:0',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:50',
        ]);

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
            'status' => 'active',
            'is_approved' => false,
            'user_id' => $request->user()->id,
        ]);

        return (new ShelterResource($shelter->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    public function report(Request $request, Shelter $shelter): JsonResponse
    {
        $validated = $request->validate([
            'report_type' => 'required|string|in:full,damage,closed,other',
            'notes' => 'nullable|string|max:500',
            'reporter_name' => 'nullable|string|max:100',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil disimpan',
            'data' => $validated,
        ]);
    }

    public function favorite(Request $request, Shelter $shelter): JsonResponse
    {
        $request->user()->shelters()->syncWithoutDetaching($shelter->id);

        return response()->json(['message' => 'Basecamp tersimpan']);
    }

    public function unfavorite(Request $request, Shelter $shelter): JsonResponse
    {
        $request->user()->shelters()->detach($shelter->id);

        return response()->json(['message' => 'Dihapus dari tersimpan']);
    }

    public function favorites(Request $request): AnonymousResourceCollection
    {
        return ShelterResource::collection(
            $request->user()->shelters()->where('is_approved', true)->orderByPivot('created_at', 'desc')->get()
        );
    }

    public function mine(Request $request): AnonymousResourceCollection
    {
        return ShelterResource::collection(
            Shelter::where('user_id', $request->user()->id)->orderByDesc('updated_at')->get()
        );
    }
}