<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Web\AttendanceController;
use App\Http\Controllers\Web\DailyReportController;
use App\Http\Controllers\Web\HistoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('web/login');
})->name('home');
Route::get('/auth/google-redirect', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google.redirect');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

Route::middleware(['auth'])->group(function () {
    Route::get('/check-in-out', [AttendanceController::class, 'showCheckInOutPage'])->name('attendance.check_page');
    Route::post('/attendance/clock', [AttendanceController::class, 'clock'])->name('attendance.clock');
    Route::resource('/attendance/daily-report', DailyReportController::class);
    Route::resource('/attendance/history', HistoryController::class);

    Route::post('/client/logout', [AuthenticatedSessionController::class, 'cuslogout'])->name('client.logout');
});


Route::get('/backoffice/login', function () {
    return Inertia::render('auth/login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/backoffice/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
