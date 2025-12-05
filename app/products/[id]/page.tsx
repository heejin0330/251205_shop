/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 개별 상품의 상세 정보를 표시하는 페이지입니다.
 * 재고, 가격, 설명 등을 포함합니다.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/supabase/queries/products";
import { formatPrice, getStockStatus } from "@/lib/utils/product";
import { getCategoryLabel } from "@/constants/categories";
import { ArrowLeft } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const stockStatus = getStockStatus(product.stock_quantity);
  const categoryLabel = getCategoryLabel(product.category);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <Link href="/products">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          상품 목록으로
        </Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 이미지 영역 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
          {/* 플레이스홀더 이미지 - 추후 실제 이미지로 교체 가능 */}
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-6xl font-bold text-muted-foreground/30">
              {product.name.charAt(0)}
            </span>
          </div>

          {/* 재고 상태 배지 */}
          {stockStatus.status === "out_of_stock" && (
            <div className="absolute right-4 top-4 rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground">
              품절
            </div>
          )}
          {stockStatus.status === "low_stock" && (
            <div className="absolute right-4 top-4 rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white">
              재고 부족
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <div className="flex flex-col">
          {/* 카테고리 */}
          {product.category && (
            <Link
              href={`/products?category=${product.category}`}
              className="mb-2 text-sm text-primary hover:underline"
            >
              {categoryLabel}
            </Link>
          )}

          {/* 상품명 */}
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            {product.name}
          </h1>

          {/* 가격 */}
          <div className="mb-6">
            <span className="text-4xl font-bold">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* 재고 정보 */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">재고 상태:</span>
              <span
                className={`font-medium ${
                  stockStatus.status === "out_of_stock"
                    ? "text-destructive"
                    : stockStatus.status === "low_stock"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {stockStatus.status === "out_of_stock"
                  ? "품절"
                  : stockStatus.status === "low_stock"
                  ? `재고 부족 (${product.stock_quantity}개)`
                  : `재고 있음 (${product.stock_quantity}개)`}
              </span>
            </div>
          </div>

          {/* 설명 */}
          {product.description && (
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold">상품 설명</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* 장바구니 버튼 */}
          <div className="mt-auto">
            <AddToCartButton
              productId={product.id}
              disabled={stockStatus.status === "out_of_stock"}
              stockQuantity={product.stock_quantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
