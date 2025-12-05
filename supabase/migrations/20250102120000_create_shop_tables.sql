-- ==========================================
-- 쇼핑몰 테이블 생성 마이그레이션
-- products, cart_items, orders, order_items 테이블 생성
-- RLS 비활성화 (개발 환경)
-- ==========================================

-- 1. 상품 테이블 생성
create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null check (price >= 0),
    category text,
    stock_quantity integer default 0 check (stock_quantity >= 0),
    is_active boolean default true,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

comment on table public.products is '쇼핑몰 상품 정보를 저장하는 테이블';

-- 2. 장바구니 테이블 생성
create table if not exists public.cart_items (
    id uuid default gen_random_uuid() primary key,
    clerk_id text not null,
    product_id uuid not null references public.products(id) on delete cascade,
    quantity integer not null default 1 check (quantity > 0),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    unique(clerk_id, product_id)
);

comment on table public.cart_items is '사용자 장바구니 아이템을 저장하는 테이블 (clerk_id로 사용자 식별)';

-- 3. 주문 테이블 생성
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    clerk_id text not null,
    total_amount decimal(10,2) not null check (total_amount >= 0),
    status text not null default 'pending'
        check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    shipping_address jsonb,
    order_note text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

comment on table public.orders is '주문 정보를 저장하는 테이블 (clerk_id로 사용자 식별)';

-- 4. 주문 상세 테이블 생성
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete restrict,
    product_name text not null,
    quantity integer not null check (quantity > 0),
    price decimal(10,2) not null check (price >= 0),
    created_at timestamp with time zone default now() not null
);

comment on table public.order_items is '주문 상세 아이템을 저장하는 테이블 (주문 시점의 상품 정보 스냅샷)';

-- 5. updated_at 자동 갱신 함수 생성
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

comment on function update_updated_at_column() is 'updated_at 컬럼을 자동으로 갱신하는 트리거 함수';

-- 6. updated_at 트리거 등록
create trigger set_updated_at_products
    before update on public.products
    for each row
    execute function update_updated_at_column();

create trigger set_updated_at_cart_items
    before update on public.cart_items
    for each row
    execute function update_updated_at_column();

create trigger set_updated_at_orders
    before update on public.orders
    for each row
    execute function update_updated_at_column();

-- 7. 인덱스 생성 (성능 최적화)
create index if not exists idx_cart_items_clerk_id on public.cart_items(clerk_id);
create index if not exists idx_cart_items_product_id on public.cart_items(product_id);
create index if not exists idx_orders_clerk_id on public.orders(clerk_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_is_active on public.products(is_active);

-- 8. RLS 비활성화 (개발 환경)
-- 프로덕션에서는 RLS를 활성화하고 적절한 정책을 설정해야 합니다
alter table public.products disable row level security;
alter table public.cart_items disable row level security;
alter table public.orders disable row level security;
alter table public.order_items disable row level security;

-- 9. 테이블 소유자 설정
alter table public.products owner to postgres;
alter table public.cart_items owner to postgres;
alter table public.orders owner to postgres;
alter table public.order_items owner to postgres;

-- 10. 권한 부여
grant all on table public.products to anon, authenticated, service_role;
grant all on table public.cart_items to anon, authenticated, service_role;
grant all on table public.orders to anon, authenticated, service_role;
grant all on table public.order_items to anon, authenticated, service_role;
