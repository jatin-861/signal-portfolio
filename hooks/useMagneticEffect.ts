'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function useMagneticEffect() {
    const [hoverType, setHoverType] = useState<'default' | 'link' | 'project' | 'video'>('default');
    const cursorRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const cursor = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };

            // Look for magnetic elements near mouse
            const elements = document.querySelectorAll('[data-magnetic="true"]');
            let targetPos = { ...mouse.current };
            let foundMagnetic = false;

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = mouse.current.x - centerX;
                const dy = mouse.current.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 80) {
                    // Attract cursor
                    targetPos.x = centerX + dx * 0.15;
                    targetPos.y = centerY + dy * 0.15;
                    foundMagnetic = true;

                    // Pull element
                    gsap.to(el, {
                        x: dx * 0.2,
                        y: dy * 0.2,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
                }
            });

            // Update cursor position with silky lag (lerp done via GSAP)
            if (cursorRef.current) {
                gsap.to(cursorRef.current, {
                    x: targetPos.x,
                    y: targetPos.y,
                    duration: 0.08,
                    ease: 'linear'
                });
            }

            // Detect hover types
            const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
            if (hoveredEl) {
                if (hoveredEl.closest('a') || hoveredEl.closest('button')) {
                    setHoverType('link');
                } else if (hoveredEl.closest('[data-hover="project"]')) {
                    setHoverType('project');
                } else if (hoveredEl.closest('[data-hover="video"]')) {
                    setHoverType('video');
                } else {
                    setHoverType('default');
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.style.cursor = 'auto';
        };
    }, []);

    return { cursorRef, hoverType };
}
