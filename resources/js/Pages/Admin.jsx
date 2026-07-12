import { useEffect, useMemo, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import {
    Plus, Pencil, Trash2, Utensils, LogOut, ArrowLeft,
    LayoutDashboard, Store, CalendarDays, Search, TrendingUp, CheckCircle2, XCircle, AlertTriangle, History,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Admin({ restaurants, menuItems, dailyToday, today }) {
    const { user, isAdmin, signOut } = useAuth();

    const [openResto, setOpenResto] = useState(false);
    const [editingResto, setEditingResto] = useState(null);
    const [menuFor, setMenuFor] = useState(null);
    const [openItem, setOpenItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [section, setSection] = useState('overview');
    const [search, setSearch] = useState('');
    const [alertHistory, setAlertHistory] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            return JSON.parse(localStorage.getItem('bendo-daily-alert-history') || '[]');
        } catch {
            return [];
        }
    });

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container py-12 text-center">
                    <h1 className="text-2xl font-bold text-secondary">Accès refusé</h1>
                    <p className="text-muted-foreground mt-2">Votre compte n'a pas le rôle administrateur.</p>
                    <Button variant="outline" className="mt-4" onClick={signOut}>Se déconnecter</Button>
                </div>
            </div>
        );
    }

    const restoForm = useForm({
        name: '', category: 'Sénégalais', district: '', image: '',
        delivery_time: '25-35 min', delivery_fee: 15, rating: 4.5, tags: '', is_active: true,
    });

    const itemForm = useForm({ name: '', description: '', price: '', image: '' });

    useEffect(() => {
        if (openResto) {
            restoForm.setData({
                name: editingResto?.name ?? '',
                category: editingResto?.category ?? 'Sénégalais',
                district: editingResto?.district ?? '',
                image: editingResto?.image ?? '',
                delivery_time: editingResto?.delivery_time ?? '25-35 min',
                delivery_fee: editingResto?.delivery_fee ?? 15,
                rating: editingResto?.rating ?? 4.5,
                tags: (editingResto?.tags ?? []).join(', '),
                is_active: editingResto?.is_active ?? true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openResto, editingResto]);

    useEffect(() => {
        if (openItem) {
            itemForm.setData({
                name: editingItem?.name ?? '',
                description: editingItem?.description ?? '',
                price: editingItem?.price ?? '',
                image: editingItem?.image ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openItem, editingItem]);

    const submitResto = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(editingResto ? 'Restaurant mis à jour' : 'Restaurant ajouté');
                setOpenResto(false);
                setEditingResto(null);
            },
            onError: () => toast.error('Vérifie les champs du formulaire.'),
        };
        if (editingResto) {
            restoForm.patch(`/admin/restaurants/${editingResto.id}`, options);
        } else {
            restoForm.post('/admin/restaurants', options);
        }
    };

    const deleteResto = (id) => {
        if (!confirm('Supprimer ce restaurant ?')) return;
        router.delete(`/admin/restaurants/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Supprimé'),
        });
    };

    const toggleActive = (r, on) => {
        router.patch(`/admin/restaurants/${r.id}`, { is_active: on }, {
            preserveScroll: true,
            onSuccess: () => toast.success(on ? 'Restaurant activé' : 'Restaurant désactivé'),
        });
    };

    const submitItem = (e) => {
        e.preventDefault();
        if (!menuFor) return;
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(editingItem ? 'Plat mis à jour' : 'Plat ajouté');
                setOpenItem(false);
                setEditingItem(null);
            },
            onError: () => toast.error('Vérifie les champs du formulaire.'),
        };
        if (editingItem) {
            itemForm.patch(`/admin/menu-items/${editingItem.id}`, options);
        } else {
            itemForm.transform((data) => ({ ...data, restaurant_id: menuFor.id })).post('/admin/menu-items', options);
        }
    };

    const deleteItem = (id) => {
        if (!confirm('Supprimer ce plat ?')) return;
        router.delete(`/admin/menu-items/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Supprimé'),
        });
    };

    const toggleDaily = (item, on) => {
        router.post('/admin/daily-menus/toggle', {
            menu_item_id: item.id,
            restaurant_id: item.restaurant_id,
            on,
        }, { preserveScroll: true });
    };

    const itemsOf = (rid) => menuItems.filter((i) => i.restaurant_id === rid);
    const isToday = (iid) => dailyToday.some((t) => t.menu_item_id === iid);

    const filteredRestos = restaurants.filter((r) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || (r.district ?? '').toLowerCase().includes(q);
    });

    const stats = {
        total: restaurants.length,
        active: restaurants.filter((r) => r.is_active).length,
        inactive: restaurants.filter((r) => !r.is_active).length,
        items: menuItems.length,
        todayCount: dailyToday.length,
        avgRating: restaurants.length
            ? (restaurants.reduce((s, r) => s + Number(r.rating || 0), 0) / restaurants.length).toFixed(1)
            : '—',
    };

    const restosWithoutDaily = restaurants.filter(
        (r) => r.is_active && !dailyToday.some((t) => t.restaurant_id === r.id),
    );
    const hasDailyAlert = restosWithoutDaily.length > 0;

    useEffect(() => {
        if (!hasDailyAlert) return;
        const key = `bendo-daily-warn-${today}`;
        if (typeof window !== 'undefined' && !sessionStorage.getItem(key)) {
            toast.warning(`${restosWithoutDaily.length} restaurant(s) actif(s) sans menu du jour`, {
                description: 'Sélectionnez les plats disponibles aujourd\'hui.',
            });
            sessionStorage.setItem(key, '1');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasDailyAlert, restosWithoutDaily.length, today]);

    useEffect(() => {
        if (!hasDailyAlert) return;
        setAlertHistory((prev) => {
            const others = prev.filter((e) => e.date !== today);
            const next = [{ date: today, count: restosWithoutDaily.length }, ...others].slice(0, 30);
            try { localStorage.setItem('bendo-daily-alert-history', JSON.stringify(next)); } catch {}
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasDailyAlert, restosWithoutDaily.length, today]);

    const navItems = [
        { id: 'overview', title: 'Aperçu', icon: LayoutDashboard },
        { id: 'restos', title: 'Restaurants', icon: Store },
        { id: 'daily', title: 'Menu du jour', icon: CalendarDays },
    ];

    const AdminSidebar = () => {
        const { state } = useSidebar();
        const collapsed = state === 'collapsed';
        return (
            <Sidebar collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin Bendo</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((it) => (
                                    <SidebarMenuItem key={it.id}>
                                        <SidebarMenuButton
                                            isActive={section === it.id}
                                            onClick={() => setSection(it.id)}
                                            className="cursor-pointer"
                                        >
                                            <it.icon className="h-4 w-4" />
                                            {!collapsed && <span>{it.title}</span>}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/" className="flex items-center gap-2">
                                            <ArrowLeft className="h-4 w-4" />
                                            {!collapsed && <span>Retour au site</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={signOut} className="cursor-pointer">
                                        <LogOut className="h-4 w-4" />
                                        {!collapsed && <span>Déconnexion</span>}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        );
    };

    const StatCard = ({ label, value, icon: Icon, hint }) => (
        <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-secondary mt-1">{value}</p>
            {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
        </div>
    );

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AdminSidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-14 flex items-center gap-2 border-b bg-card px-3 sticky top-0 z-30">
                        <SidebarTrigger />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base font-bold text-secondary truncate">
                                {section === 'overview' && 'Tableau de bord'}
                                {section === 'restos' && 'Restaurants'}
                                {section === 'daily' && `Menu du jour — ${today}`}
                            </h1>
                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </header>

                    <main className="flex-1 p-4 md:p-6 pb-20 overflow-x-hidden">
                        {section === 'overview' && (
                            <div className="space-y-5">
                                {hasDailyAlert && (
                                    <Alert variant="destructive" className="border-destructive/40">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Menu du jour incomplet</AlertTitle>
                                        <AlertDescription>
                                            <p className="mb-2">
                                                {restosWithoutDaily.length} restaurant(s) actif(s) n'ont aucun plat sélectionné pour aujourd'hui ({today}) :
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {restosWithoutDaily.slice(0, 6).map((r) => (
                                                    <Badge key={r.id} variant="outline" className="bg-background">{r.name}</Badge>
                                                ))}
                                                {restosWithoutDaily.length > 6 && (
                                                    <Badge variant="outline" className="bg-background">+{restosWithoutDaily.length - 6}</Badge>
                                                )}
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => setSection('daily')}>
                                                Configurer le menu du jour
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <StatCard label="Restaurants" value={stats.total} icon={Store} hint={`${stats.active} actifs`} />
                                    <StatCard label="Plats au menu" value={stats.items} icon={Utensils} />
                                    <StatCard label="Plats du jour" value={stats.todayCount} icon={CalendarDays} hint={today} />
                                    <StatCard label="Actifs" value={stats.active} icon={CheckCircle2} />
                                    <StatCard label="Inactifs" value={stats.inactive} icon={XCircle} />
                                    <StatCard label="Note moyenne" value={stats.avgRating} icon={TrendingUp} />
                                </div>

                                <div className="rounded-xl border bg-card p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="font-bold text-secondary">Derniers restaurants</h2>
                                        <Button size="sm" variant="outline" onClick={() => setSection('restos')}>Voir tout</Button>
                                    </div>
                                    {restaurants.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-6">Aucun restaurant pour l'instant.</p>
                                    ) : (
                                        <div className="grid gap-2">
                                            {restaurants.slice(0, 5).map((r) => (
                                                <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg border">
                                                    <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                                                        {r.image && <img src={r.image} alt={r.name} className="h-full w-full object-cover" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{r.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{r.category} • {r.district || '—'}</p>
                                                    </div>
                                                    {!r.is_active && <Badge variant="secondary">inactif</Badge>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border bg-card p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <History className="h-4 w-4 text-primary" />
                                        <h2 className="font-bold text-secondary">Historique des alertes « menu du jour »</h2>
                                    </div>
                                    {alertHistory.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-6">
                                            Aucune alerte enregistrée pour le moment.
                                        </p>
                                    ) : (
                                        <ul className="divide-y">
                                            {alertHistory.map((e) => (
                                                <li key={e.date} className="flex items-center justify-between py-2 text-sm">
                                                    <span className="font-medium">
                                                        {new Date(e.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                                                        {e.date === today && (
                                                            <Badge variant="outline" className="ml-2">aujourd'hui</Badge>
                                                        )}
                                                    </span>
                                                    <Badge variant="destructive">{e.count} resto{e.count > 1 ? 's' : ''}</Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        {section === 'restos' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Dialog open={openResto} onOpenChange={(o) => { setOpenResto(o); if (!o) setEditingResto(null); }}>
                                        <DialogTrigger asChild>
                                            <Button variant="hero"><Plus className="h-4 w-4" />Nouveau restaurant</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>{editingResto ? 'Modifier' : 'Nouveau'} restaurant</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={submitResto} className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1.5 col-span-2">
                                                        <Label>Nom</Label>
                                                        <Input required value={restoForm.data.name} onChange={(e) => restoForm.setData('name', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Catégorie</Label>
                                                        <Input required value={restoForm.data.category} onChange={(e) => restoForm.setData('category', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Quartier</Label>
                                                        <Input value={restoForm.data.district} onChange={(e) => restoForm.setData('district', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5 col-span-2">
                                                        <Label>Image (URL)</Label>
                                                        <Input value={restoForm.data.image} onChange={(e) => restoForm.setData('image', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Délai livraison</Label>
                                                        <Input value={restoForm.data.delivery_time} onChange={(e) => restoForm.setData('delivery_time', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Frais (MAD)</Label>
                                                        <Input type="number" min={0} value={restoForm.data.delivery_fee} onChange={(e) => restoForm.setData('delivery_fee', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Note (0-5)</Label>
                                                        <Input type="number" step="0.1" min={0} max={5} value={restoForm.data.rating} onChange={(e) => restoForm.setData('rating', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Tags (virgule)</Label>
                                                        <Input value={restoForm.data.tags} onChange={(e) => restoForm.setData('tags', e.target.value)} />
                                                    </div>
                                                    <div className="flex items-center gap-2 col-span-2">
                                                        <Switch checked={restoForm.data.is_active} onCheckedChange={(v) => restoForm.setData('is_active', v)} />
                                                        <Label>Actif</Label>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" variant="hero" disabled={restoForm.processing}>
                                                        {editingResto ? 'Enregistrer' : 'Créer'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <div className="relative flex-1 min-w-[180px]">
                                        <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="Rechercher…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div>
                                </div>

                                {filteredRestos.length === 0 && (
                                    <p className="text-sm text-muted-foreground py-8 text-center">Aucun restaurant.</p>
                                )}

                                <div className="grid gap-3 md:grid-cols-2">
                                    {filteredRestos.map((r) => (
                                        <div key={r.id} className="flex gap-3 p-3 rounded-xl border bg-card">
                                            <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                                                {r.image && <img src={r.image} alt={r.name} className="h-full w-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-secondary truncate">{r.name}</h3>
                                                    {!r.is_active && <Badge variant="secondary">inactif</Badge>}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{r.category} • {r.district || '—'}</p>
                                                <p className="text-xs text-muted-foreground">{itemsOf(r.id).length} plat(s)</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Switch checked={r.is_active} onCheckedChange={(v) => toggleActive(r, !!v)} aria-label="Actif" />
                                                    <span className="text-xs text-muted-foreground">{r.is_active ? 'Actif' : 'Inactif'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <Button size="sm" variant="outline" onClick={() => setMenuFor(r)}>
                                                    <Utensils className="h-3 w-3" />Menu
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => { setEditingResto(r); setOpenResto(true); }}>
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => deleteResto(r.id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {section === 'daily' && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-3">Cochez les plats disponibles aujourd'hui ({today}).</p>
                                {hasDailyAlert && (
                                    <Alert variant="destructive" className="mb-4 border-destructive/40">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>{restosWithoutDaily.length} restaurant(s) sans plats du jour</AlertTitle>
                                        <AlertDescription>
                                            Les clients ne verront pas de menu du jour pour ces restaurants tant qu'aucun plat n'est coché.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {restaurants.filter((r) => itemsOf(r.id).length > 0).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-8">Aucun plat disponible. Ajoutez d'abord des plats à un restaurant.</p>
                                )}
                                {restaurants.filter((r) => itemsOf(r.id).length > 0).map((r) => {
                                    const missing = r.is_active && !dailyToday.some((t) => t.restaurant_id === r.id);
                                    return (
                                        <div key={r.id} className="mb-5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-secondary">{r.name}</h3>
                                                {missing && (
                                                    <Badge variant="destructive" className="gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> Aucun plat sélectionné
                                                    </Badge>
                                                )}
                                                {!r.is_active && <Badge variant="secondary">inactif</Badge>}
                                            </div>
                                            <div className="mt-2 grid gap-2">
                                                {itemsOf(r.id).map((it) => (
                                                    <label key={it.id} className="flex items-center gap-3 p-2 rounded-lg border bg-card cursor-pointer">
                                                        <Checkbox checked={isToday(it.id)} onCheckedChange={(v) => toggleDaily(it, !!v)} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{it.name}</p>
                                                            <p className="text-xs text-muted-foreground">{it.price} MAD</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>

                <Dialog open={!!menuFor} onOpenChange={(o) => { if (!o) { setMenuFor(null); setEditingItem(null); } }}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Menu — {menuFor?.name}</DialogTitle>
                        </DialogHeader>
                        <Button variant="hero" size="sm" onClick={() => { setEditingItem(null); setOpenItem(true); }}>
                            <Plus className="h-4 w-4" />Ajouter un plat
                        </Button>
                        <div className="mt-3 space-y-2">
                            {menuFor && itemsOf(menuFor.id).map((it) => (
                                <div key={it.id} className="flex gap-3 p-2 rounded-lg border bg-card">
                                    <div className="h-12 w-12 rounded bg-muted overflow-hidden shrink-0">
                                        {it.image && <img src={it.image} alt={it.name} className="h-full w-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{it.name}</p>
                                        <p className="text-xs text-muted-foreground">{it.price} MAD</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => { setEditingItem(it); setOpenItem(true); }}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => deleteItem(it.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {menuFor && itemsOf(menuFor.id).length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Aucun plat encore.</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={openItem} onOpenChange={(o) => { setOpenItem(o); if (!o) setEditingItem(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Modifier' : 'Nouveau'} plat</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submitItem} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label>Nom</Label>
                                <Input required value={itemForm.data.name} onChange={(e) => itemForm.setData('name', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Description</Label>
                                <Textarea rows={2} value={itemForm.data.description} onChange={(e) => itemForm.setData('description', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Prix (MAD)</Label>
                                <Input type="number" min={1} required value={itemForm.data.price} onChange={(e) => itemForm.setData('price', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Image (URL)</Label>
                                <Input value={itemForm.data.image} onChange={(e) => itemForm.setData('image', e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button type="submit" variant="hero" disabled={itemForm.processing}>
                                    {editingItem ? 'Enregistrer' : 'Créer'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </SidebarProvider>
    );
}
