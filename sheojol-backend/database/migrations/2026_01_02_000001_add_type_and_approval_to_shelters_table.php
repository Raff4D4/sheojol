<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shelters', function (Blueprint $table) {
            $table->enum('type', ['official', 'verified', 'warning'])->default('official')->after('region')->index();
            $table->boolean('is_approved')->default(true)->after('status')->index();
            $table->foreignId('user_id')->nullable()->after('is_approved')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('shelters', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['type', 'is_approved']);
        });
    }
};