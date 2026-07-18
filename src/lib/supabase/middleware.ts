import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPurchaseKey } from "@/lib/payments/catalog";

const protectedPaths = [
  "/dashboard",
  "/cursos",
  "/videoteca",
  "/graficas",
  "/comunidad",
  "/certificados",
  "/notas",
  "/sesiones",
  "/admin",
  "/checkout/continuar",
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/login" || pathname === "/registro")) {
    const purchase = request.nextUrl.searchParams.get("purchase");
    const destinationUrl = request.nextUrl.clone();

    if (isPurchaseKey(purchase)) {
      destinationUrl.pathname = "/checkout/continuar";
      destinationUrl.search = "";
      destinationUrl.hash = "";
      destinationUrl.searchParams.set("purchase", purchase);

      return NextResponse.redirect(destinationUrl);
    }

    const [{ data: profile }, { data: accessRows }] = await Promise.all([
      supabase
        .from("mu_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle(),

      supabase
        .from("mu_course_access")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1),
    ]);

    const canEnterPlatform =
      profile?.role === "admin" || (accessRows?.length ?? 0) > 0;

    destinationUrl.search = "";

    if (canEnterPlatform) {
      destinationUrl.pathname = "/dashboard";
      destinationUrl.hash = "";
    } else {
      destinationUrl.pathname = "/";
      destinationUrl.hash = "precios";
    }

    return NextResponse.redirect(destinationUrl);
  }

  return response;
}
