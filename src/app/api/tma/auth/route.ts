import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { initData } = await req.json();
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken) {
            return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 });
        }

        // Validate Telegram initData hash
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

        const userParam = params.get("user");
        if (!userParam) {
            return NextResponse.json({ error: "No user data in initData" }, { status: 400 });
        }

        const telegramUser = JSON.parse(userParam);
        const telegramId = String(telegramUser.id);

        // Look up profile by telegram_id
        const supabase = await createClient();
        if (!supabase) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 });
        }

        const { data: profile, error } = await supabase
            .from("profiles")
            .select("*, companies(*)")
            .eq("telegram_id", telegramId)
            .single();

        if (error || !profile) {
            // Employee not yet registered — return telegram user info so they can be told to contact admin
            return NextResponse.json({
                error: "Profile not found. Please contact your HR admin to link your Telegram account.",
                telegram_user: telegramUser,
                registered: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            registered: true,
            profile: {
                id: profile.id,
                role: profile.role,
                company_id: profile.company_id,
                telegram_id: profile.telegram_id,
            },
            company: profile.companies,
        });
    } catch (err: any) {
        console.error("TMA auth error:", err);
        return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
    }
}
