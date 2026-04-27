// components/result/ResultWarningNotice.tsx
type Props = { warnings: string[] }

export default function ResultWarningNotice({ warnings }: Props) {
  if (!warnings || warnings.length === 0) return null
  return (
    <div
      className="rounded-xl p-4 flex gap-3"
      style={{
        background: 'rgba(180, 140, 80, 0.06)',
        border: '1px solid rgba(180, 140, 80, 0.18)',
      }}
    >
      <span className="shrink-0 text-sm" style={{ color: 'var(--accent-gold)' }}>⚠</span>
      <div className="space-y-1">
        {warnings.map((w, i) => (
          <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {w}
          </p>
        ))}
      </div>
    </div>
  )
}
