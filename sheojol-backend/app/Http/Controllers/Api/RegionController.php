<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $regions = Shelter::query()
            ->where('is_approved', true)
            ->when($request->filled('type'), fn ($query) => $query->where('type', $request->query('type')))
            ->select('region')
            ->distinct()
            ->orderBy('region')
            ->pluck('region');

        return response()->json([
            'data' => $regions,
        ]);
    }
}