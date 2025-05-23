<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->foreignId('branch_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_offsite')->default(false);
            $table->decimal('offsite_latitude', 10, 7)->nullable();
            $table->decimal('offsite_longitude', 10, 7)->nullable();
            $table->text('offsite_gmap_link')->nullable();
            $table->dateTime('clock_in_time');
            $table->decimal('clock_in_location_lat', 10, 7);
            $table->decimal('clock_in_location_lng', 10, 7);
            $table->dateTime('clock_out_time')->nullable();
            $table->decimal('clock_out_location_lat', 10, 7)->nullable();
            $table->decimal('clock_out_location_lng', 10, 7)->nullable();
            $table->enum('status', ['on_time', 'late', 'early_leave', 'absent', 'offsite'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
