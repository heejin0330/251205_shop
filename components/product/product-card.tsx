/**
 * @file components/product/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 재사용 가능한 상품 카드 컴포넌트로, 상품 정보를 카드 형태로 표시합니다.
 * 호버 효과, 클릭 이벤트, 재고 상태 표시 등을 포함합니다.
 */

import Link from "next/link";
import { formatPrice, getStockStatus } from "@/lib/utils/product";
import { getCategoryLabel } from "@/constants/categories";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock_quantity);
  const categoryLabel = getCategoryLabel(product.category);

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg",
        className,
      )}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {/* 플레이스홀더 이미지 - 추후 실제 이미지로 교체 가능 */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-4xl font-bold text-muted-foreground/30">
            {product.name.charAt(0)}
          </span>
        </div>

        {/* 재고 상태 배지 */}
        {stockStatus.status === "out_of_stock" && (
          <div className="absolute right-2 top-2 rounded-md bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
            품절
          </div>
        )}
        {stockStatus.status === "low_stock" && (
          <div className="absolute right-2 top-2 rounded-md bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
            재고 부족
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-1 flex-col p-4">
        {/* 카테고리 태그 */}
        {product.category && (
          <span className="mb-1 text-xs text-muted-foreground">
            {categoryLabel}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
          {product.name}
        </h3>

        {/* 설명 (선택적) */}
        {product.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 정보 */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {stockStatus.status === "in_stock" && (
            <span className="text-xs text-muted-foreground">
              재고 {product.stock_quantity}개
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
