/**
 * @file app/products/[id]/not-found.tsx
 * @description 상품을 찾을 수 없을 때 표시되는 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">상품을 찾을 수 없습니다</h1>
        <p className="mb-8 text-muted-foreground">
          요청하신 상품이 존재하지 않거나 삭제되었습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              상품 목록으로
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2">홈으로</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
