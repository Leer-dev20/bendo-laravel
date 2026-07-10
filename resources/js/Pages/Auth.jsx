import { Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';

export default function Auth() {
    const { defaultTab = 'signin', canResetPassword, status } = usePage().props;

    const signIn = useForm({ email: '', password: '', remember: false });
    const signUp = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    const handleSignIn = (e) => {
        e.preventDefault();
        signIn.post('/login');
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        signUp.post('/register');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container max-w-md py-10">
                <Link href="/" className="text-sm text-muted-foreground">← Retour</Link>
                <h1 className="mt-2 text-2xl font-extrabold text-secondary">Espace compte</h1>
                <p className="text-sm text-muted-foreground mb-6">Connectez-vous pour accéder à l'admin.</p>

                {status && <p className="mb-4 text-sm font-medium text-emerald">{status}</p>}

                <Tabs defaultValue={defaultTab}>
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="signin">Connexion</TabsTrigger>
                        <TabsTrigger value="signup">Inscription</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                        <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="si-email">Email</Label>
                                <Input
                                    id="si-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={signIn.data.email}
                                    onChange={(e) => signIn.setData('email', e.target.value)}
                                />
                                {signIn.errors.email && <p className="text-xs text-destructive">{signIn.errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="si-pw">Mot de passe</Label>
                                <Input
                                    id="si-pw"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={signIn.data.password}
                                    onChange={(e) => signIn.setData('password', e.target.value)}
                                />
                                {signIn.errors.password && <p className="text-xs text-destructive">{signIn.errors.password}</p>}
                            </div>
                            {canResetPassword && (
                                <Link href="/forgot-password" className="block text-xs text-primary hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            )}
                            <Button type="submit" variant="hero" className="w-full" disabled={signIn.processing}>
                                {signIn.processing ? '...' : 'Se connecter'}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="su-name">Nom complet</Label>
                                <Input
                                    id="su-name"
                                    required
                                    maxLength={100}
                                    value={signUp.data.name}
                                    onChange={(e) => signUp.setData('name', e.target.value)}
                                />
                                {signUp.errors.name && <p className="text-xs text-destructive">{signUp.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="su-email">Email</Label>
                                <Input
                                    id="su-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={signUp.data.email}
                                    onChange={(e) => signUp.setData('email', e.target.value)}
                                />
                                {signUp.errors.email && <p className="text-xs text-destructive">{signUp.errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="su-pw">Mot de passe</Label>
                                <Input
                                    id="su-pw"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={signUp.data.password}
                                    onChange={(e) => signUp.setData('password', e.target.value)}
                                />
                                {signUp.errors.password && <p className="text-xs text-destructive">{signUp.errors.password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="su-pw2">Confirmer le mot de passe</Label>
                                <Input
                                    id="su-pw2"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={signUp.data.password_confirmation}
                                    onChange={(e) => signUp.setData('password_confirmation', e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="hero" className="w-full" disabled={signUp.processing}>
                                {signUp.processing ? '...' : 'Créer mon compte'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
