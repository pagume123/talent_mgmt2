import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get admin's company
        const { data: adminProfile } = await supabase
            .from('profiles')
            .select('company_id, role')
            .eq('user_id', user.id)
            .single();

        if (adminProfile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { full_name, email, role = 'employee' } = await req.json();

        if (!full_name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        // 1. Create the placeholder profile (no user_id yet)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert({
                company_id: adminProfile.company_id,
                full_name,
                email,
                role,
            })
            .select()
            .single();

        if (profileError) {
            console.error('Profile creation error:', profileError);
            return NextResponse.json({ error: profileError.message, details: profileError }, { status: 500 });
        }

        // 2. Create the invitation token
        const token = randomUUID().split('-')[0].toUpperCase(); // Simple 8-char token
        const { error: inviteError } = await supabase
            .from('invitations')
            .insert({
                company_id: adminProfile.company_id,
                profile_id: profile.id,
                token,
            });

        if (inviteError) {
            console.error('Invite creation error:', inviteError);
            // Cleanup profile if invite fails
            await supabase.from('profiles').delete().eq('id', profile.id);
            return NextResponse.json({ error: inviteError.message, details: inviteError }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            employee: profile,
            token
        });

    } catch (err: any) {
        console.error('Fatal API Error:', err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get admin context
        const { data: adminProfile } = await supabase
            .from('get_my_profile()')
            .select('*')
            .single();

        if (adminProfile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all profiles in company with their invitation tokens if pending
        const { data: employees, error } = await supabase
            .from('profiles')
            .select(`
                *,
                invitations (token, status)
            `)
            .eq('company_id', adminProfile.company_id)
            .order('created_at', { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ employees });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
