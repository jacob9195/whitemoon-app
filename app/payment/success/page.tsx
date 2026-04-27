// =====================================================
// app/payment/success/page.tsx  — Server Component
//
// Vercel 수정 이유:
//   기존: 'use client' + useSearchParams() 최상단 직접 사용
//         → 빌드 시 Suspense 미적용으로 prerender 실패
//   수정: Server Component가 searchParams를 prop으로 받아
//         Client Component에 내려줌. dynamic = force-dynamic 추가.
// =====================================================

import { Suspense } from 'react'
import PaymentSuccessClient from './PaymentSuccessClient'

// 결제 완료 페이지는 URL 파라미터(paymentKey, orderId, amount)에
// 의존하므로 항상 동적 렌더링 처리
export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function PaymentSuccessPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--bg-base)' }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }}
          />
        </main>
      }
    >
      <PaymentSuccessClient searchParams={searchParams} />
    </Suspense>
  )
}
