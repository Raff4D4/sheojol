<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShelterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'region' => $this->region,
            'coordinates' => [
                'latitude' => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ],
            'address' => $this->address,
            'capacity' => (int) $this->capacity,
            'current_occupancy' => (int) $this->current_occupancy,
            'facilities' => $this->facilities ?? [],
            'status' => $this->status,
            'is_approved' => (bool) $this->is_approved,
            'distance' => isset($this->distance) ? round((float) $this->distance, 2) : null,
            'submitted_by' => $this->relationLoaded('user') && $this->user ? $this->user->name : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}