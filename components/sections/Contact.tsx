'use client';

import { useState } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (formData.message.length < 20) {
            newErrors.message = 'Message must be at least 20 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-32 px-6 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
            {/* Background Detail */}
            <div
                className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(108,99,255,0.12) 0%, transparent 70%)'
                }}
            />

            <div className="relative z-10 w-full max-w-[640px] flex flex-col items-center">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-6xl md:text-7xl text-white mb-6 uppercase">
                        Let&apos;s build <br /> something
                    </h2>
                    <p className="font-syne text-[18px] text-[var(--text-muted)]">
                        Ready to bring your digital vision to life?
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="glass-liquid p-12 w-full text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-heading text-2xl text-white">Message Sent!</h3>
                        <p className="font-syne text-[var(--text-muted)]">I&apos;ll get back to you sooner than you think.</p>
                        <MagneticButton onClick={() => setStatus('idle')} variant="outlined" className="mt-4">
                            Send Another
                        </MagneticButton>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="glass-liquid p-8 md:p-12 w-full flex flex-col gap-6">
                        <div className="flex flex-col gap-2 group relative">
                            <label
                                className={`font-syne text-xs uppercase tracking-widest text-[var(--text-muted)] transition-all duration-300 ${formData.name ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder={formData.name ? "" : "Name"}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-syne text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:ring-4 focus:ring-[var(--accent-cyan)]/5 transition-all"
                            />
                            {errors.name && <span className="text-red-400 text-[13px] font-syne mt-1">{errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-2 group relative">
                            <label
                                className={`font-syne text-xs uppercase tracking-widest text-[var(--text-muted)] transition-all duration-300 ${formData.email ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder={formData.email ? "" : "Email"}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-syne text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:ring-4 focus:ring-[var(--accent-cyan)]/5 transition-all"
                            />
                            {errors.email && <span className="text-red-400 text-[13px] font-syne mt-1">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-2 group relative">
                            <label
                                className={`font-syne text-xs uppercase tracking-widest text-[var(--text-muted)] transition-all duration-300 ${formData.message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                            >
                                Message
                            </label>
                            <textarea
                                placeholder={formData.message ? "" : "Message"}
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-syne text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:ring-4 focus:ring-[var(--accent-cyan)]/5 transition-all resize-none"
                            />
                            {errors.message && <span className="text-red-400 text-[13px] font-syne mt-1">{errors.message}</span>}
                        </div>

                        <MagneticButton
                            type="submit"
                            variant="filled"
                            className="w-full mt-4"
                        >
                            {status === 'sending' ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : status === 'error' ? (
                                'Failed - Try Again'
                            ) : (
                                'Send Message \u2192'
                            )}
                        </MagneticButton>
                    </form>
                )}
            </div>
        </section>
    );
}
