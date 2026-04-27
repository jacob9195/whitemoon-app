// =====================================================
// tests/unit/getSajuResult.test.ts
//
// 이 파일이 API 테스트의 핵심이에요.
//
// 비개발자 설명:
//   "어떤 입력을 넣으면 어떤 결과가 나와야 하는가"를 검사해요.
//   브라우저 없이 함수만 직접 호출해서 빠르게 확인해요.
//
//   성공 케이스: 올바른 입력 → ok: true + 사주 결과 구조 확인
//   실패 케이스: 잘못된 입력 → ok: false + 한국어 오류 메시지 확인
// =====================================================

import { describe, it, expect } from 'vitest'
import { getSajuResult } from '@/lib/saju/getSajuResult'
import type { SajuRequest } from '@/lib/saju/getSajuResult'

// ── 테스트용 입력 예시 모음 ────────────────────────────
const INPUT_A: SajuRequest = {
  year: '1995', month: '8', day: '12',
  calendarType: 'solar', hour: '13', gender: 'male',
}

const INPUT_B: SajuRequest = {
  year: '2001', month: '11', day: '3',
  calendarType: 'solar', hour: '9', gender: 'female',
}

const INPUT_TIME_UNKNOWN: SajuRequest = {
  year: '1995', month: '8', day: '12',
  calendarType: 'solar', hour: 'unknown', gender: 'male',
}

const INPUT_FUTURE: SajuRequest = {
  year: '2026', month: '1', day: '1',
  calendarType: 'solar', hour: '10', gender: 'male',
}

// =======================================================

describe('성공 케이스 — 정상 입력', () => {

  it('정상 입력 A (1995-08-12, 양력, 13시, 남성) — ok:true 반환', () => {
    const res = getSajuResult(INPUT_A)
    expect(res.ok).toBe(true)
  })

  it('정상 입력 B (2001-11-03, 양력, 9시, 여성) — ok:true 반환', () => {
    const res = getSajuResult(INPUT_B)
    expect(res.ok).toBe(true)
  })

  it('성공 응답에 fourPillars(사주팔자) 4개 기둥이 포함되어야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    const { fourPillars } = res.result
    expect(fourPillars).toHaveProperty('year')
    expect(fourPillars).toHaveProperty('month')
    expect(fourPillars).toHaveProperty('day')
    expect(fourPillars).toHaveProperty('time')
    expect(fourPillars.year.heavenlyStem).toBeTruthy()
    expect(fourPillars.year.stemReading).toBeTruthy()
  })

  it('성공 응답에 fiveElements(오행 분포) 5개 항목이 포함되어야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    const { fiveElements } = res.result
    expect(typeof fiveElements.wood).toBe('number')
    expect(typeof fiveElements.fire).toBe('number')
    expect(typeof fiveElements.earth).toBe('number')
    expect(typeof fiveElements.metal).toBe('number')
    expect(typeof fiveElements.water).toBe('number')
    expect(fiveElements.strongest).toBeTruthy()
    expect(fiveElements.weakest).toBeTruthy()
  })

  it('오행 비율(wood+fire+earth+metal+water)의 합이 100이어야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    const { wood, fire, earth, metal, water } = res.result.fiveElements
    expect(wood + fire + earth + metal + water).toBe(100)
  })

  it('성공 응답에 interpretation(해석) — 성향·직업·연애·주의점이 포함되어야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    const { interpretation } = res.result
    expect(interpretation.personality).toBeTruthy()
    expect(interpretation.career).toBeTruthy()
    expect(interpretation.love).toBeTruthy()
    expect(interpretation.caution).toBeTruthy()
    expect(interpretation.fiveElementsSummary).toBeTruthy()
  })

  it('성공 응답의 result.input에 입력값이 그대로 담겨야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.input.year).toBe(1995)
    expect(res.result.input.month).toBe(8)
    expect(res.result.input.day).toBe(12)
    expect(res.result.input.gender).toBe('male')
    expect(res.result.input.calendarType).toBe('solar')
  })

  it('현재 mock 단계이므로 isMock 값이 true여야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.isMock).toBe(true)
  })

  it('같은 입력으로 2번 요청하면 사주팔자·오행 결과가 동일해야 해요', () => {
    const res1 = getSajuResult(INPUT_A)
    const res2 = getSajuResult(INPUT_A)
    if (!res1.ok || !res2.ok) throw new Error('둘 다 성공 응답이어야 해요')
    expect(res1.result.fourPillars).toEqual(res2.result.fourPillars)
    expect(res1.result.fiveElements).toEqual(res2.result.fiveElements)
  })

  it('음력(lunar) 입력 — ok:true, calendarType이 lunar로 저장되어야 해요', () => {
    const res = getSajuResult({ ...INPUT_A, calendarType: 'lunar' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.result.input.calendarType).toBe('lunar')
  })

})

// =======================================================

describe('출생 시간 "모름" 처리', () => {

  it('hour=unknown 입력 시 허용되어 ok:true를 반환해야 해요', () => {
    const res = getSajuResult(INPUT_TIME_UNKNOWN)
    expect(res.ok).toBe(true)
  })

  it('hour=unknown이면 fourPillars.time이 null이어야 해요 (시주 미상)', () => {
    const res = getSajuResult(INPUT_TIME_UNKNOWN)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.fourPillars.time).toBeNull()
  })

  it('hour=null 입력 시에도 fourPillars.time이 null이어야 해요', () => {
    const res = getSajuResult({ ...INPUT_A, hour: null })
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.fourPillars.time).toBeNull()
  })

  it('hour 값이 있으면 fourPillars.time이 null이 아니어야 해요', () => {
    const res = getSajuResult(INPUT_A)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.fourPillars.time).not.toBeNull()
  })

  it('hour=unknown이어도 연주·월주·일주와 해석 문장은 정상 반환되어야 해요', () => {
    const res = getSajuResult(INPUT_TIME_UNKNOWN)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.fourPillars.year).toBeTruthy()
    expect(res.result.fourPillars.month).toBeTruthy()
    expect(res.result.fourPillars.day).toBeTruthy()
    expect(res.result.interpretation.personality).toBeTruthy()
  })

  it('hour=unknown이면 result.input.hour가 null이어야 해요', () => {
    const res = getSajuResult(INPUT_TIME_UNKNOWN)
    if (!res.ok) throw new Error('성공 응답이어야 해요')
    expect(res.result.input.hour).toBeNull()
  })

})

