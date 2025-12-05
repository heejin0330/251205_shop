/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지
 *
 * 장바구니의 상품을 주문하는 페이지입니다.
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartSummary } from "@/lib/supabase/queries/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CartItem } from "@/components/cart/cart-item";
import { formatPrice } from "@/lib/utils/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cartSummary = await getCartSummary(userId);

  if (cartSummary.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          장바구니로 돌아가기
        </Button>
      </Link>

      <h1 className="mb-8 text-3xl font-bold">주문하기</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 주문 상품 목록 */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">주문 상품</h2>
          {cartSummary.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* 주문 폼 */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg border bg-card p-6">
            <CheckoutForm totalPrice={cartSummary.totalPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
