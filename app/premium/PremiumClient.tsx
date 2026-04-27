'use client'
// =====================================================
// app/premium/PremiumClient.tsx
// 실제 UI 로직 — Server Component에서 searchParams를
// prop으로 받아 사용합니다. useSearchParams() 미사용.
// =====================================================

import { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS, type Product, type ProductId } from '@/lib/payment/products'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

type OrderState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; orderId: string; amount: number }
  | { status: 'error'; message: string }

function getStr(p: Props['searchParams'], key: string, fallback = ''): string {
  const v = p[key]
  return typeof v === 'string' ? v : fallback
}

export default function PremiumClient({ searchParams }: Props) {
  const year       = getStr(searchParams, 'year')
  const month      = getStr(searchParams, 'month')
  const day        = getStr(searchParams, 'day')
  const hour       = getStr(searchParams, 'hour', 'unknown')
  const gender     = getStr(searchParams, 'gender')
  const calendar   = getStr(searchParams, 'calendar', 'solar')
  const initProdId = (getStr(searchParams, 'productId', 'saju-classic')) as ProductId

  const hasInput    = !!(year && month && day && gender)
  const inputParams = hasInput
    ? new URLSearchParams({ year, month, day, hour, gender, calendar }).toString()
    : ''

  const [selectedId, setSelectedId] = useState<ProductId>(initProdId)
  const [orderState, setOrderState] = useState<OrderState>({ status: 'idle' })

  const selected = PRODUCTS.find(p => p.id === selectedId) ?? PRODUCTS[0]

  async function handleOrder() {
    if (!hasInput) return
    setOrderState({ status: 'loading' })
    try {
      const res  = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId:    selectedId,
          year:         Number(year),
          month:        Number(month),
          day:          Number(day),
          hour:         hour === 'unknown' ? null : Number(hour),
          gender,
          calendarType: calendar,
        }),
      })
      const data = await res.json()
      if (!data.ok) {
        setOrderState({ status: 'error', message: data.message ?? '주문 생성에 실패했어요.' })
        return
      }
      setOrderState({ status: 'ready', orderId: data.orderId, amount: data.amount })
      // TODO: Toss 위젯 열기
      alert(`주문 생성 완료 (샌드박스)\norderId: ${data.orderId}\n금액: ${data.amount.toLocaleString()}원`)
    } catch {
      setOrderState({ status: 'error', message: '네트워크 오류가 발생했어요.' })
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 pt-8 pb-24"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm">

        {/* 헤더 */}
        <div className="mb-7">
          <Link
            href={hasInput ? `/result?${inputParams}` : '/'}
            className="flex items-center gap-1.5 text-xs mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            {hasInput ? '← 무료 결과로' : '← 홈으로'}
          </Link>

          <p className="label-overline mb-2">리포트 선택</p>
          <h1
            className="font-serif text-xl font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            원하는 리포트를 선택해 주세요
          </h1>
          {hasInput && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              {calendar === 'lunar' ? '음력' : '양력'} {year}년 {month}월 {day}일 · {gender === 'male' ? '남성' : '여성'}
            </p>
          )}
        </div>

        {/* 상품 선택 */}
        <div className="space-y-2 mb-6">
          {PRODUCTS.filter(p => !p.isBundle).map((p: Product) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="w-full text-left rounded-xl p-4 transition-all"
              style={{
                background: selectedId === p.id ? 'var(--bg-elevated)' : 'var(--bg-card)',
                border: `1px solid ${selectedId === p.id ? 'var(--border-gold-md)' : 'var(--border-gold)'}`,
                boxShadow: selectedId === p.id ? 'inset 0 1px 0 rgba(180,140,80,0.12)' : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      border: `1.5px solid ${selectedId === p.id ? 'var(--accent-gold)' : 'var(--border-gold)'}`,
                      background: selectedId === p.id ? 'var(--accent-gold)' : 'transparent',
                    }}
                  >
                    {selectedId === p.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {p.shortName}
                      </span>
                      {p.badge && <span className="badge-gold">{p.badge}</span>}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {p.tagline}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold shrink-0 ml-3"
                  style={{ color: selectedId === p.id ? 'var(--text-gold)' : 'var(--text-secondary)' }}
                >
                  {p.price.toLocaleString()}원
                </span>
              </div>
            </button>
          ))}

          {/* 올인원 패키지 */}
          {PRODUCTS.filter(p => p.isBundle).map((p: Product) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="w-full text-left rounded-xl p-4 transition-all"
              style={{
                background: selectedId === p.id ? 'rgba(139,109,53,0.15)' : 'var(--bg-card)',
                border: `1px solid ${selectedId === p.id ? 'var(--border-gold-md)' : 'var(--border-gold)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      border: `1.5px solid ${selectedId === p.id ? 'var(--accent-gold)' : 'var(--border-gold)'}`,
                      background: selectedId === p.id ? 'var(--accent-gold)' : 'transparent',
                    }}
                  >
                    {selectedId === p.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {p.shortName}
                    </span>
                    {p.badge && <span className="badge-gold">{p.badge}</span>}
                  </div>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: 'var(--text-gold)' }}>
                  {p.price.toLocaleString()}원
                </span>
              </div>
              <p className="text-xs pl-6" style={{ color: 'var(--text-muted)' }}>
                모든 리포트 포함 · 개별 구매 대비 25,700원 절약
              </p>
            </button>
          ))}
        </div>

        {/* 포함 항목 */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            포함 항목
          </p>
          <ul className="space-y-2">
            {selected.includes.map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-xs" style={{ color: 'var(--accent-gold)' }}>✓</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 에러 */}
        {orderState.status === 'error' && (
          <div
            className="rounded-xl p-4 mb-4 text-sm"
            style={{ background: 'rgba(150,50,50,0.15)', border: '1px solid rgba(150,50,50,0.3)', color: '#f5a0a0' }}
          >
            {orderState.message}
          </div>
        )}

        {/* 결제 버튼 */}
        <button
          onClick={handleOrder}
          disabled={!hasInput || orderState.status === 'loading'}
          className="btn-primary w-full py-4 text-sm font-semibold disabled:opacity-50"
        >
          {orderState.status === 'loading'
            ? '처리 중...'
            : `${selected.price.toLocaleString()}원 · ${selected.shortName} 시작하기`
          }
        </button>

        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          PDF 즉시 발급 · 환불 불가 · Toss Payments 안전 결제
        </p>
      </div>
    </main>
  )
}
