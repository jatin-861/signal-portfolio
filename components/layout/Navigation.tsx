'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const links = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
];

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const scrollProgress = useScrollProgress();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const blurAmount = Math.min(24, (scrollProgress * 240));

    return (
        <nav
            className={`fixed top-0 left-0 w-full h-16 z-[100] flex items-center px-6 md:px-12 transition-all duration-400 ${scrolled ? 'glass-liquid border-white/5' : 'border-transparent'}`}
            style={{
                backdropFilter: scrolled ? `blur(${blurAmount}px)` : 'none',
                paddingTop: scrolled ? '0' : '20px'
            }}
        >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-gradient">
                    SIGNAL
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="font-syne text-[14px] text-[var(--text-muted)] hover:text-white transition-colors relative group overflow-hidden py-1"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--accent-cyan)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[110]"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={`w-6 h-[1.5px] bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
                    <span className={`w-6 h-[1.5px] bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-6 h-[1.5px] bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-[#080808]/95 z-[105] flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${isOpen ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-full'}`}>
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="font-heading text-4xl text-white hover:text-[var(--accent-cyan)] transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
