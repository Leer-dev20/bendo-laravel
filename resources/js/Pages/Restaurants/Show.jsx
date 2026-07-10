import { Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Star, Plus, Minus } from 'lucide-react';
import { Header } from '@/components/Header';
import { CartFab } from '@/components/CartFab';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function RestaurantShow({ restaurant }) {
    const cart = useCart();

    const qtyOf = (itemId) =>
        cart.restaurantSlug === restaurant.slug
            ? cart.lines.find((l) => l.id === itemId)?.quantity ?? 0
            : 0;

    const handleAdd = (itemId) => {
        const item = restaurant.menu_items.find((m) => m.id === itemId);
        const switching = cart.restaurantSlug && cart.restaurantSlug !== restaurant.slug;
        cart.addItem(item, restaurant);
        if (switching) toast('Nouveau resto — panier mis à jour 🛍️');
    };

    return (
        <div className="min-h-screen bg-background pb-28">
            <Header />
            <div className="relative">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-48 md:h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
                <Link
                    href="/restaurants"
                    className="absolute top-4 left-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-card shadow-warm text-secondary"
                    aria-label="Retour"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </div>

            <div className="container -mt-10 relative">
                <div className="rounded-2xl bg-card p-5 shadow-warm border border-border">
                    <h1 className="text-2xl font-extrabold text-secondary">{restaurant.name}</h1>
                    <p className="text-sm text-muted-foreground">{restaurant.category} • {restaurant.district}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                            <Star className="h-4 w-4 fill-saffron text-saffron" />{restaurant.rating}
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />{restaurant.delivery_time}
                        </span>
                        <span className="text-muted-foreground">Livraison {restaurant.delivery_fee} MAD</span>
                    </div>
                </div>

                <h2 className="mt-8 mb-3 text-lg font-bold text-secondary">Menu</h2>
                <div className="space-y-3">
                    {restaurant.menu_items.map((item) => {
                        const qty = qtyOf(item.id);
                        return (
                            <div key={item.id} className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm border border-border">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                    className="h-24 w-24 rounded-xl object-cover shrink-0"
                                />
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <h3 className="font-bold text-secondary">{item.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-extrabold text-secondary">{item.price} MAD</span>
                                        {qty === 0 ? (
                                            <Button size="sm" variant="hero" className="rounded-full h-8 w-8 p-0" onClick={() => handleAdd(item.id)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0" onClick={() => cart.decrement(item.id)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="font-bold text-secondary w-5 text-center">{qty}</span>
                                                <Button size="sm" variant="hero" className="rounded-full h-8 w-8 p-0" onClick={() => handleAdd(item.id)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <CartFab />
        </div>
    );
}
