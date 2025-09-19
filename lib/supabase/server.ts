import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
	const cookieStore = await cookies();

	// Prefer server-side env vars; fall back to NEXT_PUBLIC_* only if defined.
	const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

	// Fail fast if misconfigured to avoid confusing connect timeouts later
	if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder") || supabaseKey.includes("placeholder")) {
		throw new Error(
			"Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_* equivalents) in your environment/.env.local."
		);
	}

	return createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options)
					);
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	});
}
