'use client';

import React from 'react';

type MagneticButtonProps = {
    children: React.ReactNode;
    variant?: 'filled' | 'outlined';
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
};

export function MagneticButton({
    children,
    variant = 'filled',
    href,
    onClick,
    className = '',
    type = 'button'
}: MagneticButtonProps) {

    const baseStyles = 'inline-flex items-center justify-center px-8 py-4 font-syne font-medium rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] active:scale-[0.97] hover:brightness-110';

    const variants = {
        filled: 'bg-gradient-to-br from-[#6C63FF] to-[#00F5FF] text-[#080808]',
        outlined: 'glass-card border-[#00F5FF]/30 text-white hover:border-[#00F5FF]/60'
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <div data-magnetic="true" className="inline-block">
                <a href={href} className={combinedClassName}>
                    {children}
                </a>
            </div>
        );
    }

    return (
        <div data-magnetic="true" className="inline-block">
            <button type={type} onClick={onClick} className={combinedClassName}>
                {children}
            </button>
        </div>
    );
}
