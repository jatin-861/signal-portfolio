'use client';

import dynamic from 'next/dynamic';
const Hero = dynamic(() => import('@/components/sections/Hero').then(mod => mod.Hero), { ssr: false });
import { Projects } from '@/components/sections/Projects';
import { About } from '@/components/sections/About';
import { Pricing } from '@/components/sections/Pricing';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Pricing />
      <Contact />
    </>
  );
}
