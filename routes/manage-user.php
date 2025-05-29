<?php

use App\Http\Controllers\Backoffice\Usercontroller;
use Illuminate\Support\Facades\Route;

Route::prefix('backoffice')->name('backoffice.')->group(function () {
    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::resource('users', UserController::class);
    });
});
