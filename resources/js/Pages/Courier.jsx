import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Bike, MapPin, Phone, Clock, Package, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STATUS_META = {
    pending_payment: { label: 'En attente paiement', color: 'bg-muted text-secondary' },
    confirmed: { label: 'Confirmée', color: 'bg-saffron/30 text-secondary' },
    preparing: { label: 'En préparation', color: 'bg-amber-500/20 text-amber-900' },
    ready: { label: 'Prête à récupérer', color: 'bg-emerald/20 text-emerald' },
    picked_up: { label: 'En livraison', color: 'bg-primary/20 text-primary' },
    delivered: { label: 'Livrée', color: 'bg-emerald text-emerald-foreground' },
    cancelled: { label: 'Annulée', color: 'bg-destructive/20 text-destructive' },
    searching: { label: 'Recherche coursier', color: 'bg-muted text-secondary' },
    assigned: { label: 'Assignée', color: 'bg-saffron/30 text-secondary' },
};

export default function Courier({ orders = [], packages = [] }) {
    const { user, isCourier, isAdmin } = useAuth();
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!user || !(isCourier || isAdmin)) return;
        intervalRef.current = setInterval(() => {
            router.reload({ only: ['orders', 'packages'], preserveScroll: true, preserveState: true });
        }, 5000);
        return () => clearInterval(intervalRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isCourier, isAdmin]);

    if (!user) return null;

    if (!isCourier && !isAdmin) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container max-w-md py-16 text-center">
                    <Bike className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h1 className="mt-4 text-xl font-bold text-secondary">Espace coursier</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Cet espace est réservé aux livreurs. Demande à un admin d'activer ton compte.
                    </p>
                </div>
            </div>
        );
    }

    const claimOrder = (order) => {
        router.patch(`/coursier/orders/${order.id}/claim`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Commande prise'),
            onError: () => toast.error('Impossible de prendre cette commande'),
        });
    };

    const nextOrder = (order, status) => {
        router.patch(`/orders/${order.id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => toast.success(STATUS_META[status].label),
        });
    };

    const claimPackage = (pkg) => {
        router.patch(`/coursier/demandes/${pkg.id}/claim`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Colis pris en charge'),
            onError: () => toast.error('Impossible de prendre ce colis'),
        });
    };

    const nextPackage = (pkg, status) => {
        router.patch(`/coursier/demandes/${pkg.id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => toast.success(STATUS_META[status].label),
        });
    };

    const myOrders = orders.filter((o) => o.courier_id === user.id);
    const availableOrders = orders.filter((o) => !o.courier_id && (o.status === 'ready' || o.status === 'preparing'));
    const myPackages = packages.filter((p) => p.courier_id === user.id);
    const availablePackages = packages.filter((p) => !p.courier_id && p.status === 'searching');

    return (
        <div className="min-h-screen bg-background pb-16">
            <Header />
            <div className="container py-6 max-w-3xl space-y-8">
                <header>
                    <h1 className="text-2xl font-extrabold text-secondary flex items-center gap-2">
                        <Bike className="h-6 w-6 text-primary" /> Espace coursier
                    </h1>
                    <p className="text-sm text-muted-foreground">Suivi automatique des commandes et colis en cours.</p>
                </header>

                <section>
                    <h2 className="font-bold text-secondary mb-3">Mes livraisons resto ({myOrders.length})</h2>
                    {myOrders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune course en cours.</p>
                    ) : (
                        <div className="space-y-3">
                            {myOrders.map((o) => <OrderCard key={o.id} order={o} onNext={nextOrder} mine />)}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="font-bold text-secondary mb-3">Livraisons resto à prendre ({availableOrders.length})</h2>
                    {availableOrders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune commande disponible pour l'instant.</p>
                    ) : (
                        <div className="space-y-3">
                            {availableOrders.map((o) => <OrderCard key={o.id} order={o} onClaim={claimOrder} />)}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="font-bold text-secondary mb-3">Mes colis ({myPackages.length})</h2>
                    {myPackages.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun colis en cours.</p>
                    ) : (
                        <div className="space-y-3">
                            {myPackages.map((p) => <PackageCard key={p.id} pkg={p} onNext={nextPackage} mine />)}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="font-bold text-secondary mb-3">Colis à prendre ({availablePackages.length})</h2>
                    {availablePackages.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun colis disponible pour l'instant.</p>
                    ) : (
                        <div className="space-y-3">
                            {availablePackages.map((p) => <PackageCard key={p.id} pkg={p} onClaim={claimPackage} />)}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

const OrderCard = ({ order, onClaim, onNext, mine }) => {
    const meta = STATUS_META[order.status];
    const eta = order.estimated_delivery_at ? new Date(order.estimated_delivery_at) : null;
    const items = Array.isArray(order.items) ? order.items : [];
    const itemCount = items.reduce((acc, i) => acc + (i.quantity ?? 1), 0);

    return (
        <article className="rounded-2xl bg-card border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-bold text-secondary truncate">{order.restaurant_name}</p>
                    <p className="text-xs text-muted-foreground">#{order.id}</p>
                </div>
                <Badge className={meta.color}>{meta.label}</Badge>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-secondary">
                <p className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" /> {itemCount} article(s) · <span className="font-bold">{order.total} MAD</span>
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {order.address}
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {order.customer_name} · {order.phone}
                </p>
                {eta && (
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Livraison estimée {eta.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {!mine && onClaim && (
                    <Button size="sm" variant="hero" className="rounded-full" onClick={() => onClaim(order)}>
                        Prendre la course
                    </Button>
                )}
                {mine && onNext && order.status === 'ready' && (
                    <Button size="sm" variant="hero" className="rounded-full" onClick={() => onNext(order, 'picked_up')}>
                        Récupérée
                    </Button>
                )}
                {mine && onNext && order.status === 'picked_up' && (
                    <Button size="sm" variant="emerald" className="rounded-full" onClick={() => onNext(order, 'delivered')}>
                        <CheckCircle2 className="h-4 w-4" /> Marquer livrée
                    </Button>
                )}
                {mine && onNext && order.status === 'preparing' && (
                    <Button size="sm" variant="outline" className="rounded-full" disabled>
                        En préparation cuisine…
                    </Button>
                )}
            </div>
        </article>
    );
};

const PackageCard = ({ pkg, onClaim, onNext, mine }) => {
    const meta = STATUS_META[pkg.status];

    return (
        <article className="rounded-2xl bg-card border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-bold text-secondary truncate">
                        {pkg.from_zone?.name} → {pkg.to_zone?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Colis #{pkg.id}</p>
                </div>
                <Badge className={meta.color}>{meta.label}</Badge>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-secondary">
                <p className="flex items-center gap-1.5">
                    <span className="font-bold">{pkg.price} MAD</span>
                    {pkg.package_description && <span className="text-muted-foreground">· {pkg.package_description}</span>}
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {pkg.pickup_address} → {pkg.dropoff_address}
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {pkg.recipient_name} · {pkg.recipient_phone}
                </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {!mine && onClaim && (
                    <Button size="sm" variant="hero" className="rounded-full" onClick={() => onClaim(pkg)}>
                        Prendre le colis
                    </Button>
                )}
                {mine && onNext && pkg.status === 'assigned' && (
                    <Button size="sm" variant="hero" className="rounded-full" onClick={() => onNext(pkg, 'picked_up')}>
                        Colis récupéré
                    </Button>
                )}
                {mine && onNext && pkg.status === 'picked_up' && (
                    <Button size="sm" variant="emerald" className="rounded-full" onClick={() => onNext(pkg, 'delivered')}>
                        <CheckCircle2 className="h-4 w-4" /> Marquer livré
                    </Button>
                )}
            </div>
        </article>
    );
};