// =======================================================

describe('실패 케이스 — 입력 오류', () => {

  it('year 누락 시 ok:false + 한국어 오류 메시지 반환', () => {
    const res = getSajuResult({ ...INPUT_A, year: null })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.year).toContain('연도')
  })

  it('month 누락 시 ok:false + 한국어 오류 메시지 반환', () => {
    const res = getSajuResult({ ...INPUT_A, month: null })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.month).toContain('월')
  })

  it('day 누락 시 ok:false + 한국어 오류 메시지 반환', () => {
    const res = getSajuResult({ ...INPUT_A, day: null })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.day).toContain('일')
  })

  it('year·month·day 모두 누락 시 3개 오류 메시지가 반환되어야 해요', () => {
    const res = getSajuResult({ ...INPUT_A, year: null, month: null, day: null })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.year).toBeTruthy()
    expect(res.errors.month).toBeTruthy()
    expect(res.errors.day).toBeTruthy()
  })

  it('4월 31일 입력 시 ok:false + "존재하지 않는 날짜" 오류 반환', () => {
    const res = getSajuResult({ ...INPUT_A, month: '4', day: '31' })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.birth).toContain('존재하지 않는 날짜')
  })

  it('평년(2001년) 2월 29일 입력 시 ok:false 반환', () => {
    const res = getSajuResult({ ...INPUT_A, year: '2001', month: '2', day: '29' })
    expect(res.ok).toBe(false)
  })

  it('미래 연도(2026년) 입력 시 ok:false + 연도 범위 오류 반환', () => {
    const res = getSajuResult(INPUT_FUTURE)
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.year).toContain('2025년')
  })

  it('1899년 입력 시 ok:false + 연도 범위 오류 반환', () => {
    const res = getSajuResult({ ...INPUT_A, year: '1899' })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.year).toContain('1900년')
  })

  it('calendarType 누락 시 ok:false + 한국어 오류 메시지 반환', () => {
    const res = getSajuResult({ ...INPUT_A, calendarType: null })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.calendarType).toContain('양력 또는 음력')
  })

  it('calendarType에 잘못된 값("weekly") 입력 시 ok:false 반환', () => {
    const res = getSajuResult({ ...INPUT_A, calendarType: 'weekly' })
    expect(res.ok).toBe(false)
  })

  it('gender 누락 시 ok:false + 한국어 오류 메시지 반환', () => {
    const res = getSajuResult({ ...INPUT_A, gender: null })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.gender).toContain('성별')
  })

  it('gender에 잘못된 값("other") 입력 시 ok:false 반환', () => {
    const res = getSajuResult({ ...INPUT_A, gender: 'other' })
    expect(res.ok).toBe(false)
  })

  it('year에 문자("abc") 입력 시 ok:false 반환', () => {
    const res = getSajuResult({ ...INPUT_A, year: 'abc' })
    expect(res.ok).toBe(false)
  })

  it('13월 입력 시 ok:false + 월 범위 오류 반환', () => {
    const res = getSajuResult({ ...INPUT_A, month: '13' })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.month).toContain('1~12')
  })

  it('32일 입력 시 ok:false + 일 범위 오류 반환', () => {
    const res = getSajuResult({ ...INPUT_A, day: '32' })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.errors.day).toContain('1~31')
  })

})

// =======================================================

describe('경계값 테스트', () => {

  it('1900년(최솟값) 입력 — ok:true 반환', () => {
    expect(getSajuResult({ ...INPUT_A, year: '1900' }).ok).toBe(true)
  })

  it('2025년(최댓값) 입력 — ok:true 반환', () => {
    expect(getSajuResult({ ...INPUT_A, year: '2025', month: '1', day: '1' }).ok).toBe(true)
  })

  it('2026년(최댓값+1) 입력 — ok:false 반환', () => {
    expect(getSajuResult({ ...INPUT_A, year: '2026', month: '1', day: '1' }).ok).toBe(false)
  })

  it('윤년 2000년 2월 29일 — ok:true 반환', () => {
    expect(getSajuResult({ ...INPUT_A, year: '2000', month: '2', day: '29' }).ok).toBe(true)
  })

  it('평년 2001년 2월 29일 — ok:false 반환', () => {
    expect(getSajuResult({ ...INPUT_A, year: '2001', month: '2', day: '29' }).ok).toBe(false)
  })

  it('hour=0(자정) 입력 — 허용, result.input.hour가 0이어야 해요', () => {
    const res = getSajuResult({ ...INPUT_A, hour: '0' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.result.input.hour).toBe(0)
  })

  it('hour=23(밤 11시) 입력 — 허용, result.input.hour가 23이어야 해요', () => {
    const res = getSajuResult({ ...INPUT_A, hour: '23' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.result.input.hour).toBe(23)
  })

  it('hour=24(범위 초과) — 오류 없이 null로 처리되어야 해요', () => {
    const res = getSajuResult({ ...INPUT_A, hour: '24' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.result.input.hour).toBeNull()
  })

})
