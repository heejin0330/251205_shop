/**
 * @file components/product/add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 */

"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  stockQuantity: number;
}

export function AddToCartButton({
  productId,
  disabled,
  stockQuantity,
}: AddToCartButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsAdding(true);

    const result = await addToCart(productId, 1);

    if (result.success) {
      // 성공 시 장바구니 페이지로 이동하거나 토스트 메시지 표시
      router.push("/cart");
      router.refresh();
    } else {
      alert(result.error);
    }

    setIsAdding(false);
  };

  if (disabled || stockQuantity === 0) {
    return (
      <Button size="lg" className="w-full gap-2" disabled>
        <ShoppingCart className="h-5 w-5" />
        품절
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      <ShoppingCart className="h-5 w-5" />
      {isAdding ? "추가 중..." : "장바구니에 담기"}
    </Button>
  );
}
