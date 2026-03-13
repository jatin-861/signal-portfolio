'use client';

import { useState, useEffect } from 'react';
import { PricingPlan, supabase } from '@/lib/supabase';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function PricingForm() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Partial<PricingPlan>>({ highlighted: false, order_index: 0, currency: 'USD', period: 'month' });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/pricing');
            const data = await res.json();
            setPlans(data.plans || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const payload = {
                ...currentPlan,
                price: parseFloat(currentPlan.price?.toString() || '0'),
                features: Array.isArray(currentPlan.features) ? currentPlan.features : (currentPlan.features as unknown as string || '').split('\n').map(s => s.trim()).filter(Boolean),
                order_index: currentPlan.order_index ? parseInt(currentPlan.order_index.toString()) : 0
            };

            const res = await fetch('/api/pricing', {
                method: payload.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed to save pricing plan');
            }

            await fetchPlans();
            setIsEditing(false);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/pricing?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchPlans();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (isEditing) {
        return (
            <div className="glass-card p-6 md:p-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl text-white">{currentPlan.id ? 'Edit Plan' : 'New Plan'}</h2>
                    <button onClick={() => setIsEditing(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>

                {errorMsg && <div className="mb-4 text-red-400 text-sm font-syne p-3 bg-red-500/10 rounded-lg border border-red-500/20">{errorMsg}</div>}

                <form onSubmit={handleSave} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Plan Name</label>
                        <input
                            type="text" required value={currentPlan.name || ''} onChange={e => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Price</label>
                            <input
                                type="number" step="0.01" required value={currentPlan.price || ''} onChange={e => setCurrentPlan({ ...currentPlan, price: parseFloat(e.target.value) })}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Currency</label>
                            <input
                                type="text" value={currentPlan.currency || 'USD'} onChange={e => setCurrentPlan({ ...currentPlan, currency: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Period</label>
                            <input
                                type="text" value={currentPlan.period || 'month'} onChange={e => setCurrentPlan({ ...currentPlan, period: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Features (One per line. Prefix with - or ! to mark disabled)</label>
                        <textarea
                            rows={6} value={Array.isArray(currentPlan.features) ? currentPlan.features.join('\n') : currentPlan.features || ''}
                            onChange={e => setCurrentPlan({ ...currentPlan, features: e.target.value as unknown as string[] })}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                            placeholder="Full API Access&#10;Unlimited Projects&#10;- Custom Domain"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">CTA Label</label>
                        <input
                            type="text" value={currentPlan.cta_label || ''} onChange={e => setCurrentPlan({ ...currentPlan, cta_label: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-6 mt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={currentPlan.highlighted || false} onChange={e => setCurrentPlan({ ...currentPlan, highlighted: e.target.checked })} />
                                <div className={`w-10 h-6 bg-white/10 rounded-full transition-colors ${currentPlan.highlighted ? 'bg-[var(--accent-cyan)]/50' : ''}`}></div>
                                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${currentPlan.highlighted ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-sm text-[var(--text-muted)] group-hover:text-white transition-colors">Highlighted (Most Popular)</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-[var(--text-muted)]">Order Index:</label>
                            <input type="number" value={currentPlan.order_index || 0} onChange={e => setCurrentPlan({ ...currentPlan, order_index: parseInt(e.target.value) || 0 })} className="w-20 bg-white/5 border border-white/10 rounded p-1.5 text-center text-white focus:outline-none focus:border-[var(--accent-cyan)]/50" />
                        </div>
                    </div>

                    <MagneticButton type="submit" variant="filled" className="w-full mt-4">
                        {isSaving ? 'Saving...' : 'Save Plan'}
                    </MagneticButton>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="font-heading text-xl text-white">Pricing Plans</h2>
                <button
                    onClick={() => { setCurrentPlan({ highlighted: false, order_index: 0, currency: 'USD', period: 'month' }); setIsEditing(true); }}
                    className="bg-gradient-to-r from-[#6C63FF]/20 to-[#00F5FF]/20 border border-[#00F5FF]/30 text-white px-4 py-2 rounded-lg text-sm hover:from-[#6C63FF]/40 hover:to-[#00F5FF]/40 transition-all font-syne"
                >
                    + Add Plan
                </button>
            </div>

            {isLoading ? (
                <div className="animate-pulse bg-white/5 h-64 rounded-xl border border-white/10" />
            ) : plans.length === 0 ? (
                <div className="text-center p-12 glass-card text-[var(--text-muted)]">No pricing plans found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map(p => (
                        <div key={p.id} className={`glass-card p-6 flex flex-col items-start relative ${p.highlighted ? 'border-[var(--accent-cyan)]/40' : ''}`}>
                            {p.highlighted && <div className="absolute top-4 right-4 text-[10px] text-[var(--accent-cyan)] uppercase tracking-widest border border-[var(--accent-cyan)]/20 px-2 py-1 rounded-full bg-[var(--accent-cyan)]/10">Popular</div>}
                            <h3 className="font-heading text-xl text-white mb-2 pr-12">{p.name}</h3>
                            <div className="font-heading text-3xl mb-4 text-white">${p.price}<span className="text-sm font-syne text-[var(--text-muted)]">/{p.period}</span></div>
                            <div className="text-sm text-[var(--text-muted)] mb-6 flex-1 max-h-[100px] overflow-y-auto w-full custom-scrollbar pr-2">
                                {(p.features || []).map((f, i) => (
                                    <div key={i} className={`truncate ${/^[-!]/.test(f) ? 'opacity-50 line-through' : ''}`}>
                                        • {f.replace(/^[-!]/, '').trim()}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 w-full border-t border-white/5 pt-4">
                                <button onClick={() => { setCurrentPlan(p); setIsEditing(true); }} className="flex-1 text-[var(--accent-indigo)] hover:text-white px-2 py-1 text-sm bg-white/5 rounded transition-colors text-center">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="flex-1 text-red-400 hover:text-red-300 px-2 py-1 text-sm bg-white/5 rounded transition-colors text-center">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
