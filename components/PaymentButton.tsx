'use client'
// =====================================================
// components/PaymentButton.tsx
//
// 결제 버튼이에요. Toss Payments SDK 연결 자리예요.
//
// 현재: 클릭 시 /payment/success?... 로 바로 이동 (흐름 확인용)
// 나중에: 아래 TODO 블록을 활성화하면 실제 결제창이 열려요.
//
// ⚠️ 비개발자 참고:
//   이 파일에서 "TODO: Toss 결제창 열기" 부분을 찾아서
//   주석을 해제하면 실제 결제가 연결돼요.
// =====================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  productId:   string
  amount:      number
  inputParams: string   // 입력값 URL 파라미터 (결제 성공 후 PDF에 전달)
}

export default function PaymentButton({ productId, amount, inputParams }: Props) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    // ── TODO: 실제 Toss 결제창 연결 (나중에 주석 해제) ─────────────
    // 1. npm install @tosspayments/payment-sdk 설치 후
    // 2. .env.local 에 NEXT_PUBLIC_TOSS_CLIENT_KEY 설정 후
    // 3. 아래 주석을 해제하고, 그 아래 "mock 흐름" 블록을 삭제하세요
    //
    // try {
    //   const { loadTossPayments } = await import('@tosspayments/payment-sdk')
    //   const toss = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
    //   await toss.requestPayment('카드', {
    //     amount,
    //     orderId:      `saju-${Date.now()}`,
    //     orderName:    '오늘의 사주 — 상세 리포트',
    //     customerName: '사주 사용자',
    //     successUrl:   `${window.location.origin}/payment/success?${inputParams}`,
    //     failUrl:      `${window.location.origin}/payment/fail`,
    //   })
    // } catch (err: any) {
    //   if (err?.code !== 'USER_CANCEL') alert('결제 중 오류가 발생했어요.')
    //   setLoading(false)
    // }
    // ──────────────────────────────────────────────────────────────

    // ── 지금은 mock 흐름: 결제 없이 바로 성공 페이지로 이동 ─────────
    // Toss 연결 후 이 블록을 삭제하세요
    await new Promise(r => setTimeout(r, 800))  // 결제창 느낌 딜레이
    const mockOrderId = `mock-${Date.now()}`
    router.push(
      `/payment/success?orderId=${mockOrderId}&amount=${amount}&${inputParams}&mock=true`
    )
    // ──────────────────────────────────────────────────────────────
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-serif font-bold text-base rounded-2xl tracking-widest shadow-md"
    >
      {loading
        ? '처리 중...'
        : `${amount.toLocaleString()}원 결제하고 PDF 받기`
      }
    </button>
  )
}
