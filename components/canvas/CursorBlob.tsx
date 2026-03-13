'use client';

import { useState, useEffect } from 'react';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';

export function CursorBlob() {
    const { cursorRef, hoverType } = useMagneticEffect();
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }, []);

    if (isTouchDevice) return null;

    const getScale = () => {
        switch (hoverType) {
            case 'link': return 2.0;
            case 'project': return 4.0;
            case 'video': return 3.2;
            default: return 1.0;
        }
    };

    return (
        <div
            ref={cursorRef}
            id="cursor-blob"
            className={`
        fixed top-0 left-0 w-5 h-5 -ml-2.5 -mt-2.5 rounded-full pointer-events-none z-[9999]
        bg-[rgba(0,245,255,0.15)] border border-[rgba(0,245,255,0.4)] backdrop-blur-md
        transition-transform duration-300 ease-out flex items-center justify-center
        ${hoverType === 'project' ? 'mix-blend-difference opacity-100' : 'opacity-80'}
      `}
            style={{
                transform: `scale(${getScale()})`,
            }}
        >
            {hoverType === 'video' && (
                <span className="text-[10px] font-heading text-white tracking-widest scale-[0.3]">PLAY</span>
            )}
        </div>
    );
}
