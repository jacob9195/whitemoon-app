'use client'
// =====================================================
// app/payment/success/PaymentSuccessClient.tsx
//
// 실제 결제 확인 UI — searchParams를 prop으로 받아
// useSearchParams() 미사용. 빌드 오류 없음.
// =====================================================

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

type ConfirmState =
  | { status: 'confirming' }
  | { status: 'success'; downloadToken: string; orderId: string; amount: number }
  | { status: 'error'; code: string; message: string; retryable: boolean }

const ERROR_UI: Record<string, { message: string; retryable: boolean }> = {
  MISSING_PARAMS:      { message: '결제 정보가 올바르지 않아요. 다시 결제를 시도해 주세요.',     retryable: true  },
  ORDER_NOT_FOUND:     { message: '주문 정보를 찾을 수 없어요. 다시 결제를 시도해 주세요.',       retryable: true  },
  AMOUNT_MISMATCH:     { message: '결제 금액이 일치하지 않아요. 고객센터에 문의해 주세요.',       retryable: false },
  ALREADY_PAID:        { message: '이미 처리된 주문이에요.',                                     retryable: false },
  TOSS_CONFIRM_FAILED: { message: '결제 승인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.', retryable: true  },
  INTERNAL_ERROR:      { message: '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',         retryable: true  },
}

function getStr(p: Props['searchParams'], key: string, fallback = ''): string {
  const v = p[key]
  return typeof v === 'string' ? v : fallback
}

export default function PaymentSuccessClient({ searchParams }: Props) {
  const paymentKey = getStr(searchParams, 'paymentKey')
  const orderId    = getStr(searchParams, 'orderId')
  const amountStr  = getStr(searchParams, 'amount')

  // 입력값 복원 (무료 결과 페이지 링크용)
  const year     = getStr(searchParams, 'year')
  const month    = getStr(searchParams, 'month')
  const day      = getStr(searchParams, 'day')
  const hour     = getStr(searchParams, 'hour', 'unknown')
  const gender   = getStr(searchParams, 'gender')
  const calendar = getStr(searchParams, 'calendar', 'solar')
  const inputParams = new URLSearchParams({ year, month, day, hour, gender, calendar }).toString()

  const [state, setState] = useState<ConfirmState>({ status: 'confirming' })

  useEffect(() => {
    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amountStr) {
      setState({ status: 'error', code: 'MISSING_PARAMS', message: '결제 정보가 올바르지 않아요.', retryable: true })
      return
    }
    const amount = Number(amountStr)
    if (!Number.isInteger(amount) || amount <= 0) {
      setState({ status: 'error', code: 'MISSING_PARAMS', message: '결제 금액 정보가 올바르지 않아요.', retryable: true })
      return
    }

    let mounted = true

    // 결제 confirm — 서버에서 Toss 승인 + 금액 검증
    fetch('/api/payments/confirm', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ paymentKey, orderId, amount }),
    })
      .then(r => r.json())
      .then(data => {
        if (!mounted) return
        if (!data.ok) {
          const ui = ERROR_UI[data.code] ?? { message: data.message ?? '확인 중 오류가 발생했어요.', retryable: true }
          setState({ status: 'error', code: data.code, message: ui.message, retryable: ui.retryable })
          return
        }
        setState({ status: 'success', downloadToken: data.downloadToken, orderId: data.orderId, amount })
      })
      .catch(() => {
        if (!mounted) return
        setState({ status: 'error', code: 'NETWORK_ERROR', message: '네트워크 오류가 발생했어요.', retryable: true })
      })

    return () => { mounted = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const bgStyle = { background: 'var(--bg-base)', minHeight: '100vh' }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-10 pb-24" style={bgStyle}>
      <div className="w-full max-w-sm">

        {/* ── 확인 중 ── */}
        {state.status === 'confirming' && (
          <div className="text-center py-20">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent mx-auto mb-6 animate-spin"
              style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }}
            />
            <p className="font-serif text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              결제 확인 중
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              잠시만 기다려 주세요. 페이지를 닫지 마세요.
            </p>
          </div>
        )}

        {/* ── 성공 ── */}
        {state.status === 'success' && (
          <>
            <div className="text-center mb-8">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(180,140,80,0.15)', border: '1px solid var(--border-gold-md)' }}
              >
                <span style={{ color: 'var(--accent-gold)' }}>✓</span>
              </div>
              <h1 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                결제 완료
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                리포트를 지금 바로 PDF로 저장해 주세요
              </p>
            </div>

            {/* 결제 정보 */}
            <div
              className="rounded-xl p-4 mb-5 space-y-2"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
            >
              {[
                ['결제 금액', `${state.amount.toLocaleString()}원`],
                ['주문번호', state.orderId],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span
                    className="font-medium truncate max-w-[180px]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* PDF 다운로드 — confirm 성공 후에만 downloadToken이 존재 */}
            <a
              href={`/api/pdf?token=${encodeURIComponent(state.downloadToken)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary block w-full py-4 text-center text-sm font-semibold mb-3"
            >
              PDF 다운로드
            </a>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              다운로드 링크는 1시간 동안 유효해요
            </p>

            <Link
              href={`/result?${inputParams}`}
              className="block w-full py-3.5 text-center text-sm rounded-xl"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-gold)' }}
            >
              무료 결과 보기
            </Link>
          </>
        )}

        {/* ── 실패 ── */}
        {state.status === 'error' && (
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(150,50,50,0.2)', border: '1px solid rgba(150,50,50,0.3)' }}
            >
              <span className="text-xl" style={{ color: '#f5a0a0' }}>×</span>
            </div>
            <h1 className="font-serif text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              결제 확인 실패
            </h1>
            <div
              className="rounded-xl p-4 mb-6 text-left"
              style={{ background: 'rgba(150,50,50,0.12)', border: '1px solid rgba(150,50,50,0.25)' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: '#f5a0a0' }}>
                {state.message}
              </p>
              {state.code && (
                <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                  오류 코드: {state.code}
                </p>
              )}
            </div>
            {state.retryable && (
              <Link
                href={`/premium?${inputParams}`}
                className="btn-primary block w-full py-4 text-center text-sm font-semibold mb-3"
              >
                다시 결제하기
              </Link>
            )}
            <Link href="/" className="block w-full py-3 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              홈으로
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
