/**
 * @file components/payment/toss-payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/product";
import { Loader2 } from "lucide-react";

interface TossPaymentWidgetProps {
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
}

export function TossPaymentWidget({
  orderId,
  amount,
  orderName,
  customerName,
  customerEmail,
}: TossPaymentWidgetProps) {
  const router = useRouter();
  const paymentWidgetRef = useRef<any>(null);
  const agreementRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
  const customerKey = `customer_${orderId}`; // 주문 ID를 기반으로 고객 키 생성

  useEffect(() => {
    if (!clientKey) {
      setError("결제 설정이 올바르지 않습니다.");
      setIsLoading(false);
      return;
    }

    const initializeWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

        // 결제 수단 렌더링
        paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: amount, currency: "KRW" },
          { variantKey: "DEFAULT" },
        );

        // 약관 동의 렌더링
        paymentWidget.renderAgreement("#agreement", {
          variantKey: "AGREEMENT",
        });

        paymentWidgetRef.current = paymentWidget;
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load payment widget:", err);
        setError("결제 위젯을 불러오는데 실패했습니다.");
        setIsLoading(false);
      }
    };

    initializeWidget();
  }, [clientKey, customerKey, amount]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current) {
      setError("결제 위젯이 초기화되지 않았습니다.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Toss Payments가 자동으로 paymentKey, orderId, amount를 쿼리 파라미터로 추가합니다
      const successUrl = `${window.location.origin}/payments/success`;
      const failUrl = `${window.location.origin}/payments/fail`;

      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName,
        amount: {
          currency: "KRW",
          value: amount,
        },
        customerName,
        customerEmail,
        successUrl,
        failUrl,
      });
    } catch (err: any) {
      console.error("Payment request failed:", err);
      setError(err.message || "결제 요청에 실패했습니다.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">결제 위젯을 불러오는 중...</p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold">결제 수단 선택</h2>
        <div id="payment-widget" className="w-full" />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">약관 동의</h2>
        <div id="agreement" className="w-full" />
      </div>

      <div className="border-t pt-4">
        <div className="mb-4 flex justify-between text-lg font-bold">
          <span>총 결제금액</span>
          <span>{formatPrice(amount)}</span>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              결제 처리 중...
            </>
          ) : (
            `${formatPrice(amount)} 결제하기`
          )}
        </Button>
      </div>
    </div>
  );
}
