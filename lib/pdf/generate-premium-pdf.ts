// lib/pdf/generate-premium-pdf.ts
//
// @react-pdf/renderer 기반 PDF 생성
// runtime = 'nodejs' 환경에서만 실행됨
// 폰트: public/fonts/NotoSansKR-*-Subset.ttf (로컬 TTF)

import { createElement } from 'react'
import type { PremiumPdfInput } from '@/lib/types/report'
import { pdfGenerationFailed } from '@/lib/security/errors'

export async function generatePremiumPdf(data: PremiumPdfInput): Promise<Buffer> {
  try {
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { default: PremiumReportDocument } = await import('@/components/pdf/PremiumReportDocument')

    const element = createElement(PremiumReportDocument, { data })
    const buffer  = await renderToBuffer(element)
    return Buffer.from(buffer)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[generatePremiumPdf] PDF 생성 실패:', msg)

    // 폰트 파일 관련 오류 상세 안내
    if (msg.includes('font') || msg.includes('ENOENT')) {
      console.error(
        '[generatePremiumPdf] 폰트 파일 확인 필요:\n' +
        '  public/fonts/NotoSansKR-Regular-Subset.ttf\n' +
        '  public/fonts/NotoSansKR-Bold-Subset.ttf\n' +
        '  → npm run fonts:subset 또는 scripts/subset-fonts.py 실행'
      )
    }
    throw pdfGenerationFailed()
  }
}
