'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Project } from '@/lib/supabase';
import { VideoHover } from '@/components/ui/VideoHover';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const DEMO_PROJECTS: Project[] = [
    { id: 'demo-1', title: 'Nebula Dashboard', slug: 'nebula-dashboard', description: 'Real-time analytics dashboard with WebGL data visualizations', thumbnail: '', video_url: '', live_url: '#', github_url: '#', tags: ['Next.js', 'Three.js', 'D3'], featured: true, order_index: 0, created_at: '' },
    { id: 'demo-2', title: 'Pulse Music', slug: 'pulse-music', description: 'Audio-reactive visual experience powered by Web Audio API', thumbnail: '', video_url: '', live_url: '#', github_url: '#', tags: ['React', 'GLSL', 'WebAudio'], featured: true, order_index: 1, created_at: '' },
    { id: 'demo-3', title: 'Flux Commerce', slug: 'flux-commerce', description: 'High-performance e-commerce platform with edge rendering', thumbnail: '', video_url: '', live_url: '#', github_url: '#', tags: ['Next.js', 'Supabase', 'Stripe'], featured: false, order_index: 2, created_at: '' },
    { id: 'demo-4', title: 'Void Studio', slug: 'void-studio', description: 'Creative design tool with collaborative real-time editing', thumbnail: '', video_url: '', live_url: '#', github_url: '#', tags: ['React', 'Canvas', 'WebSocket'], featured: false, order_index: 3, created_at: '' },
];

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                const fetched = data.projects || [];
                setProjects(fetched.length > 0 ? fetched : DEMO_PROJECTS);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load projects', err);
                setProjects(DEMO_PROJECTS);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!isLoading && projects.length > 0 && containerRef.current) {
            const cards = containerRef.current.querySelectorAll('.project-card-wrapper');

            gsap.fromTo(cards,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }
    }, [isLoading, projects]);

    return (
        <section id="work" className="py-32 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            <h2 className="font-heading text-[48px] md:text-[72px] text-white leading-none tracking-tighter mb-16 uppercase">
                Selected Work
            </h2>

            <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    // Skeleton loader
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass-card aspect-video animate-pulse bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl relative overflow-hidden">
                            <div className="absolute bottom-6 left-6 w-1/2 h-8 bg-white/5 rounded" />
                            <div className="absolute bottom-6 right-6 w-1/4 h-8 bg-white/5 rounded" />
                        </div>
                    ))
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="project-card-wrapper opacity-0">
                            <VideoHover project={project} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
