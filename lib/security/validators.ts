// =====================================================
// lib/security/validators.ts
//
// 모든 서버 API의 입력값 검증 함수
// ─────────────────────────────────────────────────────
// 원칙:
//   - 외부 입력(query, body, header)을 절대 신뢰하지 않음
//   - 검증 실패 시 조기 반환
//   - null/undefined/빈 문자열/NaN 전부 방어
// =====================================================

// ── 문자열 검증 ───────────────────────────────────────

/** 빈 문자열·null·undefined 아닌 안전한 문자열인지 확인 */
export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

/** 정수 문자열인지 확인 (양수 한정) */
export function isPositiveIntString(v: unknown): v is string {
  if (typeof v !== 'string') return false
  const n = Number(v)
  return Number.isInteger(n) && n > 0
}

// ── 주문 생성 요청 검증 ───────────────────────────────

export type CreateOrderBody = {
  productId:   string
  year:        number
  month:       number
  day:         number
  hour:        number | null
  gender:      'male' | 'female'
  calendarType: 'solar' | 'lunar'
}

type ValidationResult<T> =
  | { ok: true;  data: T }
  | { ok: false; message: string }

export function validateCreateOrderBody(
  raw: unknown
): ValidationResult<CreateOrderBody> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: '요청 본문이 없어요' }
  }

  const b = raw as Record<string, unknown>

  if (!isNonEmptyString(b.productId)) {
    return { ok: false, message: 'productId가 없어요' }
  }

  const year  = Number(b.year)
  const month = Number(b.month)
  const day   = Number(b.day)

  if (!Number.isInteger(year)  || year  < 1900 || year  > 2025) {
    return { ok: false, message: '연도가 올바르지 않아요' }
  }
  if (!Number.isInteger(month) || month < 1    || month > 12) {
    return { ok: false, message: '월이 올바르지 않아요' }
  }
  if (!Number.isInteger(day)   || day   < 1    || day   > 31) {
    return { ok: false, message: '일이 올바르지 않아요' }
  }

  let hour: number | null = null
  if (b.hour !== null && b.hour !== undefined && b.hour !== 'unknown') {
    const h = Number(b.hour)
    if (!Number.isInteger(h) || h < 0 || h > 23) {
      return { ok: false, message: '출생 시간이 올바르지 않아요' }
    }
    hour = h
  }

  if (b.gender !== 'male' && b.gender !== 'female') {
    return { ok: false, message: '성별이 올바르지 않아요' }
  }

  if (b.calendarType !== 'solar' && b.calendarType !== 'lunar') {
    return { ok: false, message: '양력/음력 값이 올바르지 않아요' }
  }

  return {
    ok: true,
    data: {
      productId:    b.productId as string,
      year,
      month,
      day,
      hour,
      gender:       b.gender as 'male' | 'female',
      calendarType: b.calendarType as 'solar' | 'lunar',
    },
  }
}

// ── 결제 confirm 요청 검증 ────────────────────────────

export type ConfirmPaymentBody = {
  paymentKey: string
  orderId:    string
  amount:     number
}

export function validateConfirmBody(
  raw: unknown
): ValidationResult<ConfirmPaymentBody> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: '요청 본문이 없어요' }
  }

  const b = raw as Record<string, unknown>

  if (!isNonEmptyString(b.paymentKey)) {
    return { ok: false, message: 'paymentKey가 없어요' }
  }

  if (!isNonEmptyString(b.orderId)) {
    return { ok: false, message: 'orderId가 없어요' }
  }

  // paymentKey 길이 상한 (Toss paymentKey는 200자 이하)
  if (b.paymentKey.length > 300) {
    return { ok: false, message: 'paymentKey 형식이 올바르지 않아요' }
  }

  // orderId 형식 체크 (우리가 생성한 형식: saju_숫자_랜덤)
  if (b.orderId.length > 100 || !/^[a-zA-Z0-9_\-]+$/.test(b.orderId)) {
    return { ok: false, message: 'orderId 형식이 올바르지 않아요' }
  }

  const amount = Number(b.amount)
  if (!Number.isInteger(amount) || amount <= 0 || amount > 10_000_000) {
    return { ok: false, message: 'amount 값이 올바르지 않아요' }
  }

  return {
    ok: true,
    data: {
      paymentKey: b.paymentKey as string,
      orderId:    b.orderId    as string,
      amount,
    },
  }
}

// ── 다운로드 토큰 쿼리 파라미터 검증 ─────────────────

export function validateDownloadToken(
  raw: unknown
): ValidationResult<{ token: string }> {
  if (!isNonEmptyString(raw)) {
    return { ok: false, message: '다운로드 토큰이 없어요' }
  }

  // 토큰은 base64url 형식 (점(.) 포함 가능)
  if (raw.length > 2000 || !/^[A-Za-z0-9._\-]+$/.test(raw)) {
    return { ok: false, message: '토큰 형식이 올바르지 않아요' }
  }

  return { ok: true, data: { token: raw } }
}
