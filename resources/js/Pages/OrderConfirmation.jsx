import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation({ order }) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container max-w-md py-16 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald" />
                </div>
                <h1 className="text-2xl font-extrabold text-secondary">Commande confirmée !</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Commande #{order.id} chez {order.restaurant_name} — {order.total} MAD
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Livraison estimée vers {new Date(order.estimated_delivery_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex gap-2 justify-center mt-6">
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href={`/orders/${order.id}`}>Suivre ma commande</Link>
                    </Button>
                    <Button asChild variant="hero" className="rounded-full">
                        <Link href="/restaurants">Nouvelle commande</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
