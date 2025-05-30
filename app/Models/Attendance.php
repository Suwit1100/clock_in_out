<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'branch_in_id',
        'is_offsite_in',
        'is_offsite_out',
        'offsite_latitude',
        'offsite_longitude',
        'offsite_gmap_link_in',
        'offsite_gmap_link_out',
        'clock_in_time',
        'clock_in_location_lat',
        'clock_in_location_lng',
        'clock_in_status',
        'clock_out_time',
        'clock_out_location_lat',
        'clock_out_location_lng',

        'clock_out_status',
        'branch_out_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function dailyReport()
    {
        return $this->hasOne(DailyReport::class);
    }

    public function branchIn()
    {
        return $this->belongsTo(Branch::class, 'branch_in_id');
    }

    public function branchOut()
    {
        return $this->belongsTo(Branch::class, 'branch_out_id');
    }
}
