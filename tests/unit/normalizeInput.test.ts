// =====================================================
// tests/unit/normalizeInput.test.ts
//
// 입력 정규화 함수 테스트예요.
//
// 비개발자 설명:
//   사용자가 입력한 문자열("1995", "unknown", "solar" 등)을
//   계산에 쓸 수 있는 숫자/타입으로 올바르게 바꾸는지 검사해요.
//   브라우저 없이 순수하게 함수만 호출하므로 매우 빠르게 실행돼요.
// =====================================================

import { describe, it, expect } from 'vitest'
import {
  parseHour,
  parseCalendarType,
  parseGender,
  normalizeBirthInput,
} from '@/lib/saju/normalizeInput'
import type { RawBirthInput } from '@/lib/saju/normalizeInput'

// ─────────────────────────────────────────────────────────────────────

describe('parseHour — 시각 문자열 파싱', () => {

  // ── null / 빈 값 → null ──────────────────────────
  it('null → null (시주 미상)', () => {
    expect(parseHour(null)).toBeNull()
  })

  it('빈 문자열("") → null', () => {
    expect(parseHour('')).toBeNull()
  })

  it('"unknown" → null (모름 선택)', () => {
    expect(parseHour('unknown')).toBeNull()
  })

  it('" unknown " (앞뒤 공백) → null', () => {
    expect(parseHour(' unknown ')).toBeNull()
  })

  // ── 정상 숫자 ────────────────────────────────────
  it('"0" → 0', () => expect(parseHour('0')).toBe(0))
  it('"9" → 9', () => expect(parseHour('9')).toBe(9))
  it('"13" → 13', () => expect(parseHour('13')).toBe(13))
  it('"23" → 23', () => expect(parseHour('23')).toBe(23))

  // ── 범위 초과 → null (오류 없이 무시) ────────────
  it('"24" → null (범위 초과, 오류 없음)', () => {
    expect(parseHour('24')).toBeNull()
  })

  it('"-1" → null (음수)', () => {
    expect(parseHour('-1')).toBeNull()
  })

  // ── 잘못된 형식 → null ───────────────────────────
  it('"abc" → null (숫자 아님)', () => {
    expect(parseHour('abc')).toBeNull()
  })

  it('"1.5" → null (소수)', () => {
    expect(parseHour('1.5')).toBeNull()
  })

  it('"09:10" → null (시:분 형식은 지원 안 해요)', () => {
    expect(parseHour('09:10')).toBeNull()
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('parseCalendarType — 양력/음력 파싱', () => {

  it('"solar" → "solar"', () => {
    expect(parseCalendarType('solar')).toBe('solar')
  })

  it('"lunar" → "lunar"', () => {
    expect(parseCalendarType('lunar')).toBe('lunar')
  })

  it('null → "solar" (기본값)', () => {
    expect(parseCalendarType(null)).toBe('solar')
  })

  it('빈 문자열 → "solar" (기본값)', () => {
    expect(parseCalendarType('')).toBe('solar')
  })

  it('잘못된 값("weekly") → "solar" (기본값)', () => {
    expect(parseCalendarType('weekly')).toBe('solar')
  })

  it('대소문자 구분: "Solar" → "solar" (기본값)', () => {
    // 엄격한 소문자 매칭
    expect(parseCalendarType('Solar')).toBe('solar')
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('parseGender — 성별 파싱', () => {

  it('"male" → "male"', () => {
    expect(parseGender('male')).toBe('male')
  })

  it('"female" → "female"', () => {
    expect(parseGender('female')).toBe('female')
  })

  it('null → null', () => {
    expect(parseGender(null)).toBeNull()
  })

  it('빈 문자열 → null', () => {
    expect(parseGender('')).toBeNull()
  })

  it('"other" → null (허용하지 않음)', () => {
    expect(parseGender('other')).toBeNull()
  })

  it('"Male" (대문자) → null (엄격한 소문자 매칭)', () => {
    expect(parseGender('Male')).toBeNull()
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('normalizeBirthInput — 전체 정규화 (정상 케이스)', () => {

  const VALID_RAW: RawBirthInput = {
    year: '1995', month: '8', day: '12',
    hour: '14',
    gender: 'male',
    calendarType: 'solar',
  }

  it('정상 입력 A → ok:true와 BirthInput을 반환해야 해요', () => {
    const result = normalizeBirthInput(VALID_RAW)
    expect(result.ok).toBe(true)
  })

  it('정규화된 input의 year·month·day가 숫자여야 해요', () => {
    const result = normalizeBirthInput(VALID_RAW)
    if (!result.ok) throw new Error('ok가 true여야 해요')

    expect(result.input.year).toBe(1995)
    expect(result.input.month).toBe(8)
    expect(result.input.day).toBe(12)
  })

  it('정규화된 input.hour가 숫자여야 해요', () => {
    const result = normalizeBirthInput(VALID_RAW)
    if (!result.ok) throw new Error('ok가 true여야 해요')
    expect(result.input.hour).toBe(14)
  })

  it('"unknown" hour → input.hour가 null이어야 해요', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, hour: 'unknown' })
    if (!result.ok) throw new Error('ok가 true여야 해요')
    expect(result.input.hour).toBeNull()
  })

  it('null hour → input.hour가 null이어야 해요', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, hour: null })
    if (!result.ok) throw new Error('ok가 true여야 해요')
    expect(result.input.hour).toBeNull()
  })

  it('"lunar" calendarType → input.calendarType이 "lunar"여야 해요', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, calendarType: 'lunar' })
    if (!result.ok) throw new Error('ok가 true여야 해요')
    expect(result.input.calendarType).toBe('lunar')
  })

  it('null calendarType → input.calendarType이 기본값 "solar"여야 해요', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, calendarType: null })
    if (!result.ok) throw new Error('ok가 true여야 해요')
    expect(result.input.calendarType).toBe('solar')
  })

  it('정상 입력 B (2001-11-03, female) → ok:true', () => {
    const result = normalizeBirthInput({
      year: '2001', month: '11', day: '3',
      hour: '9', gender: 'female', calendarType: 'solar',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.input.year).toBe(2001)
    expect(result.input.gender).toBe('female')
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('normalizeBirthInput — 전체 정규화 (실패 케이스)', () => {

  const VALID_RAW: RawBirthInput = {
    year: '1995', month: '8', day: '12',
    hour: '14', gender: 'male', calendarType: 'solar',
  }

  it('year가 null → ok:false와 year 오류', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, year: null })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.year).toBeDefined()
  })

  it('year가 "abc" → ok:false', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, year: 'abc' })
    expect(result.ok).toBe(false)
  })

  it('month가 null → ok:false와 month 오류', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, month: null })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.month).toBeDefined()
  })

  it('day가 null → ok:false와 day 오류', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, day: null })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.day).toBeDefined()
  })

  it('gender가 null → ok:false와 gender 오류', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, gender: null })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.gender).toBeDefined()
  })

  it('gender가 "other" → ok:false', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, gender: 'other' })
    expect(result.ok).toBe(false)
  })

  it('year·month·gender 모두 null → 3개 오류', () => {
    const result = normalizeBirthInput({
      ...VALID_RAW, year: null, month: null, gender: null
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(3)
  })

  // 범위 초과 hour는 오류 없이 null 처리 (normalizeBirthInput의 관심사 아님)
  it('hour가 "99"(범위 초과) → ok:true이고 input.hour는 null이어야 해요', () => {
    const result = normalizeBirthInput({ ...VALID_RAW, hour: '99' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.input.hour).toBeNull()
  })

})
