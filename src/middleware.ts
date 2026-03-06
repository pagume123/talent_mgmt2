import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

    // Public routes — always allow
    const publicRoutes = ['/', '/auth/login', '/auth/callback']
    if (publicRoutes.some(r => pathname === r) || pathname.startsWith('/tma') || pathname.startsWith('/api/tma') || pathname.startsWith('/api/auth/tma')) {
        return supabaseResponse
    }

    // Not logged in → send to login
    if (!user) {
        // Exclude /api routes from redirection to avoid 405s, just let them return 401
        if (pathname.startsWith('/api')) return supabaseResponse;

        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    // Logged in → check if they've completed onboarding
    if (pathname.startsWith('/onboarding')) {
        return supabaseResponse // allow through
    }

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/manager')) {
        // Check if admin has a company
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id, role')
            .eq('user_id', user.id)
            .single()

        if (!profile?.company_id) {
            const url = request.nextUrl.clone()
            url.pathname = '/onboarding'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
