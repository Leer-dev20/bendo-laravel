import { Link } from '@inertiajs/react';

const getImage = (restaurant) => {
    if (restaurant?.image) return restaurant.image;
    if (restaurant?.image_url) return restaurant.image_url;
    return '/frontend-assets/resto-1.jpg';
};

export default function Show({ restaurant }) {
    const menuItems = restaurant?.menuItems || restaurant?.menu_items || [];
    const dailyMenus = restaurant?.dailyMenus || restaurant?.daily_menus || [];

    return (
        <div style={{ minHeight: '100vh', background: '#fffaf5', color: '#111827', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 40px' }}>
                <Link href="/restaurants" style={{ color: '#d97706', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>← Retour aux restaurants</Link>

                <div style={{ background: 'white', borderRadius: 28, overflow: 'hidden', boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)', border: '1px solid #f3f4f6' }}>
                    <img src={getImage(restaurant)} alt={restaurant?.name} style={{ width: '100%', height: 250, objectFit: 'cover' }} />
                    <div style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <div>
                                <h1 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 800 }}>{restaurant?.name}</h1>
                                <p style={{ margin: 0, color: '#6b7280' }}>{restaurant?.category || 'Cuisine variée'} • {restaurant?.district || 'Centre-ville'}</p>
                            </div>
                            <div style={{ padding: '10px 14px', borderRadius: 16, background: '#fff7ed', color: '#c2410c', fontWeight: 700 }}>
                                Livraison {restaurant?.delivery_fee ?? 0} MAD • {restaurant?.delivery_time || '15-30 min'}
                            </div>
                        </div>

                        <div style={{ marginTop: 24, display: 'grid', gap: 20 }}>
                            <section>
                                <h2 style={{ fontSize: 20, marginBottom: 12 }}>Menu du restaurant</h2>
                                {menuItems.length === 0 ? (
                                    <div style={{ color: '#6b7280' }}>Aucun menu n’est encore renseigné pour ce restaurant.</div>
                                ) : (
                                    <div style={{ display: 'grid', gap: 12 }}>
                                        {menuItems.map((item) => (
                                            <div key={item.id} style={{ border: '1px solid #f3f4f6', borderRadius: 16, padding: 14, background: '#fffdf9' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                                    <strong>{item.name}</strong>
                                                    <span style={{ fontWeight: 700 }}>{item.price ?? 0} MAD</span>
                                                </div>
                                                <div style={{ color: '#6b7280', marginTop: 6 }}>{item.description || 'Plat disponible'}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <h2 style={{ fontSize: 20, marginBottom: 12 }}>Offres du jour</h2>
                                {dailyMenus.length === 0 ? (
                                    <div style={{ color: '#6b7280' }}>Aucune offre du jour n’est encore publiée.</div>
                                ) : (
                                    dailyMenus.map((menu) => (
                                        <div key={menu.id} style={{ border: '1px solid #f3f4f6', borderRadius: 16, padding: 14, marginBottom: 8, background: '#fffdf9' }}>
                                            <strong>{menu?.menu_item?.name || 'Offre spéciale'}</strong>
                                            <div style={{ color: '#6b7280', marginTop: 6 }}>{menu?.menu_item?.description || 'Découvrez cette offre du jour.'}</div>
                                        </div>
                                    ))
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
