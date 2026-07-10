import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Handshake, Store, Bike, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

const types = [
    { id: 'Restaurant', icon: Store, label: 'Restaurant' },
    { id: 'Livreur', icon: Bike, label: 'Livreur' },
    { id: 'GP', icon: Plane, label: 'GP' },
];

export const PartnerModal = ({ open, onOpenChange }) => {
    const [type, setType] = useState('Restaurant');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const submit = (e) => {
        e.preventDefault();
        const list = JSON.parse(localStorage.getItem('bendo_partners') || '[]');
        list.push({ type, name, phone, message, date: new Date().toISOString() });
        localStorage.setItem('bendo_partners', JSON.stringify(list));
        toast.success(`Merci ${name} ! On te recontacte sous 48h.`);
        setName(''); setPhone(''); setMessage('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-orange shadow-warm mb-2">
                        <Handshake className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <DialogTitle className="text-center text-2xl">Devenir partenaire Bendo</DialogTitle>
                    <DialogDescription className="text-center">
                        Rejoins la communauté Bendo à Casablanca.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <div>
                        <Label className="mb-2 block">Tu es...</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {types.map((t) => (
                                <button
                                    type="button"
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={cn(
                                        'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all',
                                        type === t.id
                                            ? 'border-primary bg-primary/5 shadow-card'
                                            : 'border-border hover:border-primary/40',
                                    )}
                                >
                                    <t.icon className={cn('h-5 w-5', type === t.id ? 'text-primary' : 'text-muted-foreground')} />
                                    <span className="text-xs font-semibold">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-name">Nom complet</Label>
                        <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-phone">Téléphone</Label>
                        <Input id="p-phone" type="tel" placeholder="+212 6 ..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-msg">Quelques mots sur toi</Label>
                        <Textarea id="p-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full rounded-full">
                        Envoyer ma candidature
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
