import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { type, details, telegramId } = await req.json();
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json({ error: "Supabase not connected" }, { status: 500 });
        }

        // Identify profile from telegramId
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('id, company_id')
            .eq('telegram_id', String(telegramId))
            .single();

        if (pError || !profile) {
            return NextResponse.json({ error: "Profile not found. Please re-authenticate." }, { status: 404 });
        }

        const { data, error } = await supabase
            .from('requests')
            .insert({
                profile_id: profile.id,
                company_id: profile.company_id,
                type,
                details,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, request: data });
    } catch (error: any) {
        console.error("Request submission error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit request" }, { status: 500 });
    }
}
