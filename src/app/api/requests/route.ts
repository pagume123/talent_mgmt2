import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { type, details, telegramId, initData } = await req.json();
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken) {
            return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 });
        }

        // 1. Validate Telegram signature if coming from TMA
        if (initData) {
            const params = new URLSearchParams(initData);
            const hash = params.get("hash");
            params.delete("hash");

            const dataCheckString = Array.from(params.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => `${k}=${v}`)
                .join("\n");

            const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
            const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

            if (hash !== expectedHash) {
                return NextResponse.json({ error: "Invalid Telegram signature" }, { status: 403 });
            }
        }

        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: "Database error" }, { status: 500 });

        let profileId: string;
        let companyId: string;

        if (telegramId) {
            // Find profile by telegram_id
            const { data: profile, error: pError } = await supabase
                .from('profiles')
                .select('id, company_id')
                .eq('telegram_id', String(telegramId))
                .single();

            if (pError || !profile) {
                return NextResponse.json({ error: "Profile not found for this Telegram ID" }, { status: 404 });
            }
            profileId = profile.id;
            companyId = profile.company_id;
        } else {
            // Check for authenticated user (web admin/manager)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const { data: profile } = await supabase
                .from('profiles')
                .select('id, company_id')
                .eq('user_id', user.id)
                .single();

            if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
            profileId = profile.id;
            companyId = profile.company_id;
        }

        // 2. Insert request
        const { data: request, error: rError } = await supabase
            .from('requests')
            .insert({
                profile_id: profileId,
                company_id: companyId,
                type,
                details,
                status: 'pending'
            })
            .select()
            .single();

        if (rError) return NextResponse.json({ error: rError.message }, { status: 500 });

        return NextResponse.json({ success: true, request });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramId = searchParams.get('telegram_id');

        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: "Database error" }, { status: 500 });

        let query = supabase.from('requests').select(`
            *,
            profiles (full_name, email)
        `);

        if (telegramId) {
            // Employee view: filter by telegram_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('telegram_id', telegramId)
                .single();

            if (!profile) return NextResponse.json({ requests: [] });
            query = query.eq('profile_id', profile.id);
        } else {
            // Admin/Manager view: filter by company
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const { data: profile } = await supabase
                .from('profiles')
                .select('company_id, role')
                .eq('user_id', user.id)
                .single();

            if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

            query = query.eq('company_id', profile.company_id);

            // Supervisors only see their reports? For now, let's keep it simple for MVP.
        }

        const { data: requests, error } = await query.order('created_at', { ascending: false });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ requests });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify admin/supervisor permissions
        const { data: profile } = await supabase
            .from('get_my_profile()')
            .select('*')
            .single();

        if (!profile || (profile.role !== 'admin' && profile.role !== 'supervisor')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id, status } = await req.json();

        const { data: request, error } = await supabase
            .from('requests')
            .update({ status })
            .eq('id', id)
            .eq('company_id', profile.company_id) // Safety check
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, request });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
