import { Link } from '@inertiajs/react';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';

const STATUS_META = {
    pending_payment: { label: 'En attente paiement', color: 'bg-muted text-secondary' },
    confirmed: { label: 'Confirmée', color: 'bg-saffron/30 text-secondary' },
    preparing: { label: 'En préparation', color: 'bg-amber-500/20 text-amber-900' },
    ready: { label: 'Prête', color: 'bg-emerald/20 text-emerald' },
    picked_up: { label: 'En livraison', color: 'bg-primary/20 text-primary' },
    delivered: { label: 'Livrée', color: 'bg-emerald text-emerald-foreground' },
    cancelled: { label: 'Annulée', color: 'bg-destructive/20 text-destructive' },
};

export default function OrdersIndex({ orders }) {
    const list = orders.data ?? orders;

    return (
        <div className="min-h-screen bg-background pb-16">
            <Header />
            <div className="container py-6 max-w-2xl">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary mb-4">
                    <ArrowLeft className="h-4 w-4" /> Accueil
                </Link>
                <h1 className="text-2xl font-extrabold text-secondary flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" /> Mes commandes
                </h1>
                <p className="text-sm text-muted-foreground">Historique de tes commandes restaurants.</p>

                {list.length === 0 ? (
                    <div className="mt-10 text-center">
                        <p className="text-secondary font-semibold">Aucune commande pour l'instant</p>
                        <p className="text-sm text-muted-foreground mt-1">Découvre nos restos partenaires.</p>
                        <Link href="/restaurants" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                            Voir les restos →
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 space-y-3">
                        {list.map((o) => {
                            const meta = STATUS_META[o.status] ?? STATUS_META.confirmed;
                            return (
                                <Link
                                    key={o.id}
                                    href={`/orders/${o.id}`}
                                    className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 hover:shadow-card transition-shadow"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-secondary truncate">{o.restaurant_name}</p>
                                            <Badge className={meta.color}>{meta.label}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            #{o.id} · {new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className="font-extrabold text-secondary shrink-0">{o.total} MAD</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
