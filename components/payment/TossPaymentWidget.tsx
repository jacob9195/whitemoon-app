'use client'
// =====================================================
// components/payment/TossPaymentWidget.tsx
//
// Toss Payments 결제위젯 클라이언트 컴포넌트
// ─────────────────────────────────────────────────────
// 흐름:
//   1. 마운트 시 @tosspayments/tosspayments-sdk 로드
//   2. 결제위젯 렌더링 (카드 UI 표시)
//   3. "결제하기" 버튼 클릭 → requestPayment()
//   4. Toss가 successUrl / failUrl 로 리다이렉트
//
// 보안:
//   - NEXT_PUBLIC_TOSS_CLIENT_KEY 만 클라이언트에 노출 (공개 키)
//   - secret key는 서버에서만 (lib/payment/toss.ts)
//   - orderId / amount는 서버가 확정한 값 사용 (props로 전달)
// =====================================================

import { useEffect, useRef, useState } from 'react'

type Props = {
  orderId:    string   // 서버가 생성한 주문 ID
  amount:     number   // 서버가 확정한 금액
  orderName:  string   // 결제창 표시 이름
  successUrl: string   // 결제 완료 후 이동할 URL
  failUrl:    string   // 결제 실패/취소 후 이동할 URL
  onError?:   (msg: string) => void
}

export default function TossPaymentWidget({
  orderId, amount, orderName, successUrl, failUrl, onError,
}: Props) {
  const widgetRef  = useRef<HTMLDivElement>(null)
  const methodsRef = useRef<HTMLDivElement>(null)

  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const [paying,       setPaying]       = useState(false)
  const [loadError,    setLoadError]    = useState<string | null>(null)

  // 결제위젯 인스턴스 (any: SDK 타입 정의가 없는 경우 대비)
  const tossWidgetRef = useRef<any>(null)

  useEffect(() => {
    let isMounted = true

    async function loadWidget() {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
      if (!clientKey) {
        const msg = '결제 설정이 올바르지 않아요. 관리자에게 문의해 주세요.'
        setLoadError(msg)
        onError?.(msg)
        return
      }

      try {
        // Toss SDK 동적 로드
        const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk')
        const tossPayments = await loadTossPayments(clientKey)

        if (!isMounted) return

        // 결제위젯 인스턴스 생성
        const widget = tossPayments.widgets({ customerKey: orderId })
        tossWidgetRef.current = widget

        // 결제 금액 설정
        await widget.setAmount({ currency: 'KRW', value: amount })

        // 결제 수단 UI 렌더링
        if (methodsRef.current && isMounted) {
          await widget.renderPaymentMethods({
            selector: '#toss-payment-methods',
            variantKey: 'DEFAULT',
          })
        }

        if (isMounted) setWidgetLoaded(true)

      } catch (err) {
        if (!isMounted) return
        console.error('[TossPaymentWidget] 위젯 로드 실패:', err)
        const msg = '결제 서비스를 불러오는 중 오류가 발생했어요. 페이지를 새로고침해 주세요.'
        setLoadError(msg)
        onError?.(msg)
      }
    }

    loadWidget()
    return () => { isMounted = false }
  }, [orderId, amount, onError])

  async function handlePayment() {
    if (!tossWidgetRef.current || paying) return
    setPaying(true)

    try {
      await tossWidgetRef.current.requestPayment({
        orderId,
        orderName,
        successUrl,
        failUrl,
        // 고객 정보 — 익명 서비스이므로 최소화
        customerName: '사주 사용자',
      })
      // 결제 완료 시 Toss가 successUrl로 리다이렉트하므로
      // 이 아래 코드는 실행되지 않아요
    } catch (err: any) {
      // 사용자가 직접 취소한 경우 (에러 아님)
      if (err?.code === 'USER_CANCEL') {
        setPaying(false)
        return
      }
      console.error('[TossPaymentWidget] requestPayment 실패:', err)
      const msg = '결제 중 오류가 발생했어요. 다시 시도해 주세요.'
      onError?.(msg)
      setPaying(false)
    }
  }

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        <p className="font-medium mb-1">결제 서비스 오류</p>
        <p>{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs underline text-red-600"
        >
          페이지 새로고침
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Toss 결제위젯 렌더링 영역 */}
      <div
        id="toss-payment-methods"
        ref={methodsRef}
        className="mb-4 min-h-[120px]"
      >
        {!widgetLoaded && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-2" />
            <span className="text-sm text-stone-400">결제 수단 불러오는 중...</span>
          </div>
        )}
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={!widgetLoaded || paying}
        className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-bold text-base rounded-2xl tracking-widest shadow-md"
      >
        {paying
          ? '결제 처리 중...'
          : !widgetLoaded
          ? '준비 중...'
          : `${amount.toLocaleString()}원 결제하기`
        }
      </button>

      <p className="text-xs text-stone-400 text-center mt-3">
        Toss Payments 안전 결제 · 즉시 PDF 발급 · 환불 불가
      </p>
    </div>
  )
}
