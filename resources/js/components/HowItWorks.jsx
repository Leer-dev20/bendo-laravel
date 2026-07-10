import { UtensilsCrossed, Bike, PartyPopper } from 'lucide-react';

const steps = [
    {
        icon: UtensilsCrossed,
        title: 'Savourez',
        description: "Choisis ton plat préféré chez nos restos partenaires à Casablanca.",
        color: 'bg-gradient-orange',
        step: '01',
    },
    {
        icon: Bike,
        title: 'Envoyez',
        description: 'On prépare ta commande et notre coursier prend la route immédiatement.',
        color: 'bg-gradient-saffron',
        step: '02',
    },
    {
        icon: PartyPopper,
        title: 'Recevez',
        description: '30 minutes en moyenne. Le goût du pays, livré chaud à ta porte.',
        color: 'bg-emerald',
        step: '03',
    },
];

export const HowItWorks = () => {
    return (
        <section className="container py-16 md:py-24">
            <div className="text-center mb-12 md:mb-16 animate-fade-up">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    Comment ça marche
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-secondary leading-tight max-w-2xl mx-auto">
                    Trois étapes, <span className="text-primary">zéro stress</span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                    De ton envie jusqu'à la première bouchée, on s'occupe de tout.
                </p>
            </div>

            <div className="relative grid md:grid-cols-3 gap-6 md:gap-8">
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-saffron to-emerald opacity-30" />

                {steps.map((s, i) => (
                    <div
                        key={s.title}
                        className="relative group animate-fade-up"
                        style={{ animationDelay: `${i * 150}ms` }}
                    >
                        <div className="relative bg-card rounded-3xl p-6 md:p-8 shadow-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2 border border-border/50">
                            <span className="absolute top-4 right-4 text-5xl font-extrabold text-muted/60 leading-none select-none">
                                {s.step}
                            </span>

                            <div
                                className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl ${s.color} shadow-warm mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                            >
                                <s.icon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-secondary mb-2">
                                {s.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {s.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
