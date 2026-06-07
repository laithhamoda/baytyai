import { createClient } from "./server";

export interface SessionUser {
  id: string;
  email: string | null;
  role: "admin" | "user";
}

/**
 * Returns the current authenticated user with their role, or null.
 * Role is read from the `profiles` table; defaults to "user".
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile?.role === "admin" ? "admin" : "user",
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "admin";
}
