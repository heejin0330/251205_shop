/**
 * @file actions/payments.ts
 * @description 결제 관련 Server Actions
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import { revalidatePath } from "next/cache";

/**
 * 결제 완료 후 주문 상태 업데이트
 */
export async function updateOrderStatus(
  orderId: string,
  status: "confirmed" | "cancelled",
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    const supabase = await createClerkSupabaseClient();

    // 본인의 주문인지 확인
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (!order) {
      return {
        success: false,
        error: "주문을 찾을 수 없습니다.",
      };
    }

    // 주문 상태 업데이트
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error updating order status:", error);
      return {
        success: false,
        error: "주문 상태 업데이트에 실패했습니다.",
      };
    }

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return {
      success: true,
      message: "주문 상태가 업데이트되었습니다.",
    };
  } catch (error) {
    console.error("Unexpected error in updateOrderStatus:", error);
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
