import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const company_id = searchParams.get('company_id');

        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ perks: [] });

        let query = supabase
            .from('perks')
            .select('*')
            .order('created_at', { ascending: false });

        if (company_id) query = query.eq('company_id', company_id);

        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ perks: data ?? [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id, role')
            .eq('user_id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, description, value } = await req.json();

        const { data, error } = await supabase
            .from('perks')
            .insert({
                company_id: profile.company_id,
                title,
                description,
                value
            })
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, perk: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
