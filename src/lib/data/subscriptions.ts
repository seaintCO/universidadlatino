import { createClient } from "@/lib/supabase/server";

export async function getCurrentSubscription(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_subscriptions")
    .select(
      "plan, status, current_period_start, current_period_end, cancel_at_period_end",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Unable to load subscription:", error.message);
    return null;
  }

  return data;
}
