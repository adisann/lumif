import { createBrowserClient } from "@supabase/ssr";

const safeSupabaseFetch: typeof fetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch {
    return new Response(
      JSON.stringify({
        error: "supabase_unreachable",
        message: "Server Supabase tidak dapat dijangkau atau sedang gangguan (HTTP 555).",
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase env belum kebaca. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: safeSupabaseFetch,
    },
  });
}
