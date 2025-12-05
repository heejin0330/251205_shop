/**
 * @file components/cart/cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트 (배지 포함)
 */

import { Suspense } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCartItemCount } from "@/lib/supabase/queries/cart";
import { auth } from "@clerk/nextjs/server";

async function CartBadge() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const count = await getCartItemCount(userId);

  if (count === 0) {
    return null;
  }

  return (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function CartIcon() {
  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        <Suspense fallback={null}>
          <CartBadge />
        </Suspense>
      </Button>
    </Link>
  );
}
