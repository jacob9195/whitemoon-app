// components/result/PremiumBundleBanner.tsx
import Link from 'next/link'
import { BUNDLE_PRODUCT } from '@/lib/payment/products'

type Props = { inputParams: string }

const INDIVIDUAL_TOTAL = 9900 + 9900 + 15900 + 19900

export default function PremiumBundleBanner({ inputParams }: Props) {
  const product = BUNDLE_PRODUCT
  const saving  = INDIVIDUAL_TOTAL - product.price
  const href    = `/premium?productId=${product.id}&${inputParams}`

  return (
    <div
      className="relative rounded-2xl overflow-hidden mt-6"
      style={{
        background: 'linear-gradient(135deg, var(--bg-elevated) 0%, #1e1710 100%)',
        border: '1px solid var(--border-gold-md)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
      }}
    >
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, transparent, var(--accent-gold) 50%, transparent)' }}
      />

      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm"
            style={{ background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', color: 'var(--accent-gold)' }}
          >
            ◈
          </div>
          <div>
            {product.badge && (
              <span className="badge-gold inline-block mb-1">{product.badge}</span>
            )}
            <h3 className="font-serif text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          {product.description}
        </p>

        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>개별 구매 시</span>
            <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
              {INDIVIDUAL_TOTAL.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>올인원 패키지</span>
            <div className="text-right">
              <span className="text-2xl font-bold" style={{ color: 'var(--text-gold)' }}>
                {product.price.toLocaleString()}원
              </span>
              <span className="text-xs ml-2 font-semibold" style={{ color: '#6aaa6a' }}>
                {saving.toLocaleString()}원 절약
              </span>
            </div>
          </div>
        </div>

        <Link href={href} className="btn-primary block w-full py-4 text-center text-sm font-semibold">
          올인원 패키지로 시작하기
        </Link>

        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          모든 리포트 포함 · PDF 즉시 다운로드
        </p>
      </div>
    </div>
  )
}
