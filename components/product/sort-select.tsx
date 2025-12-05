/**
 * @file components/product/sort-select.tsx
 * @description 정렬 선택 컴포넌트
 *
 * 상품 정렬 옵션을 선택할 수 있는 클라이언트 컴포넌트입니다.
 * URL 쿼리 파라미터를 사용하여 상태를 관리합니다.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { GetProductsOptions } from "@/types/product";
import { cn } from "@/lib/utils";

interface SortSelectProps {
  currentSort: GetProductsOptions["sort"];
  currentCategory?: string;
}

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
] as const;

export function SortSelect({ currentSort, currentCategory }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1"); // 정렬 변경 시 첫 페이지로 이동

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">정렬:</span>
      <select
        value={currentSort || "created_at_desc"}
        onChange={handleSortChange}
        className={cn(
          "flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
