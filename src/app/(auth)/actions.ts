"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

export async function login(formData: FormData) {
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const next = textValue(formData, "next") || "/dashboard";

  if (!email || !password) {
    redirect("/login?error=Completa tu correo y contraseña.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent("Correo o contraseña incorrectos.")}`,
    );
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signup(formData: FormData) {
  const firstName = textValue(formData, "firstName");
  const lastName = textValue(formData, "lastName");
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");

  if (!firstName || !lastName || !email || password.length < 8) {
    redirect(
      `/registro?error=${encodeURIComponent(
        "Completa todos los campos. La contraseña debe tener al menos 8 caracteres.",
      )}`,
    );
  }

  const supabase = await createClient();

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    redirect(`/registro?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?message=${encodeURIComponent(
      "Revisa tu correo para confirmar tu cuenta.",
    )}`,
  );
}

export async function requestPasswordReset(formData: FormData) {
  const email = textValue(formData, "email");

  if (!email) {
    redirect("/recuperar?error=Ingresa tu correo.");
  }

  const supabase = await createClient();

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
