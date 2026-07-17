"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPurchaseKey } from "@/lib/payments/catalog";

function textValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function purchaseDestination(value: string) {
  return isPurchaseKey(value)
    ? `/checkout/continuar?purchase=${encodeURIComponent(value)}`
    : "/dashboard";
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      queryWithPurchase(
        "/login",
        purchase,
        "error",
        "Correo o contraseña incorrectos.",
      ),
    );
  }

  revalidatePath("/", "layout");

  if (isPurchaseKey(purchase)) {
    redirect(purchaseDestination(purchase));
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signup(formData: FormData) {
  const firstName = textValue(formData, "firstName");
  const lastName = textValue(formData, "lastName");
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const purchase = textValue(formData, "purchase");

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

  const supabase = await createClient();

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const callbackDestination = isPurchaseKey(purchase)
    ? `/checkout/continuar?purchase=${encodeURIComponent(purchase)}`
    : "/dashboard";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        callbackDestination,
      )}`,
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    redirect(queryWithPurchase("/registro", purchase, "error", error.message));
  }

  revalidatePath("/", "layout");

  /*
   * When Supabase email confirmation is disabled, signUp returns a session
   * and the student goes directly to Stripe.
   */
  if (data.session) {
    redirect(purchaseDestination(purchase));
  }

  /*
   * When email confirmation is enabled, preserve the selected purchase.
   * After confirming, the callback continues to Stripe.
   */
  redirect(
    queryWithPurchase(
      "/login",
      purchase,
      "message",
      "Revisa tu correo para confirmar tu cuenta. Después inicia sesión para continuar directamente al pago.",
    ),
  );
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
