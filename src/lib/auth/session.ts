import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_profiles")
    .select(
      "id, email, first_name, last_name, display_name, avatar_url, role, onboarding_completed",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load Mercado profile:", error.message);
    return null;
  }

  return data;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
