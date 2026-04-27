// app/page.tsx — 홈 (월백당사주 고객 입력 시작)
import Link from 'next/link'

const PRODUCTS = [
  { id: '정통사주', label: '정통사주',   desc: '사주팔자 전체 해석',     icon: '☯' },
  { id: '연애결혼', label: '연애·결혼',  desc: '인연·결혼운 집중 분석',  icon: '♡' },
  { id: '재물사업', label: '재물·사업',  desc: '재물·직업운 집중 분석',  icon: '◈' },
  { id: '궁합',    label: '궁합',        desc: '두 사람의 인연과 조화',   icon: '⊕' },
]

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm text-center">
        <p className="label-overline mb-4">월백당사주</p>

        <h1
          className="font-serif text-4xl font-semibold mb-3 tracking-wide leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          나의 사주를<br />풀어드립니다
        </h1>

        <div className="divider-gold mx-auto w-20 mb-5" />

        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          생년월일과 연락처를 입력하시면<br />
          전문가가 직접 사주를 풀어 전달해 드립니다
        </p>

        {/* 상품 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {PRODUCTS.map(({ id, label, desc, icon }) => (
            <Link
              key={id}
              href={`/apply?product=${encodeURIComponent(id)}`}
              className="rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
              style={{
                background:  'var(--bg-card)',
                border:      '1px solid var(--border-gold)',
                boxShadow:   'var(--shadow-card)',
              }}
            >
              <div className="text-xl mb-2" style={{ color: 'var(--text-gold)' }}>{icon}</div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {label}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/apply"
          className="btn-primary block w-full py-4 text-sm font-semibold tracking-widest"
        >
          신청하기
        </Link>

        <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          입력 정보는 사주 풀이 목적으로만 사용됩니다
        </p>
      </div>
    </main>
  )
}
