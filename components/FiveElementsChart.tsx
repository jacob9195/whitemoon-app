// components/FiveElementsChart.tsx — 다크 테마
import type { FiveElements } from '@/lib/saju/types'

type Props = {
  elements: FiveElements
  summary:  string
}

const ELEMENTS = [
  { key: 'wood',  label: '목 木', color: '#4a7c59' },
  { key: 'fire',  label: '화 火', color: '#8b3a3a' },
  { key: 'earth', label: '토 土', color: '#7a6535' },
  { key: 'metal', label: '금 金', color: '#7a8a7a' },
  { key: 'water', label: '수 水', color: '#3a5a7a' },
] as const

export default function FiveElementsChart({ elements, summary }: Props) {
  return (
    <div>
      <div className="space-y-2.5 mb-4">
        {ELEMENTS.map(({ key, label, color }) => {
          const pct = elements[key as keyof typeof elements] as number
          const isStrongest = elements.strongest === label.split(' ')[0].replace('목','목').replace('화','화').replace('토','토').replace('금','금').replace('수','수')

          return (
            <div key={key} className="flex items-center gap-3">
              <span
                className="text-xs w-9 shrink-0 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {label}
              </span>

              {/* 바 트랙 */}
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: '6px', background: 'var(--bg-elevated)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: color,
                    opacity: pct < 10 ? 0.4 : 1,
                  }}
                />
              </div>

              <span
                className="text-xs w-8 text-right shrink-0 tabular-nums"
                style={{ color: pct > 25 ? 'var(--text-gold)' : 'var(--text-muted)' }}
              >
                {pct}%
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="h-px mb-4"
        style={{ background: 'var(--border-subtle)' }}
      />

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {summary}
      </p>
    </div>
  )
}
