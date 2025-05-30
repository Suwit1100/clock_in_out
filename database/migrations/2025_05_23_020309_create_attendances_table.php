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
            $table->foreignId('branch_in_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->boolean('is_offsite_in')->default(false);
            $table->boolean('is_offsite_out')->default(false);
            $table->decimal('offsite_latitude', 10, 7)->nullable();
            $table->decimal('offsite_longitude', 10, 7)->nullable();
            $table->text('offsite_gmap_link_in')->nullable();
            $table->text('offsite_gmap_link_out')->nullable();
            $table->dateTime('clock_in_time');
            $table->decimal('clock_in_location_lat', 10, 7);
            $table->decimal('clock_in_location_lng', 10, 7);
            $table->enum('clock_in_status', ['early', 'on_time', 'late'])->nullable();
            $table->dateTime('clock_out_time')->nullable();
            $table->decimal('clock_out_location_lat', 10, 7)->nullable();
            $table->decimal('clock_out_location_lng', 10, 7)->nullable();
            $table->enum('clock_out_status', ['early', 'on_time', 'late'])->nullable();
            $table->timestamps();
            $table->foreignId('branch_out_id')->nullable()->constrained('branches')->onDelete('set null');
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
