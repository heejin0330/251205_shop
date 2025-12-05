/**
 * @file lib/supabase/queries/products.ts
 * @description Supabase 상품 조회 쿼리 함수
 *
 * 상품 목록 조회, 최신 상품 조회 등의 쿼리 함수를 제공합니다.
 * 공개 데이터 조회이므로 인증이 필요 없습니다.
 */

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

/**
 * 최신 상품 조회
 * @param limit 조회할 상품 개수 (기본값: 8)
 * @returns 최신 상품 목록 (created_at 기준 내림차순)
 */
export async function getLatestProducts(
  limit: number = 8,
): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest products:", {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    throw new Error(
      `최신 상품 조회 실패: ${error.message || "알 수 없는 오류"}`,
    );
  }

  return (data || []) as Product[];
}