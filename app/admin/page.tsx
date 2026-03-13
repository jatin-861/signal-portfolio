'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PricingForm } from '@/components/admin/PricingForm';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'projects' | 'pricing'>('projects');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin/login');
            } else {
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#080808]">
                <div className="w-8 h-8 border-2 border-[var(--accent-cyan)]/20 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] p-6 md:p-12 font-syne text-white">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-4xl uppercase tracking-tight text-white">Console</h1>
                        <p className="text-[var(--text-muted)] text-sm">Signal Operations Control</p>
                    </div>
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="glass-card px-4 py-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-4 py-2 text-sm uppercase tracking-widest relative ${activeTab === 'projects' ? 'text-white' : 'text-[var(--text-muted)] hover:text-white/80'}`}
                    >
                        Projects
                        {activeTab === 'projects' && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-[var(--accent-cyan)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`px-4 py-2 text-sm uppercase tracking-widest relative ${activeTab === 'pricing' ? 'text-white' : 'text-[var(--text-muted)] hover:text-white/80'}`}
                    >
                        Pricing
                        {activeTab === 'pricing' && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-[var(--accent-cyan)]" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="mt-4">
                    {activeTab === 'projects' ? <ProjectForm /> : <PricingForm />}
                </div>
            </div>
        </div>
    );
}
