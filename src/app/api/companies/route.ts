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
