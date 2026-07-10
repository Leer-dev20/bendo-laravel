<?php

namespace App\Providers;

use App\Models\Order;
use App\Models\Restaurant;
use App\Models\Wallet;
use App\Observers\OrderObserver;
use App\Policies\OrderPolicy;
use App\Policies\RestaurantPolicy;
use App\Policies\WalletPolicy;
use Illuminate\Support\Facades\Gate;
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
        Order::observe(OrderObserver::class);

        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Restaurant::class, RestaurantPolicy::class);
        Gate::policy(Wallet::class, WalletPolicy::class);
    }
}
