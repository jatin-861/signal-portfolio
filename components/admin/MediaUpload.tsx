'use client';

import { useState } from 'react';

export function MediaUpload({ onUpload }: { onUpload: (url: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        // Implementation would use Supabase Storage to upload and get public URL
        // For this scaffold, we'll just mock the behavior
        setTimeout(() => {
            onUpload('https://example.com/mock-upload-url.jpg');
            setUploading(false);
        }, 1500);
    };

    return (
        <div className="border border-dashed border-gray-600 rounded p-6 text-center text-[var(--text-muted)] cursor-pointer hover:border-[#00F5FF] transition-colors relative">
            <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? 'Uploading...' : 'Click or drag file to upload media'}
        </div>
    );
}
