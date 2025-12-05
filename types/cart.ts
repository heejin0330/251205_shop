/**
 * @file types/cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 */

import type { Product } from "./product";

/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // 조인된 상품 정보
  product?: Product;
}

/**
 * 장바구니 아이템 (상품 정보 포함)
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

/**
 * 장바구니 요약 정보
 */
export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  items: CartItemWithProduct[];
}
