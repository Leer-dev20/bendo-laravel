import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Header } from '@/components/Header';
import { ServiceWidget } from '@/components/ServiceWidget';
import { WaitlistModal } from '@/components/WaitlistModal';
import { PartnerModal } from '@/components/PartnerModal';
import { HowItWorks } from '@/components/HowItWorks';
import { PopularRestaurants } from '@/components/PopularRestaurants';
import { StatsTrust } from '@/components/StatsTrust';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, Bike, Plane, MapPin, Search, Handshake, Sparkles, ShieldCheck, Clock, Star } from 'lucide-react';

export default function Index({ restaurants = [] }) {
    const [address, setAddress] = useState('');
    const [waitlist, setWaitlist] = useState(null);
    const [partnerOpen, setPartnerOpen] = useState(false);

    const handleRestaurant = () => {
        if (address.trim()) {
            try { localStorage.setItem('bendo.address', address.trim()); } catch {}
        }
        router.visit('/restaurants');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <section className="relative overflow-hidden bg-gradient-hero">
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-saffron/40 blur-3xl" />
                <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-emerald/10 blur-3xl animate-float" />

                <div className="container relative pt-10 pb-16 md:pt-16 md:pb-24">
                    <div className="mx-auto max-w-2xl text-center animate-fade-up">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground px-4 py-1.5 text-xs font-bold mb-5 shadow-card">
                            <Sparkles className="h-3.5 w-3.5 text-saffron" />
                            Nouveau à Casablanca
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-secondary leading-[1.05] tracking-tight">
                            Savourez,<br />
                            envoyez,<br />
                            <span className="text-primary">recevez.</span>
                        </h1>
                        <p className="mt-5 text-base md:text-xl text-secondary/80 max-w-md mx-auto leading-relaxed">
                            La super-app logistique de Casa.<br className="hidden sm:block" />
                            <span className="font-semibold">On s'occupe de tout le reste.</span>
                        </p>

                        <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-card/70 backdrop-blur px-4 py-2 shadow-card">
                            <div className="flex -space-x-2">
                                {['A', 'K', 'F'].map((c, i) => (
                                    <div
                                        key={c}
                                        className="h-7 w-7 rounded-full bg-gradient-orange border-2 border-card flex items-center justify-center text-[11px] font-bold text-primary-foreground"
                                        style={{ zIndex: 3 - i }}
                                    >
                                        {c}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                <span className="font-bold text-secondary">4.8/5</span>
                                <span className="text-secondary/60">· +1200 commandes</span>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => { e.preventDefault(); handleRestaurant(); }}
                            className="mt-6 mx-auto max-w-md flex items-center gap-2 rounded-full bg-card p-2 shadow-warm border border-border/50"
                        >
                            <div className="flex flex-1 items-center gap-2 pl-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Ton adresse à Casablanca..."
                                    className="border-0 shadow-none focus-visible:ring-0 h-10 text-sm bg-transparent px-0"
                                />
                            </div>
                            <Button type="submit" variant="hero" size="icon" className="rounded-full shrink-0 h-10 w-10">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    <div className="mt-12 mx-auto max-w-3xl">
                        <p className="text-center text-xs font-semibold uppercase tracking-widest text-secondary/70 mb-4 ">
                            Nos services
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <ServiceWidget
                                icon={UtensilsCrossed}
                                title="Restaurant"
                                subtitle="Cuisine d'ici, livrée chez toi"
                                badge="Disponible"
                                active
                                onClick={handleRestaurant}
                            />
                            <ServiceWidget
                                icon={Bike}
                                title="Coursier"
                                subtitle="Envoie un colis en ville"
                                badge="Disponible"
                                active
                                onClick={() => router.visit('/coursier/demander')}
                            />
                            <ServiceWidget
                                icon={Plane}
                                title="GP"
                                subtitle="Casa ↔ Dakar, sans stress"
                                badge="Bientôt"
                                flag="🇲🇦🇸🇳"
                                onClick={() => setWaitlist('GP')}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-border bg-muted/30">
                <div className="container py-6 grid grid-cols-3 gap-4 text-center">
                    {[
                        { icon: Clock, label: 'Livraison rapide', sub: '30 min en moy.' },
                        { icon: ShieldCheck, label: 'Paiement à la livraison', sub: 'Cash accepté' },
                        { icon: Sparkles, label: 'Goût authentique', sub: 'Cuisine du pays' },
                    ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-1">
                            <t.icon className="h-5 w-5 text-primary" />
                            <p className="text-xs sm:text-sm font-semibold text-secondary">{t.label}</p>
                            <p className="text-[11px] text-muted-foreground hidden sm:block">{t.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            <HowItWorks />
            <PopularRestaurants restaurants={restaurants} />
            <StatsTrust />

            <section className="container py-16 md:py-24">
                <div className="relative overflow-hidden rounded-3xl bg-secondary p-8 md:p-12 text-secondary-foreground shadow-warm">
                    <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
                    <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
                        <div>
                            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-orange shadow-warm mb-4">
                                <Handshake className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                                Construisons Bendo ensemble
                            </h2>
                            <p className="text-secondary-foreground/80 max-w-lg">
                                Restaurateur, livreur ou voyageur GP ? Rejoins une communauté qui valorise le goût du pays et le service rapide.
                            </p>
                        </div>
                        <Button
                            variant="hero"
                            size="lg"
                            className="rounded-full font-bold w-full md:w-auto"
                            onClick={() => setPartnerOpen(true)}
                        >
                            <Handshake className="h-4 w-4" />
                            Devenir partenaire
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />

            <WaitlistModal
                open={waitlist === 'Coursier'}
                onOpenChange={(o) => !o && setWaitlist(null)}
                service="Coursier"
                icon={<Bike className="h-8 w-8 text-saffron-foreground" />}
            />
            <WaitlistModal
                open={waitlist === 'GP'}
                onOpenChange={(o) => !o && setWaitlist(null)}
                service="GP"
                icon={<Plane className="h-8 w-8 text-saffron-foreground" />}
            />
            <PartnerModal open={partnerOpen} onOpenChange={setPartnerOpen} />
        </div>
    );
}
