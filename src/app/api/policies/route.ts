import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const company_id = searchParams.get('company_id');

        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ policies: [] });

        let query = supabase
            .from('policies')
            .select('id, title_en, title_am, content_en, content_am, status')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (company_id) query = query.eq('company_id', company_id);

        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ policies: data ?? [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
