import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    // When behind a proxy (like Railway), use the forwarded headers to construct the correct origin
    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
    const host = forwardedHost || request.headers.get('host')

    // Construct the actual external origin
    const origin = host ? `${forwardedProto}://${host}` : new URL(request.url).origin

    if (code) {
        const supabase = await createClient()
        if (supabase) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error && data.user) {
                // Check if profile exists, if not this is a new user → onboarding
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, company_id')
                    .eq('id', data.user.id)
                    .single()

                if (!profile) {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
                if (!profile.company_id) {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
