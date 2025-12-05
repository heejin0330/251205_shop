import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

/**
 * Supabase 서버 클라이언트 (Server Component용)
 *
 * 공식 문서 모범 사례 기반:
 * - @supabase/ssr의 createServerClient 사용
 * - Next.js cookies를 통한 세션 관리
 * - Clerk 통합 지원 (accessToken 옵션)
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      // Clerk 통합: Clerk 토큰을 Supabase에 전달
      async accessToken() {
        const token = (await auth()).getToken();
        return token ?? null;
      },
    },
  );
}

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * 레거시 호환성을 위한 별칭 함수
 * @deprecated createClient()를 사용하세요
 */
export async function createClerkSupabaseClient() {
  return createClient();
}
