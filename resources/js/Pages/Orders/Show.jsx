import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Clock, CheckCircle2, ChefHat, Package, Bike } from 'lucide-react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';

const STEPS = [
    { key: 'confirmed', label: 'Confirmée', icon: CheckCircle2 },
    { key: 'preparing', label: 'En préparation', icon: ChefHat },
    { key: 'ready', label: 'Prête', icon: Package },
    { key: 'picked_up', label: 'En livraison', icon: Bike },
    { key: 'delivered', label: 'Livrée', icon: CheckCircle2 },
];

const STATUS_LABEL = {
    pending_payment: 'En attente de paiement',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready: 'Prête',
    picked_up: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée',
};

const useCountdown = (target) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);
    if (!target) return null;
    return new Date(target).getTime() - now;
};

const fmt = (ms) => {
    const abs = Math.abs(ms);
    const m = Math.floor(abs / 60000);
    const s = Math.floor((abs % 60000) / 1000);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function OrderShow({ order: initial }) {
    const [order, setOrder] = useState(initial);
    const active = !['delivered', 'cancelled'].includes(order.status);

    useEffect(() => {
        if (!active) return;
        const channel = window.Echo.private(`orders.${initial.id}`)
            .listen('.order.status.updated', (e) => {
                setOrder((prev) => ({ ...prev, status: e.status, courier_id: e.courier_id, estimated_delivery_at: e.estimated_delivery_at }));
            });
        return () => window.Echo.leave(`orders.${initial.id}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial.id, active]);

    const idx = STEPS.findIndex((s) => s.key === order.status);
    const eta = order.status === 'picked_up' ? order.estimated_delivery_at : order.estimated_ready_at;
    const remaining = useCountdown(active ? eta : null);
    const isLate = remaining !== null && remaining < 0;

    return (
        <div className="min-h-screen bg-background pb-16">
            <Header />
            <div className="container py-6 max-w-lg">
                <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary mb-4">
                    <ArrowLeft className="h-4 w-4" /> Mes commandes
                </Link>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold text-secondary">Commande #{order.id}</h1>
                    {order.status === 'cancelled' && <Badge variant="destructive">Annulée</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{order.restaurant_name}</p>

                {active && remaining !== null && (
                    <div className={`mt-4 rounded-3xl p-6 text-center shadow-warm border ${
                        isLate ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-gradient-to-br from-primary/10 to-saffron/30 border-primary/20 text-secondary'
                    }`}>
                        <p className="text-xs uppercase tracking-wide opacity-70 flex items-center justify-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {idx >= 3 ? 'Arrivée estimée dans' : 'Prête dans'}
                        </p>
                        <p className="text-5xl font-extrabold tabular-nums mt-1">
                            {isLate ? `+${fmt(remaining)}` : fmt(remaining)}
                        </p>
                    </div>
                )}

                {order.status !== 'cancelled' && (
                    <ol className="mt-6 grid grid-cols-5 gap-1">
                        {STEPS.map((s, i) => {
                            const done = i <= idx;
                            const Icon = s.icon;
                            return (
                                <li key={s.key} className="flex flex-col items-center text-center">
                                    <span className={`h-9 w-9 rounded-full flex items-center justify-center border-2 ${
                                        done ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border'
                                    }`}>
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className={`mt-1 text-[10px] leading-tight ${done ? 'text-secondary font-semibold' : 'text-muted-foreground'}`}>
                                        {s.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                )}

                <div className="mt-6 rounded-2xl bg-card p-5 shadow-warm border border-border space-y-2">
                    {(order.items ?? []).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-secondary">{item.quantity}x {item.name}</span>
                            <span className="font-semibold text-secondary">{item.price * item.quantity} MAD</span>
                        </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2 space-y-1">
                        <Row label="Sous-total" value={`${order.subtotal} MAD`} />
                        <Row label="Livraison" value={`${order.delivery_fee} MAD`} />
                        <Row label="Frais de service" value={`${order.platform_fee} MAD`} />
                        <div className="flex items-center justify-between pt-1">
                            <span className="font-bold text-secondary">Total</span>
                            <span className="font-extrabold text-secondary">{order.total} MAD</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl bg-card p-5 border border-border space-y-2">
                    <Row label="Adresse" value={order.address} />
                    <Row label="Téléphone" value={order.phone} />
                </div>

                {order.status_history?.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-card p-5 border border-border">
                        <h2 className="font-bold text-secondary mb-3 text-sm">Historique</h2>
                        <ul className="space-y-2">
                            {order.status_history.map((h) => (
                                <li key={h.id} className="flex items-center justify-between text-xs">
                                    <span className="text-secondary font-medium">{STATUS_LABEL[h.status] ?? h.status}</span>
                                    <span className="text-muted-foreground">{new Date(h.created_at).toLocaleString('fr-FR')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

const Row = ({ label, value }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-secondary text-right">{value}</span>
    </div>
);
