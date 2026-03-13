'use client';

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-20 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex flex-col gap-4 items-center md:items-start">
                    <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-gradient">
                        SIGNAL
                    </Link>
                    <p className="font-syne text-sm text-[var(--text-muted)] text-center md:text-left max-w-[300px]">
                        Crafting award-worthy digital experiences for the modern web.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="#work" className="font-syne text-sm text-[var(--text-muted)] hover:text-white transition-colors">Work</Link>
                    <Link href="#about" className="font-syne text-sm text-[var(--text-muted)] hover:text-white transition-colors">About</Link>
                    <Link href="#contact" className="font-syne text-sm text-[var(--text-muted)] hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="font-syne text-xs text-[var(--text-muted)] uppercase tracking-widest">
                        Built with Three.js & Next.js
                    </p>
                    <p className="font-syne text-[10px] text-[var(--text-muted)]/40 uppercase tracking-[0.2em]">
                        &copy; 2024 Signal Portfolio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
