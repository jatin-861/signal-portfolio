'use client';

import React, { useRef, useState } from 'react';
import { Project } from '@/lib/supabase';

export function VideoHover({ project }: { project: Project }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            if (!isVideoLoaded && project.video_url) {
                videoRef.current.src = project.video_url;
                setIsVideoLoaded(true);
            }
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="glass-card relative overflow-hidden group aspect-video cursor-none transform-gpu transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:scale-[1.02]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-hover="video"
        >
            {/* Thumbnail */}
            {project.thumbnail ? (
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                    style={{ backgroundImage: `url(${project.thumbnail})` }}
                />
            ) : (
                <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-60' : 'opacity-100'}`}
                    style={{ background: `linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,245,255,0.08) 50%, rgba(108,99,255,0.05) 100%)` }}
                />
            )}

            {/* Lazy Video */}
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                muted
                loop
                playsInline
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/40 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <h3 className="font-heading text-3xl text-white mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75">
                    {project.tags?.map((tag, i) => (
                        <span key={i} className="glass-liquid px-3 py-1 text-[11px] font-syne text-[var(--text-primary)] tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* CTAs Overlay */}
            <div className={`absolute top-6 right-6 flex gap-3 transition-all duration-300 origin-top-right ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} pointer-events-auto`}>
                {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="glass-liquid px-4 py-2 font-syne text-sm text-white hover:text-[#00F5FF] transition-colors" onClick={(e) => e.stopPropagation()}>
                        View Live ↗
                    </a>
                )}
                {project.slug && (
                    <a href={`/projects/${project.slug}`} className="glass-liquid px-4 py-2 font-syne text-sm text-[#00F5FF] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                        Case Study →
                    </a>
                )}
            </div>
        </div>
    );
}
