<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
        $this->registerRoutes();
    }

    protected function registerRoutes()
    {
        \Illuminate\Support\Facades\Route::prefix('api/v1')
            ->middleware('api')
            ->namespace('App\Http\Controllers')
            ->group(base_path('routes/api.php'));
    }
}
