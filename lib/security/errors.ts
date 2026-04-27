// =====================================================
// lib/security/errors.ts
//
// 구조화된 에러 타입 — 사용자용/개발자용 메시지 분리
// ─────────────────────────────────────────────────────
// 원칙:
//   - 사용자에게는 친절한 한국어 메시지만
//   - 스택 트레이스·내부 정보는 절대 외부 노출 금지
//   - HTTP 상태코드와 에러 코드를 분리
// =====================================================

import { PaymentErrorCode, type PaymentErrorCodeType } from '@/lib/types/payment'

// ── API 에러 클래스 ───────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly code:       PaymentErrorCodeType,
    public readonly userMsg:    string,   // 클라이언트 응답에 포함
    public readonly httpStatus: number,   // HTTP 상태코드
    public readonly devDetail?: string,   // 서버 로그에만 기록
  ) {
    super(devDetail ?? userMsg)
    this.name = 'AppError'
  }
}

// ── 자주 쓰는 에러 팩토리 ────────────────────────────

export function invalidInput(msg: string): AppError {
  return new AppError(PaymentErrorCode.INVALID_INPUT, msg, 400)
}

export function orderNotFound(): AppError {
  return new AppError(
    PaymentErrorCode.ORDER_NOT_FOUND,
    '주문을 찾을 수 없어요. 다시 결제를 시도해 주세요.',
    404,
  )
}

export function amountMismatch(expected: number, got: number): AppError {
  return new AppError(
    PaymentErrorCode.AMOUNT_MISMATCH,
    '결제 금액이 일치하지 않아요. 고객센터에 문의해 주세요.',
    400,
    `Amount mismatch: expected=${expected}, got=${got}`,
  )
}

export function alreadyPaid(orderId: string): AppError {
  return new AppError(
    PaymentErrorCode.ALREADY_PAID,
    '이미 승인 완료된 주문이에요.',
    409,
    `Duplicate confirm attempt: orderId=${orderId}`,
  )
}

export function tossConfirmFailed(detail: string): AppError {
  return new AppError(
    PaymentErrorCode.TOSS_CONFIRM_FAILED,
    '결제 승인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
    502,
    `Toss confirm failed: ${detail}`,
  )
}

export function tokenInvalid(): AppError {
  return new AppError(
    PaymentErrorCode.TOKEN_INVALID,
    '다운로드 권한이 유효하지 않아요. 결제 완료 페이지에서 다시 시도해 주세요.',
    403,
  )
}

export function tokenExpired(): AppError {
  return new AppError(
    PaymentErrorCode.TOKEN_EXPIRED,
    '다운로드 링크가 만료됐어요. 결제 완료 페이지로 돌아가서 다시 다운로드해 주세요.',
    403,
  )
}

export function orderNotPaid(): AppError {
  return new AppError(
    PaymentErrorCode.ORDER_NOT_PAID,
    '결제가 완료되지 않은 주문이에요.',
    403,
  )
}

export function pdfGenerationFailed(): AppError {
  return new AppError(
    PaymentErrorCode.PDF_GENERATION_FAILED,
    'PDF 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
    500,
  )
}

export function internalError(devDetail: string): AppError {
  return new AppError(
    PaymentErrorCode.INTERNAL_ERROR,
    '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
    500,
    devDetail,
  )
}

// ── 서버 로거 (스택 트레이스를 외부에 노출 금지) ──────

export function logServerError(context: string, err: unknown): void {
  const ts = new Date().toISOString()
  if (err instanceof AppError) {
    console.error(`[${ts}] [${context}] ${err.code}: ${err.devDetail ?? err.userMsg}`)
  } else if (err instanceof Error) {
    // 스택 트레이스는 서버 로그에만 (클라이언트 응답 아님)
    console.error(`[${ts}] [${context}] Unexpected error: ${err.message}`)
  } else {
    console.error(`[${ts}] [${context}] Unknown error:`, String(err))
  }
}

// ── 통일된 에러 응답 생성 ─────────────────────────────

export function toErrorResponse(err: unknown): {
  body:   { ok: false; code: string; message: string }
  status: number
} {
  if (err instanceof AppError) {
    return {
      body:   { ok: false, code: err.code, message: err.userMsg },
      status: err.httpStatus,
    }
  }
  return {
    body:   { ok: false, code: PaymentErrorCode.INTERNAL_ERROR, message: '서버 오류가 발생했어요.' },
    status: 500,
  }
}
