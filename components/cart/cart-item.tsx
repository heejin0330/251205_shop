/**
 * @file components/cart/cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/product";
import { updateCartItem, removeFromCart } from "@/actions/cart";
import type { CartItemWithProduct } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock_quantity) {
      return;
    }

    setIsUpdating(true);
    setQuantity(newQuantity);

    const result = await updateCartItem(item.id, newQuantity);

    if (!result.success) {
      // 실패 시 원래 수량으로 복구
      setQuantity(item.quantity);
      alert(result.error);
    }

    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (!confirm("정말 이 상품을 장바구니에서 삭제하시겠습니까?")) {
      return;
    }

    setIsRemoving(true);

    const result = await removeFromCart(item.id);

    if (!result.success) {
      alert(result.error);
      setIsRemoving(false);
    } else {
      router.refresh();
    }
  };

  const maxQuantity = item.product.stock_quantity;
  const itemTotal = item.product.price * quantity;

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      {/* 상품 이미지 */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-2xl font-bold text-muted-foreground/30">
            {item.product.name.charAt(0)}
          </span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatPrice(item.product.price)} / 개
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* 수량 조절 및 총액 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity || isUpdating}
            >
              <Plus className="h-4 w-4" />
            </Button>
            {maxQuantity < 10 && (
              <span className="text-xs text-muted-foreground">
                (재고: {maxQuantity}개)
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold">{formatPrice(itemTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
