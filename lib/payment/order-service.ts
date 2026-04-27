// =====================================================
// lib/payment/order-service.ts
//
// 주문 비즈니스 로직 (저장소와 분리)
// =====================================================

import type { Order } from '@/lib/types/payment'
import type { CreateOrderBody } from '@/lib/security/validators'
import { getOrderRepository } from './order-repository'
import { PRODUCTS } from '@/lib/payment/products'
import {
  orderNotFound,
  amountMismatch,
  alreadyPaid,
  internalError,
} from '@/lib/security/errors'

// ── 주문 ID 생성 ──────────────────────────────────────
// 형식: saju_{타임스탬프}_{랜덤 6자리}
// 예:   saju_1719000000000_a3f9c2
function generateOrderId(): string {
  const ts   = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `saju_${ts}_${rand}`
}

// ── 주문 생성 ─────────────────────────────────────────

export async function createOrder(
  body: CreateOrderBody
): Promise<Pick<Order, 'orderId' | 'amount' | 'orderName'>> {
  const product = PRODUCTS.find(p => p.id === body.productId)
  if (!product) {
    throw internalError(`Unknown productId: ${body.productId}`)
  }

  const repo    = getOrderRepository()
  const orderId = generateOrderId()

  const order: Order = {
    orderId,
    productId:  product.id,
    orderName:  product.name,
    amount:     product.price,   // ← 서버가 금액 확정. 클라이언트 값 무시
    status:     'created',
    birthInput: {
      year:         body.year,
      month:        body.month,
      day:          body.day,
      hour:         body.hour,
      gender:       body.gender,
      calendarType: body.calendarType,
    },
    createdAt:     Date.now(),
    downloadCount: 0,
  }

  await repo.create(order)

  return {
    orderId:   order.orderId,
    amount:    order.amount,
    orderName: order.orderName,
  }
}

// ── 주문 조회 ─────────────────────────────────────────

export async function getOrder(orderId: string): Promise<Order> {
  const repo  = getOrderRepository()
  const order = await repo.findById(orderId)
  if (!order) throw orderNotFound()
  return order
}

// ── 결제 confirm 전 검증 ──────────────────────────────
// 반환: { order, isAlreadyPaid }
// isAlreadyPaid=true면 중복 confirm → 기존 paid 주문 반환 (멱등성)

export async function validateAndMarkPaid(
  orderId:    string,
  paymentKey: string,
  amount:     number,
): Promise<{ order: Order; isAlreadyPaid: boolean }> {
  const repo  = getOrderRepository()
  const order = await repo.findById(orderId)

  if (!order) throw orderNotFound()

  // 중복 confirm 처리 — 이미 paid면 멱등성 유지 (에러 X)
  if (order.status === 'paid' || order.status === 'consumed') {
    return { order, isAlreadyPaid: true }
  }

  // 금액 불일치 검증 (클라이언트가 amount를 변조해도 차단)
  if (order.amount !== amount) {
    await repo.updateStatus(orderId, 'failed', {
      lastError: `Amount mismatch: expected=${order.amount}, got=${amount}`,
    })
    throw amountMismatch(order.amount, amount)
  }

  // 상태 paid로 전이
  await repo.updateStatus(orderId, 'paid', {
    paymentKey,
    paidAt: Date.now(),
  })

  const paid = await repo.findById(orderId)
  return { order: paid!, isAlreadyPaid: false }
}

// ── 다운로드 카운트 증가 ──────────────────────────────

export async function recordDownload(orderId: string): Promise<void> {
  const repo  = getOrderRepository()
  const order = await repo.findById(orderId)
  if (!order) return
  await repo.updateStatus(orderId, order.status, {
    downloadedAt:  Date.now(),
    downloadCount: (order.downloadCount ?? 0) + 1,
  })
}
