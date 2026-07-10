import { cn } from '@/lib/utils';

export const BendoLogo = ({ className, showWordmark = true }) => {
    return (
        <div className={cn('flex items-center', className)}>
            {showWordmark ? (
                <img
                    src="/frontend-assets/bendo-logo.png"
                    alt="Bendo logo"
                    className="h-9 md:h-10 w-auto object-contain"
                    loading="eager"
                />
            ) : (
                <BendoMark className="h-9 w-9" />
            )}
        </div>
    );
};

export const BendoMark = ({ className }) => (
    <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Bendo"
    >
        <g className="origin-center">
            <ellipse cx="26" cy="6" rx="2" ry="5" fill="hsl(var(--saffron))" transform="rotate(-25 26 6)" />
            <ellipse cx="34" cy="3" rx="2" ry="6" fill="hsl(var(--saffron))" />
            <ellipse cx="42" cy="6" rx="2" ry="5" fill="hsl(var(--saffron))" transform="rotate(25 42 6)" />
        </g>
        <circle cx="34" cy="38" r="20" fill="url(#bendo-grad)" />
        <circle cx="34" cy="38" r="8" fill="hsl(var(--background))" />
        <ellipse cx="44" cy="28" rx="3" ry="5" fill="hsl(var(--saffron) / 0.7)" transform="rotate(30 44 28)" />
        <defs>
            <linearGradient id="bendo-grad" x1="14" y1="18" x2="54" y2="58" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(35 95% 58%)" />
                <stop offset="1" stopColor="hsl(20 92% 42%)" />
            </linearGradient>
        </defs>
    </svg>
);
