import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Wallet, CreditCard, Banknote, LocateFixed } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';

const PLATFORM_FEE = 3;

export default function Checkout({ walletBalance }) {
    const cart = useCart();
    const form = useForm({
    customer_name: '',
    phone: '',
    address: '',
    notes: '',
    payment_method: 'cash',
    restaurant_slug: cart.restaurantSlug,
    items: cart.lines.map((l) => ({ id: l.id, quantity: l.quantity })),
});

    const [locating, setLocating] = useState(false);
    const total = cart.subtotal + cart.deliveryFee + PLATFORM_FEE;
    const walletInsufficient = form.data.payment_method === 'wallet' && walletBalance < total;

    const useMyLocation = () => {
    if (!navigator.geolocation) {
        alert('La géolocalisation n\'est pas supportée par ton navigateur.');
        return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                    { headers: { 'Accept-Language': 'fr' } },
                );
                const data = await res.json();
                form.setData('address', data.display_name ?? `${latitude}, ${longitude}`);
            } catch {
                alert('Impossible de récupérer ton adresse. Renseigne-la manuellement.');
            } finally {
                setLocating(false);
            }
        },
        () => {
            alert('Localisation refusée ou indisponible.');
            setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 },
    );
};
    const submit = (e) => {
    e.preventDefault();
    if (walletInsufficient) return;

    form.post('/orders', {
        onSuccess: () => cart.clear(),
    });
};

    return (
        <div className="min-h-screen bg-background pb-12">
            <Header />
            <div className="container py-6 max-w-xl">
                <Link href="/panier" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary mb-4">
                    <ArrowLeft className="h-4 w-4" /> Retour panier
                </Link>
                <h1 className="text-2xl font-extrabold text-secondary">Validation</h1>
                <p className="text-sm text-muted-foreground">Commande chez {cart.restaurantName}</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input id="name" value={form.data.customer_name} onChange={(e) => form.setData('customer_name', e.target.value)} placeholder="Aïssatou Diop" />
                        {form.errors.customer_name && <p className="text-xs text-destructive">{form.errors.customer_name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input id="phone" type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} placeholder="+212 6 12 34 56 78" />
                        {form.errors.phone && <p className="text-xs text-destructive">{form.errors.phone}</p>}
                    </div>
                   <div className="space-y-2">
    <div className="flex items-center justify-between">
        <Label htmlFor="address">Adresse de livraison *</Label>
        <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
        >
            <LocateFixed className="h-3.5 w-3.5" />
            {locating ? 'Localisation...' : 'Ma position'}
        </button>
    </div>
    <Input id="address" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} placeholder="Rue, immeuble, étage — Casablanca" />
    {form.errors.address && <p className="text-xs text-destructive">{form.errors.address}</p>}
</div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Instructions (optionnel)</Label>
                        <Textarea id="notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} placeholder="Code porte, étage, allergies..." />
                    </div>

                    <div className="space-y-2">
                        <Label>Mode de paiement</Label>
                        <div className="grid gap-2">
                            <PayOption
                                active={form.data.payment_method === 'cash'} onClick={() => form.setData('payment_method', 'cash')}
                                icon={<Banknote className="h-5 w-5" />}
                                title="À la livraison" sub="En espèces directement au livreur"
                            />
                            <PayOption
                                active={form.data.payment_method === 'wallet'} onClick={() => form.setData('payment_method', 'wallet')}
                                icon={<Wallet className="h-5 w-5" />}
                                title="Cagnotte" sub={`Solde : ${walletBalance} MAD${walletInsufficient ? ' — insuffisant' : ''}`}
                                warning={walletInsufficient}
                            />
                            <PayOption
                                active={form.data.payment_method === 'card'} onClick={() => form.setData('payment_method', 'card')}
                                icon={<CreditCard className="h-5 w-5" />}
                                title="Carte bancaire" sub="Paiement sécurisé Stripe"
                            />
                        </div>
                        {form.errors.payment_method && <p className="text-xs text-destructive">{form.errors.payment_method}</p>}
                    </div>

                    <div className="rounded-2xl bg-card p-4 shadow-sm border border-border space-y-1 text-sm">
                        <Row label="Sous-total" value={`${cart.subtotal} MAD`} />
                        <Row label="Livraison" value={`${cart.deliveryFee} MAD`} />
                        <Row label="Frais de service" value={`${PLATFORM_FEE} MAD`} />
                        <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                            <span className="font-bold text-secondary">Total</span>
                            <span className="font-extrabold text-lg text-secondary">{total} MAD</span>
                        </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full rounded-full font-bold h-14" disabled={form.processing || walletInsufficient}>
                        {form.processing ? '...' : form.data.payment_method === 'card' ? 'Payer par carte' : 'Confirmer ma commande'}
                    </Button>
                </form>
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

const PayOption = ({ active, onClick, icon, title, sub, warning }) => (
    <button
        type="button" onClick={onClick}
        className={`w-full text-left rounded-2xl border p-3 flex items-center gap-3 transition-colors ${
            active ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'
        }`}
    >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${active ? 'bg-primary text-primary-foreground' : 'bg-saffron/30 text-primary'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-secondary">{title}</p>
            <p className={`text-xs ${warning ? 'text-destructive' : 'text-secondary/70'}`}>{sub}</p>
        </div>
        <span className={`h-4 w-4 rounded-full border-2 ${active ? 'border-primary bg-primary' : 'border-border'}`} />
    </button>
);
