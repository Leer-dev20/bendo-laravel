import { Link } from '@inertiajs/react';

const getImage = (restaurant) => {
    if (restaurant?.image) return restaurant.image;
    if (restaurant?.image_url) return restaurant.image_url;
    const index = Math.abs((restaurant?.id || '').length) % 3;
    return ['/frontend-assets/resto-1.jpg', '/frontend-assets/resto-2.jpg', '/frontend-assets/resto-3.jpg'][index];
};

export default function Index({ restaurants = [] }) {
    return (
        <div style={{ minHeight: '100vh', background: '#fffaf5', color: '#111827', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#111827' }}>Restaurants à proximité</h1>
                        <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Découvrez les adresses prêtes à livrer vos plats préférés.</p>
                    </div>
                    <Link href="/" style={{ color: '#d97706', fontWeight: 700, textDecoration: 'none' }}>← Retour à l’accueil</Link>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                    <span style={{ padding: '8px 12px', borderRadius: 999, background: '#ffedd5', color: '#c2410c', fontWeight: 700 }}>Tous</span>
                    <span style={{ padding: '8px 12px', borderRadius: 999, background: '#f3f4f6', color: '#111827' }}>Sénégalais</span>
                    <span style={{ padding: '8px 12px', borderRadius: 999, background: '#f3f4f6', color: '#111827' }}>Ivoirien</span>
                    <span style={{ padding: '8px 12px', borderRadius: 999, background: '#f3f4f6', color: '#111827' }}>Nigérian</span>
                </div>

                {restaurants.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 20, padding: 24, color: '#6b7280', border: '1px solid #f3f4f6' }}>
                        Aucun restaurant n’est encore disponible. Les données de la base seront affichées ici dès qu’elles seront ajoutées.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                        {restaurants.map((restaurant) => (
                            <article key={restaurant.id} style={{ background: 'white', borderRadius: 22, overflow: 'hidden', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)', border: '1px solid #f3f4f6' }}>
                                <img src={getImage(restaurant)} alt={restaurant.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                        <div>
                                            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>{restaurant.name}</h2>
                                            <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>{restaurant.category || 'Cuisine variée'} • {restaurant.district || 'Centre-ville'}</p>
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#111827' }}>{restaurant.delivery_fee ?? 0} MAD</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ color: '#6b7280', fontSize: 13 }}>{restaurant.delivery_time || '15-30 min'}</span>
                                        <Link href={`/restaurants/${restaurant.slug}`} style={{ background: '#111827', color: 'white', padding: '10px 14px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>
                                            Voir le menu
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
