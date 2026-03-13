'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MagneticButton } from '@/components/ui/MagneticButton';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
            } else {
                router.push('/admin');
                router.refresh();
            }
        } catch {
            setError('An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#080808] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-radial-gradient from-[rgba(108,99,255,0.05)] to-transparent pointer-events-none" />

            <div className="glass-liquid p-10 md:p-14 max-w-md w-full relative z-10 flex flex-col items-center">
                <h1 className="text-4xl font-heading text-white mb-2 text-center uppercase tracking-tight">Access</h1>
                <p className="font-syne text-[var(--text-muted)] mb-8 text-center text-sm">Signal Administrative Console</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-syne text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:ring-4 focus:ring-[var(--accent-cyan)]/5 transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-syne text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:ring-4 focus:ring-[var(--accent-cyan)]/5 transition-all"
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 font-syne text-[13px] text-center">{error}</p>}

                    <MagneticButton type="submit" variant="filled" className="w-full mt-2">
                        {isLoading ? 'Authenticating...' : 'Enter'}
                    </MagneticButton>
                </form>
            </div>
        </div>
    );
}
