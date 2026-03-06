import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

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
