/**
 * @file components/product/product-grid.tsx
 * @description 상품 그리드 레이아웃 컴포넌트
 *
 * 상품 목록을 반응형 Grid 레이아웃으로 표시하는 컴포넌트입니다.
 * 모바일: 1열, 태블릿: 2열, 데스크톱: 3-4열
 */

import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}

export function ProductGrid({
  products,
  className,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            상품이 없습니다
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            다른 카테고리를 선택해보세요
          </p>
        </div>
      </div>
    );
  }

  // Tailwind의 동적 클래스 생성을 위한 명시적 클래스 매핑
  const gridColsClass = cn(
    "grid gap-4 grid-cols-1",
    columns.tablet === 2 && "md:grid-cols-2",
    columns.tablet === 3 && "md:grid-cols-3",
    columns.desktop === 3 && "lg:grid-cols-3",
    columns.desktop === 4 && "lg:grid-cols-4",
    columns.wide === 4 && "xl:grid-cols-4",
    columns.wide === 5 && "xl:grid-cols-5",
    className,
  );

  return (
    <div className={gridColsClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
