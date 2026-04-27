'use client'
// app/confirm/page.tsx — 신청 완료 + 계좌이체 안내

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ── 계좌 정보: .env.local에서 설정 ────────────────────────
const ACCOUNT = {
  bank:   process.env.NEXT_PUBLIC_BANK_NAME    ?? '토스뱅크',
  number: process.env.NEXT_PUBLIC_ACCOUNT_NUM  ?? '1000-7407-1075',
  holder: process.env.NEXT_PUBLIC_ACCOUNT_NAME ?? '김*훈',
}

// 상품별 금액 (원하는 금액으로 변경하세요)
const PRICES: Record<string, number> = {
  정통사주: 30000,
  연애결혼: 25000,
  재물사업: 25000,
  궁합:     45000,
}

function ConfirmContent() {
  const params  = useSearchParams()
  const product = params.get('product') ?? '정통사주'
  const name    = params.get('name')    ?? '고객'
  const price   = PRICES[product] ?? 0

  function handleCopy() {
    navigator.clipboard.writeText(ACCOUNT.number)
      .then(() => alert('계좌번호가 복사되었습니다.'))
      .catch(() => alert(`계좌번호: ${ACCOUNT.number}`))
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── 상단: 완료 메시지 ─────────────────────────── */}
      <div
        className="flex flex-col items-center justify-center pt-16 pb-10 px-6 text-center"
        style={{ borderBottom: '1px solid var(--border-gold)' }}
      >
        {/* 체크 아이콘 */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-7"
          style={{
            background: 'linear-gradient(135deg, rgba(180,140,80,0.2) 0%, rgba(180,140,80,0.05) 100%)',
            border: '2px solid var(--accent-gold)',
          }}
        >
          <span style={{ fontSize: 32, color: 'var(--text-gold)' }}>✓</span>
        </div>

        <h1
          className="font-serif text-3xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          신청이 완료되었습니다
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-gold)' }}>{name}</strong>님의 사주 분석 신청을 접수했습니다.
        </p>
      </div>

      {/* ── 하단: 계좌이체 안내 ───────────────────────── */}
      <div className="flex-1 px-5 pt-8 pb-16 max-w-md mx-auto w-full">

        {/* 타이틀 */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--text-gold)', fontWeight: 700 }}>
            PAYMENT INFORMATION
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            계좌이체 안내
          </p>
        </div>

        {/* 계좌 정보 카드 */}
        <div className="space-y-3 mb-6">
          {[
            { label: '은행',   value: ACCOUNT.bank,   copy: false },
            { label: '계좌번호', value: ACCOUNT.number, copy: true },
            { label: '예금주', value: ACCOUNT.holder,  copy: false },
            { label: '입금 금액', value: price > 0 ? `${price.toLocaleString()}원` : '문의', copy: false, gold: true },
          ].map(({ label, value, copy, gold }) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
              }}
            >
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <div className="flex items-center gap-3">
                <span
                  className="text-base font-bold"
                  style={{ color: gold ? 'var(--text-gold)' : 'var(--text-primary)' }}
                >
                  {value}
                </span>
                {copy && (
                  <button
                    onClick={handleCopy}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: 'var(--accent-bronze)', color: '#fff' }}
                  >
                    복사
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <div
          className="rounded-2xl px-5 py-4 mb-8 text-sm leading-relaxed"
          style={{
            background: 'rgba(180,140,80,0.08)',
            border: '1px solid rgba(180,140,80,0.25)',
            color: 'var(--text-secondary)',
          }}
        >
          입금 확인 후 사주 분석을 진행합니다.
          분석 완료 시 입력하신 이메일로 리포트가 발송됩니다.
          문의사항은 카카오톡 채널{' '}
          <strong style={{ color: 'var(--text-gold)' }}>@월백당사주</strong>로 연락해 주세요.
        </div>

        {/* 입금자명 안내 */}
        <div
          className="rounded-2xl px-5 py-3 mb-8 text-xs text-center"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}
        >
          입금자명은 <strong style={{ color: 'var(--text-primary)' }}>신청자 이름({name})</strong>으로 해주세요
        </div>

        <Link
          href="/"
          className="block text-center text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--text-muted)' }}>불러오는 중...</p>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}
