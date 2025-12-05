/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리하는 페이지입니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartSummary } from "@/lib/supabase/queries/cart";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/product";
import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cartSummary = await getCartSummary(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">장바구니</h1>

      {cartSummary.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">
            장바구니가 비어있습니다
          </h2>
          <p className="mb-6 text-muted-foreground">
            상품을 장바구니에 추가해보세요
          </p>
          <Link href="/products">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              상품 둘러보기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {cartSummary.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">주문 요약</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 개수</span>
                  <span>{cartSummary.totalItems}개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{formatPrice(cartSummary.totalPrice)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>총 결제금액</span>
                    <span>{formatPrice(cartSummary.totalPrice)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout" className="mt-6 block">
                <Button size="lg" className="w-full">
                  주문하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
