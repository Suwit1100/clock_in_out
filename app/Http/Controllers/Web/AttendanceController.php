<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function showCheckInOutPage()
    {
        return Inertia::render('web/check_in_out');
    }
}
