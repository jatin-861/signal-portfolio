import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { supabase } from '@/lib/supabase';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const MAX_REQUESTS = 3;
const TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'fallback_ip';
        const now = Date.now();
        const record = rateLimitMap.get(ip);

        if (record) {
            if (now - record.timestamp < TIME_WINDOW_MS) {
                if (record.count >= MAX_REQUESTS) {
                    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
                }
                record.count += 1;
            } else {
                rateLimitMap.set(ip, { count: 1, timestamp: now });
            }
        } else {
            rateLimitMap.set(ip, { count: 1, timestamp: now });
        }

        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert to Supabase DB for record
        const { error: dbError } = await supabase
            .from('contact_submissions')
            .insert([{ name, email, message }]);

        if (dbError) {
            console.error('Supabase Error:', dbError);
            // Don't block — DB might not be set up yet, still try email
        }

        // Send email notification via Resend
        // On Resend free tier, `to` must be the account owner's email
        // Use `reply-to` so owner can reply directly to the visitor
        const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
        if (recipient) {
            try {
                await resend.emails.send({
                    from: 'Signal Portfolio <onboarding@resend.dev>',
                    to: [recipient],
                    replyTo: email,
                    subject: `[SIGNAL] New message from ${name}`,
                    text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                });
            } catch (emailError) {
                // Email is a bonus notification, don't fail the request
                console.warn('Email notification failed (non-blocking):', emailError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact route error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
    }
}
