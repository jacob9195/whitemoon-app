// components/result/PremiumProductCard.tsx
import Link from 'next/link'
import type { Product } from '@/lib/payment/products'

type Props = { product: Product; inputParams: string; compact?: boolean }

export default function PremiumProductCard({ product, inputParams, compact = false }: Props) {
  const href = `/premium?productId=${product.id}&${inputParams}`

  if (product.isFeatured) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-gold-md)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(180,140,80,0.12)',
        }}
      >
        <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, var(--accent-gold), transparent)' }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {product.badge && <span className="badge-gold inline-block mb-2">{product.badge}</span>}
              <h3 className="font-serif text-lg font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {product.shortName}
              </h3>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-gold)' }}>
                {product.price.toLocaleString()}
                <span className="text-sm font-normal ml-0.5">원</span>
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {product.description}
          </p>

          <ul className="space-y-2 mb-6">
            {product.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="shrink-0 mt-0.5 text-xs" style={{ color: 'var(--accent-gold)' }}>✓</span>
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </li>
            ))}
          </ul>

          <Link href={href} className="btn-primary block w-full py-3.5 text-center text-sm">
            상세 리포트 열어보기
          </Link>
        </div>
      </div>
    )
  }

  if (product.isBundle) return null

  if (compact) {
    return (
      <div
        className="rounded-xl p-4 flex flex-col h-full"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="mb-3">
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-gold)' }}>
            {product.shortName}
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {product.price.toLocaleString()}
            <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-secondary)' }}>원</span>
          </p>
        </div>

        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
          {product.tagline}
        </p>

        <Link
          href={href}
          className="block w-full py-2.5 text-center text-xs font-semibold rounded-lg transition-colors"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-gold)', border: '1px solid var(--border-gold)' }}
        >
          자세히 보기
        </Link>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          {product.badge && <span className="badge-gold inline-block mb-1.5">{product.badge}</span>}
          <h3 className="font-serif text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {product.shortName}
          </h3>
        </div>
        <p className="text-lg font-bold shrink-0 ml-4" style={{ color: 'var(--text-gold)' }}>
          {product.price.toLocaleString()}
          <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-secondary)' }}>원</span>
        </p>
      </div>

      <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {product.description}
      </p>

      <Link
        href={href}
        className="block w-full py-3 text-center text-sm font-semibold rounded-xl transition-colors"
        style={{ background: 'var(--bg-elevated)', color: 'var(--text-gold)', border: '1px solid var(--border-gold-md)' }}
      >
        리포트 확인하기
      </Link>
    </div>
  )
}
