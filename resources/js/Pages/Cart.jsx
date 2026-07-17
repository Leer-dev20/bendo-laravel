import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const PLATFORM_FEE = 3;

export default function Cart() {
    const cart = useCart();
    const total = cart.subtotal + cart.deliveryFee + (cart.lines.length ? PLATFORM_FEE : 0);

    return (
        <div className="min-h-screen bg-background pb-28">
            <Header />
            <div className="container py-6 max-w-xl">
                <Link href="/restaurants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary mb-4">
                    <ArrowLeft className="h-4 w-4" /> Continuer mes achats
                </Link>
                <h1 className="text-2xl font-extrabold text-secondary">Mon panier</h1>
                {cart.restaurantName && (
                    <p className="text-sm text-muted-foreground">Chez {cart.restaurantName}</p>
                )}

                {cart.lines.length === 0 ? (
                    <div className="mt-12 text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="text-secondary font-semibold">Ton panier est vide</p>
                        <p className="text-sm text-muted-foreground mt-1">Découvre nos restos partenaires.</p>
                        <Button variant="hero" className="rounded-full mt-5" onClick={() => router.visit('/restaurants')}>
                            Voir les restos
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mt-6 space-y-3">
                            {cart.lines.map((l) => (
                                <div key={l.id} className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm border border-border">
                                    <img src={l.image} alt={l.name} width={96} height={96} loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-bold text-secondary text-sm">{l.name}</h3>
                                            <button onClick={() => cart.removeItem(l.id)} className="text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0" onClick={() => cart.decrement(l.id)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="font-bold text-secondary w-5 text-center">{l.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    variant="hero"
                                                    className="rounded-full h-8 w-8 p-0"
                                                    onClick={() => cart.addItem(l, { slug: cart.restaurantSlug, delivery_fee: cart.deliveryFee, name: cart.restaurantName })}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <span className="font-extrabold text-secondary">{l.price * l.quantity} MAD</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl bg-card p-4 shadow-sm border border-border space-y-2 text-sm">
                            <Row label="Sous-total" value={`${cart.subtotal} MAD`} />
                            <Row label="Frais de livraison" value={`${cart.deliveryFee} MAD`} />
                            <Row label="Frais de service" value={`${PLATFORM_FEE} MAD`} />
                            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                                <span className="font-bold text-secondary">Total</span>
                                <span className="font-extrabold text-lg text-secondary">{total} MAD</span>
                            </div>
                        </div>

                        <Button
                            variant="hero"
                            size="lg"
                            className="w-full rounded-full mt-6 font-bold h-14"
                            onClick={() => router.visit('/checkout')}
                        >
                            Passer la commande
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

const Row = ({ label, value }) => (
    <div className="flex items-center justify-between text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-secondary">{value}</span>
    </div>
);
