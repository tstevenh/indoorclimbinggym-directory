import { createServerClient } from '@supabase/ssr'

export function createClient(Astro: any) {
  // Extract root domain for cookie sharing across subdomains
  // Production: .indoorclimbinggym.com (shares between dashboard.* and www.*)
  // Development: undefined (localhost - no subdomain sharing needed)
  const isDevelopment = import.meta.env.DEV
  const cookieDomain = isDevelopment ? undefined : '.indoorclimbinggym.com'

  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // Parse cookies from request header (Astro-compatible)
          const allCookies: { name: string; value: string }[] = []
          const cookieHeader = Astro.request.headers.get('cookie') || ''

          if (cookieHeader) {
            const cookies = cookieHeader.split(';').map(c => c.trim())

            cookies.forEach(cookie => {
              const [name, ...valueParts] = cookie.split('=')
              if (name && valueParts.length > 0) {
                allCookies.push({
                  name: name.trim(),
                  value: decodeURIComponent(valueParts.join('=').trim())
                })
              }
            })
          }

          return allCookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            Astro.cookies.set(name, value, {
              ...options,
              domain: cookieDomain, // Share cookies across subdomains in production
            })
          })
        },
      },
    }
  )
}
