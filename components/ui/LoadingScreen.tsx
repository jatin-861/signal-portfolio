'use client';

import { useState, useEffect } from 'react';

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Simulate loading progress based on document readiness
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15 + 5;
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            const fadeTimer = setTimeout(() => setIsFading(true), 300);
            const removeTimer = setTimeout(() => setIsVisible(false), 900);
            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [progress]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-[#080808] flex flex-col items-center justify-center transition-opacity duration-[600ms] ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <h1 className="font-heading text-5xl md:text-6xl bg-gradient-to-r from-[#6C63FF] to-[#00F5FF] bg-clip-text text-transparent uppercase tracking-tight mb-10">
                SIGNAL
            </h1>
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--accent-cyan)] transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
            <span className="mt-4 font-mono text-[11px] text-[var(--text-muted)] tracking-widest">
                {Math.round(Math.min(progress, 100))}%
            </span>
        </div>
    );
}
