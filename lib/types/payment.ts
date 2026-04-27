// =====================================================
// lib/types/payment.ts
//
// 결제·주문·다운로드 토큰 관련 타입 정의
// =====================================================

// ── 주문 상태 ─────────────────────────────────────────
// created  : 주문 생성됨 (결제 전)
// pending  : Toss 결제창 열림 (진행 중)
// paid     : 서버 confirm 완료 (PDF 발급 가능)
// failed   : 결제 실패
// cancelled: 사용자 취소
// consumed : 다운로드 완료 (선택: 1회 제한 정책 시 사용)
export type OrderStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'consumed'

// ── 주문 레코드 ───────────────────────────────────────
export type Order = {
  orderId:       string        // 서버가 생성한 고유 ID (e.g. saju_1234567890_abc)
  productId:     string        // 상품 ID (e.g. 'saju-basic')
  orderName:     string        // 결제창 표시 이름
  amount:        number        // 서버가 확정한 금액 (원, 클라이언트 값 무시)
  status:        OrderStatus
  // 사주 입력값 — PDF 생성에 사용 (결제 후 입력값 분실 방지)
  birthInput: {
    year:         number
    month:        number
    day:          number
    hour:         number | null
    gender:       'male' | 'female'
    calendarType: 'solar' | 'lunar'
  }
  // Toss 승인 결과 (confirm 후 채워짐)
  paymentKey?:   string
  tossStatus?:   string        // Toss가 반환하는 status (e.g. 'DONE')
  // 타임스탬프
  createdAt:     number        // Date.now()
  paidAt?:       number
  downloadedAt?: number        // 마지막 다운로드 시각
  downloadCount: number        // 다운로드 횟수 (0부터 시작)
  // 오류 기록
  lastError?:    string
}

// ── 다운로드 토큰 페이로드 ────────────────────────────
// HMAC-SHA256 으로 서명되는 페이로드
// 위조·변조 시 서명 불일치로 차단
export type DownloadTokenPayload = {
  orderId:   string
  productId: string
  issuedAt:  number  // Date.now()
  expiresAt: number  // issuedAt + TTL_MS
  // nonce: 동일 페이로드 재사용 방지 (선택)
  nonce:     string
}

// ── API 응답 타입 ─────────────────────────────────────

// POST /api/orders/create
export type CreateOrderResponse =
  | {
      ok: true
      orderId:   string
      amount:    number
      orderName: string
    }
  | { ok: false; code: string; message: string }

// POST /api/payments/confirm
export type ConfirmPaymentResponse =
  | {
      ok: true
      downloadToken: string   // 서명된 1회성 토큰 (TTL 1h)
      orderId:       string
      paidAt:        number
    }
  | { ok: false; code: string; message: string }

// GET /api/pdf (성공 시 binary stream, 실패 시 JSON)
export type PdfErrorResponse = {
  ok: false
  code: string
  message: string
}

// ── 에러 코드 상수 ────────────────────────────────────
export const PaymentErrorCode = {
  // 주문 생성
  INVALID_INPUT:         'INVALID_INPUT',
  UNKNOWN_PRODUCT:       'UNKNOWN_PRODUCT',
  // confirm
  MISSING_PARAMS:        'MISSING_PARAMS',
  ORDER_NOT_FOUND:       'ORDER_NOT_FOUND',
  AMOUNT_MISMATCH:       'AMOUNT_MISMATCH',
  ALREADY_PAID:          'ALREADY_PAID',
  TOSS_CONFIRM_FAILED:   'TOSS_CONFIRM_FAILED',
  // PDF
  TOKEN_MISSING:         'TOKEN_MISSING',
  TOKEN_INVALID:         'TOKEN_INVALID',
  TOKEN_EXPIRED:         'TOKEN_EXPIRED',
  ORDER_NOT_PAID:        'ORDER_NOT_PAID',
  PDF_GENERATION_FAILED: 'PDF_GENERATION_FAILED',
  // 공통
  INTERNAL_ERROR:        'INTERNAL_ERROR',
} as const

export type PaymentErrorCodeType = typeof PaymentErrorCode[keyof typeof PaymentErrorCode]
