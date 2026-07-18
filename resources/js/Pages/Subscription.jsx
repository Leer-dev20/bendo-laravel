import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const QUICK = [100, 200, 500, 1000];

export default function Subscription({ wallet }) {
    const [amount, setAmount] = useState('200');
    const [busy, setBusy] = useState(false);

    const topupDemo = () => {
        const value = parseInt(amount, 10);
        if (!value || value < 20 || value > 10000) {
            toast.error('Montant entre 20 et 10 000 MAD');
            return;
        }
        setBusy(true);
        router.post('/abonnement/recharge-demo', { amount: value }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`+${value} MAD ajoutés à ta cagnotte`),
            onFinish: () => setBusy(false),
        });
    };

    const topupCard = () => {
        const value = parseInt(amount, 10);
        if (!value || value < 20 || value > 10000) {
            toast.error('Montant entre 20 et 10 000 MAD');
            return;
        }
        setBusy(true);
        router.post('/abonnement/recharge', { amount: value, provider: 'stripe' });
    };

    return (
        <div className="min-h-screen bg-background pb-16">
            <Header />
            <div className="container py-6 max-w-2xl">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary mb-4">
                    <ArrowLeft className="h-4 w-4" /> Accueil
                </Link>
                <h1 className="text-2xl font-extrabold text-secondary">Mon abonnement</h1>
                <p className="text-sm text-muted-foreground">
                    Recharge ta cagnotte et règle tes repas en un clic, sans cash.
                </p>

                <div className="mt-6 rounded-3xl bg-gradient-to-br from-primary to-saffron text-primary-foreground p-6 shadow-warm">
                    <div className="flex items-center gap-2 text-sm opacity-90">
                        <WalletIcon className="h-4 w-4" /> Solde disponible
                    </div>
                    <div className="mt-1 text-4xl font-extrabold tracking-tight">
                        {wallet.balance} <span className="text-xl font-bold opacity-90">MAD</span>
                    </div>
                    <p className="text-xs opacity-80 mt-2">Utilisable immédiatement au paiement.</p>
                </div>

                <div className="mt-6 rounded-2xl bg-card border border-border p-5 space-y-4">
                    <h2 className="font-bold text-secondary">Recharger</h2>
                    <div className="flex flex-wrap gap-2">
                        {QUICK.map((q) => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setAmount(String(q))}
                                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                                    amount === String(q)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-secondary border-border hover:bg-muted'
                                }`}
                            >
                                {q} MAD
                            </button>
                        ))}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="amount">Montant personnalisé (MAD)</Label>
                        <Input
                            id="amount" type="number" inputMode="numeric" min={20} max={10000}
                            value={amount} onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                        <Button variant="hero" className="rounded-full font-bold" disabled={busy} onClick={topupCard}>
                            <CreditCard className="h-4 w-4" /> Payer par carte
                        </Button>
                        <Button variant="outline" className="rounded-full font-semibold" disabled={busy} onClick={topupDemo}>
                            <Plus className="h-4 w-4" /> Recharge démo
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Le paiement par carte ouvre une page sécurisée Stripe. La recharge démo crédite ta cagnotte sans paiement (test).
                    </p>
                </div>

                <div className="mt-6 rounded-2xl bg-card border border-border p-5">
                    <h2 className="font-bold text-secondary mb-3">Historique</h2>
                    {wallet.transactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun mouvement pour l'instant.</p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {wallet.transactions.map((t) => (
                                <li key={t.id} className="py-3 flex items-center gap-3">
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ${t.amount > 0 ? 'bg-emerald/10 text-emerald' : 'bg-muted text-secondary'}`}>
                                        {t.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-secondary truncate">{t.description ?? t.type}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString('fr-FR')}</p>
                                    </div>
                                    <span className={`text-sm font-bold ${t.amount > 0 ? 'text-emerald' : 'text-secondary'}`}>
                                        {t.amount > 0 ? '+' : ''}{t.amount} MAD
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
