import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase 브라우저 클라이언트 (Client Component용)
 *
 * 공식 문서 모범 사례 기반:
 * - @supabase/ssr의 createBrowserClient 사용
 * - 브라우저 환경에서 실행되는 Client Component용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { createClient } from '@/lib/supabase/client';
 *
 * export default function MyComponent() {
 *   const supabase = createClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
