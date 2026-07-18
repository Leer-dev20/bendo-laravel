import { useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Home, UtensilsCrossed, ChefHat, Bike, Package, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';

const STEPS = [
    { key: 'confirmed', label: 'Confirmée', icon: CheckCircle2 },
    { key: 'preparing', label: 'En préparation', icon: ChefHat },
    { key: 'ready', label: 'Prête', icon: Package },
    { key: 'picked_up', label: 'En livraison', icon: Bike },
    { key: 'delivered', label: 'Livrée', icon: CheckCircle2 },
];

const stepIndex = (s) => Math.max(0, STEPS.findIndex((x) => x.key === s));

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

export default function OrderConfirmation({ order: initialOrder }) {
    const [order, setOrder] = useState(initialOrder);

    useEffect(() => {
        const channel = window.Echo.private(`orders.${initialOrder.id}`)
            .listen('.order.status.updated', (e) => {
                setOrder((prev) => ({
                    ...prev,
                    status: e.status,
                    courier_id: e.courier_id,
                    estimated_delivery_at: e.estimated_delivery_at,
                }));
            });

        return () => {
            window.Echo.leave(`orders.${initialOrder.id}`);
        };
    }, [initialOrder.id]);

    const current = order.status;
    const idx = stepIndex(current);
    const eta = current === 'picked_up' || current === 'ready'
        ? order.estimated_delivery_at
        : order.estimated_ready_at;
    const remaining = useCountdown(eta);
    const isLate = remaining !== null && remaining < 0;

    const payLabel = useMemo(() => {
        switch (order.payment_method) {
            case 'card': return 'Carte bancaire';
            case 'wallet': return 'Cagnotte';
            case 'wave': return 'Wave';
            case 'orange_money': return 'Orange Money';
            default: return 'Cash à la livraison';
        }
    }, [order.payment_method]);

    return (
        <div className="min-h-screen bg-background pb-12">
            <Header />
            <div className="container py-8 max-w-lg">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-emerald/10 flex items-center justify-center mb-5 animate-fade-up">
                        <CheckCircle2 className="h-10 w-10 text-emerald" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">
                        {current === 'delivered' ? 'Commande livrée 🎉' : 'Commande confirmée !'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {order.customer_name ? `Merci ${order.customer_name.split(' ')[0]} — ` : ''}
                        {current === 'delivered' ? 'Bon appétit !' : 'on prépare ton repas avec amour 🍲'}
                    </p>
                </div>

                {current !== 'delivered' && current !== 'cancelled' && (
                    <div className={`mt-6 rounded-3xl p-6 text-center shadow-warm border ${
                        isLate ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-gradient-to-br from-primary/10 to-saffron/30 border-primary/20 text-secondary'
                    }`}>
                        <p className="text-xs uppercase tracking-wide opacity-70 flex items-center justify-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {idx >= 3 ? 'Arrivée estimée dans' : 'Prête dans'}
                        </p>
                        <p className="text-5xl font-extrabold tabular-nums mt-1">
                            {remaining !== null ? (isLate ? `+${fmt(remaining)}` : fmt(remaining)) : '—'}
                        </p>
                        <p className="text-xs opacity-70 mt-2">
                            {isLate ? 'Léger retard, on fait au plus vite' : `Délai de préparation : ${order.prep_minutes} min`}
                        </p>
                    </div>
                )}

                <ol className="mt-6 grid grid-cols-5 gap-1">
                    {STEPS.map((s, i) => {
                        const done = i <= idx;
                        const Icon = s.icon;
                        return (
                            <li key={s.key} className="flex flex-col items-center text-center">
                                <span className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-colors ${
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

                <div className="mt-6 rounded-2xl bg-card p-5 shadow-warm border border-border space-y-2">
                    <Row label="N° commande" value={`#${order.id}`} />
                    <Row label="Restaurant" value={order.restaurant_name} />
                    <Row label="Livraison" value={order.address} />
                    <Row label="Total" value={`${order.total} MAD`} />
                    <Row label="Paiement" value={payLabel} />
                </div>

                <div className="mt-8 flex flex-col gap-2">
                    <Button asChild variant="hero" className="rounded-full font-bold">
                        <Link href="/restaurants"><UtensilsCrossed className="h-4 w-4" /> Commander encore</Link>
                    </Button>
                    <Button asChild variant="ghost" className="rounded-full">
                        <Link href="/"><Home className="h-4 w-4" /> Retour à l'accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

const Row = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 text-sm">
        <span className="text-muted-foreground shrink-0">{label}</span>
        <span className="font-semibold text-secondary text-right">{value}</span>
    </div>
);
