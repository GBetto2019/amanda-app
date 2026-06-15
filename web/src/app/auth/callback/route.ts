import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("status, acesso_expira_em")
          .eq("id", user.id)
          .single();

        const isActive =
          profile?.status === "active" &&
          (!profile.acesso_expira_em ||
            new Date(profile.acesso_expira_em) > new Date());

        if (isActive) {
          return NextResponse.redirect(`${origin}/chat`);
        }
        return NextResponse.redirect(`${origin}/planos`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/entrar`);
}
