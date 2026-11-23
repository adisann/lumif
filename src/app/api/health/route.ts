import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
  let authReachable = false;
  let authStatus: number | null = null;
  let dbReachable = false;
  let dbStatus: number | null = null;

  if (supabaseUrl && supabaseKey) {
    const baseUrl = supabaseUrl.replace(/\/$/, "");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    try {
      const [authRes, dbRes] = await Promise.all([
        fetch(`${baseUrl}/auth/v1/health`, {
          headers: { apikey: supabaseKey },
          cache: "no-store",
          signal: controller.signal,
        }),
        fetch(`${baseUrl}/rest/v1/user_profiles?select=user_id&limit=1`, {
          headers: { apikey: supabaseKey },
          cache: "no-store",
          signal: controller.signal,
        }),
      ]);

      authStatus = authRes.status;
      authReachable = authRes.ok;
      dbStatus = dbRes.status;
      dbReachable = dbRes.ok;
    } catch {
      authReachable = false;
      dbReachable = false;
    } finally {
      clearTimeout(timer);
    }
  }

  return NextResponse.json(
    {
      ok: supabaseConfigured && authReachable && dbReachable,
      supabaseConfigured,
      authReachable,
      authStatus,
      dbReachable,
      dbStatus,
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
