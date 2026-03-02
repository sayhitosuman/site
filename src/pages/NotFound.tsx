import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NotFoundProps {
    onSecretUnlock?: () => void;
}

export default function NotFound({ onSecretUnlock }: NotFoundProps) {
    const [clicks, setClicks] = useState(0);
    const location = useLocation();
    const isBackend = location.pathname.startsWith("/backend");

    const handleClick = () => {
        const newClicks = clicks + 1;
        setClicks(newClicks);
        if (newClicks >= 5 && isBackend && onSecretUnlock) {
            onSecretUnlock();
        }
    };

    return (
        <>
            <div
                className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 select-none cursor-default"
                onClick={handleClick}
            >
                <h1 className="font-[var(--font-serif)] text-8xl md:text-9xl italic opacity-10 animate-pulse">
                    404
                </h1>

                <div className="mt-4">
                    <p className="mt-4 text-[var(--color-muted)] max-w-xs mx-auto leading-relaxed">
                        The page you're looking for doesn't exist or has been deleated.
                    </p>

                    <div className="mt-12">
                        <Link
                            to="/"
                            className="text-sm font-mono border border-[var(--color-rule)] px-6 py-2.5 hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-all duration-300 no-underline"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>

                {/* Subtle hint for backend debuggers */}
                {isBackend && clicks > 0 && clicks < 5 && (
                    <p className="fixed bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-20 tracking-[0.2em] uppercase">
                        {5 - clicks} more to reveal
                    </p>
                )}
            </div>
        </>
    );
}

