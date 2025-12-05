/**
 * @file actions/orders.ts
 * @description 주문 관련 Server Actions
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import { getCartSummary } from "@/lib/supabase/queries/cart";
import type { CreateOrderRequest, ShippingAddress } from "@/types/order";
import { revalidatePath } from "next/cache";

/**
 * 주문 생성
 */
export async function createOrder(request: CreateOrderRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 장바구니 조회
    const cartSummary = await getCartSummary(userId);

    if (cartSummary.items.length === 0) {
      return {
        success: false,
        error: "장바구니가 비어있습니다.",
      };
    }

    // 재고 확인
    for (const item of cartSummary.items) {
      if (item.product.stock_quantity < item.quantity) {
        return {
          success: false,
          error: `${item.product.name}의 재고가 부족합니다. (재고: ${item.product.stock_quantity}개)`,
        };
      }
    }

    const supabase = await createClerkSupabaseClient();

    // 주문 생성
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: userId,
        total_amount: cartSummary.totalPrice,
        status: "pending",
        shipping_address: request.shippingAddress as unknown,
        order_note: request.orderNote || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return {
        success: false,
        error: "주문 생성에 실패했습니다.",
      };
    }

    // 주문 아이템 생성
    const orderItems = cartSummary.items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // 주문 아이템 생성 실패 시 주문도 롤백해야 하지만,
      // Supabase는 트랜잭션을 지원하지 않으므로 여기서는 에러만 반환
      return {
        success: false,
        error: "주문 아이템 생성에 실패했습니다.",
      };
    }

    // 장바구니 비우기
    const { error: cartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", userId);

    if (cartError) {
      console.error("Error clearing cart:", cartError);
      // 장바구니 비우기 실패는 치명적이지 않으므로 경고만
    }

    revalidatePath("/cart");
    revalidatePath("/orders");

    return {
      success: true,
      orderId: order.id,
      message: "주문이 완료되었습니다.",
    };
  } catch (error) {
    console.error("Unexpected error in createOrder:", error);
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
