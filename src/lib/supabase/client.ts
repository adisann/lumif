import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { lumifToast } from "@/lib/toast";

const safeSupabaseFetch: typeof fetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch {
    return new Response(
      JSON.stringify({
        error: "supabase_unreachable",
        message: "Server Supabase tidak dapat dijangkau atau sedang gangguan.",
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

let warnedMissingEnv = false;

function createOfflineFallbackClient(): SupabaseClient {
  const errResult = {
    data: null,
    error: { message: "Konfigurasi server Supabase belum aktif. Menggunakan mode lokal." },
  };
  const authErrResult = {
    data: { user: null, session: null },
    error: { message: "Konfigurasi server Supabase belum aktif." },
  };

  const queryBuilder = {
    select: () => queryBuilder,
    insert: () => queryBuilder,
    update: () => queryBuilder,
    upsert: () => queryBuilder,
    delete: () => queryBuilder,
    eq: () => queryBuilder,
    in: () => queryBuilder,
    gte: () => queryBuilder,
    order: () => queryBuilder,
    limit: () => queryBuilder,
    single: async () => errResult,
    maybeSingle: async () => errResult,
    then: (onfulfilled?: (value: typeof errResult) => unknown) =>
      Promise.resolve(errResult).then(onfulfilled),
  };

  return {
    from: () => queryBuilder,
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => authErrResult,
      signUp: async () => authErrResult,
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: errResult.error }),
      resetPasswordForEmail: async () => ({ data: {}, error: errResult.error }),
      exchangeCodeForSession: async () => authErrResult,
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  } as unknown as SupabaseClient;
}

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== "undefined" && !warnedMissingEnv) {
      warnedMissingEnv = true;
      console.warn(
        "Supabase env belum terbaca. Mengaktifkan fallback offline agar aplikasi tidak crash."
      );
      lumifToast.warning(
        "Koneksi server belum aktif",
        "Menggunakan penyimpanan perangkat agar aplikasi tetap berjalan lancar."
      );
    }
    return createOfflineFallbackClient();
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: safeSupabaseFetch,
    },
  });
}
