/**
 * @file app/payments/[orderId]/page.tsx
 * @description 결제 페이지
 *
 * 주문 생성 후 결제를 진행하는 페이지입니다.
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { TossPaymentWidget } from "@/components/payment/toss-payment-widget";
import { formatPrice } from "@/lib/utils/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";

interface PaymentPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { orderId } = await params;
  const order = await getOrderById(userId, orderId);

  if (!order) {
    notFound();
  }

  // 이미 결제 완료된 주문인 경우 주문 상세 페이지로 리다이렉트
  if (order.status !== "pending") {
    redirect(`/orders/${orderId}`);
  }

  const shippingAddress = order.shipping_address as {
    name: string;
    phone: string;
    email?: string;
  } | null;

  // 주문 상품명 생성
  const orderName =
    order.order_items && order.order_items.length > 0
      ? order.order_items.length === 1
        ? order.order_items[0].product_name
        : `${order.order_items[0].product_name} 외 ${
            order.order_items.length - 1
          }개`
      : "주문";

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/checkout">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          주문 페이지로 돌아가기
        </Button>
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <CreditCard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">결제하기</h1>
          <p className="text-muted-foreground">
            주문번호: {order.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 결제 위젯 */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <TossPaymentWidget
              orderId={order.id}
              amount={order.total_amount}
              orderName={orderName}
              customerName={shippingAddress?.name}
              customerEmail={shippingAddress?.email}
            />
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">주문 요약</h2>
            {order.order_items && order.order_items.length > 0 && (
              <div className="mb-4 space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
