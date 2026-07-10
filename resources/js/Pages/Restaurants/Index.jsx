import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Star, Bike, Search, X, UtensilsCrossed } from 'lucide-react';
import { Header } from '@/components/Header';
import { CartFab } from '@/components/CartFab';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 6;

export default function RestaurantsIndex({ restaurants = [] }) {
    const [active, setActive] = useState('Tous');
    const [query, setQuery] = useState('');

    const categories = useMemo(() => {
        const set = new Set(restaurants.map((r) => r.category));
        return ['Tous', ...Array.from(set)];
    }, [restaurants]);

    const q = query.trim().toLowerCase();

    const filtered = useMemo(() => {
        return restaurants.filter((r) => {
            if (active !== 'Tous' && r.category !== active) return false;
            if (!q) return true;
            return (
                r.name.toLowerCase().includes(q) ||
                r.district.toLowerCase().includes(q) ||
                r.category.toLowerCase().includes(q) ||
                (r.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
                (r.menu_items ?? []).some(
                    (m) => m.name.toLowerCase().includes(q) || (m.description ?? '').toLowerCase().includes(q),
                )
            );
        });
    }, [restaurants, active, q]);

    const matchedDishes = useMemo(() => {
        if (!q) return [];
        const out = [];
        for (const r of restaurants) {
            if (active !== 'Tous' && r.category !== active) continue;
            for (const m of r.menu_items ?? []) {
                if (m.name.toLowerCase().includes(q)) {
                    out.push({ restoSlug: r.slug, restoName: r.name, dish: m.name });
                }
            }
        }
        return out.slice(0, 6);
    }, [restaurants, active, q]);

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const sentinelRef = useRef(null);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [active, q]);

    const visibleRestaurants = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    useEffect(() => {
        if (!hasMore) return;
        const node = sentinelRef.current;
        if (!node) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
                }
            },
            { rootMargin: '300px 0px' },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [hasMore, filtered.length]);

    return (
        <div className="min-h-screen bg-background pb-28">
            <Header />
            <div className="container py-6">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary mb-4">
                    <ArrowLeft className="h-4 w-4" /> Retour
                </Link>
                <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Restos près de toi</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Toutes les saveurs d'Afrique, livrées à Casablanca.
                </p>

                <div className="mt-5 max-w-xl">
                    <div className="flex items-center gap-2 rounded-full bg-card border border-border shadow-card px-3 h-12 focus-within:border-primary/60 transition-colors">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un resto, un plat (jollof, yassa, tajine)..."
                            className="border-0 shadow-none focus-visible:ring-0 h-10 text-sm bg-transparent px-0"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                aria-label="Effacer la recherche"
                                className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-secondary transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 -mx-4 px-4 overflow-x-auto">
                    <div className="flex gap-2 w-max">
                        {categories.map((cat) => {
                            const isActive = active === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActive(cat)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold border transition-all ${
                                        isActive
                                            ? 'bg-secondary text-secondary-foreground border-secondary shadow-card'
                                            : 'bg-card text-secondary border-border hover:border-primary/50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {q && matchedDishes.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary/70 mb-3">
                            Plats correspondants
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {matchedDishes.map((d, i) => (
                                <Link
                                    key={`${d.restoSlug}-${i}`}
                                    href={`/restaurants/${d.restoSlug}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-semibold text-secondary hover:border-primary/60 hover:shadow-card transition-all"
                                >
                                    <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                                    {d.dish}
                                    <span className="text-muted-foreground font-normal">· {d.restoName}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <p className="mt-5 text-xs text-muted-foreground">
                    {visibleRestaurants.length} sur {filtered.length} resto{filtered.length > 1 ? 's' : ''}
                    {q && (
                        <>
                            {' '}pour "<span className="font-semibold text-secondary">{query}</span>"
                        </>
                    )}
                </p>

                {filtered.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                        <p className="text-sm text-muted-foreground">
                            Aucun resto ne correspond. Essaie un autre mot-clé ou change de cuisine.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleRestaurants.map((r) => (
                                <Link
                                    key={r.slug}
                                    href={`/restaurants/${r.slug}`}
                                    className="group rounded-2xl overflow-hidden bg-card shadow-warm border border-border hover:shadow-lg transition-all hover:-translate-y-0.5"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={r.image}
                                            alt={r.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 flex gap-1.5">
                                            {(r.tags ?? []).slice(0, 2).map((t) => (
                                                <Badge key={t} className="bg-card/90 text-secondary hover:bg-card text-[10px]">{t}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-bold text-secondary">{r.name}</h3>
                                                <p className="text-xs text-muted-foreground">{r.category} • {r.district}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-semibold text-secondary">
                                                <Star className="h-4 w-4 fill-saffron text-saffron" />
                                                {r.rating}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{r.delivery_time}</span>
                                            <span className="inline-flex items-center gap-1"><Bike className="h-3.5 w-3.5" />{r.delivery_fee} MAD</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {hasMore &&
                                Array.from({ length: Math.min(PAGE_SIZE, filtered.length - visibleCount) }).map((_, i) => (
                                    <div
                                        key={`sk-${i}`}
                                        className="rounded-2xl overflow-hidden bg-card border border-border shadow-warm animate-fade-in"
                                        aria-hidden
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                            <Skeleton className="absolute inset-0 rounded-none" />
                                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-card/50 to-transparent" />
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {hasMore && (
                            <>
                                <div ref={sentinelRef} aria-hidden className="h-1" />
                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))}
                                        className="rounded-full px-5 py-2.5 text-xs font-bold border border-border bg-card text-secondary hover:border-primary/60 hover:shadow-card transition-all"
                                    >
                                        Charger plus de restos
                                    </button>
                                </div>
                            </>
                        )}
                        {!hasMore && filtered.length > PAGE_SIZE && (
                            <p className="mt-6 text-center text-xs text-muted-foreground">
                                Tu as vu tous les restos disponibles ✨
                            </p>
                        )}
                    </>
                )}
            </div>
            <CartFab />
        </div>
    );
}
