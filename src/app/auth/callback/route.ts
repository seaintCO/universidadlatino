import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const destination = new URL("/login", url.origin);
      destination.searchParams.set("error", "El enlace no es válido o expiró.");
      return NextResponse.redirect(destination);
    }
  }

  return NextResponse.redirect(
    new URL(next.startsWith("/") ? next : "/dashboard", url.origin),
  );
}
