// =====================================================
// app/premium/page.tsx
// Server Component wrapper — searchParams를 prop으로 받아
// Client Component에 내려줍니다. Suspense로 감쌉니다.
// =====================================================

import { Suspense } from 'react'

// searchParams를 사용하므로 항상 동적 렌더링
export const dynamic = 'force-dynamic'
import PremiumClient from './PremiumClient'

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function PremiumPage({ searchParams }: PageProps) {
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
      <PremiumClient searchParams={searchParams} />
    </Suspense>
  )
}
