// =====================================================
// app/api/orders/create/route.ts
//
// POST /api/orders/create
// 주문을 서버에서 생성하고 orderId/amount를 반환해요.
//
// 보안: 금액은 서버가 확정. 클라이언트가 보낸 금액은 무시.
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { validateCreateOrderBody } from '@/lib/security/validators'
import { createOrder } from '@/lib/payment/order-service'
import { logServerError, toErrorResponse, invalidInput } from '@/lib/security/errors'
import { PRODUCTS } from '@/lib/payment/products'

export async function POST(req: NextRequest) {
  try {
    // 1. body 파싱
    let raw: unknown
    try {
      raw = await req.json()
    } catch {
      const err = invalidInput('요청 본문이 올바른 JSON이 아니에요')
      const r = toErrorResponse(err)
      return NextResponse.json(r.body, { status: r.status })
    }

    // 2. 입력값 검증
    const validation = validateCreateOrderBody(raw)
    if (!validation.ok) {
      const err = invalidInput(validation.message)
      const r = toErrorResponse(err)
      return NextResponse.json(r.body, { status: r.status })
    }

    const body = validation.data

    // 3. 상품 존재 확인
    const product = PRODUCTS.find(p => p.id === body.productId)
    if (!product) {
      const err = invalidInput('존재하지 않는 상품이에요')
      const r = toErrorResponse(err)
      return NextResponse.json(r.body, { status: r.status })
    }

    // 4. 주문 생성 (서버가 금액 확정)
    const order = await createOrder(body)

    return NextResponse.json({
      ok:        true,
      orderId:   order.orderId,
      amount:    order.amount,     // 서버 확정 금액
      orderName: order.orderName,
    } satisfies { ok: true; orderId: string; amount: number; orderName: string })

  } catch (err) {
    logServerError('POST /api/orders/create', err)
    const r = toErrorResponse(err)
    return NextResponse.json(r.body, { status: r.status })
  }
}
