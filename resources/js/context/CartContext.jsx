import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'bendo.cart.v1';

const empty = {
    restaurantSlug: null,
    restaurantName: null,
    deliveryFee: 0,
    lines: [],
};

export const CartProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        if (typeof window === 'undefined') return empty;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : empty;
        } catch {
            return empty;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const addItem = (item, restaurant) => {
        setState((s) => {
            const sameResto = s.restaurantSlug === restaurant.slug;
            const lines = sameResto ? [...s.lines] : [];
            const existing = lines.find((l) => l.id === item.id);
            if (existing) existing.quantity += 1;
            else lines.push({ ...item, quantity: 1 });
            return {
                restaurantSlug: restaurant.slug,
                restaurantName: restaurant.name,
                deliveryFee: restaurant.delivery_fee,
                lines,
            };
        });
    };

    const decrement = (id) =>
        setState((s) => {
            const lines = s.lines
                .map((l) => (l.id === id ? { ...l, quantity: l.quantity - 1 } : l))
                .filter((l) => l.quantity > 0);
            if (lines.length === 0) return empty;
            return { ...s, lines };
        });

    const removeItem = (id) =>
        setState((s) => {
            const lines = s.lines.filter((l) => l.id !== id);
            if (lines.length === 0) return empty;
            return { ...s, lines };
        });

    const clear = () => setState(empty);

    const { count, subtotal } = useMemo(() => {
        return state.lines.reduce(
            (acc, l) => {
                acc.count += l.quantity;
                acc.subtotal += l.quantity * l.price;
                return acc;
            },
            { count: 0, subtotal: 0 },
        );
    }, [state.lines]);

    return (
        <CartContext.Provider value={{ ...state, addItem, removeItem, decrement, clear, count, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
