import { Button } from '@/components/ui/button';
import { BendoLogo } from './BendoLogo';
import { LogIn, Shield, LogOut, Wallet, Bike } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
    const { user, isAdmin, isCourier, signOut } = useAuth();

    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-saffron/80 border-b border-saffron-foreground/10">
            <div className="container flex h-16 items-center justify-between gap-2">
                <BendoLogo />
                <div className="flex items-center gap-2">
                    {user && (
                        <Button asChild variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex">
                            <Link href="/abonnement"><Wallet className="h-4 w-4" />Cagnotte</Link>
                        </Button>
                    )}
                    {(isCourier || isAdmin) && (
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                            <Link href="/coursier"><Bike className="h-4 w-4" />Coursier</Link>
                        </Button>
                    )}
                    {isAdmin && (
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                            <Link href="/admin"><Shield className="h-4 w-4" />Admin</Link>
                        </Button>
                    )}
                    {user ? (
                        <Button variant="emerald" size="sm" className="rounded-full font-semibold" onClick={signOut}>
                            <LogOut className="h-4 w-4" />Déconnexion
                        </Button>
                    ) : (
                        <Button asChild variant="emerald" size="sm" className="rounded-full font-semibold">
                            <Link href="/login"><LogIn className="h-4 w-4" />Connexion</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
