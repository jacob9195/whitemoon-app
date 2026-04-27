// =====================================================
// components/InsightTabs.tsx
// 직업 / 연애 / 주의점 탭을 전환하며 보는 컴포넌트예요.
// =====================================================

'use client'

import { useState } from 'react'
import type { SajuInterpretation } from '@/lib/saju/types'

type Props = {
  interpretation: SajuInterpretation
}

const TABS = [
  { key: 'career'  as const, label: '💼 직업' },
  { key: 'love'    as const, label: '💛 연애' },
  { key: 'caution' as const, label: '🌿 주의점' },
]

export default function InsightTabs({ interpretation }: Props) {
  const [activeTab, setActiveTab] = useState<'career' | 'love' | 'caution'>('career')

  return (
    <>
      {/* 탭 버튼 */}
      <div className="flex gap-2 mb-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-stone-100 text-stone-500 border border-transparent hover:bg-stone-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
        {interpretation[activeTab]}
      </p>
    </>
  )
}
