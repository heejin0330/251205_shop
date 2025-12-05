/**
 * @file app/orders/[id]/not-found.tsx
 * @description 주문 상세 페이지 Not Found
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <PackageX className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">주문을 찾을 수 없습니다</h1>
        <p className="mb-6 text-muted-foreground">
          요청하신 주문이 존재하지 않거나 접근 권한이 없습니다.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
