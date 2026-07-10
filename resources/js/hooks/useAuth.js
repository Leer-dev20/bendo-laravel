import { usePage, router } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage().props;

    return {
        user: auth.user,
        isAdmin: auth.user?.isAdmin ?? false,
        isCourier: auth.user?.isCourier ?? false,
        loading: false,
        signOut: async () => {
            router.post('/logout');
        },
    };
}
