'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 2000;

    const [positions, driftFactors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const drift = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Randomized in sphere (radius 8)
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = 8 * Math.pow(Math.random(), 1 / 3);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            drift[i] = Math.random() * 10;
        }
        return [pos, drift];
    }, []);

    useFrame((state) => {
        const { clock } = state;
        const time = clock.getElapsedTime();

        if (pointsRef.current) {
            // Slow rotation for the entire field
            pointsRef.current.rotation.y += 0.0002;
            pointsRef.current.rotation.x += 0.0001;

            // Individual particle drift (oscillation)
            const positionAttr = pointsRef.current.geometry.attributes.position;
            for (let i = 0; i < particleCount; i++) {
                const offset = Math.sin(time + driftFactors[i]) * 0.005;
                positionAttr.array[i * 3 + 1] += offset;
            }
            positionAttr.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#00F5FF"
                size={0.015}
                transparent
                opacity={0.4}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
