import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
  let authReachable = false;
  let authStatus: number | null = null;

  if (supabaseUrl && supabaseKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/health`, {
        headers: { apikey: supabaseKey },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timer);
      authStatus = res.status;
      authReachable = res.ok;
    } catch {
      authReachable = false;
    }
  }

  return NextResponse.json(
    {
      ok: supabaseConfigured && authReachable,
      supabaseConfigured,
      authReachable,
      authStatus,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
