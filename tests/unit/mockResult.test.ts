// =====================================================
// tests/unit/mockResult.test.ts
//
// mock 응답 구조가 타입 스펙(types.ts)에 맞는지 검증해요.
//
// 비개발자 설명:
//   나중에 실제 계산 모듈로 교체할 때, 이 테스트를 그대로 재사용할 수 있어요.
//   "mock 데이터가 정해진 모양을 지키고 있는가"를 확인하는 안전망이에요.
//   실제 계산 모듈이 연결되면 getMockResult 대신 calculateSaju를 넣으면 돼요.
// =====================================================

import { describe, it, expect } from 'vitest'
import { getMockResult } from '@/lib/mock/mockResult'
import type { BirthInput } from '@/lib/saju/types'

// ── 테스트용 BirthInput 예시 ─────────────────────────
const BASE_INPUT: BirthInput = {
  year: 1995, month: 8, day: 12,
  hour: 13,
  gender: 'male',
  calendarType: 'solar',
}

const INPUT_NO_HOUR: BirthInput = {
  ...BASE_INPUT,
  hour: null,
}

// ─────────────────────────────────────────────────────────────────────

describe('getMockResult — 최상위 구조', () => {

  it('반환값에 input·fourPillars·fiveElements·interpretation·isMock이 있어야 해요', () => {
    const result = getMockResult(BASE_INPUT)

    expect(result).toHaveProperty('input')
    expect(result).toHaveProperty('fourPillars')
    expect(result).toHaveProperty('fiveElements')
    expect(result).toHaveProperty('interpretation')
    expect(result).toHaveProperty('isMock')
  })

  it('isMock이 true여야 해요 (실제 계산 전 단계)', () => {
    const result = getMockResult(BASE_INPUT)
    expect(result.isMock).toBe(true)
  })

  it('result.input이 넘겨준 BirthInput과 동일해야 해요', () => {
    const result = getMockResult(BASE_INPUT)
    expect(result.input).toEqual(BASE_INPUT)
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('getMockResult — fourPillars 구조', () => {

  it('year·month·day 기둥이 모두 Pillar 객체여야 해요', () => {
    const result = getMockResult(BASE_INPUT)
    const { year, month, day } = result.fourPillars

    for (const pillar of [year, month, day]) {
      expect(pillar).toHaveProperty('heavenlyStem')
      expect(pillar).toHaveProperty('earthlyBranch')
      expect(pillar).toHaveProperty('stemReading')
      expect(pillar).toHaveProperty('branchReading')
      expect(pillar).toHaveProperty('stemMeaning')
      expect(pillar).toHaveProperty('branchMeaning')
    }
  })

  it('heavenlyStem이 유효한 천간 한자여야 해요', () => {
    const VALID_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
    const result = getMockResult(BASE_INPUT)

    expect(VALID_STEMS).toContain(result.fourPillars.year.heavenlyStem)
    expect(VALID_STEMS).toContain(result.fourPillars.month.heavenlyStem)
    expect(VALID_STEMS).toContain(result.fourPillars.day.heavenlyStem)
  })

  it('earthlyBranch가 유효한 지지 한자여야 해요', () => {
    const VALID_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
    const result = getMockResult(BASE_INPUT)

    expect(VALID_BRANCHES).toContain(result.fourPillars.year.earthlyBranch)
    expect(VALID_BRANCHES).toContain(result.fourPillars.month.earthlyBranch)
    expect(VALID_BRANCHES).toContain(result.fourPillars.day.earthlyBranch)
  })

  it('hour가 있으면 time 기둥이 Pillar 객체여야 해요', () => {
    const result = getMockResult(BASE_INPUT) // hour: 13
    expect(result.fourPillars.time).not.toBeNull()
    expect(result.fourPillars.time).toHaveProperty('heavenlyStem')
  })

  it('hour가 null이면 time 기둥이 null이어야 해요', () => {
    const result = getMockResult(INPUT_NO_HOUR)
    expect(result.fourPillars.time).toBeNull()
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('getMockResult — fiveElements 구조', () => {

  it('목·화·토·금·수가 모두 숫자여야 해요', () => {
    const { fiveElements: fe } = getMockResult(BASE_INPUT)

    expect(typeof fe.wood).toBe('number')
    expect(typeof fe.fire).toBe('number')
    expect(typeof fe.earth).toBe('number')
    expect(typeof fe.metal).toBe('number')
    expect(typeof fe.water).toBe('number')
  })

  it('각 오행 값이 0~100 범위여야 해요', () => {
    const { fiveElements: fe } = getMockResult(BASE_INPUT)

    for (const val of [fe.wood, fe.fire, fe.earth, fe.metal, fe.water]) {
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThanOrEqual(100)
    }
  })

  it('오행 합계가 100이어야 해요', () => {
    const { fiveElements: fe } = getMockResult(BASE_INPUT)
    const total = fe.wood + fe.fire + fe.earth + fe.metal + fe.water
    expect(total).toBe(100)
  })

  it('strongest가 유효한 오행이어야 해요', () => {
    const { fiveElements: fe } = getMockResult(BASE_INPUT)
    expect(['목','화','토','금','수']).toContain(fe.strongest)
  })

  it('weakest가 유효한 오행이어야 해요', () => {
    const { fiveElements: fe } = getMockResult(BASE_INPUT)
    expect(['목','화','토','금','수']).toContain(fe.weakest)
  })

  it('strongest와 weakest가 서로 달라야 해요', () => {
    const { fiveElements: fe } = getMockResult(BASE_INPUT)
    expect(fe.strongest).not.toBe(fe.weakest)
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('getMockResult — interpretation 구조', () => {

  it('personality·career·love·caution·fiveElementsSummary가 모두 비어있지 않은 문자열이어야 해요', () => {
    const { interpretation } = getMockResult(BASE_INPUT)

    for (const [key, val] of Object.entries(interpretation)) {
      expect(typeof val).toBe('string')
      expect(val.length).toBeGreaterThan(0)
    }
  })

  it('모든 interpretation 문장에 한국어가 포함되어야 해요', () => {
    const { interpretation } = getMockResult(BASE_INPUT)
    const hasKorean = (s: string) => /[\uAC00-\uD7A3]/.test(s)

    expect(hasKorean(interpretation.personality)).toBe(true)
    expect(hasKorean(interpretation.career)).toBe(true)
    expect(hasKorean(interpretation.love)).toBe(true)
    expect(hasKorean(interpretation.caution)).toBe(true)
    expect(hasKorean(interpretation.fiveElementsSummary)).toBe(true)
  })

  it('interpretation 문장에 단정적 표현("~입니다")이 없어야 해요 (문체 규칙)', () => {
    // CLAUDE.md 문체 규칙: "~편이에요", "~수 있어요" 사용. "~입니다" 금지
    const { interpretation } = getMockResult(BASE_INPUT)
    const allTexts = Object.values(interpretation).join(' ')

    // "입니다"가 포함되어 있으면 문체 규칙 위반
    expect(allTexts).not.toMatch(/입니다[.。]?$/)
  })

})
