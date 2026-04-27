/**
 * lib/mock/mockResult.ts
 *
 * 실제 사주 계산 엔진 기반 결과 생성 (더 이상 mock 아님)
 */

import type { BirthInput, FreeResult, PremiumResult } from '@/lib/saju/types'
import { calculateSaju, type BirthInput as EngineInput } from '@/lib/saju-engine/calculator'
import { interpretChart } from '@/lib/saju-engine/interpreter'
import { STEM_INFO, BRANCH_INFO, ELEMENT_KOR } from '@/lib/saju-engine/constants'
import type { FiveElementKey } from '@/lib/saju-engine/constants'

function toEngineInput(input: BirthInput): EngineInput {
  return {
    year: input.year, month: input.month, day: input.day,
    hour: input.hour, minute: 0,
    gender: input.gender, calendarType: input.calendarType,
  }
}

function convertPillar(p: { stem: string; branch: string; stemKor: string; branchKor: string }) {
  const stem   = p.stem as Parameters<typeof STEM_INFO.__check__>[0] extends never ? any : any
  const branch = p.branch as any
  return {
    heavenlyStem:  p.stem as any,
    earthlyBranch: p.branch as any,
    stemReading:   p.stemKor,
    branchReading: p.branchKor,
    stemMeaning:   (STEM_INFO as any)[p.stem]?.meaning ?? '',
    branchMeaning: (BRANCH_INFO as any)[p.branch]?.meaning ?? '',
  }
}

function mapElementToKor(el: string): '목' | '화' | '토' | '금' | '수' {
  const m: Record<string, '목'|'화'|'토'|'금'|'수'> = { wood:'목', fire:'화', earth:'토', metal:'금', water:'수' }
  return m[el] ?? '목'
}

export function getMockFreeResult(input: BirthInput): FreeResult {
  const chart = calculateSaju(toEngineInput(input))
  const interp = interpretChart(chart, input.year)
  const { fourPillars: fp, elementBalance: fe } = chart

  const fiveElements = {
    wood: fe.woodPct, fire: fe.firePct, earth: fe.earthPct, metal: fe.metalPct, water: fe.waterPct,
    strongest: mapElementToKor(fe.dominant),
    weakest:   mapElementToKor(fe.deficient),
  }

  const fourPillars = {
    year:  convertPillar(fp.year),
    month: convertPillar(fp.month),
    day:   convertPillar(fp.day),
    time:  fp.hour ? convertPillar(fp.hour) : null,
  }

  const defKor = (ELEMENT_KOR as any)[fe.deficient] ?? fe.deficient
  const domKor = (ELEMENT_KOR as any)[fe.dominant]  ?? fe.dominant

  return {
    input,
    isMock: false,
    certaintyLevel: chart.certaintyLevel,
    warnings: chart.warnings,
    fourPillars,
    fiveElements,
    interpretation: {
      fiveElementsSummary: `오행 분포: 목(${fe.woodPct}%)·화(${fe.firePct}%)·토(${fe.earthPct}%)·금(${fe.metalPct}%)·수(${fe.waterPct}%). ${domKor}이 가장 강하고 ${defKor}이 가장 약한 구조입니다.`,
      personality:  interp.personality,
      careerTeaser: interp.career.split('\n').slice(0, 2).join(' '),
      loveTeaser:   interp.love.split('\n').slice(0, 2).join(' '),
    },
  }
}

export function getMockPremiumResult(input: BirthInput): PremiumResult {
  const chart = calculateSaju(toEngineInput(input))
  const interp = interpretChart(chart, input.year)
  const { fourPillars: fp, elementBalance: fe } = chart
  const currentYear = new Date().getFullYear()

  const fiveElements = {
    wood: fe.woodPct, fire: fe.firePct, earth: fe.earthPct, metal: fe.metalPct, water: fe.waterPct,
    strongest: mapElementToKor(fe.dominant),
    weakest:   mapElementToKor(fe.deficient),
  }

  const fourPillars = {
    year:  convertPillar(fp.year),
    month: convertPillar(fp.month),
    day:   convertPillar(fp.day),
    time:  fp.hour ? convertPillar(fp.hour) : null,
  }

  const defKor = (ELEMENT_KOR as any)[fe.deficient] ?? fe.deficient
  const domKor = (ELEMENT_KOR as any)[fe.dominant]  ?? fe.dominant

  const colorMap: Record<string,string> = { wood:'초록·청색', fire:'빨강·주황', earth:'황색·갈색', metal:'흰색·금색', water:'검정·청색' }
  const dirMap: Record<string,string>   = { wood:'동쪽', fire:'남쪽', earth:'중앙', metal:'서쪽', water:'북쪽' }
  const actMap: Record<string,string>   = { wood:'산책·원예', fire:'운동·사교', earth:'명상·정리', metal:'독서·음악', water:'수영·여행' }

  return {
    input,
    isMock: false,
    certaintyLevel: chart.certaintyLevel,
    warnings: chart.warnings,
    fourPillars,
    fiveElements,
    interpretation: {
      fiveElementsSummary: `오행 분포: 목(${fe.woodPct}%)·화(${fe.firePct}%)·토(${fe.earthPct}%)·금(${fe.metalPct}%)·수(${fe.waterPct}%). ${domKor}이 가장 강하고 ${defKor}이 가장 약한 구조입니다.`,
      personality:  interp.personality,
      career:       interp.career,
      love:         interp.love,
      caution:      interp.keyWeaknesses.map(w => `· ${w}`).join('\n') + '\n\n' + interp.actionGuide,
      yearFortune:  `${currentYear}년(${currentYear - input.year + 1}세) ` + interp.yearlyFlow,
      monthlyFlow:  ['1~2월: 관계와 활동에 집중', '3~4월: 계획 점검', '5~6월: 적극적 추진', '7~8월: 내실 강화', '9~10월: 성과 마무리', '11~12월: 다음 해 준비'].join('\n'),
      luckyTip:     `부족한 ${defKor} 기운 보완:\n· 행운 색상: ${colorMap[fe.deficient]??''}\n· 유리한 방향: ${dirMap[fe.deficient]??''}\n· 추천 활동: ${actMap[fe.deficient]??''}`,
    },
  }
}

/** @deprecated */
export function getMockResult(input: BirthInput) {
  const free = getMockFreeResult(input)
  return {
    ...free,
    interpretation: {
      ...free.interpretation,
      career:  free.interpretation.careerTeaser,
      love:    free.interpretation.loveTeaser,
      caution: '상세 해석은 프리미엄 리포트에서 확인하세요.',
    },
  }
}
