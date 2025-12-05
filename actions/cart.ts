/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 장바구니 추가, 수정, 삭제 등의 작업을 처리합니다.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import { revalidatePath } from "next/cache";

/**
 * 장바구니에 상품 추가
 */
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        error: "수량은 1개 이상이어야 합니다.",
      };
    }

    const supabase = await createClerkSupabaseClient();

    // 기존 장바구니 아이템 확인
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("clerk_id", userId)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      // 기존 아이템이 있으면 수량 업데이트
      const newQuantity = existingItem.quantity + quantity;

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (error) {
        console.error("Error updating cart item:", error);
        return {
          success: false,
          error: "장바구니 업데이트에 실패했습니다.",
        };
      }
    } else {
      // 새 아이템 추가
      const { error } = await supabase.from("cart_items").insert({
        clerk_id: userId,
        product_id: productId,
        quantity,
      });

      if (error) {
        console.error("Error adding to cart:", error);
        return {
          success: false,
          error: "장바구니에 추가하는데 실패했습니다.",
        };
      }
    }

    revalidatePath("/cart");
    revalidatePath("/products");

    return {
      success: true,
      message: "장바구니에 추가되었습니다.",
    };
  } catch (error) {
    console.error("Unexpected error in addToCart:", error);
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 수량 변경
 */
export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    if (quantity <= 0) {
      return {
        success: false,
        error: "수량은 1개 이상이어야 합니다.",
      };
    }

    const supabase = await createClerkSupabaseClient();

    // 본인의 장바구니 아이템인지 확인
    const { data: cartItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("id", cartItemId)
      .eq("clerk_id", userId)
      .single();

    if (!cartItem) {
      return {
        success: false,
        error: "장바구니 아이템을 찾을 수 없습니다.",
      };
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error updating cart item:", error);
      return {
        success: false,
        error: "수량 변경에 실패했습니다.",
      };
    }

    revalidatePath("/cart");

    return {
      success: true,
      message: "수량이 변경되었습니다.",
    };
  } catch (error) {
    console.error("Unexpected error in updateCartItem:", error);
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제
 */
export async function removeFromCart(cartItemId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    const supabase = await createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error removing cart item:", error);
      return {
        success: false,
        error: "장바구니에서 삭제하는데 실패했습니다.",
      };
    }

    revalidatePath("/cart");

    return {
      success: true,
      message: "장바구니에서 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Unexpected error in removeFromCart:", error);
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
