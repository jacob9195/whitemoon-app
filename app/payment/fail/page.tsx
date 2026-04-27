// app/payment/fail/page.tsx — 다크 테마
import Link from 'next/link'

type SearchParams = { [key: string]: string | string[] | undefined }
function str(p: SearchParams, k: string, fb = '') {
  const v = p[k]; return typeof v === 'string' ? v : fb
}

const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED:    '결제를 취소했어요.',
  PAY_PROCESS_ABORTED:     '결제가 중단됐어요.',
  REJECT_CARD_COMPANY:     '카드사에서 결제를 거절했어요. 다른 카드를 사용해 보세요.',
  PROVIDER_ERROR:          '결제 서비스에 일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
  INVALID_CARD_EXPIRATION: '카드 유효기간이 올바르지 않아요.',
  INVALID_STOPPED_CARD:    '정지된 카드예요. 다른 카드를 사용해 주세요.',
}

export default function PaymentFailPage({ searchParams }: { searchParams: SearchParams }) {
  const code    = str(searchParams, 'code')
  const rawMsg  = str(searchParams, 'message', '결제 중 오류가 발생했어요.')
  const msg     = ERROR_MESSAGES[code] ?? rawMsg

  const year     = str(searchParams, 'year')
  const month    = str(searchParams, 'month')
  const day      = str(searchParams, 'day')
  const hour     = str(searchParams, 'hour', 'unknown')
  const gender   = str(searchParams, 'gender')
  const calendar = str(searchParams, 'calendar', 'solar')
  const hasInput = year && month && day && gender
  const retryParams = hasInput
    ? new URLSearchParams({ year, month, day, hour, gender, calendar }).toString()
    : ''

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm text-center">

        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(150,50,50,0.2)', border: '1px solid rgba(150,50,50,0.3)' }}>
          <span className="text-2xl font-light" style={{ color: '#e08080' }}>×</span>
        </div>

        <h1 className="font-serif text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          결제 실패
        </h1>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          {msg}
        </p>

        {code === 'PAY_PROCESS_CANCELED' && (
          <div className="rounded-xl p-3 mb-5 text-xs" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}>
            결제가 취소됐어요. 카드 청구는 발생하지 않았어요.
          </div>
        )}

        {code && (
          <p className="text-xs mb-6 font-mono" style={{ color: 'var(--text-muted)' }}>
            오류 코드: {code}
          </p>
        )}

        {hasInput ? (
          <Link href={`/premium?${retryParams}`}
            className="btn-primary block w-full py-4 text-center text-sm font-semibold mb-3">
            다시 결제하기
          </Link>
        ) : (
          <Link href="/premium"
            className="btn-primary block w-full py-4 text-center text-sm font-semibold mb-3">
            결제 페이지로
          </Link>
        )}
        {hasInput && (
          <Link href={`/result?${retryParams}`}
            className="block w-full py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            무료 결과 보기
          </Link>
        )}
        <Link href="/" className="block w-full py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          홈으로
        </Link>
      </div>
    </main>
  )
}
