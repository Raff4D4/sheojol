<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShelterResource;
use App\Models\Shelter;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $approvedActive = Shelter::query()->where('is_approved', true)->where('status', 'active');

        $byType = [
            'official' => (clone $approvedActive)->where('type', 'official')->count(),
            'verified' => (clone $approvedActive)->where('type', 'verified')->count(),
            'warning' => (clone $approvedActive)->where('type', 'warning')->count(),
        ];

        return response()->json([
            'data' => [
                'shelters_total' => Shelter::count(),
                'active_total' => $byType['official'] + $byType['verified'] + $byType['warning'],
                'official_total' => $byType['official'],
                'verified_total' => $byType['verified'],
                'warning_total' => $byType['warning'],
                'pending_total' => Shelter::where('is_approved', false)->count(),
                'drivers_total' => User::where('role', 'driver')->count(),
                'regions_total' => Shelter::where('is_approved', true)->distinct('region')->count('region'),
                'by_region' => Shelter::where('is_approved', true)
                    ->selectRaw('region, COUNT(*) as total')
                    ->groupBy('region')
                    ->orderByDesc('total')
                    ->pluck('total', 'region')
                    ->toArray(),
                'recent_pending' => ShelterResource::collection(
                    Shelter::with('user')->where('is_approved', false)->orderByDesc('created_at')->limit(5)->get()
                ),
            ],
        ]);
    }

    public function pending(Request $request): AnonymousResourceCollection
    {
        return ShelterResource::collection(
            Shelter::with('user')
                ->where('is_approved', false)
                ->orderByDesc('created_at')
                ->paginate($request->integer('per_page', 50))
        );
    }

    public function approve(Request $request, Shelter $shelter): ShelterResource
    {
        $shelter->update(['is_approved' => true]);

        return new ShelterResource($shelter->load('user'));
    }

    public function reject(Request $request, Shelter $shelter): JsonResponse
    {
        abort_unless($shelter->is_approved === false, 422);

        $shelter->delete();

        return response()->json(['message' => 'Laporan ditolak dan dihapus']);
    }
}