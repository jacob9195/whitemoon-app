// =====================================================
// app/api/payments/confirm/route.ts
//
// POST /api/payments/confirm
//
// 흐름:
//   1. 입력값 검증 (paymentKey, orderId, amount)
//   2. 저장소에서 주문 조회
//   3. 금액 불일치 검증
//   4. 중복 confirm 멱등성 처리
//   5. Toss confirm API 호출
//   6. 주문 상태 → paid
//   7. 다운로드 토큰 발급 후 반환
//
// 보안:
//   - 클라이언트 amount를 절대 신뢰하지 않음 (서버 주문 금액과 비교)
//   - 이미 paid 주문 재호출 → 기존 토큰 재발급 (멱등성)
//   - secret key는 환경변수에서만 (클라이언트 노출 금지)
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { validateConfirmBody } from '@/lib/security/validators'
import { validateAndMarkPaid } from '@/lib/payment/order-service'
import { callTossConfirm } from '@/lib/payment/toss'
import { issueDownloadToken } from '@/lib/payment/download-auth'
import { logServerError, toErrorResponse, invalidInput } from '@/lib/security/errors'

export async function POST(req: NextRequest) {
  try {
    // 1. body 파싱
    let raw: unknown
    try {
      raw = await req.json()
    } catch {
      return NextResponse.json(
        { ok: false, code: 'INVALID_INPUT', message: '요청 본문이 올바른 JSON이 아니에요' },
        { status: 400 }
      )
    }

    // 2. 입력값 검증
    const validation = validateConfirmBody(raw)
    if (!validation.ok) {
      const err = invalidInput(validation.message)
      const r = toErrorResponse(err)
      return NextResponse.json(r.body, { status: r.status })
    }

    const { paymentKey, orderId, amount } = validation.data

    // 3. 주문 조회 + 금액 검증 + 중복 처리
    // isAlreadyPaid=true → 멱등성: 이미 paid인 주문이면 기존 상태 유지
    const { order, isAlreadyPaid } = await validateAndMarkPaid(orderId, paymentKey, amount)

    // 4. Toss confirm API 호출 (중복이 아닌 경우에만)
    if (!isAlreadyPaid) {
      await callTossConfirm({ paymentKey, orderId, amount: order.amount })
      // Toss 승인 성공 → 이미 validateAndMarkPaid에서 paid로 변경됨
    }
    // 중복이면: Toss는 이미 처리됐으므로 다시 호출하지 않음

    // 5. 다운로드 토큰 발급 (TTL: 1시간)
    const downloadToken = issueDownloadToken(order.orderId, order.productId)

    return NextResponse.json({
      ok:            true,
      downloadToken,
      orderId:       order.orderId,
      paidAt:        order.paidAt ?? Date.now(),
    })

  } catch (err) {
    logServerError('POST /api/payments/confirm', err)
    const r = toErrorResponse(err)
    return NextResponse.json(r.body, { status: r.status })
  }
}
