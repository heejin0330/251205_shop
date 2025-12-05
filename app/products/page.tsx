/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * 상품을 Grid 레이아웃으로 표시하고, 카테고리 필터링 및 정렬 기능을 제공합니다.
 * Server Component로 구현되어 서버에서 데이터를 페칭합니다.
 */

import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductLoading } from "@/components/product/product-loading";
import { CategoryFilter } from "@/components/product/category-filter";
import { SortSelect } from "@/components/product/sort-select";
import { getProducts } from "@/lib/supabase/queries/products";
import type { GetProductsOptions } from "@/types/product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const sort = (params.sort as GetProductsOptions["sort"]) || "created_at_desc";
  const page = parseInt(params.page || "1", 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // 상품 데이터 조회
  const products = await getProducts({
    category,
    sort,
    limit: ITEMS_PER_PAGE,
    offset,
  });

  // 전체 상품 개수 조회 (페이지네이션용)
  // 효율성을 위해 count만 조회하도록 개선 가능
  const allProducts = await getProducts({
    category,
    sort,
  });
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">상품 목록</h1>

        {/* 필터 및 정렬 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CategoryFilter />

          {/* 정렬 선택 */}
          <SortSelect currentSort={sort} currentCategory={category} />
        </div>
      </div>

      {/* 상품 그리드 */}
      <Suspense fallback={<ProductLoading />}>
        <ProductGrid products={products} />
      </Suspense>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href={`/products?${new URLSearchParams({
              ...params,
              page: String(Math.max(1, page - 1)),
            }).toString()}`}
          >
            <Button variant="outline" size="icon" disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          <span className="px-4 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>

          <Link
            href={`/products?${new URLSearchParams({
              ...params,
              page: String(Math.min(totalPages, page + 1)),
            }).toString()}`}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
