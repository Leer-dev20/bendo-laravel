import { Link } from '@inertiajs/react';

export default function Show({ order }) {
    const history = order?.status_history || [];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24, fontFamily: 'Inter, sans-serif' }}>
            <Link href="/orders" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>← Retour aux commandes</Link>

            <div style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 14px 35px rgba(15, 23, 42, 0.08)' }}>
                <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 30 }}>Commande #{order?.id}</h1>
                <p style={{ margin: 0, color: '#6b7280' }}>Restaurant : {order?.restaurant_name || order?.restaurant_slug}</p>
                <p style={{ margin: '8px 0 0', fontWeight: 700 }}>Statut actuel : {order?.status}</p>

                <div style={{ marginTop: 20 }}>
                    <h2 style={{ fontSize: 20, marginBottom: 12 }}>Historique</h2>
                    {history.length === 0 ? (
                        <div style={{ color: '#6b7280' }}>Aucun historique pour cette commande.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: 10 }}>
                            {history.map((entry) => (
                                <div key={entry.id} style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 12 }}>
                                    <strong>{entry.status}</strong>
                                    <div style={{ color: '#6b7280', marginTop: 4 }}>{entry.created_at}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
