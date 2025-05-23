<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'radius_meters',
        'work_start_time',
        'work_end_time',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
