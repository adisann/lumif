import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function resolveSafeRedirectPath(rawNext: string | null): string {
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) {
    return "/home";
  }
  return rawNext;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = resolveSafeRedirectPath(searchParams.get("next"));

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${nextPath}`);
      }
    } catch {
      // Redirect back to /login with error indicator below
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
