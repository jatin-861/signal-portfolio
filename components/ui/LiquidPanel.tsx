'use client';

import { ReactNode } from 'react';

interface LiquidPanelProps {
    children: ReactNode;
    className?: string;
    magnetic?: boolean;
}

export function LiquidPanel({ children, className = '', magnetic = false }: LiquidPanelProps) {
    return (
        <div
            className={`glass-liquid ${className}`}
            data-magnetic={magnetic ? 'true' : undefined}
        >
            {children}
        </div>
    );
}
