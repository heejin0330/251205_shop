/**
 * @file types/order.ts
 * @description 주문 관련 TypeScript 타입 정의
 */

/**
 * 배송지 주소 타입
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  addressDetail?: string;
  postalCode: string;
}

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 주문 아이템 타입
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 정보 타입
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
  // 조인된 주문 아이템들
  order_items?: OrderItem[];
}

/**
 * 주문 생성 요청 타입
 */
export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  orderNote?: string;
}
