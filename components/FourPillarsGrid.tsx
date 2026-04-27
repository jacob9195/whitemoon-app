// components/FourPillarsGrid.tsx — 다크 테마
import type { FourPillars } from '@/lib/saju/types'

type Props = { pillars: FourPillars }

export default function FourPillarsGrid({ pillars }: Props) {
  const list = [
    { label: '연주', sub: '年柱', data: pillars.year,  isDay: false },
    { label: '월주', sub: '月柱', data: pillars.month, isDay: false },
    { label: '일주', sub: '日柱', data: pillars.day,   isDay: true  },
    { label: '시주', sub: '時柱', data: pillars.time,  isDay: false },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {list.map(({ label, sub, data, isDay }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center"
            style={{
              background: isDay ? 'rgba(180,140,80,0.10)' : 'var(--bg-elevated)',
              border: `1px solid ${isDay ? 'var(--border-gold-md)' : 'var(--border-subtle)'}`,
              boxShadow: isDay ? 'inset 0 1px 0 rgba(180,140,80,0.15)' : 'none',
            }}
          >
            {/* 라벨 */}
            <p
              className="text-[9px] font-semibold mb-2"
              style={{ color: isDay ? 'var(--text-gold)' : 'var(--text-muted)' }}
            >
              {label}
              <span className="block text-[8px] opacity-70">{sub}</span>
            </p>

            {data === null ? (
              <div className="py-1">
                <span className="text-xl font-serif block leading-none" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>—</span>
                <p className="text-[8px] mt-2" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>미입력</p>
              </div>
            ) : (
              <>
                <span
                  className="text-[22px] font-serif block leading-none"
                  style={{ color: isDay ? 'var(--text-gold)' : 'var(--text-primary)' }}
                >
                  {data.heavenlyStem}
                </span>
                <span className="text-[9px] block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {data.stemReading}
                </span>

                <div
                  className="my-1.5 h-px mx-2"
                  style={{ background: 'var(--border-subtle)' }}
                />

                <span
                  className="text-[22px] font-serif block leading-none"
                  style={{ color: isDay ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {data.earthlyBranch}
                </span>
                <span className="text-[9px] block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {data.branchReading}
                </span>

                <p
                  className="text-[8px] mt-2 pt-1.5 leading-relaxed"
                  style={{
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    opacity: 0.8,
                  }}
                >
                  {data.stemMeaning.split(',')[0]}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text-gold)' }}>일주(日柱)의 천간</span>이
        나의 본질적 기운인 <span style={{ color: 'var(--text-gold)' }}>일간(日干)</span>입니다.
      </p>
    </>
  )
}
