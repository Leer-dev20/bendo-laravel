import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Instagram, Facebook, X, Linkedin, Mail, MapPin, Phone, Globe, Apple, Smartphone } from 'lucide-react';
import { BendoLogo } from './BendoLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const linkColumns = [
    {
        title: 'Bendo',
        links: [
            { label: 'À propos', href: '#' },
            { label: 'Notre mission', href: '#' },
            { label: 'Carrières', href: '#' },
            { label: 'Presse', href: '#' },
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'Restaurants', href: '/restaurants' },
            { label: 'Coursier', href: '#' },
            { label: 'GP Casa-Dakar', href: '#' },
            { label: 'Devenir partenaire', href: '#' },
        ],
    },
    {
        title: 'Aide',
        links: [
            { label: "Centre d'aide", href: '#' },
            { label: 'Contact', href: '#' },
            { label: 'Suivi de commande', href: '#' },
            { label: 'FAQ', href: '#' },
        ],
    },
    {
        title: 'Légal',
        links: [
            { label: "Conditions d'utilisation", href: '#' },
            { label: 'Politique de confidentialité', href: '#' },
            { label: 'Cookies', href: '#' },
            { label: 'Mentions légales', href: '#' },
        ],
    },
];

const socials = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: X, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

export const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        toast.success('Merci ! Tu seras notifié(e) des nouveautés Bendo 🧡');
        setEmail('');
    };

    return (
        <footer className="bg-secondary text-secondary-foreground">
            <div className="border-b border-secondary-foreground/10">
                <div className="container py-10 md:py-12 grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                            Reste dans la <span className="text-saffron">tribu Bendo</span>
                        </h3>
                        <p className="mt-2 text-sm text-secondary-foreground/70 max-w-md">
                            Nouveaux restos, promos exclusives, lancement coursier et GP — directement dans ta boîte mail.
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                        <div className="flex flex-1 items-center gap-2 rounded-full bg-secondary-foreground/10 backdrop-blur px-4 py-1">
                            <Mail className="h-4 w-4 text-secondary-foreground/60 shrink-0" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ton@email.com"
                                className="border-0 shadow-none focus-visible:ring-0 h-10 text-sm bg-transparent text-secondary-foreground placeholder:text-secondary-foreground/50 px-0"
                            />
                        </div>
                        <Button type="submit" variant="hero" className="rounded-full font-bold shrink-0">
                            S'inscrire
                        </Button>
                    </form>
                </div>
            </div>

            <div className="container py-12 md:py-16 grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-10">
                <div className="col-span-2 md:col-span-2 space-y-4">
                    <div className="bg-saffron rounded-2xl p-3 inline-block">
                        <BendoLogo />
                    </div>
                    <p className="text-sm text-secondary-foreground/70 leading-relaxed max-w-xs">
                        La super-app logistique de Casablanca. Restaurants africains, coursier et GP — on s'occupe de tout le reste.
                    </p>
                    <div className="space-y-2 text-sm text-secondary-foreground/70">
                        <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-saffron shrink-0" />
                            Casablanca, Maroc
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-saffron shrink-0" />
                            +212 6 00 00 00 00
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-saffron shrink-0" />
                            hello@bendo.app
                        </p>
                    </div>
                </div>

                {linkColumns.map((col) => (
                    <div key={col.title} className="space-y-3">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-saffron">
                            {col.title}
                        </h4>
                        <ul className="space-y-2">
                            {col.links.map((l) => (
                                <li key={l.label}>
                                    {l.href.startsWith('/') ? (
                                        <Link
                                            href={l.href}
                                            className="text-sm text-secondary-foreground/70 hover:text-saffron transition-colors"
                                        >
                                            {l.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={l.href}
                                            className="text-sm text-secondary-foreground/70 hover:text-saffron transition-colors"
                                        >
                                            {l.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-secondary-foreground/10">
                <div className="container py-8 grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-3">
                            Télécharge l'app
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 rounded-xl bg-secondary-foreground/10 hover:bg-secondary-foreground/15 transition-colors px-4 py-2.5 border border-secondary-foreground/10"
                            >
                                <Apple className="h-6 w-6 text-secondary-foreground" />
                                <div className="text-left">
                                    <p className="text-[10px] text-secondary-foreground/60 leading-none">Télécharger sur</p>
                                    <p className="text-sm font-bold text-secondary-foreground leading-tight">App Store</p>
                                </div>
                            </a>

                            <a
                                href="#"
                                className="inline-flex items-center gap-2 rounded-xl bg-secondary-foreground/10 hover:bg-secondary-foreground/15 transition-colors px-4 py-2.5 border border-secondary-foreground/10"
                            >
                                <Smartphone className="h-6 w-6 text-secondary-foreground" />
                                <div className="text-left">
                                    <p className="text-[10px] text-secondary-foreground/60 leading-none">Disponible sur</p>
                                    <p className="text-sm font-bold text-secondary-foreground leading-tight">Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="md:text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-3">
                            Paiements acceptés
                        </p>
                        <div className="flex md:justify-end flex-wrap gap-2">
                            {['Cash', 'Visa', 'Mastercard', 'CMI'].map((p) => (
                                <span
                                    key={p}
                                    className="inline-flex items-center rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/10 px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-secondary-foreground/10">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-secondary-foreground/60">
                        © 2026 Bendo. Tous droits réservés. Fait avec 🧡 à Casablanca.
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground/60 hover:text-saffron transition-colors">
                            <Globe className="h-3.5 w-3.5" />
                            Français
                        </button>
                        <div className="flex items-center gap-2">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary-foreground/10 hover:bg-saffron hover:text-saffron-foreground text-secondary-foreground transition-colors"
                                >
                                    <s.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
