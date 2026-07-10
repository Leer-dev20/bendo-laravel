<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Usage dans routes/web.php :
     *   Route::middleware('role:admin')->group(...)
     *   Route::middleware('role:admin,courier')->group(...)
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, "Accès réservé aux rôles : " . implode(', ', $roles));
        }

        return $next($request);
    }
}
