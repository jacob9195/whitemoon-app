// =====================================================
// lib/types/report.ts
//
// 무료 결과와 유료 프리미엄 리포트 타입 정의
// =====================================================

import type { BirthInput, FourPillars, FiveElements } from '@/lib/saju/types'

// ── 무료 결과 데이터 ──────────────────────────────────
export type FreeReportData = {
  basicChart: {
    fourPillars: FourPillars
    fiveElements: FiveElements
  }
  elementsSummary:  string   // 오행 1줄 요약
  personalityShort: string   // 성향 1~2줄
  careerShort:      string   // 직업 teaser 1줄
  loveShort:        string   // 연애 teaser 1줄
  cautionShort:     string   // 주의점 teaser 1줄
}

// ── 프리미엄 PDF 섹션 ─────────────────────────────────
// 각 섹션은 최소 2~5문단 분량의 해석 문장
export type PremiumReportData = {
  // 1. 기본 정보 요약 (생년월일·사주팔자 구성)
  chartOverview:      string

  // 2. 사주팔자 전체 구조 설명 (4기둥 각각의 의미)
  fourPillarsDetail:  string

  // 3. 일간(일주 천간) 중심 성향 해석
  dayMasterDetail:    string

  // 4. 오행 강약 상세 분석
  elementsDetail:     string

  // 5. 십성(十星) 상세 해석
  // TODO: 십성 계산 모듈 완성 후 실제 값 대입. 현재는 일간 기반 추정 해석
  tenGodsDetail:      string

  // 6. 성격 장점·약점
  personalityDetail:  string

  // 7. 인간관계·사회성 스타일
  relationshipDetail: string

  // 8. 연애·결혼 성향
  loveMarriageDetail: string

  // 9. 직업·적성·일하는 방식
  careerDetail:       string

  // 10. 재물운·소비 성향·돈 관리 포인트
  wealthDetail:       string

  // 11. 건강·생활 습관 주의점
  healthDetail:       string

  // 12. 시기 흐름 요약 (올해 운세 + 월별 흐름)
  // TODO: 대운/세운 계산 모듈 완성 후 고도화
  timingDetail:       string

  // 13. 실천 조언 (행운 정보 포함)
  actionGuide:        string

  // 14. 전체 요약
  finalSummary:       string
}

// ── PDF 생성에 전달되는 전체 데이터 ──────────────────
export type PremiumPdfInput = {
  input:       BirthInput
  freeData:    FreeReportData
  premiumData: PremiumReportData
  isMock:      boolean
  orderId:     string
  paidAt:      number
}
