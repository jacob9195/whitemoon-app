'use client'
// app/confirm/page.tsx — 신청 완료 + 계좌이체 안내 (네이비+금빛 스타일)

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ACCOUNT = {
  bank:   process.env.NEXT_PUBLIC_BANK_NAME    ?? '토스뱅크',
  number: process.env.NEXT_PUBLIC_ACCOUNT_NUM  ?? '1000-7407-1075',
  holder: process.env.NEXT_PUBLIC_ACCOUNT_NAME ?? '김*훈',
}

const PRICES: Record<string, number> = {
  정통사주: 24900,
  연애결혼: 12900,
  재물사업: 12900,
  궁합:     15900,
}

const C = {
  bg:          '#0a1628',
  card:        '#0d1e38',
  cardInner:   '#081424',
  gold:        '#c9a84c',
  goldBorder:  'rgba(201,168,76,0.4)',
  goldDim:     'rgba(201,168,76,0.15)',
  text:        '#f0e6d0',
  textMuted:   'rgba(240,230,208,0.55)',
  textDim:     'rgba(240,230,208,0.3)',
  active:      'linear-gradient(135deg,#c9a84c,#8a6d2a)',
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
    <main style={{ minHeight: '100vh', background: C.bg, paddingBottom: 60 }}>

      {/* ── 상단 완료 헤더 ── */}
      <div style={{
        background: 'linear-gradient(180deg, #061020 0%, #0a1628 100%)',
        padding: '52px 24px 36px',
        textAlign: 'center',
        borderBottom: `1px solid ${C.goldDim}`,
      }}>
        {/* 체크 아이콘 */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
          background: 'rgba(201,168,76,0.1)',
          border: `2px solid ${C.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(201,168,76,0.2)',
        }}>
          <span style={{ fontSize: 28, color: C.gold }}>✓</span>
        </div>

        <p style={{ fontSize: 11, letterSpacing: 5, color: C.gold, marginBottom: 10, fontFamily: 'sans-serif' }}>
          月 白 堂 사주
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: 'Georgia, serif', marginBottom: 10 }}>
          신청이 완료되었습니다
        </h1>
        <p style={{ fontSize: 15, color: C.textMuted, fontFamily: 'sans-serif' }}>
          <strong style={{ color: C.gold }}>{name}</strong>님의 사주 분석 신청을 접수했습니다
        </p>
        <div style={{ width: 40, height: 1, background: C.gold, margin: '16px auto 0', opacity: 0.5 }} />
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 16px' }}>

        {/* ── 계좌이체 안내 타이틀 ── */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 10, letterSpacing: 4, color: C.gold, marginBottom: 6, fontFamily: 'sans-serif' }}>
            PAYMENT INFORMATION
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: 'Georgia, serif' }}>
            계좌이체 안내
          </p>
        </div>

        {/* ── 계좌 정보 카드 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {[
            { label: '은행',    value: ACCOUNT.bank,   copy: false, gold: false },
            { label: '계좌번호', value: ACCOUNT.number, copy: true,  gold: false },
            { label: '예금주',  value: ACCOUNT.holder, copy: false, gold: false },
            { label: '입금 금액', value: `${price.toLocaleString()}원`, copy: false, gold: true },
          ].map(({ label, value, copy, gold }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', borderRadius: 12,
              background: gold ? 'rgba(201,168,76,0.08)' : C.card,
              border: `1px solid ${gold ? C.gold : C.goldBorder}`,
            }}>
              <span style={{ fontSize: 14, color: C.textMuted, fontFamily: 'sans-serif' }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: gold ? 18 : 15, fontWeight: 700, fontFamily: 'sans-serif',
                  color: gold ? C.gold : C.text,
                }}>{value}</span>
                {copy && (
                  <button onClick={handleCopy} style={{
                    fontSize: 12, padding: '4px 12px', borderRadius: 20,
                    background: C.active, color: '#041018',
                    border: 'none', cursor: 'pointer', fontWeight: 700,
                    fontFamily: 'sans-serif',
                  }}>복사</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── 안내 문구 ── */}
        <div style={{
          background: C.card, border: `1px solid ${C.goldBorder}`,
          borderRadius: 12, padding: '16px 18px', marginBottom: 16,
        }}>
          {/* 왼쪽 금색 라인 */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 3, borderRadius: 2, background: C.gold, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, fontFamily: 'sans-serif' }}>
              입금 확인 후 사주 분석을 진행합니다. 분석 완료 시 입력하신 이메일로 리포트가 발송됩니다.
              문의사항은 카카오톡 채널{' '}
              <strong style={{ color: C.gold }}>@월백당사주</strong>로 연락해 주세요.
            </p>
          </div>
        </div>

        {/* ── 입금자명 안내 ── */}
        <div style={{
          background: C.cardInner, border: `1px solid ${C.goldDim}`,
          borderRadius: 10, padding: '12px 16px', marginBottom: 28,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: C.textMuted, fontFamily: 'sans-serif' }}>
            입금자명은{' '}
            <strong style={{ color: C.text }}>{name}</strong>
            (으)로 해주세요
          </p>
        </div>

        {/* ── 홈 버튼 ── */}
        <Link href="/" style={{
          display: 'block', textAlign: 'center',
          padding: '14px', borderRadius: 12,
          background: C.card, border: `1px solid ${C.goldBorder}`,
          color: C.textMuted, fontSize: 14, textDecoration: 'none',
          fontFamily: 'sans-serif',
        }}>
          홈으로 돌아가기
        </Link>

      </div>
    </main>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a1628' }}>
        <p style={{ color: 'rgba(240,230,208,0.4)', fontFamily: 'sans-serif' }}>불러오는 중...</p>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}
