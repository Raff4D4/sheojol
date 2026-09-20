<?php

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminDriverController;
use App\Http\Controllers\Api\Admin\AdminShelterController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\ShelterController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('admin/login', [AuthController::class, 'loginAdmin']);

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/login-admin', [AuthController::class, 'loginAdmin']);

Route::get('regions', [RegionController::class, 'index']);
Route::get('shelters', [ShelterController::class, 'index']);
Route::get('shelters/{shelter}', [ShelterController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'me']);

    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::patch('auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('auth/password', [AuthController::class, 'updatePassword']);

    Route::post('shelters', [ShelterController::class, 'store']);
    Route::post('shelters/{shelter}/report', [ShelterController::class, 'report']);
    Route::post('shelters/{shelter}/favorite', [ShelterController::class, 'favorite']);
    Route::delete('shelters/{shelter}/favorite', [ShelterController::class, 'unfavorite']);
    Route::get('me/favorites', [ShelterController::class, 'favorites']);
    Route::get('me/shelters', [ShelterController::class, 'mine']);

    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index']);
        Route::get('shelters', [AdminShelterController::class, 'index']);
        Route::post('shelters', [AdminShelterController::class, 'store']);
        Route::get('shelters/pending', [AdminDashboardController::class, 'pending']);
        Route::patch('shelters/{shelter}', [AdminShelterController::class, 'update']);
        Route::delete('shelters/{shelter}', [AdminShelterController::class, 'destroy']);
        Route::post('shelters/{shelter}/approve', [AdminDashboardController::class, 'approve']);
        Route::post('shelters/{shelter}/reject', [AdminDashboardController::class, 'reject']);
        Route::get('drivers', [AdminDriverController::class, 'index']);
        Route::post('drivers', [AdminDriverController::class, 'store']);
        Route::post('drivers/{driver}/reset-password', [AdminDriverController::class, 'resetPassword']);
    });
});