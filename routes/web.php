<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\CourierRequestController;
use App\Http\Controllers\CourierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index', [
        'restaurants' => \App\Models\Restaurant::active()
            ->orderByDesc('rating')
            ->limit(6)
            ->get(['id', 'slug', 'name', 'category', 'image', 'rating', 'delivery_time', 'delivery_fee', 'district']),
    ]);
})->name('home');

Route::get('/restaurants', [RestaurantController::class, 'index'])->name('restaurants.index');
Route::get('/restaurants/{restaurant:slug}', [RestaurantController::class, 'show'])->name('restaurants.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/panier', fn () => Inertia::render('Cart'))->name('cart');
    Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/commande/{order}', [OrderController::class, 'confirmation'])->name('orders.confirmation');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');

    Route::get('/abonnement', [WalletController::class, 'show'])->name('wallet.show');
    Route::post('/abonnement/recharge', [WalletController::class, 'topup'])->name('wallet.topup');
    Route::post('/abonnement/recharge-demo', [WalletController::class, 'topupDemo'])->name('wallet.topup-demo');

    Route::get('/orders/{order}/pay', [PaymentController::class, 'payForOrder'])->name('checkout.payment');
    Route::get('/paiement/retour', [PaymentController::class, 'return'])->name('payment.return');

    Route::get('/coursier/demander', [CourierRequestController::class, 'create'])->name('courier-requests.create');
    Route::post('/coursier/demander', [CourierRequestController::class, 'store'])->name('courier-requests.store');
    Route::get('/mes-courses', [CourierRequestController::class, 'index'])->name('courier-requests.index');
    Route::get('/coursier/demander/{courierRequest}', [CourierRequestController::class, 'show'])->name('courier-requests.show');

    // Espace admin
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminController::class, 'index'])->name('dashboard');
        Route::post('/restaurants', [RestaurantController::class, 'store'])->name('restaurants.store');
        Route::patch('/restaurants/{restaurant}', [RestaurantController::class, 'update'])->name('restaurants.update');
        Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy'])->name('restaurants.destroy');
        Route::post('/menu-items', [\App\Http\Controllers\Admin\MenuItemController::class, 'store'])->name('menu-items.store');
        Route::patch('/menu-items/{menuItem}', [\App\Http\Controllers\Admin\MenuItemController::class, 'update'])->name('menu-items.update');
        Route::delete('/menu-items/{menuItem}', [\App\Http\Controllers\Admin\MenuItemController::class, 'destroy'])->name('menu-items.destroy');
        Route::post('/daily-menus/toggle', [\App\Http\Controllers\Admin\DailyMenuController::class, 'toggle'])->name('daily-menus.toggle');
    });

    // Espace coursier (livreur)
    Route::middleware('role:courier,admin')->prefix('coursier')->name('courier.')->group(function () {
        Route::get('/', [CourierController::class, 'index'])->name('index');
        Route::patch('/orders/{order}/claim', [CourierController::class, 'claim'])->name('claim');
        Route::patch('/demandes/{courierRequest}/claim', [CourierRequestController::class, 'claim'])->name('courier-requests.claim');
        Route::patch('/demandes/{courierRequest}/status', [CourierRequestController::class, 'updateStatus'])->name('courier-requests.update-status');
    });
});

Route::post('/webhooks/orange-money', [PaymentController::class, 'orangeMoneyWebhook'])->name('payment.webhook.orange_money');
Route::post('/webhooks/stripe', [PaymentController::class, 'stripeWebhook'])->name('payment.webhook.stripe');

require __DIR__.'/auth.php';
