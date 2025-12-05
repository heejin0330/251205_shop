- [ ] Phase 1: 기본 인프라

  - [x] Next.js 프로젝트 셋업 (pnpm, App Router, React 19)
  - [x] Clerk 연동 (로그인/회원가입, 미들웨어 보호)
  - [x] 기본 레이아웃/네비게이션 구성 (`app/layout.tsx`, `components/Navbar.tsx`)
  - [x] Supabase 프로젝트 연결 및 환경변수 세팅 (`.env.local`)
  - [x] Supabase 클라이언트 설정 (`lib/supabase/`)
    - [x] 서버 클라이언트 (`server.ts`) - `@supabase/ssr` v0.8.0 사용
    - [x] 브라우저 클라이언트 (`client.ts`)
    - [x] Clerk 통합 클라이언트 (`clerk-server.ts`, `clerk-client.ts`)
    - [x] 에러 처리 및 로깅 개선 (`queries/products.ts`)
  - [x] DB 스키마 준비: `products`, `cart_items`, `orders`, `order_items` (개발 환경 RLS 비활성화)
    - [x] 마이그레이션 파일 생성 (`20250102120000_create_shop_tables.sql`)
    - [x] 샘플 데이터 마이그레이션 파일 생성 (`20250102120001_insert_sample_products.sql`)
    - [x] 마이그레이션 적용 완료 (Supabase CLI 사용: `pnpm supabase db push`)
  - [x] 마이그레이션 작성/적용 (`supabase/migrations/*`) - users 테이블 및 storage 버킷 완료

- [x] Phase 2: 상품 기능

  - [x] **Phase 2-1: 홈 페이지 구현**
    - [x] 프로모션/히어로 섹션
    - [x] 카테고리 진입 동선 (카테고리 카드 그리드)
    - [x] 인기 상품 미리보기 (Grid 레이아웃)
  - [x] **Phase 2-2: 상품 목록 페이지 구현**
    - [x] 상품 카드 컴포넌트 (`ProductCard.tsx`)
    - [x] 상품 그리드 레이아웃 (`ProductGrid.tsx`)
    - [x] 카테고리 필터 (`CategoryFilter.tsx`)
    - [x] 정렬 기능 (`SortSelect.tsx`)
    - [x] 페이지네이션
  - [x] 상품 상세 페이지: 재고/가격/설명 표시 (`app/products/[id]/page.tsx`)
  - [x] 로딩/에러/빈 상태 UI 구현
  - [x] 어드민 상품 등록은 대시보드에서 수기 관리(문서화 완료)

  📚 **어드민 가이드**: `docs/ADMIN-PRODUCT-GUIDE.md` 참고

  📋 **구현 목표 문서**: `docs/PHASE2-GOALS.md` 참고

- [x] Phase 3: 장바구니 & 주문

  - [x] 장바구니 담기/삭제/수량 변경 (`cart_items` 연동)
    - [x] 타입 정의 (`types/cart.ts`, `types/order.ts`)
    - [x] 장바구니 쿼리 함수 (`lib/supabase/queries/cart.ts`)
    - [x] 장바구니 Server Actions (`actions/cart.ts`)
    - [x] 장바구니 페이지 UI (`app/cart/page.tsx`)
    - [x] 장바구니 아이템 컴포넌트 (`components/cart/cart-item.tsx`)
    - [x] Navbar 장바구니 아이콘 및 배지 (`components/cart/cart-icon.tsx`)
    - [x] 상품 상세 페이지 장바구니 담기 기능 (`components/product/add-to-cart-button.tsx`)
  - [x] 주문 생성 흐름(주소/메모 입력 포함)
    - [x] 주문 쿼리 함수 (`lib/supabase/queries/orders.ts`)
    - [x] 주문 Server Actions (`actions/orders.ts`)
    - [x] 주문 페이지 UI (`app/checkout/page.tsx`)
    - [x] 주문 폼 컴포넌트 (`components/checkout/checkout-form.tsx`)
    - [x] 주문 완료 페이지 (`app/orders/[id]/page.tsx`)
  - [x] 주문테이블 저장(`orders`, `order_items`) 및 합계 검증

- [x] Phase 4: 결제 통합 (Toss Payments 테스트 모드)

  - [x] 결제위젯 연동 및 클라이언트 플로우 구축
    - [x] Toss Payments SDK 설치 (`@tosspayments/payment-widget-sdk`)
    - [x] 결제 타입 정의 (`types/payment.ts`)
    - [x] 결제 위젯 컴포넌트 (`components/payment/toss-payment-widget.tsx`)
    - [x] 결제 페이지 (`app/payments/[orderId]/page.tsx`)
    - [x] 주문 생성 후 결제 페이지로 리다이렉트
  - [x] 결제 성공/실패 콜백 처리
    - [x] 결제 성공 페이지 (`app/payments/success/page.tsx`)
    - [x] 결제 실패 페이지 (`app/payments/fail/page.tsx`)
    - [x] 결제 승인 API 라우트 (`app/api/payments/confirm/route.ts`)
  - [x] 결제 완료 후 주문 상태 업데이트(`orders.status`)
    - [x] 결제 승인 후 주문 상태를 `confirmed`로 업데이트
    - [x] 결제 실패 시 주문 상태를 `cancelled`로 업데이트
    - [x] 주문 상세 페이지에 결제하기 버튼 추가 (pending 상태일 때)

- [ ] Phase 5: 마이페이지

  - [ ] 주문 내역 목록 조회 (사용자별 `orders`)
  - [ ] 주문 상세 보기 (`order_items` 포함)

- [ ] Phase 6: 테스트 & 배포

  - [ ] 전체 사용자 플로우 E2E 점검
  - [ ] 주요 버그 수정 및 예외처리 강화
  - [ ] Vercel 배포 설정 및 환경변수 구성

- [ ] 공통 작업 & 문서화

  - [ ] 오류/로딩/비어있는 상태 UI 정비
  - [ ] 타입 안전성 강화 (Zod + react-hook-form 적용 구간)
  - [ ] README/PRD 반영, 운영 가이드 업데이트
  - [ ] 접근성/반응형/다크모드 점검

- [ ] 환경/리포지토리 기초 세팅
  - [ ] `.gitignore` / `.cursorignore` 정비
  - [ ] `eslint.config.mjs` / 포맷터 설정 확정
  - [ ] 아이콘/OG 이미지/파비콘 추가 (`public/`)
  - [ ] SEO 관련 파일 (`robots.ts`, `sitemap.ts`, `manifest.ts`)
