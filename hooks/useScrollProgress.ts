'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    const rafId = useRef(0);

    const updateScroll = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentScrollY / scrollHeight).toFixed(4)));
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();

        return () => {
            window.removeEventListener('scroll', updateScroll);
            cancelAnimationFrame(rafId.current);
        };
    }, [updateScroll]);

    return progress;
}
