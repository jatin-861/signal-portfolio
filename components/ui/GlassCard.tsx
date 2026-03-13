'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    magnetic?: boolean;
}

export function GlassCard({ children, className = '', magnetic = false }: GlassCardProps) {
    return (
        <div
            className={`glass-card ${className}`}
            data-magnetic={magnetic ? 'true' : undefined}
        >
            {children}
        </div>
    );
}
