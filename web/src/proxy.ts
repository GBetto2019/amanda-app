import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

async function getProfile(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  const { data } = await supabase
    .from("profiles")
    .select("status, acesso_expira_em")
    .eq("id", userId)
    .single();
  return data;
}

function isActive(profile: { status: string; acesso_expira_em?: string | null } | null) {
  if (!profile || profile.status !== "active") return false;
  if (profile.acesso_expira_em && new Date(profile.acesso_expira_em) <= new Date()) return false;
  return true;
}

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

  // /chat → requer auth + status active
  if (pathname.startsWith("/chat")) {
    if (!user) {
      return NextResponse.redirect(new URL("/entrar", request.url));
    }
    const profile = await getProfile(supabase, user.id);
    if (!isActive(profile)) {
      return NextResponse.redirect(new URL("/aguardando", request.url));
    }
  }

  // /planos → requer auth
  if (pathname.startsWith("/planos") && !user) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  // /aguardando → requer auth
  if (pathname.startsWith("/aguardando") && !user) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  // /entrar ou /cadastro → se já logado, redireciona conforme status
  if (pathname === "/entrar" || pathname === "/cadastro") {
    if (user) {
      const profile = await getProfile(supabase, user.id);
      if (isActive(profile)) {
        return NextResponse.redirect(new URL("/chat", request.url));
      }
      return NextResponse.redirect(new URL("/planos", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/chat/:path*", "/planos/:path*", "/aguardando/:path*", "/entrar", "/cadastro"],
};
