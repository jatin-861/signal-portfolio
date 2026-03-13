'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const HeroScene = dynamic(() => import('@/components/canvas/HeroScene').then(mod => mod.HeroScene), { ssr: false });
const ParticleField = dynamic(() => import('@/components/canvas/ParticleField').then(mod => mod.ParticleField), { ssr: false });

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const eyebrowRef = useRef<HTMLDivElement>(null);
    const titleLine1Ref = useRef<HTMLDivElement>(null);
    const titleLine2Ref = useRef<HTMLDivElement>(null);
    const titleLine3Ref = useRef<HTMLDivElement>(null);
    const subtextRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const progress = useScrollProgress();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.16, 1, 0.3, 1)' } });

            // Entrance animation sequence
            tl.fromTo(eyebrowRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                0.0
            )
                .fromTo(titleLine1Ref.current,
                    { x: -40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.9 },
                    0.2
                )
                .fromTo(titleLine2Ref.current,
                    { x: -40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.9 },
                    0.4
                )
                .fromTo(titleLine3Ref.current,
                    { x: -40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.9 },
                    0.6
                )
                .fromTo(subtextRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.7 },
                    0.9
                )
                .fromTo(ctaRef.current ? Array.from(ctaRef.current.children) : [],
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08 },
                    1.1
                )
                .fromTo(scrollIndicatorRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    1.4
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#080808]">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 2]}>
                    <HeroScene />
                    <ParticleField />
                </Canvas>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                <div
                    className="glass-liquid p-8 md:p-[64px] pb-12 md:pb-[80px] w-full max-w-[900px] md:w-[clamp(600px,70vw,900px)] flex flex-col items-center text-center pointer-events-auto mx-4"
                    data-magnetic="true"
                >
                    <div ref={eyebrowRef} className="font-syne text-[13px] text-[#00F5FF] tracking-[0.2em] uppercase mb-6 opacity-0">
                        Creative Technologist
                    </div>

                    <h1 className="font-heading text-[52px] md:text-[96px] leading-[0.95] tracking-tight uppercase flex flex-col items-center">
                        <span ref={titleLine1Ref} className="text-white opacity-0 block">BUILDING</span>
                        <span ref={titleLine2Ref} className="text-white opacity-0 block">DIGITAL</span>
                        <span ref={titleLine3Ref} className="bg-gradient-to-r from-[#6C63FF] to-[#00F5FF] bg-clip-text text-transparent opacity-0 block">EXPERIENCES</span>
                    </h1>

                    <div ref={subtextRef} className="font-syne text-[18px] text-[var(--text-muted)] mt-8 max-w-[400px] leading-relaxed opacity-0">
                        Full-stack developer crafting award-worthy web experiences.
                    </div>

                    <div ref={ctaRef} className="flex gap-4 mt-10">
                        <MagneticButton href="#work" variant="filled">
                            View Work ↗
                        </MagneticButton>
                        <MagneticButton href="#contact" variant="outlined">
                            Get In Touch
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-0 pointer-events-none transition-opacity duration-500"
                style={{ opacity: progress > 100 ? 0 : undefined }}
            >
                <span className="font-syne text-[11px] text-[var(--text-muted)] tracking-[0.2em] mb-3 uppercase">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#00F5FF]/50 to-transparent animate-pulse" />
            </div>
        </section>
    );
}
