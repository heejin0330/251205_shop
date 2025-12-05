# 어드민 상품 등록 가이드

## 개요

MVP 단계에서는 별도의 어드민 페이지를 구현하지 않고, Supabase 대시보드에서 직접 상품을 등록/관리합니다.

## 상품 등록 방법

### 1. Supabase 대시보드 접속

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 **Table Editor** 클릭
4. `products` 테이블 선택

### 2. 새 상품 추가

**Insert** 버튼을 클릭하여 다음 정보를 입력:

- **name** (필수): 상품명
- **description** (선택): 상품 설명
- **price** (필수): 가격 (숫자, 예: 25000)
- **category** (선택): 카테고리 ID
  - `electronics` - 전자제품
  - `clothing` - 의류
  - `books` - 도서
  - `food` - 식품
  - `sports` - 스포츠
  - `beauty` - 뷰티
  - `home` - 생활/가정
- **stock_quantity** (기본값: 0): 재고 수량
- **is_active** (기본값: true): 활성화 여부

### 3. 상품 수정/삭제

- **수정**: 테이블에서 직접 셀을 클릭하여 수정
- **삭제**: 행 선택 후 **Delete** 버튼 클릭

## SQL로 일괄 등록

SQL Editor에서 다음 쿼리를 실행하여 여러 상품을 한 번에 추가할 수 있습니다:

```sql
INSERT INTO public.products (name, description, price, category, stock_quantity) VALUES
('상품명 1', '상품 설명 1', 25000, 'clothing', 100),
('상품명 2', '상품 설명 2', 35000, 'electronics', 50),
('상품명 3', '상품 설명 3', 15000, 'food', 200);
```

## 주의사항

- `is_active`가 `false`인 상품은 웹사이트에 표시되지 않습니다
- `stock_quantity`가 0이면 "품절"로 표시됩니다
- `price`는 0 이상의 숫자여야 합니다
- `category`는 위에 나열된 카테고리 ID 중 하나를 사용해야 올바르게 표시됩니다

## 향후 개선 사항

Phase 6 이후에 어드민 페이지를 구현할 계획입니다:

- 상품 등록/수정/삭제 UI
- 이미지 업로드 기능
- 대량 등록 기능
- 상품 통계 대시보드
