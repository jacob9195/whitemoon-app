// =====================================================
// lib/saju/types.ts — 전면 확장 (3레이어 구조)
//
// Layer 1 (Calculation): InputPayload → NormalizedBirthData → SajuChart
// Layer 2 (Interpretation): SajuChart → InterpretationBasis → FreeResult / PremiumResult
// Layer 3 (Presentation): 무료/유료 분기 + 불확실성 표기
// =====================================================

// ═══════════════════════════════════════════
// LAYER 1: 계산 계층 타입
// ═══════════════════════════════════════════

export type BirthInput = {
  year:         number
  month:        number
  day:          number
  hour:         number | null
  gender:       'male' | 'female'
  calendarType: 'solar' | 'lunar'
}

export type HeavenlyStem =
  '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'

export type EarthlyBranch =
  '子' | '丑' | '寅' | '卯' | '辰' | '巳' |
  '午' | '未' | '申' | '酉' | '戌' | '亥'

export type FiveElementName = '목' | '화' | '토' | '금' | '수'

export type Pillar = {
  heavenlyStem:  HeavenlyStem
  earthlyBranch: EarthlyBranch
  stemReading:   string
  branchReading: string
  stemMeaning:   string
  branchMeaning: string
}

export type FourPillars = {
  year:  Pillar
  month: Pillar
  day:   Pillar
  time:  Pillar | null
}

export type FiveElements = {
  wood:  number
  fire:  number
  earth: number
  metal: number
  water: number
  strongest: FiveElementName
  weakest:   FiveElementName
}

// 불확실성 레벨
export type CertaintyLevel = 'high' | 'medium' | 'low'

// 계산 결과 + 불확실성 메타
export type SajuChart = {
  fourPillars:    FourPillars
  fiveElements:   FiveElements
  certaintyLevel: CertaintyLevel
  warnings:       string[]       // 불확실성 경고 (시주 미입력, DST 등)
  assumptions:    string[]       // 계산 시 사용한 가정
  isMock:         boolean
}

// ═══════════════════════════════════════════
// LAYER 2: 해석 계층 타입
// ═══════════════════════════════════════════

// 일간별 해석 근거
export type InterpretationBasis = {
  dayMaster:             string   // 일간 한자 (甲~癸)
  dayMasterElement:      string   // 일간 오행
  seasonContext:         string   // 월지 계절감 / 조후 맥락
  elementBalance:        string   // 오행 편중 구조 설명
  dominantPatterns:      string   // 두드러진 기질 패턴
  usefulElementsHypothesis: string // 용신 가설 (단정 X, 논리 근거)
  riskFactors:           string   // 구조상 주의 지점
  strengthSummary:       string   // 강점 요약
}

// ═══════════════════════════════════════════
// LAYER 3: 표현 계층 타입 (무료/유료 분기)
// ═══════════════════════════════════════════

// 무료 결과 — result 페이지
export type FreeInterpretation = {
  fiveElementsSummary: string  // 오행 분포 요약 (1~2문장)
  personality:         string  // 핵심 성향 (2~3문단)
  careerTeaser:        string  // 직업 미리보기 (3~4문장)
  loveTeaser:          string  // 연애 미리보기 (3~4문장)
}

export type FreeResult = {
  input:          BirthInput
  fourPillars:    FourPillars
  fiveElements:   FiveElements
  interpretation: FreeInterpretation
  certaintyLevel: CertaintyLevel
  warnings:       string[]
  isMock:         boolean
}

// 유료 결과 — 상품별 분기
export type PremiumInterpretation = {
  fiveElementsSummary: string
  personality:         string
  career:              string
  love:                string
  caution:             string
  yearFortune:         string
  monthlyFlow:         string
  luckyTip:            string
  // 추가 유료 전용
  relationships:       string  // 인간관계 스타일
  wealth:              string  // 재물 상세
  health:              string  // 건강 주의점
  actionGuide:         string  // 실천 조언
}

export type PremiumResult = {
  input:          BirthInput
  fourPillars:    FourPillars
  fiveElements:   FiveElements
  interpretation: PremiumInterpretation
  certaintyLevel: CertaintyLevel
  warnings:       string[]
  isMock:         boolean
  orderId?:       string
  paidAt?:        number
}

// ── 기존 호환 alias ────────────────────────────────────
/** @deprecated FreeResult를 사용하세요 */
export type SajuInterpretation = FreeInterpretation & {
  career: string; love: string; caution: string
}
/** @deprecated FreeResult를 사용하세요 */
export type SajuResult = FreeResult & {
  interpretation: FreeInterpretation & { career: string; love: string; caution: string }
}
