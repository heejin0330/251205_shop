/**
 * @file lib/supabase/queries/cart.ts
 * @description Supabase 장바구니 조회 쿼리 함수
 */

import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import type { CartItemWithProduct, CartSummary } from "@/types/cart";
import type { Product } from "@/types/product";

/**
 * 현재 사용자의 장바구니 아이템 조회 (상품 정보 포함)
 */
export async function getCartItems(
  clerkId: string,
): Promise<CartItemWithProduct[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("clerk_id", clerkId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart items:", {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    throw new Error(
      `장바구니 조회 실패: ${error.message || "알 수 없는 오류"}`,
    );
  }

  // 타입 변환: product를 Product 타입으로 변환
  return (data || []).map((item) => ({
    ...item,
    product: item.product as Product,
  })) as CartItemWithProduct[];
}

/**
 * 장바구니 요약 정보 조회
 */
export async function getCartSummary(clerkId: string): Promise<CartSummary> {
  const items = await getCartItems(clerkId);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    totalItems,
    totalPrice,
    items,
  };
}

/**
 * 장바구니 아이템 개수 조회
 */
export async function getCartItemCount(clerkId: string): Promise<number> {
  const supabase = await createClerkSupabaseClient();

  const { count, error } = await supabase
    .from("cart_items")
    .select("*", { count: "exact", head: true })
    .eq("clerk_id", clerkId);

  if (error) {
    console.error("Error counting cart items:", error);
    return 0;
  }

  return count || 0;
}
