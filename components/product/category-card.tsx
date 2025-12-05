/**
 * @file components/product/category-card.tsx
 * @description 카테고리 카드 컴포넌트
 *
 * 홈페이지에서 카테고리별로 이동할 수 있는 카드 컴포넌트입니다.
 */

import Link from "next/link";
import { CATEGORIES, CATEGORY_ICONS } from "@/constants/categories";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS];

  return (
    <Link
      href={`/products?category=${category.id}`}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md",
        className,
      )}
    >
      {Icon && (
        <div className="rounded-full bg-primary/10 p-4 transition-transform group-hover:scale-110">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      )}
      <span className="font-medium">{category.label}</span>
    </Link>
  );
}
