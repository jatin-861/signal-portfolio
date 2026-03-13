'use client';

import { useEffect, useRef } from 'react';
import { splitTextReveal } from '@/lib/animations';

interface TextRevealProps {
    text: string;
    className?: string;
}

export function TextReveal({ text, className = '' }: TextRevealProps) {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current && textRef.current.children) {
            const chars = textRef.current.querySelectorAll('.reveal-char');
            splitTextReveal(Array.from(chars));
        }
    }, []);

    return (
        <div ref={textRef} className={className} style={{ perspective: '400px' }}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className="reveal-char inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
}
