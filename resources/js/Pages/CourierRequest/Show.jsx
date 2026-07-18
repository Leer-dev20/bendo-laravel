import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Bike, MapPin, Package, Phone, CheckCircle2, Search, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';

const STEPS = [
    { key: 'searching', label: 'Recherche d\'un coursier', icon: Search },
    { key: 'assigned', label: 'Coursier assigné', icon: Bike },
    { key: 'picked_up', label: 'Colis récupéré', icon: Package },
    { key: 'delivered', label: 'Livré', icon: CheckCircle2 },
];

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

export default function CourierRequestShow({ courierRequest: initial }) {
    const [cr, setCr] = useState(initial);

    useEffect(() => {
        window.Echo.private(`courier-requests.${initial.id}`)
            .listen('.courier-request.status.updated', (e) => {
                setCr((prev) => ({
                    ...prev,
                    status: e.status,
                    courier_id: e.courier_id,
                    estimated_pickup_at: e.estimated_pickup_at,
                    estimated_delivery_at: e.estimated_delivery_at,
                }));
            });

        return () => window.Echo.leave(`courier-requests.${initial.id}`);
    }, [initial.id]);

    const currentIndex = STEPS.findIndex((s) => s.key === cr.status);
    const eta = cr.status === 'picked_up' ? cr.estimated_delivery_at : cr.estimated_pickup_at;
    const remaining = useCountdown(cr.status === 'delivered' || cr.status === 'cancelled' ? null : eta);
    const isLate = remaining !== null && remaining < 0;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container max-w-lg py-6">
                <Link href="/mes-courses" className="text-sm text-muted-foreground">← Mes courses</Link>
                <h1 className="mt-2 text-2xl font-extrabold text-secondary flex items-center gap-2">
                    <Bike className="h-6 w-6 text-primary" /> Course #{cr.id}
                </h1>

                {cr.status === 'cancelled' ? (
                    <Badge variant="destructive" className="mt-4">Course annulée</Badge>
                ) : (
                    <>
                        {remaining !== null && (
                            <div className={`mt-4 rounded-3xl p-6 text-center shadow-warm border ${
                                isLate ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-gradient-to-br from-primary/10 to-saffron/30 border-primary/20 text-secondary'
                            }`}>
                                <p className="text-xs uppercase tracking-wide opacity-70 flex items-center justify-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    {cr.status === 'picked_up' ? 'Livraison estimée dans' : 'Récupération estimée dans'}
                                </p>
                                <p className="text-5xl font-extrabold tabular-nums mt-1">
                                    {isLate ? `+${fmt(remaining)}` : fmt(remaining)}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 space-y-0">
                            {STEPS.map((step, i) => {
                                const done = i <= currentIndex;
                                return (
                                    <div key={step.key} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            {i < STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-8 ${done ? 'bg-primary' : 'bg-border'}`} />}
                                        </div>
                                        <div className="pb-6">
                                            <p className={`text-sm font-semibold ${done ? 'text-secondary' : 'text-muted-foreground'}`}>{step.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <div className="rounded-2xl bg-card border border-border p-4 space-y-2 mt-2">
                    <p className="flex items-center gap-1.5 text-sm text-secondary">
                        <MapPin className="h-4 w-4 text-muted-foreground" /> {cr.from_zone?.name ?? cr.fromZone?.name} → {cr.to_zone?.name ?? cr.toZone?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{cr.pickup_address} → {cr.dropoff_address}</p>
                    <p className="flex items-center gap-1.5 text-sm text-secondary">
                        <Package className="h-4 w-4 text-muted-foreground" /> {cr.recipient_name} <span className="text-muted-foreground">· {cr.recipient_phone}</span>
                    </p>
                    {cr.courier && (
                        <p className="flex items-center gap-1.5 text-sm text-secondary">
                            <Phone className="h-4 w-4 text-muted-foreground" /> Coursier : {cr.courier.name}
                        </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                        <span className="text-sm text-muted-foreground">Prix</span>
                        <span className="text-lg font-extrabold text-primary">{cr.price} MAD</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
