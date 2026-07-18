import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, User as UserIcon, Lock, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ProfileEdit() {
    const { auth, status } = usePage().props;

    return (
        <div className="min-h-screen bg-background pb-16">
            <Header />
            <div className="container py-6 max-w-xl space-y-6">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary">
                    <ArrowLeft className="h-4 w-4" /> Accueil
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-secondary">Mon profil</h1>
                    <p className="text-sm text-muted-foreground">Gère tes informations et ta sécurité.</p>
                </div>

                <InfoSection user={auth.user} status={status} />
                <PasswordSection />
                <DeleteSection />
            </div>
        </div>
    );
}

const SectionCard = ({ icon: Icon, title, sub, children }) => (
    <section className="rounded-2xl bg-card border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-saffron/20 text-primary shrink-0">
                <Icon className="h-4.5 w-4.5" />
            </span>
            <div>
                <h2 className="font-bold text-secondary">{title}</h2>
                {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </div>
        </div>
        {children}
    </section>
);

const InfoSection = ({ user, status }) => {
    const form = useForm({ name: user.name, email: user.email });

    const submit = (e) => {
        e.preventDefault();
        form.patch('/profile', {
            preserveScroll: true,
            onSuccess: () => toast.success('Profil mis à jour'),
        });
    };

    return (
        <SectionCard icon={UserIcon} title="Informations personnelles" sub="Nom et adresse email de ton compte">
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                    {form.errors.name && <p className="text-xs text-destructive">{form.errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} required />
                    {form.errors.email && <p className="text-xs text-destructive">{form.errors.email}</p>}
                </div>
                {status === 'verification-link-sent' && (
                    <p className="text-sm text-emerald">Un nouveau lien de vérification a été envoyé.</p>
                )}
                <Button type="submit" variant="hero" className="rounded-full" disabled={form.processing}>
                    Enregistrer
                </Button>
            </form>
        </SectionCard>
    );
};

const PasswordSection = () => {
    const form = useForm({ current_password: '', password: '', password_confirmation: '' });

    const submit = (e) => {
        e.preventDefault();
        form.put('/password', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Mot de passe mis à jour');
                form.reset();
            },
            onError: () => {
                if (form.errors.password) form.reset('password', 'password_confirmation');
                if (form.errors.current_password) form.reset('current_password');
            },
        });
    };

    return (
        <SectionCard icon={Lock} title="Mot de passe" sub="Utilise un mot de passe long et unique">
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                    <Input id="current_password" type="password" value={form.data.current_password} onChange={(e) => form.setData('current_password', e.target.value)} />
                    {form.errors.current_password && <p className="text-xs text-destructive">{form.errors.current_password}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="new_password">Nouveau mot de passe</Label>
                    <Input id="new_password" type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
                    {form.errors.password && <p className="text-xs text-destructive">{form.errors.password}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                    <Input id="password_confirmation" type="password" value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} />
                </div>
                <Button type="submit" variant="hero" className="rounded-full" disabled={form.processing}>
                    Mettre à jour
                </Button>
            </form>
        </SectionCard>
    );
};

const DeleteSection = () => {
    const [open, setOpen] = useState(false);
    const form = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        form.delete('/profile', {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
            onError: () => form.reset('password'),
        });
    };

    return (
        <SectionCard icon={Trash2} title="Supprimer le compte" sub="Action définitive et irréversible">
            <p className="text-sm text-muted-foreground">
                Une fois ton compte supprimé, toutes tes données (commandes, cagnotte, historique) seront définitivement effacées.
            </p>
            <Button variant="outline" className="rounded-full border-destructive text-destructive hover:bg-destructive/10" onClick={() => setOpen(true)}>
                Supprimer mon compte
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Saisis ton mot de passe pour confirmer. Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="del_password">Mot de passe</Label>
                            <Input id="del_password" type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} autoFocus />
                            {form.errors.password && <p className="text-xs text-destructive">{form.errors.password}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="destructive" className="rounded-full" disabled={form.processing}>
                                Supprimer définitivement
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </SectionCard>
    );
};
