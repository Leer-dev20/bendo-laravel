import { Truck, Store, MapPin, Smile, ShieldCheck, CreditCard, Headphones, Leaf } from 'lucide-react';

const stats = [
    { icon: Truck, value: '10K+', label: 'Livraisons réussies' },
    { icon: Store, value: '25+', label: 'Restos partenaires' },
    { icon: MapPin, value: '12', label: 'Quartiers couverts' },
    { icon: Smile, value: '4.8/5', label: 'Avis clients' },
];

const badges = [
    { icon: ShieldCheck, title: 'Paiement sécurisé', desc: 'Cash ou carte à la livraison' },
    { icon: CreditCard, title: 'Sans engagement', desc: 'Aucun frais caché, jamais' },
    { icon: Headphones, title: 'Support 7j/7', desc: "Une équipe à Casa pour t'aider" },
    { icon: Leaf, title: 'Emballage soigné', desc: 'Hygiène et fraîcheur garanties' },
];

export const StatsTrust = () => {
    return (
        <section className="container py-16 md:py-24">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-orange p-8 md:p-12 shadow-warm mb-16">
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-saffron/30 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="relative">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground leading-tight">
                            Bendo en chiffres
                        </h2>
                        <p className="mt-2 text-primary-foreground/80 text-sm md:text-base">
                            La communauté grandit chaque jour à Casablanca.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className="text-center animate-fade-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur mb-3">
                                    <s.icon className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
                                    {s.value}
                                </p>
                                <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {badges.map((b, i) => (
                    <div
                        key={b.title}
                        className="bg-card rounded-2xl p-5 border border-border/50 hover:shadow-card transition-shadow animate-fade-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/20 mb-3">
                            <b.icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-bold text-sm text-secondary mb-1">{b.title}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{b.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
