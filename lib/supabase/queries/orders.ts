/**
 * @file lib/supabase/queries/orders.ts
 * @description Supabase 주문 조회 쿼리 함수
 */

import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import type { Order, OrderItem } from "@/types/order";

/**
 * 사용자의 주문 목록 조회
 */
export async function getOrders(clerkId: string): Promise<Order[]> {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("clerk_id", clerkId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    throw new Error(`주문 조회 실패: ${error.message || "알 수 없는 오류"}`);
  }

  return (data || []) as Order[];
}

/**
 * 주문 상세 조회 (주문 아이템 포함)
 */
export async function getOrderById(
  clerkId: string,
  orderId: string,
): Promise<Order | null> {
  const supabase = await createClerkSupabaseClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("clerk_id", clerkId)
    .single();

  if (orderError) {
    if (orderError.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching order:", orderError);
    throw new Error(`주문 조회 실패: ${orderError.message}`);
  }

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    throw new Error(`주문 아이템 조회 실패: ${itemsError.message}`);
  }

  return {
    ...(order as Order),
    order_items: (orderItems || []) as OrderItem[],
  };
}
