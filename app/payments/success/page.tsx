/**
 * @file app/payments/success/page.tsx
 * @description 결제 성공 페이지
 *
 * Toss Payments 결제 성공 후 콜백을 처리하는 페이지입니다.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMessage("결제 정보가 올바르지 않습니다.");
      return;
    }

    // 결제 승인 API 호출
    const confirmPayment = async () => {
      try {
        const confirmResponse = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount, 10),
          }),
        });

        const confirmData = await confirmResponse.json();

        if (!confirmResponse.ok || !confirmData.success) {
          setStatus("error");
          setErrorMessage(confirmData.error || "결제 승인에 실패했습니다.");
          return;
        }

        // 결제 성공 시 주문 상세 페이지로 리다이렉트
        setStatus("success");
        setTimeout(() => {
          router.push(`/orders/${orderId}`);
        }, 1500);
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setStatus("error");
        setErrorMessage("결제 처리 중 오류가 발생했습니다.");
      }
    };

    confirmPayment();
  }, [isSignedIn, router, searchParams]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">결제 처리 중...</h1>
          <p className="text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    const orderId = searchParams.get("orderId");
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
              <Button variant="outline">장바구니로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // success 상태 (리다이렉트 전)
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-green-500/10 p-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">결제가 완료되었습니다</h1>
        <p className="text-muted-foreground">주문 페이지로 이동합니다...</p>
      </div>
    </div>
  );
}
