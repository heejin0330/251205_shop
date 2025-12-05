/**
 * @file constants/categories.ts
 * @description 상품 카테고리 상수 정의
 */

import { Category } from "@/types/product";
import {
  Laptop,
  Shirt,
  Book,
  UtensilsCrossed,
  Dumbbell,
  Sparkles,
  Home,
} from "lucide-react";

/**
 * 카테고리 목록
 */
export const CATEGORIES: Category[] = [
  {
    id: "electronics",
    name: "electronics",
    label: "전자제품",
    icon: "Laptop",
  },
  {
    id: "clothing",
    name: "clothing",
    label: "의류",
    icon: "Shirt",
  },
  {
    id: "books",
    name: "books",
    label: "도서",
    icon: "Book",
  },
  {
    id: "food",
    name: "food",
    label: "식품",
    icon: "UtensilsCrossed",
  },
  {
    id: "sports",
    name: "sports",
    label: "스포츠",
    icon: "Dumbbell",
  },
  {
    id: "beauty",
    name: "beauty",
    label: "뷰티",
    icon: "Sparkles",
  },
  {
    id: "home",
    name: "home",
    label: "생활/가정",
    icon: "Home",
  },
];

/**
 * 카테고리 아이콘 매핑
 */
export const CATEGORY_ICONS = {
  electronics: Laptop,
  clothing: Shirt,
  books: Book,
  food: UtensilsCrossed,
  sports: Dumbbell,
  beauty: Sparkles,
  home: Home,
};

/**
 * 카테고리 ID로 라벨 찾기
 */
export function getCategoryLabel(categoryId: string | null): string {
  if (!categoryId) return "전체";
  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.label || categoryId;
}
