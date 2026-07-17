import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  moduleSlugToPurchaseKey,
  type PurchaseKey,
} from "@/lib/payments/catalog";

export async function getUserAccessKeys(
  userId: string,
): Promise<Set<PurchaseKey>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_course_access")
    .select("access_key")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("Unable to load course access:", error.message);
    return new Set();
  }

  return new Set(
    (data ?? []).map((row) => row.access_key as PurchaseKey),
  );
}

export async function userCanAccessModule(
  userId: string,
  moduleSlug: string,
  role?: string | null,
) {
  if (role === "admin") {
    return true;
  }

  const requiredKey = moduleSlugToPurchaseKey(moduleSlug);

  if (!requiredKey) {
    return false;
  }

  const keys = await getUserAccessKeys(userId);

  return keys.has("bundle") || keys.has(requiredKey);
}
