import { Link } from '@inertiajs/react';

export default function Index({ orders }) {
    const items = orders?.data || [];

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24, fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 32 }}>Mes commandes</h1>
                    <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Suivez vos commandes en temps réel.</p>
                </div>
                <Link href="/" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>← Accueil</Link>
            </div>

            {items.length === 0 ? (
                <div style={{ background: '#f9fafb', borderRadius: 16, padding: 24, color: '#6b7280' }}>
                    Aucune commande pour le moment.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                    {items.map((order) => (
                        <article key={order.id} style={{ background: 'white', borderRadius: 18, padding: 20, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: 14, color: '#6b7280' }}>Commande #{order.id}</div>
                                    <h2 style={{ margin: '6px 0', fontSize: 20 }}>{order.restaurant_name || order.restaurant_slug}</h2>
                                    <div style={{ color: '#6b7280' }}>{order.status}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800 }}>{order.total ?? 0} FCFA</div>
                                    <Link href={`/orders/${order.id}`} style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Voir les détails</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
