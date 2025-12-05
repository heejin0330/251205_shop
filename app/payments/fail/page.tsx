/**
 * @file app/payments/fail/page.tsx
 * @description 결제 실패 페이지
 *
 * Toss Payments 결제 실패 후 표시되는 페이지입니다.
 */

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  const errorMessage =
    error || message || code || "결제 처리 중 오류가 발생했습니다.";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">결제에 실패했습니다</h1>
        <p className="mb-6 text-muted-foreground">{errorMessage}</p>
        <div className="flex gap-4">
          {orderId && (
            <Link href={`/payments/${orderId}`}>
              <Button>다시 시도</Button>
            </Link>
          )}
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              장바구니로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
