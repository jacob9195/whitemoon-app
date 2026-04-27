// =====================================================
// app/api/pdf/route.ts
//
// GET /api/pdf?token=XXX
//
// Vercel 수정 이유:
//   @react-pdf/renderer는 Node.js 전용 모듈(canvas 등)을 사용.
//   빌드 시 정적 import하면 Edge/prerender 환경에서 오류 발생.
//   → export const runtime = 'nodejs' + force-dynamic 추가
//   → generatePremiumPdf는 런타임에 dynamic import 방식으로 호출
//
// PDF 생성 시점:
//   confirm API 성공 후 발급된 downloadToken이 있어야만 접근 가능.
//   빌드 시점·파라미터 없는 상태에서는 token 검증에서 403으로 차단됨.
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { validateDownloadToken } from '@/lib/security/validators'
import { verifyDownloadToken } from '@/lib/payment/download-auth'
import { getOrder, recordDownload } from '@/lib/payment/order-service'
import { logServerError, toErrorResponse, orderNotPaid } from '@/lib/security/errors'

// ── 런타임 설정 ────────────────────────────────────────
// Node.js 런타임 필수: @react-pdf/renderer가 Node.js 전용
export const runtime = 'nodejs'
// 항상 동적 렌더링: 빌드 시 실행 차단
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // 1. token 파라미터 추출 및 형식 검증
    const rawToken       = req.nextUrl.searchParams.get('token')
    const tokenValidation = validateDownloadToken(rawToken)
    if (!tokenValidation.ok) {
      return NextResponse.json(
        { ok: false, code: 'TOKEN_MISSING', message: tokenValidation.message },
        { status: 403 }
      )
    }

    // 2. 토큰 서명 검증 + 만료 확인
    const payload = verifyDownloadToken(tokenValidation.data.token)

    // 3. 저장소에서 주문 조회
    const order = await getOrder(payload.orderId)

    // 4. 결제 상태 확인 — confirm 성공 후에만 'paid' 상태
    if (order.status !== 'paid' && order.status !== 'consumed') {
      throw orderNotPaid()
    }

    // 5. 다운로드 횟수 기록
    await recordDownload(order.orderId)

    // 6. 사주 데이터 구성
    const { getMockFreeResult, getMockPremiumResult } = await import('@/lib/mock/mockResult')
    const { buildFreeReportData, buildPremiumReportData } = await import('@/lib/saju/interpret-premium')
    const { generatePremiumPdf } = await import('@/lib/pdf/generate-premium-pdf')

    const birthInput     = order.birthInput as Parameters<typeof getMockFreeResult>[0]
    const freeResult     = getMockFreeResult(birthInput)
    const premiumResult  = getMockPremiumResult(birthInput)

    const freeData    = buildFreeReportData(freeResult.input, freeResult.fourPillars, freeResult.fiveElements)
    const premiumData = buildPremiumReportData(premiumResult.input, premiumResult.fourPillars, premiumResult.fiveElements)

    const pdfInput = {
      input:      birthInput,
      freeData,
      premiumData,
      isMock:     freeResult.isMock,
      orderId:    order.orderId,
      paidAt:     order.paidAt ?? Date.now(),
    }

    // 7. PDF 생성 — dynamic import로 빌드 시점 실행 차단
    const pdfBuffer = await generatePremiumPdf(pdfInput)

    // 8. 응답
    const safeFilename = `saju-report-${order.orderId.replace(/[^a-zA-Z0-9_\-]/g, '_')}.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length':      String(pdfBuffer.length),
        'Cache-Control':       'no-store, no-cache, must-revalidate',
        'Pragma':              'no-cache',
      },
    })

  } catch (err) {
    logServerError('GET /api/pdf', err)
    const r = toErrorResponse(err)
    return NextResponse.json(r.body, { status: r.status })
  }
}
