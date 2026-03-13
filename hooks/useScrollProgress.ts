'use client';

import { useState, useEffect } from 'react';

export function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentScrollY / scrollHeight).toFixed(4)));
            }
        };

        window.addEventListener('scroll', updateScroll);
        updateScroll();

        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    return progress;
}
