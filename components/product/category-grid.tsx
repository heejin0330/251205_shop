/**
 * @file components/product/category-grid.tsx
 * @description 카테고리 그리드 컴포넌트
 *
 * 홈페이지에서 모든 카테고리를 그리드 형태로 표시하는 컴포넌트입니다.
 */

import { CategoryCard } from "./category-card";
import { CATEGORIES } from "@/constants/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {CATEGORIES.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
