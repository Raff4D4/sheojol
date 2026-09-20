<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Shelter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'region',
        'latitude',
        'longitude',
        'address',
        'capacity',
        'current_occupancy',
        'facilities',
        'status',
        'is_approved',
        'user_id',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'capacity' => 'integer',
        'current_occupancy' => 'integer',
        'facilities' => 'array',
        'is_approved' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function savedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}