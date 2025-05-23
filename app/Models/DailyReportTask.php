<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReportTask extends Model
{
    use HasFactory;

    protected $fillable = ['daily_report_id', 'task_type', 'project_name'];

    public function report()
    {
        return $this->belongsTo(DailyReport::class, 'daily_report_id');
    }
}
