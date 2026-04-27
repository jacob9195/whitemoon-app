// =====================================================
// lib/payment/order-repository.ts
//
// 주문 저장소 — 인터페이스와 메모리 구현체 분리
// ─────────────────────────────────────────────────────
// 지금: Node.js 프로세스 메모리 (Map) 사용
//   → Vercel serverless는 요청마다 재시작될 수 있어 메모리가 휘발됨
//   → 지금은 데모/테스트 용도
//
// 나중에 Supabase/PostgreSQL로 교체하려면:
//   SupabaseOrderRepository를 구현하고 createOrderRepository()에서 반환하면 됨
//
// 중요: 이 파일은 서버 전용 (route handler에서만 import)
// =====================================================

import type { Order, OrderStatus } from '@/lib/types/payment'

// ── 인터페이스 정의 ───────────────────────────────────

export interface OrderRepository {
  /** 주문 생성 */
  create(order: Order): Promise<void>

  /** orderId로 주문 조회 */
  findById(orderId: string): Promise<Order | null>

  /** 주문 상태 전이 */
  updateStatus(
    orderId: string,
    status:  OrderStatus,
    extra?:  Partial<Pick<Order, 'paymentKey' | 'tossStatus' | 'paidAt' | 'downloadedAt' | 'downloadCount' | 'lastError'>>
  ): Promise<void>
}

// ── 메모리 구현체 (개발/데모용) ───────────────────────
// ⚠️ 서버 재시작 시 데이터 휘발됨
// ⚠️ Vercel 서버리스에서는 요청 간 공유 안 될 수 있음
// → 프로덕션에서는 반드시 Supabase/DB 구현체로 교체

class InMemoryOrderRepository implements OrderRepository {
  private store: Map<string, Order> = new Map()

  async create(order: Order): Promise<void> {
    this.store.set(order.orderId, { ...order })
  }

  async findById(orderId: string): Promise<Order | null> {
    return this.store.get(orderId) ?? null
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    extra?: Partial<Pick<Order, 'paymentKey' | 'tossStatus' | 'paidAt' | 'downloadedAt' | 'downloadCount' | 'lastError'>>
  ): Promise<void> {
    const order = this.store.get(orderId)
    if (!order) return
    this.store.set(orderId, { ...order, status, ...extra })
  }
}

// ── 싱글톤 팩토리 ─────────────────────────────────────
// 프로세스 내에서 동일 인스턴스를 공유
// Supabase 연동 시: new SupabaseOrderRepository() 로 교체

let _repo: OrderRepository | null = null

export function getOrderRepository(): OrderRepository {
  if (!_repo) {
    // TODO: 환경변수 SUPABASE_URL이 있으면 SupabaseOrderRepository 반환
    // if (process.env.SUPABASE_URL) {
    //   _repo = new SupabaseOrderRepository()
    // } else {
    _repo = new InMemoryOrderRepository()
    // }
  }
  return _repo
}
