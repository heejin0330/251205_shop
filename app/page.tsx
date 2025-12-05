/**
 * @file app/page.tsx
 * @description 홈 페이지
 *
 * 프로모션 섹션, 카테고리 진입 동선, 인기 상품 미리보기를 포함하는 홈 페이지입니다.
 */

import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductLoading } from "@/components/product/product-loading";
import { CategoryGrid } from "@/components/product/category-grid";
import { getLatestProducts } from "@/lib/supabase/queries/products";
import { ArrowRight, ShoppingBag } from "lucide-react";

async function LatestProducts() {
  const latestProducts = await getLatestProducts(8);
  return <ProductGrid products={latestProducts} />;
}

export default async function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* 프로모션/히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              쇼핑몰에 오신 것을 환영합니다
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              다양한 카테고리의 상품을 만나보세요. 최신 트렌드와 품질 좋은
              상품을 한 곳에서 만나보실 수 있습니다.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                지금 쇼핑하기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 진입 동선 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">카테고리별 쇼핑</h2>
            <p className="text-muted-foreground">
              원하는 카테고리를 선택하여 상품을 둘러보세요
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* 인기 상품 미리보기 */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">최신 상품</h2>
              <p className="text-muted-foreground">
                방금 추가된 새로운 상품들을 만나보세요
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                더보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Suspense fallback={<ProductLoading count={8} />}>
            <LatestProducts />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
