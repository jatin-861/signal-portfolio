'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const skills = ["Next.js", "Three.js", "GSAP", "Supabase", "GLSL"];

export function About() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Left Column Animation
            gsap.fromTo(leftColRef.current,
                { x: -60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    scrollTrigger: {
                        trigger: leftColRef.current,
                        start: 'top 75%',
                    }
                }
            );

            // Right Column Animation
            gsap.fromTo(rightColRef.current,
                { x: 60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    scrollTrigger: {
                        trigger: rightColRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* LEFT COLUMN */}
                <div ref={leftColRef} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <span className="font-syne text-[11px] text-[var(--accent-cyan)] tracking-[0.3em] uppercase">
                            About
                        </span>
                        <h2 className="font-heading text-5xl md:text-6xl text-white leading-[1.1]">
                            Crafting the web&apos;s most <br /> memorable moments
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6 text-[16px] text-[var(--text-muted)] leading-relaxed font-syne">
                        <p>
                            I am a creative technologist focused on pushing the boundaries of what&apos;s possible on the web.
                            By merging deep engineering precision with cinematic visual storytelling, I create experiences
                            that resonate and inspire.
                        </p>
                        <p>
                            My approach is rooted in the belief that every frame, every interaction, and every line of code
                            should serve the larger narrative. I don&apos;t just build websites; I build digital worlds.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {skills.map((skill) => (
                            <span key={skill} className="glass-card px-4 py-2 text-[14px] text-[var(--accent-cyan)] font-syne shadow-none border-[rgba(0,245,255,0.15)]">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div ref={rightColRef} className="flex flex-col gap-8">
                    {/* Stats Display */}
                    <div className="glass-liquid p-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-2">
                            <span className="font-heading text-6xl text-gradient">12+</span>
                            <span className="font-syne text-sm text-[var(--text-muted)]">Projects Shipped</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-heading text-6xl text-gradient">4+</span>
                            <span className="font-syne text-sm text-[var(--text-muted)]">Years Building</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-heading text-6xl text-gradient">3</span>
                            <span className="font-syne text-sm text-[var(--text-muted)] uppercase tracking-wider">Awwwards</span>
                        </div>
                    </div>

                    {/* Terminal Code Block */}
                    <div className="glass-card p-6 font-mono text-[13px] leading-relaxed relative overflow-hidden group">
                        <div className="flex gap-2 mb-4 opacity-40">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p><span className="text-[var(--accent-cyan)]">class</span> <span className="text-[var(--accent-indigo)]">Human</span> {'{'}</p>
                            <p className="pl-4"><span className="text-[var(--text-muted)]">{`// Powered by caffeine and curiosity`}</span></p>
                            <p className="pl-4"><span className="text-[var(--accent-cyan)]">constructor</span>() {'{'}</p>
                            <p className="pl-8 text-white">this.location = <span className="text-[var(--accent-indigo)]">{`"The Grid"`}</span>;</p>
                            <p className="pl-8 text-white">this.state = <span className="text-[var(--accent-indigo)]">{`"Building"`}</span>;</p>
                            <p className="pl-4">{'}'}</p>
                            <p className="pl-4"><span className="text-[var(--accent-cyan)]">dream</span>() {'{'}</p>
                            <p className="pl-8 text-white"><span className="text-[var(--accent-cyan)]">return</span> <span className="text-[var(--accent-indigo)]">{`"Award winning WebGL scenes"`}</span>;</p>
                            <p className="pl-4">{'}'}</p>
                            <p>{'}'}</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
