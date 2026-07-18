"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPurchaseKey } from "@/lib/payments/catalog";
import { reconcileStripeAccessForUser } from "@/lib/payments/reconcile-access";
import { ensureStripeCustomer } from "@/lib/payments/customer";
import { createAdminClient } from "@/lib/supabase/admin";

function textValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function safeInternalPath(value: string, fallback: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function purchaseDestination(value: string) {
  return isPurchaseKey(value)
    ? `/checkout/continuar?purchase=${encodeURIComponent(value)}`
    : "/#precios";
}

function queryWithPurchase(
  pathname: string,
  purchase: string,
  field: "error" | "message",
  message: string,
) {
  const params = new URLSearchParams();

  params.set(field, message);

  if (isPurchaseKey(purchase)) {
    params.set("purchase", purchase);
  }

  return `${pathname}?${params.toString()}`;
}

export async function login(formData: FormData) {
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const purchase = textValue(formData, "purchase");
  const next = textValue(formData, "next");

  if (!email || !password) {
    redirect(
      queryWithPurchase(
        "/login",
        purchase,
        "error",
        "Completa tu correo y contraseña.",
      ),
    );
  }

  const supabase = await createClient();

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !signInData.user) {
    const normalizedMessage = error?.message.toLowerCase() ?? "";

    const loginError = normalizedMessage.includes("email not confirmed")
      ? "Confirma tu correo electrónico antes de iniciar sesión."
      : normalizedMessage.includes("invalid login credentials")
        ? "El correo o la contraseña no coinciden con tu cuenta."
        : "No pudimos iniciar sesión. Revisa tus datos o recupera tu contraseña.";

    redirect(queryWithPurchase("/login", purchase, "error", loginError));
  }

  const recovery = await reconcileStripeAccessForUser(signInData.user.id);

  if (recovery.error) {
    console.error("Purchase recovery warning:", recovery.error);
  }

  revalidatePath("/", "layout");

  if (isPurchaseKey(purchase)) {
    redirect(purchaseDestination(purchase));
  }

  const [{ data: profile }, { data: accessRows }] = await Promise.all([
    supabase
      .from("mu_profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .maybeSingle(),

    supabase
      .from("mu_course_access")
      .select("id")
      .eq("user_id", signInData.user.id)
      .eq("status", "active")
      .limit(1),
  ]);

  const canEnterPlatform =
    profile?.role === "admin" || (accessRows?.length ?? 0) > 0;

  if (!canEnterPlatform) {
    redirect("/#precios");
  }

  redirect(safeInternalPath(next, "/dashboard"));
}

export async function signup(formData: FormData) {
  const firstName = textValue(formData, "firstName");
  const lastName = textValue(formData, "lastName");
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const confirmPassword = textValue(formData, "confirmPassword");
  const acceptedTerms = formData.get("acceptedTerms") === "on";
  const acceptedRefundPolicy = formData.get("acceptedRefundPolicy") === "on";
  const purchase = textValue(formData, "purchase");

  if (!isPurchaseKey(purchase)) {
    redirect("/#precios");
  }

  if (!firstName || !lastName || !email || password.length < 8) {
    redirect(
      queryWithPurchase(
        "/registro",
        purchase,
        "error",
        "Completa todos los campos. La contraseña debe tener al menos 8 caracteres.",
      ),
    );
  }

  if (password !== confirmPassword) {
    redirect(queryWithPurchase("/registro", purchase, "error", "Las contraseñas no coinciden."));
  }

  if (!acceptedTerms) {
    redirect(queryWithPurchase("/registro", purchase, "error", "Debes aceptar los Términos y Condiciones."));
  }
  if (!acceptedRefundPolicy) {
    redirect(queryWithPurchase("/registro", purchase, "error", "Debes aceptar la Política de Reembolsos."));
  }

  const supabase = await createClient();

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
    },
  });

  if (createError || !created.user) {
    const duplicate = createError?.message.toLowerCase().includes("already");
    redirect(queryWithPurchase("/registro", purchase, "error", duplicate
      ? "Ya existe una cuenta con este correo. Inicia sesión para continuar tu compra."
      : "No pudimos crear tu cuenta. Intenta nuevamente."));
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    redirect(queryWithPurchase("/login", purchase, "error", "Tu cuenta fue creada. Inicia sesión para continuar."));
  }

  await ensureStripeCustomer(data.user);

  revalidatePath("/", "layout");

  redirect(purchaseDestination(purchase));
}

export async function requestPasswordReset(formData: FormData) {
  const email = textValue(formData, "email");

  if (!email) {
    redirect("/recuperar?error=Ingresa tu correo.");
  }

  const supabase = await createClient();

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/dashboard`,
  });

  if (error) {
    redirect(`/recuperar?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/recuperar?message=${encodeURIComponent(
      "Te enviamos un enlace seguro para recuperar el acceso.",
    )}`,
  );
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
