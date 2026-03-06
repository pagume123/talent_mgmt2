import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { token, initData } = await req.json();
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken) {
            return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 });
        }

        if (!token) {
            return NextResponse.json({ error: "Invitation token is required" }, { status: 400 });
        }

        // 1. Validate Telegram initData hash
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

        // 2. Look up the invitation
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: "Database error" }, { status: 500 });

        const { data: invite, error: inviteError } = await supabase
            .from("invitations")
            .select("*, profiles(*)")
            .eq("token", token)
            .eq("status", "pending")
            .single();

        if (inviteError || !invite) {
            return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 404 });
        }

        // 3. Link the profile to this telegram_id
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ telegram_id: telegramId })
            .eq("id", invite.profile_id);

        if (updateError) {
            return NextResponse.json({ error: "Failed to link account. This Telegram ID may already be linked." }, { status: 409 });
        }

        // 4. Mark invitation as claimed
        await supabase
            .from("invitations")
            .update({ status: "claimed" })
            .eq("id", invite.id);

        return NextResponse.json({
            success: true,
            profile: invite.profiles,
            company_id: invite.company_id
        });

    } catch (err: any) {
        console.error("Link error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
