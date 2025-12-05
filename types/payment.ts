/**
 * @file types/payment.ts
 * @description 결제 관련 TypeScript 타입 정의
 */

/**
 * Toss Payments 결제 요청 타입
 */
export interface PaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

/**
 * Toss Payments 결제 응답 타입
 */
export interface PaymentResponse {
  success: boolean;
  paymentKey?: string;
  orderId?: string;
  amount?: number;
  error?: string;
  errorCode?: string;
}

/**
 * 결제 승인 요청 타입
 */
export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 결제 승인 응답 타입
 */
export interface PaymentConfirmResponse {
  success: boolean;
  paymentKey?: string;
  orderId?: string;
  amount?: number;
  method?: string;
  error?: string;
}
