<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    use HasFactory;

    protected $fillable = ['attendance_id', 'summary_text', 'plan_text', 'note'];

    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }
    public function tasks()
    {
        return $this->hasMany(DailyReportTask::class);
    }
}
