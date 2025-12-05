# Phase 2: 상품 기능 구현 목표

## 📋 개요

Phase 2에서는 쇼핑몰의 핵심 기능인 상품 조회 및 탐색 기능을 구현합니다. 홈페이지와 상품 목록 페이지를 Grid 레이아웃으로 구현하여 사용자가 상품을 쉽게 발견하고 탐색할 수 있도록 합니다.

---

## 🎯 구현 목표

### 1. 홈 페이지 (`app/page.tsx`)

#### 1.1 프로모션 섹션

- **목표**: 주요 프로모션 배너 또는 히어로 섹션 표시
- **구현 내용**:
  - 큰 이미지 배너 또는 텍스트 기반 히어로 섹션
  - CTA 버튼 (예: "지금 쇼핑하기")
  - 반응형 디자인 (모바일/태블릿/데스크톱)

#### 1.2 카테고리 진입 동선

- **목표**: 사용자가 원하는 카테고리로 빠르게 이동할 수 있는 네비게이션
- **구현 내용**:
  - 주요 카테고리 카드 그리드 (electronics, clothing, books, food, sports, beauty, home)
  - 각 카테고리별 아이콘/이미지 + 이름
  - 클릭 시 해당 카테고리의 상품 목록 페이지로 이동 (`/products?category={category}`)
  - 호버 효과 및 시각적 피드백

#### 1.3 인기 상품 미리보기

- **목표**: 홈페이지에서 바로 인기 상품을 확인할 수 있도록
- **구현 내용**:
  - 최신 상품 또는 인기 상품 6-8개 Grid 레이아웃으로 표시
  - 상품 카드 컴포넌트 재사용 (`components/product/ProductCard.tsx`)
  - "더보기" 버튼으로 전체 상품 목록 페이지로 이동

---

### 2. 상품 목록 페이지 (`app/products/page.tsx`)

#### 2.1 Grid 레이아웃

- **목표**: 상품을 효율적으로 표시하는 반응형 Grid 레이아웃
- **구현 내용**:
  - 모바일: 1열 (1개씩)
  - 태블릿: 2열 (2개씩)
  - 데스크톱: 3-4열 (3-4개씩)
  - Tailwind CSS Grid 사용 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`)

#### 2.2 상품 카드 컴포넌트 (`components/product/ProductCard.tsx`)

- **목표**: 재사용 가능한 상품 카드 컴포넌트
- **구현 내용**:
  - 상품 이미지 (플레이스홀더 또는 실제 이미지)
  - 상품명
  - 가격 (천 단위 콤마 표시)
  - 카테고리 태그
  - 재고 상태 표시 (품절/재고 있음)
  - 클릭 시 상품 상세 페이지로 이동 (`/products/[id]`)
  - 호버 효과 (이미지 확대, 그림자 효과 등)

#### 2.3 카테고리 필터

- **목표**: 카테고리별로 상품 필터링
- **구현 내용**:
  - URL 쿼리 파라미터로 필터링 (`?category=electronics`)
  - 카테고리 버튼/탭 UI (전체, 전자제품, 의류, 도서, 식품, 스포츠, 뷰티, 생활/가정)
  - 활성 카테고리 시각적 표시
  - Server Component에서 쿼리 파라미터 읽어서 필터링

#### 2.4 정렬 기능

- **목표**: 상품을 다양한 기준으로 정렬
- **구현 내용**:
  - 정렬 옵션: 최신순, 가격 낮은순, 가격 높은순, 이름순
  - 드롭다운 또는 버튼 그룹으로 UI 제공
  - URL 쿼리 파라미터로 정렬 상태 관리 (`?sort=price_asc`)

#### 2.5 페이지네이션 (선택사항)

- **목표**: 많은 상품을 효율적으로 탐색
- **구현 내용**:
  - 페이지당 12개 또는 16개 상품 표시
  - 이전/다음 버튼 또는 페이지 번호 표시
  - URL 쿼리 파라미터로 페이지 상태 관리 (`?page=2`)

---

## 🗂️ 파일 구조

```
app/
├── page.tsx                    # 홈 페이지 (프로모션 + 카테고리 + 인기 상품)
├── products/
│   ├── page.tsx               # 상품 목록 페이지 (Grid 레이아웃)
│   └── [id]/
│       └── page.tsx           # 상품 상세 페이지 (Phase 2 후반부)
components/
├── product/
│   ├── ProductCard.tsx        # 상품 카드 컴포넌트
│   ├── ProductGrid.tsx        # 상품 그리드 레이아웃 컴포넌트
│   └── CategoryFilter.tsx     # 카테고리 필터 컴포넌트
lib/
└── supabase/
    └── queries/
        └── products.ts        # 상품 조회 쿼리 함수들
