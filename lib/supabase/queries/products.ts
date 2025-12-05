/**
 * @file lib/supabase/queries/products.ts
 * @description Supabase 상품 조회 쿼리 함수
 */

import { createClient } from "@/lib/supabase/server";
import type { Product, GetProductsOptions } from "@/types/product";

/**
 * 모든 상품 조회 (필터링 및 정렬 지원)
 */
export async function getProducts(
  options: GetProductsOptions = {},
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase.from("products").select("*").eq("is_active", true);

  // 카테고리 필터링
  if (options.category) {
    query = query.eq("category", options.category);
  }

  // 정렬
  switch (options.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "created_at_desc":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // 페이지네이션
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 20) - 1,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    throw new Error(
      `상품 조회 실패: ${error.message || "알 수 없는 오류"} (코드: ${
        error.code || "N/A"
      })`,
    );
  }

  return (data as Product[]) || [];
}

/**
 * 상품 ID로 단일 상품 조회
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // 상품을 찾을 수 없음
      return null;
    }
    console.error("Error fetching product:", error);
    throw error;
  }

  return data as Product;
}

/**
 * 카테고리별 상품 개수 조회
 */
export async function getProductCount(
  options: GetProductsOptions = {},
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error counting products:", error);
    throw error;
  }

  return count || 0;
}

/**
 * 최신 상품 조회 (홈페이지용)
 */
export async function getLatestProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({
    sort: "created_at_desc",
    limit,
  });
}
