import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get admin context
        const { data: adminProfile } = await supabase
            .from('profiles')
            .select('company_id, role')
            .eq('user_id', user.id)
            .single();

        if (adminProfile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { telegram_id, message } = await req.json();

        if (!telegram_id || !message) {
            return NextResponse.json({ error: 'Missing telegram_id or message' }, { status: 400 });
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        if (!BOT_TOKEN) {
            return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
        }

        // Send message via Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegram_id,
                text: message,
                parse_mode: 'HTML'
            }),
        });

        const result = await response.json();

        if (!result.ok) {
            console.error('Telegram API Error:', result);
            return NextResponse.json({ error: result.description || 'Failed to send message via Telegram' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Messaging API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
