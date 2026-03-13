'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Simplex 3D Noise implementation for the shader
const noise = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
`;

export function HeroScene() {
    const meshRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uStrength: { value: 0.4 }
    }), []);

    useEffect(() => {
        if (meshRef.current) {
            // Entrance animation
            gsap.fromTo(meshRef.current.scale,
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 1, z: 1, duration: 2, ease: 'expo.out' }
            );
        }
    }, []);

    useFrame((state) => {
        const { clock, mouse } = state;
        uniforms.uTime.value = clock.getElapsedTime() * 1000;

        if (groupRef.current) {
            // Mouse parallax
            const targetRotationX = (mouse.y * Math.PI) / 12;
            const targetRotationY = (mouse.x * Math.PI) / 12;
            groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
        }

        if (meshRef.current && wireframeRef.current) {
            const slowRotation = clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.z = slowRotation;
            wireframeRef.current.rotation.z = slowRotation;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight color="#1A1040" intensity={0.5} />
            <pointLight position={[5, 5, 5]} distance={20} intensity={40} color="#6C63FF" />
            <pointLight position={[-5, -3, 2]} distance={20} intensity={20} color="#00F5FF" />

            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 4]} />
                <meshStandardMaterial
                    color="#6C63FF"
                    emissive="#2A2560"
                    emissiveIntensity={0.4}
                    metalness={0.8}
                    roughness={0.2}
                    onBeforeCompile={(shader) => {
                        shader.uniforms.uTime = uniforms.uTime;
                        shader.uniforms.uStrength = uniforms.uStrength;
                        shader.vertexShader = `
              uniform float uTime;
              uniform float uStrength;
              ${noise}
              ${shader.vertexShader}
            `.replace(
                            '#include <begin_vertex>',
                            `
              #include <begin_vertex>
              float noiseVal = snoise(position * 0.3 + uTime * 0.0008);
              transformed += normal * noiseVal * uStrength;
              `
                        );
                    }}
                />
            </mesh>

            <mesh ref={wireframeRef}>
                <icosahedronGeometry args={[2.02, 4]} />
                <meshStandardMaterial
                    color="#00F5FF"
                    wireframe
                    transparent
                    opacity={0.08}
                    onBeforeCompile={(shader) => {
                        shader.uniforms.uTime = uniforms.uTime;
                        shader.uniforms.uStrength = uniforms.uStrength;
                        shader.vertexShader = `
              uniform float uTime;
              uniform float uStrength;
              ${noise}
              ${shader.vertexShader}
            `.replace(
                            '#include <begin_vertex>',
                            `
              #include <begin_vertex>
              float noiseVal = snoise(position * 0.3 + uTime * 0.0008);
              transformed += normal * noiseVal * uStrength;
              `
                        );
                    }}
                />
            </mesh>

            <EffectComposer>
                <Bloom luminanceThreshold={0.8} intensity={0.4} radius={0.3} />
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL}
                    offset={new THREE.Vector2(0.0008, 0.0008)}
                    radialModulation={false}
                    modulationOffset={0.0}
                />
            </EffectComposer>
        </group>
    );
}
