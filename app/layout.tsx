import type { Metadata } from 'next';
import '@/styles/globals.css';
import dynamic from 'next/dynamic';

const Navigation = dynamic(() => import('@/components/layout/Navigation').then(mod => mod.Navigation), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer), { ssr: false });
const CursorBlob = dynamic(() => import('@/components/canvas/CursorBlob').then(mod => mod.CursorBlob), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/layout/SmoothScroll').then(mod => mod.SmoothScroll), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen').then(mod => mod.LoadingScreen), { ssr: false });

export const metadata: Metadata = {
  title: 'SIGNAL — Creative Developer Portfolio',
  description: 'Award-winning web experiences. Three.js, Next.js, GSAP.',
  openGraph: {
    title: 'SIGNAL',
    description: 'Building the web\'s most memorable moments.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIGNAL — Creative Developer Portfolio',
    description: 'Award-winning web experiences. Three.js, Next.js, GSAP.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-[var(--accent-cyan)] selection:text-[#080808]">
        <LoadingScreen />
        <Navigation />
        <main>{children}</main>
        <Footer />
        <CursorBlob />
        <SmoothScroll />
      </body>
    </html>
  );
}
