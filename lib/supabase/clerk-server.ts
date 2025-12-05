/**
 * @file lib/supabase/clerk-server.ts
 * @description Clerk 통합이 필요한 경우의 Supabase 서버 클라이언트
 *
 * RLS 정책에서 Clerk user ID를 확인해야 하는 경우 사용합니다.
 * 예: 장바구니, 주문 등 사용자별 데이터 조회
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/clerk-server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClerkSupabaseClient();
 *   const { data } = await supabase.from('cart_items').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk 토큰을 사용하는 Supabase 서버 클라이언트
 *
 * 주의: accessToken 옵션을 사용하면 supabase.auth 관련 메서드에 접근할 수 없습니다.
 * 데이터베이스 조회만 가능합니다.
 */
export async function createClerkSupabaseClient() {
  const { getToken } = await auth();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${(await getToken()) ?? ""}`,
      },
    },
  });
}
