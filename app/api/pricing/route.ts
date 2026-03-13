import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function checkAuth(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return !error && !!user;
}

export async function GET() {
    const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plans: data }, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
}

export async function POST(request: Request) {
    if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { data, error } = await supabase
            .from('pricing_plans')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ plan: data });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) throw new Error('Plan ID required for update');

        const { data, error } = await supabase
            .from('pricing_plans')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ plan: data });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) throw new Error('Plan ID required for deletion');

        const { error } = await supabase
            .from('pricing_plans')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
