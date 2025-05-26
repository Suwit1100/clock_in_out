<?php

namespace App\Providers;

use App\Models\DailyReport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('dailyReportId', function () {
            if (!Auth::check()) return null;

            $user = Auth::user();
            $today = now()->toDateString();

            $report = DailyReport::whereDate('created_at', $today)
                ->whereHas('attendance', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                })
                ->first();

            return $report?->id;
        });
    }
}
