// =====================================================
// components/result/PremiumIntroSection.tsx
// 무료 → 유료 전환 브릿지 섹션
// =====================================================

export default function PremiumIntroSection() {
  return (
    <section className="my-10">
      {/* 구분선 */}
      <div className="divider-gold mb-8" />

      <div className="text-center px-2">
        <p className="label-overline mb-3">더 깊은 해석</p>
        <h2
          className="font-serif text-xl font-semibold mb-3 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          무료 결과에서 다 담지 못한<br />
          흐름을 더 깊이 읽어드립니다
        </h2>
        <p
          className="text-sm leading-relaxed max-w-xs mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          핵심 요약을 넘어 관계, 일, 재물의 구체적 패턴과
          올해의 시기 흐름까지 — 오래 참고할 수 있는 리포트입니다.
        </p>
      </div>

      <div className="divider-gold mt-8" />
    </section>
  )
}
