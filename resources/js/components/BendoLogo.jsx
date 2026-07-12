import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import bendoLogo from '@/assets/bendologo.png';

export const BendoLogo = ({ className, showWordmark = true }) => {
    return (
        <Link href="/" className={cn('flex items-center', className)}>
            {showWordmark ? (
                <img
                    src={bendoLogo}
                    alt="Bendo logo"
                    className="h-16 md:h-20 w-auto object-contain"
                    loading="eager"
                />
            ) : (
                <BendoMark className="h-12 md:h-14 w-14" />
            )}
        </Link>
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
