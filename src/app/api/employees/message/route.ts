import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

function logDebug(data: any) {
    try {
        const logPath = path.join(process.cwd(), 'telegram_debug.log');
        fs.appendFileSync(logPath, new Date().toISOString() + ': ' + JSON.stringify(data, null, 2) + '\n');
    } catch (e) { }
}

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

        logDebug({ event: 'Incoming Request', telegram_id, message });

        if (!telegram_id || !message) {
            logDebug({ event: 'Validation Failed', telegram_id, message });
            return NextResponse.json({ error: 'Missing telegram_id or message' }, { status: 400 });
        }

        let BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        if (!BOT_TOKEN) {
            logDebug({ event: 'Missing Config', error: 'Bot token not configured' });
            return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
        }

        // Windows environment variables often have hidden \r characters at the end of the line
        // which completely breaks the URL. We must trim it.
        BOT_TOKEN = BOT_TOKEN.trim();

        logDebug({ event: 'Sanitized Token', prefix: BOT_TOKEN.substring(0, 15) + '...' });

        const payload = {
            chat_id: telegram_id.toString(), // Ensure string representation
            text: message
        };

        logDebug({ event: 'Sending to Telegram', payload });

        // Send message via Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        logDebug({ event: 'Telegram Response', status: response.status, result });

        if (!result.ok) {
            console.error('Telegram API Error:', result);
            return NextResponse.json({
                error: `Telegram API: ${result.description} (Error code: ${result.error_code})`
            }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        logDebug({ event: 'Fatal API Error', error: err.message, stack: err.stack });
        console.error('Messaging API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
