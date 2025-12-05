/**
 * @file components/product/product-error.tsx
 * @description 상품 에러 상태 컴포넌트
 *
 * 상품 데이터를 불러오는 중 에러가 발생했을 때 표시되는 컴포넌트입니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProductErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ProductError({
  message = "상품을 불러오는 중 오류가 발생했습니다.",
  onRetry,
}: ProductErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">{message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          잠시 후 다시 시도해주세요
        </p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
        )}
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>
    </div>
  );
}
