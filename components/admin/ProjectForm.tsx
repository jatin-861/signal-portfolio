'use client';

import { useState, useEffect } from 'react';
import { Project, supabase } from '@/lib/supabase';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function ProjectForm() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({ featured: false, order_index: 0 });
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data.projects || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setCurrentProject(prev => ({
            ...prev,
            title,
            // Auto-generate slug only if we are creating a new project and haven't manually edited it much
            slug: prev.id ? prev.slug : generateSlug(title)
        }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setCurrentProject(prev => ({ ...prev, slug: generateSlug(raw) }));
    };

    const handleFileDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let file: File | null = null;

        if ('dataTransfer' in e) {
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                file = e.dataTransfer.files[0];
            }
        } else {
            if (e.target.files && e.target.files[0]) {
                file = e.target.files[0];
            }
        }

        if (!file) return;

        // Validate MIME type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setErrorMsg('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
            return;
        }
        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('File exceeds 5MB limit.');
            return;
        }

        setErrorMsg('');
        setUploading(true);
        setUploadProgress(10); // Start progress

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Unauthorized");

            const fileExt = file.type.split('/')[1];
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            setUploadProgress(50); // Mid progress

            const { error } = await supabase.storage
                .from('thumbnails')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (error) throw error;

            setUploadProgress(90);

            const { data: publicUrlData } = supabase.storage
                .from('thumbnails')
                .getPublicUrl(fileName);

            setCurrentProject(prev => ({ ...prev, thumbnail: publicUrlData.publicUrl }));
            setUploadProgress(100);
        } catch (err: unknown) {
            console.error(err);
            setErrorMsg(err instanceof Error ? err.message : 'Error uploading file.');
        } finally {
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
            }, 1000);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const payload = {
                ...currentProject,
                tags: Array.isArray(currentProject.tags) ? currentProject.tags : (currentProject.tags as unknown as string || '').split(',').map(s => s.trim()).filter(Boolean),
                order_index: currentProject.order_index ? parseInt(currentProject.order_index.toString()) : 0
            };

            const res = await fetch('/api/projects', {
                method: payload.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed to save project');
            }

            await fetchProjects();
            setIsEditing(false);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchProjects();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (isEditing) {
        return (
            <div className="glass-card p-6 md:p-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl text-white">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
                    <button onClick={() => setIsEditing(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>

                {errorMsg && <div className="mb-4 text-red-400 text-sm font-syne p-3 bg-red-500/10 rounded-lg border border-red-500/20">{errorMsg}</div>}

                <form onSubmit={handleSave} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Title</label>
                            <input
                                type="text" required value={currentProject.title || ''} onChange={handleTitleChange}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Slug</label>
                            <input
                                type="text" required value={currentProject.slug || ''} onChange={handleSlugChange}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Description</label>
                        <textarea
                            rows={3} value={currentProject.description || ''} onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Tags (comma-separated)</label>
                        <input
                            type="text" value={Array.isArray(currentProject.tags) ? currentProject.tags.join(', ') : currentProject.tags || ''}
                            onChange={e => setCurrentProject({ ...currentProject, tags: e.target.value as unknown as string[] })}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                        />
                    </div>

                    {/* Thumbnail Dropzone */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Thumbnail</label>

                        <div
                            className="glass-card border-dashed border-[var(--text-muted)]/40 p-8 text-center relative overflow-hidden group hover:border-[var(--accent-cyan)]/50 transition-colors"
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleFileDrop}
                        >
                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileDrop} className="absolute inset-0 opacity-0 cursor-pointer z-10" />

                            {uploading && (
                                <div className="absolute bottom-0 left-0 h-1 bg-[var(--accent-cyan)] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                            )}

                            {currentProject.thumbnail ? (
                                <div className="flex flex-col items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={currentProject.thumbnail} alt="Preview" className="h-24 rounded object-cover shadow-lg" />
                                    <span className="text-xs text-[var(--text-muted)] group-hover:text-white">Click or drag to replace</span>
                                </div>
                            ) : (
                                <div className="text-[var(--text-muted)] flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity group-hover:text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span className="text-sm">Drag & drop or click to upload thumbnail (Max 5MB)</span>
                                </div>
                            )}
                        </div>
                        {/* Fallback text input if manual URL is needed */}
                        <input
                            type="text" placeholder="Or paste image URL" value={currentProject.thumbnail || ''} onChange={e => setCurrentProject({ ...currentProject, thumbnail: e.target.value })}
                            className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3 text-[13px] text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Video URL</label>
                        <input
                            type="url" value={currentProject.video_url || ''} onChange={e => setCurrentProject({ ...currentProject, video_url: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Live URL</label>
                            <input
                                type="url" value={currentProject.live_url || ''} onChange={e => setCurrentProject({ ...currentProject, live_url: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">GitHub URL</label>
                            <input
                                type="url" value={currentProject.github_url || ''} onChange={e => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--accent-cyan)]/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={currentProject.featured || false} onChange={e => setCurrentProject({ ...currentProject, featured: e.target.checked })} />
                                <div className={`w-10 h-6 bg-white/10 rounded-full transition-colors ${currentProject.featured ? 'bg-[var(--accent-cyan)]/50' : ''}`}></div>
                                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${currentProject.featured ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-sm text-[var(--text-muted)] group-hover:text-white transition-colors">Featured</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-[var(--text-muted)]">Order Index:</label>
                            <input type="number" value={currentProject.order_index || 0} onChange={e => setCurrentProject({ ...currentProject, order_index: parseInt(e.target.value) || 0 })} className="w-20 bg-white/5 border border-white/10 rounded p-1.5 text-center text-white focus:outline-none focus:border-[var(--accent-cyan)]/50" />
                        </div>
                    </div>

                    <MagneticButton type="submit" variant="filled" className="w-full mt-4">
                        {isSaving ? 'Saving...' : 'Save Project'}
                    </MagneticButton>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <h2 className="font-heading text-xl text-white">All Projects</h2>
                <button
                    onClick={() => { setCurrentProject({ featured: false, order_index: 0 }); setIsEditing(true); }}
                    className="bg-gradient-to-r from-[#6C63FF]/20 to-[#00F5FF]/20 border border-[#00F5FF]/30 text-white px-4 py-2 rounded-lg text-sm hover:from-[#6C63FF]/40 hover:to-[#00F5FF]/40 transition-all font-syne"
                >
                    + Add Project
                </button>
            </div>

            {isLoading ? (
                <div className="animate-pulse bg-white/5 h-64 rounded-xl border border-white/10" />
            ) : projects.length === 0 ? (
                <div className="text-center p-12 glass-card text-[var(--text-muted)]">No projects found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-[var(--text-muted)] text-xs uppercase tracking-widest">
                                <th className="p-4 font-normal">Project</th>
                                <th className="p-4 font-normal hidden md:table-cell">Tags</th>
                                <th className="p-4 font-normal text-center">Status</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            {p.thumbnail ? (
                                                <div className="w-12 h-12 rounded bg-white/5 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${p.thumbnail})` }} />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-white/5 flex-shrink-0" />
                                            )}
                                            <div>
                                                <div className="text-white font-medium">{p.title}</div>
                                                <div className="text-[11px] text-[var(--text-muted)] font-mono">{p.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {p.tags?.slice(0, 3).map((t, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-[var(--text-muted)]">{t}</span>
                                            ))}
                                            {(p.tags?.length || 0) > 3 && <span className="text-[10px] text-[var(--text-muted)]">+{p.tags!.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        {p.featured && <span className="inline-block px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 rounded-full border border-[var(--accent-cyan)]/20">Featured</span>}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => { setCurrentProject(p); setIsEditing(true); }} className="text-[var(--accent-indigo)] hover:text-white px-2 py-1 text-sm transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 px-2 py-1 text-sm ml-2 transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
