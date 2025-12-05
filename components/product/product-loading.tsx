/**
 * @file components/product/product-loading.tsx
 * @description 상품 로딩 상태 컴포넌트
 *
 * 상품 목록을 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 */

import { cn } from "@/lib/utils";

interface ProductLoadingProps {
  count?: number;
  className?: string;
}

export function ProductLoading({ count = 8, className }: ProductLoadingProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-lg border bg-card animate-pulse"
        >
          {/* 이미지 스켈레톤 */}
          <div className="aspect-square w-full bg-muted" />

          {/* 정보 영역 스켈레톤 */}
          <div className="flex flex-1 flex-col p-4 gap-3">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-6 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="mt-auto flex items-center justify-between">
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
