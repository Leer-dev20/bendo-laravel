import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export const WaitlistModal = ({ open, onOpenChange, service, icon }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            toast.error('Email invalide');
            return;
        }
        setLoading(true);
        const list = JSON.parse(localStorage.getItem('bendo_waitlist') || '[]');
        list.push({ email, service, date: new Date().toISOString() });
        localStorage.setItem('bendo_waitlist', JSON.stringify(list));
        setTimeout(() => {
            toast.success(`Tu es sur la liste pour ${service} 🎉`);
            setEmail('');
            setLoading(false);
            onOpenChange(false);
        }, 400);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-saffron shadow-warm mb-2">
                        {icon}
                    </div>
                    <DialogTitle className="text-center text-2xl">Bientôt disponible</DialogTitle>
                    <DialogDescription className="text-center">
                        Le service <strong className="text-primary">{service}</strong> arrive très bientôt à Casablanca. Laisse ton email, on te prévient en premier.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                    <Input
                        type="email"
                        placeholder="ton@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                    />
                    <Button type="submit" variant="hero" size="lg" className="w-full rounded-full" disabled={loading}>
                        <Sparkles className="h-4 w-4" />
                        {loading ? 'Inscription...' : 'Me prévenir'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
