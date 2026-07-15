import { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Bike, MapPin, ArrowRight, Package, User as UserIcon, Phone, CreditCard, LocateFixed } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Cash à la livraison' },
    { id: 'card', label: 'Carte bancaire' },
    { id: 'wave', label: 'Wave' },
    { id: 'orange_money', label: 'Orange Money' },
];

export default function CourierRequestCreate({ zones, rates }) {
    const [locating, setLocating] = useState(false);
    const form = useForm({
        from_zone_id: '',
        to_zone_id: '',
        pickup_address: '',
        dropoff_address: '',
        recipient_name: '',
        recipient_phone: '',
        package_description: '',
        payment_method: 'cash',
    });

    const price = useMemo(() => {
        if (!form.data.from_zone_id || !form.data.to_zone_id) return null;
        const rate = rates.find(
            (r) => String(r.from_zone_id) === String(form.data.from_zone_id)
                && String(r.to_zone_id) === String(form.data.to_zone_id),
        );
        return rate?.price ?? null;
    }, [form.data.from_zone_id, form.data.to_zone_id, rates]);

    const canSubmit = form.data.from_zone_id && form.data.to_zone_id
        && form.data.pickup_address && form.data.dropoff_address
        && form.data.recipient_name && form.data.recipient_phone;

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
                    const address = data.display_name ?? `${latitude}, ${longitude}`;
                    form.setData('pickup_address', address);

                    const matched = zones.find((z) =>
                        address.toLowerCase().includes(z.name.toLowerCase())
                        || (data.address?.suburb ?? '').toLowerCase().includes(z.name.toLowerCase())
                        || (data.address?.neighbourhood ?? '').toLowerCase().includes(z.name.toLowerCase()),
                    );
                    if (matched) form.setData('from_zone_id', String(matched.id));
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
        form.post('/coursier/demander');
    };

    return (
        <div className="min-h-screen bg-background pb-28">
            <Header />
            <div className="container max-w-lg py-6">
                <Link href="/" className="text-sm text-muted-foreground">← Retour</Link>
                <h1 className="mt-2 text-2xl font-extrabold text-secondary flex items-center gap-2">
                    <Bike className="h-6 w-6 text-primary" /> Envoyer un colis
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Un coursier récupère et livre ton colis à Casablanca.
                </p>

                <form onSubmit={submit} className="space-y-5">
                    {/* Étape 1 : zones + prix en direct */}
                    <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-secondary/70">Trajet</p>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                            <div className="space-y-1.5">
                                <Label>Départ</Label>
                                <select
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    value={form.data.from_zone_id}
                                    onChange={(e) => form.setData('from_zone_id', e.target.value)}
                                    required
                                >
                                    <option value="">Zone…</option>
                                    {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                                </select>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground mb-2.5" />
                            <div className="space-y-1.5">
                                <Label>Arrivée</Label>
                                <select
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    value={form.data.to_zone_id}
                                    onChange={(e) => form.setData('to_zone_id', e.target.value)}
                                    required
                                >
                                    <option value="">Zone…</option>
                                    {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {price !== null && (
                            <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                                <span className="text-sm text-muted-foreground">Prix estimé</span>
                                <span className="text-lg font-extrabold text-primary">{price} MAD</span>
                            </div>
                        )}
                    </div>

                    {/* Étape 2 : adresses précises */}
                    <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-secondary/70">Adresses précises</p>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Adresse de récupération</Label>
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
                            <Input
                                required
                                placeholder="Ex: 12 rue des Fleurs, Maârif"
                                value={form.data.pickup_address}
                                onChange={(e) => form.setData('pickup_address', e.target.value)}
                            />
                            {form.errors.pickup_address && <p className="text-xs text-destructive">{form.errors.pickup_address}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Adresse de livraison</Label>
                            <Input
                                required
                                placeholder="Ex: 45 avenue Hassan II, Gauthier"
                                value={form.data.dropoff_address}
                                onChange={(e) => form.setData('dropoff_address', e.target.value)}
                            />
                            {form.errors.dropoff_address && <p className="text-xs text-destructive">{form.errors.dropoff_address}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" />Description du colis (optionnel)</Label>
                            <Textarea
                                rows={2}
                                placeholder="Ex: enveloppe de documents, petit paquet..."
                                value={form.data.package_description}
                                onChange={(e) => form.setData('package_description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Étape 3 : destinataire */}
                    <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-secondary/70">Destinataire</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" />Nom</Label>
                                <Input
                                    required
                                    value={form.data.recipient_name}
                                    onChange={(e) => form.setData('recipient_name', e.target.value)}
                                />
                                {form.errors.recipient_name && <p className="text-xs text-destructive">{form.errors.recipient_name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Téléphone</Label>
                                <Input
                                    required
                                    type="tel"
                                    placeholder="+212 6..."
                                    value={form.data.recipient_phone}
                                    onChange={(e) => form.setData('recipient_phone', e.target.value)}
                                />
                                {form.errors.recipient_phone && <p className="text-xs text-destructive">{form.errors.recipient_phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Étape 4 : paiement */}
                    <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-secondary/70 flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5" />Paiement
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {PAYMENT_METHODS.map((m) => (
                                <button
                                    type="button"
                                    key={m.id}
                                    onClick={() => form.setData('payment_method', m.id)}
                                    className={`rounded-xl border-2 p-3 text-sm font-semibold text-left transition-all ${
                                        form.data.payment_method === m.id
                                            ? 'border-primary bg-primary/5 shadow-card'
                                            : 'border-border hover:border-primary/40'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full rounded-full font-bold"
                        disabled={!canSubmit || form.processing}
                    >
                        {form.processing ? 'Envoi...' : price ? `Commander — ${price} MAD` : 'Commander la course'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
