import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  moduleSlugToPurchaseKey,
  type PurchaseKey,
} from "@/lib/payments/catalog";
import { ownsPurchase } from "@/lib/payments/entitlements";

export type AccessContext = {
  role: string | null;
  keys: Set<PurchaseKey>;
  isAdmin: boolean;
};

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

  return new Set((data ?? []).map((row) => row.access_key as PurchaseKey));
}

export async function getUserAccessContext(
  userId: string,
): Promise<AccessContext> {
  const supabase = await createClient();

  const [{ data: profile, error: profileError }, keys] = await Promise.all([
    supabase.from("mu_profiles").select("role").eq("id", userId).maybeSingle(),
    getUserAccessKeys(userId),
  ]);

  if (profileError) {
    console.error("Unable to load user role:", profileError.message);
  }

  const role = profile?.role ?? null;

  return {
    role,
    keys,
    isAdmin: role === "admin",
  };
}

export function canAccessPurchaseKey(
  context: AccessContext,
  purchaseKey: PurchaseKey,
) {
  return context.isAdmin || ownsPurchase(context.keys, purchaseKey);
}

export function canAccessModuleSlug(
  context: AccessContext,
  moduleSlug: string,
) {
  const purchaseKey = moduleSlugToPurchaseKey(moduleSlug);

  return purchaseKey
    ? canAccessPurchaseKey(context, purchaseKey)
    : context.isAdmin;
}

export async function userCanAccessModule(
  userId: string,
  moduleSlug: string,
  role?: string | null,
) {
  const keys = await getUserAccessKeys(userId);
  const context: AccessContext = {
    role: role ?? null,
    keys,
    isAdmin: role === "admin",
  };

  return canAccessModuleSlug(context, moduleSlug);
}

export async function userCanAccessLesson(userId: string, lessonId: string) {
  const admin = createAdminClient();

  const { data: lesson, error } = await admin
    .from("mu_lessons")
    .select("module_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !lesson) {
    return false;
  }

  const { data: moduleData, error: moduleError } = await admin
    .from("mu_course_modules")
    .select("slug")
    .eq("id", lesson.module_id)
    .maybeSingle();

  if (moduleError || !moduleData) {
    return false;
  }

  const context = await getUserAccessContext(userId);

  return canAccessModuleSlug(context, moduleData.slug);
}
