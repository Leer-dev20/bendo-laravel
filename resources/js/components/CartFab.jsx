import { router } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export const CartFab = () => {
    const { count, subtotal } = useCart();
    if (count === 0) return null;
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
            <Button
                variant="hero"
                size="lg"
                className="w-full rounded-full font-bold shadow-warm justify-between h-14 px-5"
                onClick={() => router.visit('/panier')}
            >
                <span className="flex items-center gap-2">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary-foreground/20 px-2 text-sm">
                        {count}
                    </span>
                    <ShoppingBag className="h-5 w-5" />
                    Voir mon panier
                </span>
                <span>{subtotal} MAD</span>
            </Button>
        </div>
    );
};
