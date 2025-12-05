/**
 * @file components/product/category-filter.tsx
 * @description 카테고리 필터 컴포넌트
 *
 * 상품을 카테고리별로 필터링할 수 있는 컴포넌트입니다.
 * URL 쿼리 파라미터를 사용하여 상태를 관리합니다.
 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, CATEGORY_ICONS } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 카테고리 */}
      <Link href="/products" replace>
        <Button
          variant={currentCategory === null ? "default" : "outline"}
          size="sm"
          className={cn(
            currentCategory === null && "bg-primary text-primary-foreground",
          )}
        >
          전체
        </Button>
      </Link>

      {/* 카테고리별 필터 */}
      {CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS];
        const isActive = currentCategory === category.id;

        return (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            replace
          >
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2",
                isActive && "bg-primary text-primary-foreground",
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {category.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
