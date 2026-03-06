import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateCompanySettings, CompanyArchetype } from '@/lib/utils/archetypes';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, archetype, metadata } = body as {
            name: string;
            archetype: CompanyArchetype;
            metadata: Record<string, string>;
        };

        if (!name || !archetype) {
            return NextResponse.json({ error: 'Company name and archetype are required' }, { status: 400 });
        }

        // Generate LLM-ready archetype settings
        const settings = generateCompanySettings(archetype);

        // 1. Create the company
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert({
                name,
                archetype,
                settings: { ...settings, onboarding_metadata: metadata },
            })
            .select()
            .single();

        if (companyError) {
            return NextResponse.json({ error: companyError.message }, { status: 500 });
        }

        // 2. Create or update the admin's profile
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                user_id: user.id,
                company_id: company.id,
                role: 'admin',
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                email: user.email,
            }, { onConflict: 'user_id' });

        if (profileError) {
            // Rollback: delete company if profile failed
            await supabase.from('companies').delete().eq('id', company.id);
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, company });
    } catch (err: any) {
        console.error('Company creation crash:', err);
        return NextResponse.json({
            error: err.message ?? 'Unexpected error',
            details: err.code ?? 'No specific code',
            hint: 'Check if you have run the SQL in schema.sql and enabled RLS.'
        }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { name, metadata } = await req.json();

        // Get admin context to verify ownership and get company_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id, role')
            .eq('user_id', user.id)
            .single();

        if (profile?.role !== 'admin' || !profile.company_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update company
        const { data: company, error } = await supabase
            .from('companies')
            .update({
                name,
                // Partial update of settings JSON if needed, or just specific fields
                // For now, let's keep it simple: update name and top-level fields
            })
            .eq('id', profile.company_id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, company });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
