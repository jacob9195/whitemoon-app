// =====================================================
// components/PremiumTeaser.tsx
//
// 무료 결과 페이지 하단에 표시되는 유료 유도 블록이에요.
// 가려진 항목들을 시각적으로 보여주고 결제 페이지로 안내해요.
// =====================================================

import Link from 'next/link'

type Props = {
  inputParams: string  // URL 파라미터 문자열 (입력값 전달용)
}

const LOCKED_ITEMS = [
  { emoji: '💼', label: '직업 상세 분석', desc: '어떤 환경에서 능력이 꽃피는지' },
  { emoji: '💛', label: '연애 상세 분석', desc: '궁합 좋은 유형과 주의할 패턴' },
  { emoji: '🌿', label: '주의점 & 조언',  desc: '지금 가장 주의할 에너지 흐름' },
  { emoji: '📅', label: '올해 운세',       desc: `${new Date().getFullYear()}년 월별 흐름 분석` },
  { emoji: '🍀', label: '행운 정보',       desc: '행운의 색상·방향·숫자' },
]

export default function PremiumTeaser({ inputParams }: Props) {
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white overflow-hidden">

      {/* 잠금 항목 목록 */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold text-amber-700 mb-3 tracking-wide">
          ✨ PDF에 포함되는 상세 분석
        </p>
        {LOCKED_ITEMS.map(({ emoji, label, desc }) => (
          <div key={label}
            className="flex items-center gap-3 py-1.5 opacity-60 select-none">
            {/* 자물쇠 표시 */}
            <span className="text-stone-300 text-xs shrink-0">🔒</span>
            <span className="text-lg shrink-0">{emoji}</span>
            <div>
              <p className="text-sm font-medium text-stone-500 line-through decoration-stone-300">
                {label}
              </p>
              <p className="text-xs text-stone-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="h-px bg-amber-100 mx-4" />

      {/* CTA */}
      <div className="p-4 text-center">
        <p className="text-xs text-stone-500 mb-3 leading-relaxed">
          상세 분석이 담긴 PDF를<br />
          <span className="font-semibold text-amber-700">2,900원</span>에 받아보세요
        </p>
        <Link
          href={`/premium?${inputParams}`}
          className="block w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all text-white font-bold text-sm rounded-xl tracking-widest shadow-sm"
        >
          상세 PDF 받기 →
        </Link>
        <p className="text-xs text-stone-400 mt-2">카드 결제 · 즉시 다운로드</p>
      </div>
    </div>
  )
}
