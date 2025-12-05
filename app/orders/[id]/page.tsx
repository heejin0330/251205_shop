/**
 * @file app/orders/[id]/page.tsx
 * @description 주문 상세 페이지
 *
 * 주문 완료 후 주문 상세 정보를 표시하는 페이지입니다.
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { formatPrice } from "@/lib/utils/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusLabels: Record<string, string> = {
  pending: "주문 대기",
  confirmed: "주문 확인",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const order = await getOrderById(userId, id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address as {
    name: string;
    phone: string;
    address: string;
    addressDetail?: string;
    postalCode: string;
  } | null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Button>
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">주문이 완료되었습니다</h1>
          <p className="text-muted-foreground">
            주문번호: {order.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 주문 상세 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문 상태 */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">주문 상태</h2>
            <p className="text-lg font-medium">
              {statusLabels[order.status] || order.status}
            </p>
            {order.status === "pending" && (
              <Link href={`/payments/${order.id}`} className="mt-4 block">
                <Button>결제하기</Button>
              </Link>
            )}
          </div>

          {/* 주문 상품 */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">주문 상품</h2>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}개
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 배송지 정보 */}
          {shippingAddress && (
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">배송지 정보</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">받는 분:</span>{" "}
                  {shippingAddress.name}
                </p>
                <p>
                  <span className="font-medium">전화번호:</span>{" "}
                  {shippingAddress.phone}
                </p>
                <p>
                  <span className="font-medium">주소:</span> (
                  {shippingAddress.postalCode}) {shippingAddress.address}
                  {shippingAddress.addressDetail &&
                    ` ${shippingAddress.addressDetail}`}
                </p>
              </div>
            </div>
          )}

          {/* 주문 요청사항 */}
          {order.order_note && (
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">주문 요청사항</h2>
              <p className="text-sm">{order.order_note}</p>
            </div>
          )}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">주문 요약</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">주문일시</span>
                <span>
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>총 결제금액</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
            <Link href="/products" className="mt-6 block">
              <Button variant="outline" className="w-full">
                쇼핑 계속하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
