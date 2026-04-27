// =====================================================
// components/result/PremiumProductsSection.tsx
//
// 유료 상품 전체 섹션 — 배치 순서:
//   1. 정통 사주 리포트 (대표, 전폭)
//   2. 연애 + 재물·직업 (2열)
//   3. 궁합 리포트
//   4. 올인원 패키지 배너
// =====================================================

import { PRODUCTS } from '@/lib/payment/products'
import PremiumProductCard from './PremiumProductCard'
import PremiumBundleBanner from './PremiumBundleBanner'

type Props = { inputParams: string }

export default function PremiumProductsSection({ inputParams }: Props) {
  const featured = PRODUCTS.find(p => p.isFeatured)!
  const love     = PRODUCTS.find(p => p.id === 'saju-love')!
  const wealth   = PRODUCTS.find(p => p.id === 'saju-wealth')!
  const match    = PRODUCTS.find(p => p.id === 'saju-match')!

  return (
    <section className="space-y-4">

      {/* 1. 대표 상품 — 정통 사주 리포트 */}
      <PremiumProductCard
        product={featured}
        inputParams={inputParams}
      />

      {/* 2. 세부 관심사 — 연애 + 재물·직업 2열 */}
      <div>
        <p
          className="text-xs mb-3 px-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          관심 영역만 선택해서 확인해보세요
        </p>
        <div className="grid grid-cols-2 gap-3">
          <PremiumProductCard product={love}   inputParams={inputParams} compact />
          <PremiumProductCard product={wealth} inputParams={inputParams} compact />
        </div>
      </div>

      {/* 3. 궁합 리포트 */}
      <div>
        <p
          className="text-xs mb-3 px-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          관계 중심 심층 분석
        </p>
        <PremiumProductCard product={match} inputParams={inputParams} />
      </div>

      {/* 4. 올인원 패키지 */}
      <PremiumBundleBanner inputParams={inputParams} />

    </section>
  )
}
