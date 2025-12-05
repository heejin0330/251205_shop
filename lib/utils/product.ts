/**
 * @file lib/utils/product.ts
 * @description 상품 관련 유틸리티 함수
 */

/**
 * 가격을 한국 원화 형식으로 포맷팅
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "89,000원")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

/**
 * 가격을 간단한 형식으로 포맷팅 (원 단위 제거)
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "89,000")
 */
export function formatPriceSimple(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price);
}

/**
 * 재고 상태 확인
 * @param stockQuantity 재고 수량
 * @returns 재고 상태 ('in_stock' | 'low_stock' | 'out_of_stock')
 */
export function getStockStatus(stockQuantity: number): {
  status: "in_stock" | "low_stock" | "out_of_stock";
  label: string;
} {
  if (stockQuantity === 0) {
    return { status: "out_of_stock", label: "품절" };
  }
  if (stockQuantity < 10) {
    return { status: "low_stock", label: "재고 부족" };
  }
  return { status: "in_stock", label: "재고 있음" };
}
