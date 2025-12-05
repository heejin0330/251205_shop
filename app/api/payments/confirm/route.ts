/**
 * @file app/api/payments/confirm/route.ts
 * @description Toss Payments 결제 승인 API 라우트
 *
 * 결제 성공 후 결제 승인을 처리하는 서버 사이드 API입니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import type { PaymentConfirmRequest } from "@/types/payment";

const TOSS_PAYMENTS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY;
const TOSS_PAYMENTS_API_URL =
  process.env.TOSS_PAYMENTS_API_URL || "https://api.tosspayments.com/v1";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const body: PaymentConfirmRequest = await req.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "필수 파라미터가 누락되었습니다." },
        { status: 400 },
      );
    }

    if (!TOSS_PAYMENTS_SECRET_KEY) {
      console.error("TOSS_PAYMENTS_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "결제 서버 설정 오류" },
        { status: 500 },
      );
    }

    // 주문 확인
    const supabase = await createClerkSupabaseClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "주문을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 금액 검증
    if (order.total_amount !== amount) {
      return NextResponse.json(
        { success: false, error: "결제 금액이 일치하지 않습니다." },
        { status: 400 },
      );
    }

    // Toss Payments 결제 승인 API 호출
    const confirmResponse = await fetch(
      `${TOSS_PAYMENTS_API_URL}/payments/confirm`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${TOSS_PAYMENTS_SECRET_KEY}:`,
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      },
    );

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error("Toss Payments confirm error:", confirmData);

      // 결제 실패 시 주문 상태를 cancelled로 변경
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);

      return NextResponse.json(
        {
          success: false,
          error: confirmData.message || "결제 승인에 실패했습니다.",
          errorCode: confirmData.code,
        },
        { status: confirmResponse.status },
      );
    }

    // 결제 성공 시 주문 상태를 confirmed로 변경
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      // 결제는 성공했지만 주문 상태 업데이트 실패
      // 이 경우 수동으로 처리해야 할 수 있음
    }

    return NextResponse.json({
      success: true,
      paymentKey: confirmData.paymentKey,
      orderId: confirmData.orderId,
      amount: confirmData.totalAmount,
      method: confirmData.method,
    });
  } catch (error) {
    console.error("Unexpected error in payment confirm:", error);
    return NextResponse.json(
      { success: false, error: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
