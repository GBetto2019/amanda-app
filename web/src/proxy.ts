import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { acessoAtivo, type AcessoInfo } from "@/lib/acesso";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  async function getAssinante(): Promise<AcessoInfo> {
    if (!user) return null;
    const { data } = await supabase
      .from("assinantes")
      .select("acesso_status, data_fim")
      .eq("user_id", user.id)
      .maybeSingle();
    return data;
  }

  async function isAdmin(): Promise<boolean> {
    if (!user) return false;
    const { data } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    return !!data;
  }

  // --- Painel admin ---
  if (pathname === "/admin/login") {
    if (user && (await isAdmin())) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/admin")) {
    if (!user || !(await isAdmin())) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return supabaseResponse;
  }

  // --- Mentor IA ---
  if (pathname.startsWith("/chat")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!acessoAtivo(await getAssinante())) {
      return NextResponse.redirect(new URL("/aguardando", request.url));
    }
  }

  // --- Aguardando/renovação (requer login) ---
  if (pathname.startsWith("/aguardando") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // --- Login do assinante: se já logado, roteia conforme acesso ---
  if (pathname === "/login" && user) {
    if (await isAdmin()) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (acessoAtivo(await getAssinante())) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
    return NextResponse.redirect(new URL("/aguardando", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/chat/:path*", "/admin/:path*", "/aguardando/:path*", "/login"],
};
