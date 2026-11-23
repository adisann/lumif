import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRIVATE_NO_STORE_PREFIXES = [
  "/home",
  "/insight",
  "/profile",
  "/urge-log",
  "/community",
  "/routines",
  "/lair",
  "/focus-guard",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  // Refresh Supabase auth cookies cleanly on server when configured
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, {
                ...options,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              })
            );
          },
        },
        global: {
          fetch: async (input, init) => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 1800);
            try {
              return await fetch(input, { ...init, signal: controller.signal });
            } finally {
              clearTimeout(timer);
            }
          },
        },
      });

      await supabase.auth.getUser();
    } catch {
      // Allow graceful offline/demo fallback when Supabase network is paused
    }
  }

  // Prevent browser or intermediary proxies from caching personal recovery pages
  const pathname = request.nextUrl.pathname;
  if (PRIVATE_NO_STORE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|assets/|models/).*)",
  ],
};
