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
          // Manual cookie parsing - Astro doesn't have a getAll() method
          // Cookie values from HTTP headers are already decoded by the browser/HTTP layer
          const cookieHeader = Astro.request.headers.get('cookie')
          if (!cookieHeader) return []

          return cookieHeader
            .split(';')
            .map(cookie => cookie.trim())
            .filter(cookie => cookie.length > 0)
            .map(cookie => {
              const [name, ...valueParts] = cookie.split('=')
              return {
                name: name.trim(),
                value: valueParts.join('=').trim() // Rejoin in case value contains '='
              }
            })
            .filter(cookie => cookie.name && cookie.value)
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
