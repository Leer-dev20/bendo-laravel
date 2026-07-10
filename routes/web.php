<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/restaurants', [RestaurantController::class, 'index'])->name('restaurants.index');
Route::get('/restaurants/{restaurant:slug}', [RestaurantController::class, 'show'])->name('restaurants.show');

Route::middleware('auth')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');

    Route::get('/wallet', [WalletController::class, 'show'])->name('wallet.show');
    Route::post('/wallet/topup', [WalletController::class, 'topup'])->name('wallet.topup');

    Route::get('/orders/{order}/pay', [PaymentController::class, 'payForOrder'])->name('checkout.payment');
    Route::get('/paiement/retour', [PaymentController::class, 'return'])->name('payment.return');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::post('/restaurants', [RestaurantController::class, 'store'])->name('restaurants.store');
        Route::patch('/restaurants/{restaurant}', [RestaurantController::class, 'update'])->name('restaurants.update');
        Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy'])->name('restaurants.destroy');
    });
});

Route::post('/webhooks/orange-money', [PaymentController::class, 'orangeMoneyWebhook'])->name('payment.webhook.orange_money');
Route::post('/webhooks/stripe', [PaymentController::class, 'stripeWebhook'])->name('payment.webhook.stripe');

require __DIR__.'/auth.php';
