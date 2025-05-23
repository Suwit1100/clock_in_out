<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OffsiteSetting extends Model
{
    use HasFactory;

    protected $fillable = ['work_start_time', 'work_end_time'];
}
