import { Link, router } from '@inertiajs/react';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PopularRestaurants = ({ restaurants = [] }) => {
    return (
        <section className="bg-muted/40 py-16 md:py-24">
            <div className="container">
                <div className="flex items-end justify-between mb-8 md:mb-10 gap-4 animate-fade-up">
                    <div>
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                            Trending Casablanca
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary leading-tight">
                            Les restos qui cartonnent
                        </h2>
                    </div>
                    <Button
                        asChild
                        variant="ghost"
                        className="hidden sm:inline-flex font-semibold text-primary hover:text-primary/80"
                    >
                        <Link href="/restaurants">Tout voir <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    {restaurants.map((r, i) => (
                        <button
                            key={r.slug}
                            onClick={() => router.visit(`/restaurants/${r.slug}`)}
                            className="group text-left bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border border-border/50 animate-fade-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={r.image}
                                    alt={r.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
                                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur px-2.5 py-1 text-xs font-bold text-secondary shadow-card">
                                    <Star className="h-3 w-3 fill-saffron text-saffron" />
                                    {r.rating}
                                </span>
                                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald text-emerald-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-card">
                                    {r.category}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-extrabold text-lg text-secondary mb-1">{r.name}</h3>
                                <p className="text-xs text-muted-foreground mb-3">{r.district}</p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        {r.delivery_time}
                                    </span>
                                    <span className="font-bold text-primary">{r.delivery_fee} MAD livraison</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="mt-16">
                    <h3 className="text-center text-xs font-bold uppercase tracking-widest text-secondary/70 mb-8">
                        Ils ont goûté, ils en parlent
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { name: 'Aïssatou D.', district: 'Maârif', text: 'Le thieb de Téranga est exactement comme à Dakar. Livré chaud en 25 min, magique !', rating: 5 },
                            { name: 'Karim B.', district: 'Gauthier', text: 'Enfin une appli qui livre vraiment de la cuisine du pays à Casa. Je recommande à 100%.', rating: 5 },
                            { name: 'Fatou M.', district: 'Bourgogne', text: 'Service nickel, coursier sympa, prix justes. Bendo, c\'est devenu mon réflexe.', rating: 5 },
                        ].map((t, i) => (
                            <div
                                key={t.name}
                                className="bg-card rounded-3xl p-6 shadow-card border border-border/50 animate-fade-up"
                                style={{ animationDelay: `${i * 120}ms` }}
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-saffron text-saffron" />
                                    ))}
                                </div>
                                <p className="text-sm text-secondary leading-relaxed mb-4">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-orange flex items-center justify-center text-primary-foreground font-bold text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-secondary">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.district}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