```

---

## 📊 데이터베이스 스키마 (참고)

### products 테이블

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 카테고리 목록

- `electronics` - 전자제품
- `clothing` - 의류
- `books` - 도서
- `food` - 식품
- `sports` - 스포츠
- `beauty` - 뷰티
- `home` - 생활/가정

---

## 🎨 UI/UX 요구사항

### 디자인 원칙

1. **간결성**: 불필요한 요소 제거, 핵심 정보에 집중
2. **일관성**: shadcn/ui 컴포넌트 활용, 일관된 스타일
3. **반응형**: 모바일 우선 설계, 모든 화면 크기 지원
4. **접근성**: 키보드 네비게이션, 스크린 리더 지원

### 상품 카드 디자인

- 이미지 영역: 16:9 비율 또는 정사각형
- 정보 영역: 상품명, 가격, 카테고리
- 상태 표시: 재고 있음/품절 배지
- 호버 효과: 이미지 확대, 카드 그림자 증가

---

## 🔧 기술 스택

### 데이터 페칭

- **Server Components**: `app/products/page.tsx`에서 직접 데이터 페칭
- **Supabase Client**: `lib/supabase/server.ts`의 `createClient()` 사용
- **React Query**: 필요시 클라이언트 사이드 캐싱 (선택사항)

### 상태 관리

- **URL 쿼리 파라미터**: 필터링, 정렬, 페이지네이션 상태
- **Server Component**: 서버에서 필터링된 데이터 조회

### 타입 안전성

- **TypeScript**: 모든 컴포넌트와 함수에 타입 정의
- **Zod**: 필요시 데이터 검증 스키마 (선택사항)

---

## ✅ 구현 체크리스트

### Phase 2-1: 홈 페이지

- [ ] 프로모션/히어로 섹션 구현
- [ ] 카테고리 카드 그리드 구현
- [ ] 인기 상품 미리보기 섹션 구현
- [ ] 반응형 디자인 적용

### Phase 2-2: 상품 목록 페이지

- [ ] 상품 카드 컴포넌트 (`ProductCard.tsx`) 구현
- [ ] 상품 그리드 레이아웃 (`ProductGrid.tsx`) 구현
- [ ] 카테고리 필터 컴포넌트 (`CategoryFilter.tsx`) 구현
- [ ] 정렬 기능 구현
- [ ] 페이지네이션 구현 (선택사항)
- [ ] Supabase 쿼리 함수 구현 (`lib/supabase/queries/products.ts`)
- [ ] 반응형 Grid 레이아웃 적용

### Phase 2-3: 공통 작업

- [ ] 로딩 상태 UI 구현
- [ ] 에러 상태 UI 구현
- [ ] 빈 상태 UI 구현 (상품이 없을 때)
- [ ] 타입 정의 (`types/product.ts`)
- [ ] 유틸리티 함수 (가격 포맷팅 등)

---

## 📝 구현 우선순위

### 1단계: 기본 구조

1. 상품 카드 컴포넌트 구현
2. 상품 그리드 레이아웃 구현
3. Supabase에서 상품 데이터 조회 함수 구현

### 2단계: 홈 페이지

1. 홈 페이지 레이아웃 구성
2. 카테고리 카드 그리드 추가
3. 인기 상품 미리보기 추가

### 3단계: 상품 목록 페이지

1. 상품 목록 페이지 기본 구조
2. 카테고리 필터 추가
3. 정렬 기능 추가
4. 페이지네이션 추가 (선택사항)

### 4단계: 개선 및 최적화

1. 로딩/에러/빈 상태 UI 추가
2. 성능 최적화 (이미지 최적화 등)
3. 접근성 개선
4. 반응형 디자인 완성

---

## 🚀 다음 단계 (Phase 2 후반부)

- 상품 상세 페이지 구현 (`app/products/[id]/page.tsx`)
- 상품 이미지 업로드 및 표시 (Supabase Storage 활용)
- 검색 기능 추가 (선택사항)

---

## 📚 참고 자료

- [Supabase Query Documentation](https://supabase.com/docs/guides/database/queries)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
