// =====================================================
// lib/payment/toss.ts
//
// Toss Payments 서버 승인 API 호출
// ─────────────────────────────────────────────────────
// 원칙:
//   - TOSS_SECRET_KEY는 이 파일(서버)에서만 사용
//   - 절대 NEXT_PUBLIC_ 접두사 없음
//   - 로그에 secret key 출력 금지
// =====================================================

import { tossConfirmFailed } from '@/lib/security/errors'

const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm'

// Authorization 헤더 생성 (Basic Base64(secretKey:))
function buildAuthHeader(): string {
  const secret = process.env.TOSS_SECRET_KEY
  if (!secret) {
    throw tossConfirmFailed('TOSS_SECRET_KEY 환경변수가 설정되지 않았어요')
  }
  // Node.js 환경에서 btoa가 없으면 Buffer 사용
  const encoded = typeof btoa !== 'undefined'
    ? btoa(`${secret}:`)
    : Buffer.from(`${secret}:`).toString('base64')
  return `Basic ${encoded}`
}

// Toss confirm API 응답 타입 (필요한 필드만)
type TossConfirmResponse = {
  paymentKey: string
  orderId:    string
  orderName:  string
  status:     string    // 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' 등
  totalAmount: number
  approvedAt: string    // ISO8601
  method:     string
}

/**
 * Toss Payments confirm API를 호출해요.
 * 성공 시 Toss 응답 반환.
 * 실패 시 AppError(TOSS_CONFIRM_FAILED) throw.
 */
export async function callTossConfirm(params: {
  paymentKey: string
  orderId:    string
  amount:     number
}): Promise<TossConfirmResponse> {
  let response: Response

  try {
    response = await fetch(TOSS_CONFIRM_URL, {
      method:  'POST',
      headers: {
        Authorization:  buildAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: params.paymentKey,
        orderId:    params.orderId,
        amount:     params.amount,
      }),
    })
  } catch (networkErr) {
    throw tossConfirmFailed(`Network error: ${String(networkErr)}`)
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw tossConfirmFailed(`Invalid JSON from Toss: status=${response.status}`)
  }

  if (!response.ok) {
    // Toss 에러 응답 (code/message 포함 가능)
    const b = body as { code?: string; message?: string }
    // 에러 코드는 서버 로그에만 (클라이언트 노출 금지)
    throw tossConfirmFailed(
      `Toss API error: status=${response.status} code=${b?.code ?? 'unknown'}`
    )
  }

  const res = body as TossConfirmResponse

  // 최종 상태 확인
  if (res.status !== 'DONE') {
    throw tossConfirmFailed(`Unexpected Toss status: ${res.status}`)
  }

  return res
}
