import { cn } from '@/lib/utils';

export const ServiceWidget = ({ icon: Icon, title, subtitle, badge, active, onClick, flag }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'group relative flex flex-col items-start gap-3 rounded-3xl bg-card p-5 text-left transition-all duration-300',
                'border border-border/50',
                active
                    ? 'shadow-card hover:shadow-warm hover:-translate-y-1'
                    : 'opacity-60 hover:opacity-90 hover:shadow-card',
            )}
        >
            {badge && (
                <span
                    className={cn(
                        'absolute -top-2 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        active ? 'bg-emerald text-emerald-foreground' : 'bg-secondary text-secondary-foreground',
                    )}
                >
                    {badge}
                </span>
            )}
            <div
                className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110',
                    active ? 'bg-gradient-orange shadow-warm' : 'bg-muted',
                )}
            >
                <Icon className={cn('h-6 w-6', active ? 'text-primary-foreground' : 'text-muted-foreground')} />
            </div>
            <div className="space-y-0.5">
                <h3 className="flex items-center gap-1.5 font-bold text-base text-secondary">
                    {title}
                    {flag && <span className="text-sm">{flag}</span>}
                </h3>
                <p className="text-xs text-muted-foreground leading-snug">{subtitle}</p>
            </div>
        </button>
    );
};
