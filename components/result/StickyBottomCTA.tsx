'use client'
// =====================================================
// components/result/StickyBottomCTA.tsx
// 모바일 하단 고정 CTA
// =====================================================

import Link from 'next/link'
import { FEATURED_PRODUCT } from '@/lib/payment/products'

type Props = { inputParams: string }

export default function StickyBottomCTA({ inputParams }: Props) {
  const product = FEATURED_PRODUCT
  const href    = `/premium?productId=${product.id}&${inputParams}`

  return (
    <div
      className="no-print fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
      style={{
        background: 'linear-gradient(to top, var(--bg-base) 60%, transparent)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        paddingTop: '20px',
      }}
    >
      <div className="max-w-sm mx-auto">
        <Link
          href={href}
          className="btn-primary flex items-center justify-between w-full px-5 py-3.5"
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            상세 리포트 열어보기
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: 'var(--text-gold)' }}
          >
            {product.price.toLocaleString()}원 →
          </span>
        </Link>
      </div>
    </div>
  )
}
