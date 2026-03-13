'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PricingPlan } from '@/lib/supabase';
import { MagneticButton } from '@/components/ui/MagneticButton';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const DEMO_PLANS: PricingPlan[] = [
    { id: 'demo-1', name: 'Starter', price: 2500, currency: 'USD', period: 'project', features: ['Single-page website', 'Responsive design', 'Basic animations', '2 revision rounds', '!Custom 3D elements'], highlighted: false, cta_label: 'Get Started', order_index: 0 },
    { id: 'demo-2', name: 'Professional', price: 7500, currency: 'USD', period: 'project', features: ['Multi-page application', 'WebGL / Three.js scenes', 'Advanced GSAP animations', 'CMS integration', '5 revision rounds', 'Performance optimization'], highlighted: true, cta_label: 'Most Popular', order_index: 1 },
    { id: 'demo-3', name: 'Enterprise', price: 15000, currency: 'USD', period: 'project', features: ['Full-stack application', 'Custom 3D experiences', 'Real-time features', 'CI/CD pipeline', 'Unlimited revisions', '3 months support'], highlighted: false, cta_label: 'Contact Me', order_index: 2 },
];

export function Pricing() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/pricing')
            .then(res => res.json())
            .then(data => {
                const fetched = data.plans || [];
                setPlans(fetched.length > 0 ? fetched : DEMO_PLANS);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load pricing plans', err);
                setPlans(DEMO_PLANS);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!isLoading && plans.length > 0 && containerRef.current) {
            const cards = containerRef.current.querySelectorAll('.pricing-card');

            gsap.fromTo(cards,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }
    }, [isLoading, plans]);

    const renderFeatureRow = (feature: string, available: boolean, idx: number) => (
        <li key={idx} className="flex items-center gap-3 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0">
            {available ? (
                <svg className="w-5 h-5 text-[#00F5FF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-[var(--text-muted)] opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            <span className={`font-syne text-[15px] ${available ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] line-through opacity-70'}`}>
                {feature}
            </span>
        </li>
    );

    return (
        <section id="pricing" className="py-32 px-6 flex flex-col items-center justify-center min-h-screen relative">
            <div className="absolute inset-0 bg-radial-gradient from-[rgba(108,99,255,0.05)] to-transparent pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
                <h2 className="font-heading text-[64px] text-white leading-none tracking-tighter mb-4 uppercase text-center">
                    Pricing Tiers
                </h2>
                <p className="font-syne text-[18px] text-[var(--text-muted)] mb-20 text-center max-w-[500px]">
                    Transparent options for projects of all sizes.
                </p>

                <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-center">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="glass-card h-[600px] animate-pulse rounded-[24px]" />
                        ))
                    ) : (
                        plans.map((plan) => {
                            const isHighlighted = plan.highlighted;

                            return (
                                <div
                                    key={plan.id}
                                    className={`pricing-card relative p-8 md:p-10 flex flex-col ${isHighlighted ? 'glass-liquid scale-100 lg:scale-105 z-10' : 'glass-card scale-100 z-0'} opacity-0`}
                                >
                                    {isHighlighted && (
                                        <>
                                            {/* Animated gradient border ring */}
                                            <div className="absolute inset-[-1px] rounded-[24px] pointer-events-none p-[1px] bg-gradient-to-br from-[#6C63FF] via-[#00F5FF] to-[#6C63FF] z-[-1] opacity-60 animate-[rotate-hue_3s_linear_infinite]" />
                                            <style dangerouslySetInnerHTML={{
                                                __html: `
                        @keyframes rotate-hue {
                          from { filter: hue-rotate(0deg); }
                          to { filter: hue-rotate(360deg); }
                        }
                      `}} />
                                            {/* Badge */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] px-4 py-1.5 rounded-full z-20">
                                                <span className="font-syne text-[11px] font-bold text-white tracking-widest uppercase shadow-sm">Most Popular</span>
                                            </div>
                                        </>
                                    )}

                                    <h3 className="font-heading text-2xl text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="font-heading text-5xl text-white">${plan.price}</span>
                                        <span className="font-syne text-[var(--text-muted)] text-sm">/{plan.period}</span>
                                    </div>

                                    <ul className="flex flex-col gap-2 flex-1 mb-10">
                                        {plan.features.map((feature, idx) => (
                                            // We'll treat features that start with "!" or "-" as unavailable, for demo purposes, 
                                            // or just pass 'true' to all if they are only listed as inclusions.
                                            renderFeatureRow(feature.replace(/^[-!]/, '').trim(), !/^[-!]/.test(feature), idx)
                                        ))}
                                    </ul>

                                    <MagneticButton
                                        href="#contact"
                                        variant={isHighlighted ? 'filled' : 'outlined'}
                                        className="w-full mt-auto"
                                    >
                                        {plan.cta_label || 'Get Started'}
                                    </MagneticButton>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
