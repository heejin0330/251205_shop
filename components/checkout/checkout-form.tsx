/**
 * @file components/checkout/checkout-form.tsx
 * @description 주문 폼 컴포넌트
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/actions/orders";
import type { ShippingAddress } from "@/types/order";

const checkoutSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(/^[0-9-]+$/, "올바른 전화번호 형식이 아닙니다"),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요")
    .regex(/^[0-9-]+$/, "올바른 우편번호 형식이 아닙니다"),
  address: z.string().min(1, "주소를 입력해주세요"),
  addressDetail: z.string().optional(),
  orderNote: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  totalPrice: number;
}

export function CheckoutForm({ totalPrice }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    const shippingAddress: ShippingAddress = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      addressDetail: data.addressDetail,
      postalCode: data.postalCode,
    };

    const result = await createOrder({
      shippingAddress,
      orderNote: data.orderNote,
    });

    if (result.success && result.orderId) {
      // 주문 생성 후 결제 페이지로 리다이렉트
      router.push(`/payments/${result.orderId}`);
      router.refresh();
    } else {
      alert(result.error || "주문 생성에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">배송지 정보</h2>

        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="홍길동"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">전화번호 *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="010-1234-5678"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">우편번호 *</Label>
          <Input
            id="postalCode"
            {...register("postalCode")}
            placeholder="12345"
            disabled={isSubmitting}
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">주소 *</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="서울시 강남구 테헤란로 123"
            disabled={isSubmitting}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressDetail">상세주소</Label>
          <Input
            id="addressDetail"
            {...register("addressDetail")}
            placeholder="101동 101호"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">주문 요청사항</h2>
        <div className="space-y-2">
          <Label htmlFor="orderNote">배송 시 요청사항 (선택사항)</Label>
          <Textarea
            id="orderNote"
            {...register("orderNote")}
            placeholder="문 앞에 놓아주세요"
            rows={4}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="mb-4 flex justify-between text-lg font-bold">
          <span>총 결제금액</span>
          <span>{totalPrice.toLocaleString("ko-KR")}원</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "주문 처리 중..." : "주문하기"}
        </Button>
      </div>
    </form>
  );
}
