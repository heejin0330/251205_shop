# Toss Payments 설정 가이드

## 환경변수 설정

`.env.local` 파일에 다음 환경변수를 추가하세요:

```bash
# Toss Payments (테스트 모드)
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_...
TOSS_PAYMENTS_SECRET_KEY=test_sk_...
TOSS_PAYMENTS_API_URL=https://api.tosspayments.com/v1

# App URL (결제 콜백용)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 테스트 키 발급

1. [Toss Payments 개발자 센터](https://developers.tosspayments.com/)에 접속
2. 테스트 계정으로 로그인
3. 테스트 키 발급:
   - Client Key: `test_ck_...` 형식
   - Secret Key: `test_sk_...` 형식

## 결제 플로우

1. **주문 생성**: 사용자가 배송지 정보 입력 후 주문 생성 (`/checkout`)
2. **결제 페이지**: 주문 생성 후 결제 페이지로 리다이렉트 (`/payments/[orderId]`)
3. **결제 위젯**: Toss Payments 위젯이 표시되고 사용자가 결제 수단 선택
4. **결제 요청**: 사용자가 결제하기 버튼 클릭
5. **결제 승인**: Toss Payments에서 결제 성공 시 `/payments/success`로 리다이렉트
6. **주문 상태 업데이트**: 서버에서 결제 승인 API 호출 후 주문 상태를 `confirmed`로 변경
7. **주문 완료**: 주문 상세 페이지로 리다이렉트 (`/orders/[orderId]`)

## 테스트 결제 방법

Toss Payments 테스트 모드에서는 다음 테스트 카드 정보를 사용할 수 있습니다:

- **카드번호**: 4242 4242 4242 4242
- **유효기간**: 12/34
- **CVC**: 123
- **비밀번호**: 12 34 56

## 주의사항

- **테스트 모드 전용**: 프로덕션에서는 반드시 실제 키로 교체해야 합니다
- **환경변수 보안**: Secret Key는 절대 클라이언트에 노출되지 않도록 주의
- **콜백 URL**: `NEXT_PUBLIC_APP_URL`은 배포 환경에 맞게 설정해야 합니다
