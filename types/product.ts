/**
 * @file types/product.ts
 * @description 상품 관련 TypeScript 타입 정의
 */

/**
 * 상품 정보 타입
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 목록 조회 옵션
 */
export interface GetProductsOptions {
  category?: string;
  sort?: "created_at_desc" | "price_asc" | "price_desc" | "name_asc";
  limit?: number;
  offset?: number;
}

/**
 * 카테고리 정보 타입
 */
export interface Category {
  id: string;
  name: string;
  label: string;
  icon?: string;
}

/**
 * 정렬 옵션 타입
 */
export interface SortOption {
  value: string;
  label: string;
}
