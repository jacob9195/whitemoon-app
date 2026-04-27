// =====================================================
// tests/unit/validate.test.ts
// lib/utils/validate.ts 의 단위 테스트예요.
//
// 비개발자 설명:
//   "순수 함수" 테스트예요. 브라우저를 열 필요 없이
//   날짜 유효성 검사 로직이 맞는지만 빠르게 확인해요.
//   Playwright보다 훨씬 빠르게 실행돼요 (수백ms 이내).
// =====================================================

import { describe, it, expect } from 'vitest'
import { isValidDate, validateBirthForm } from '@/lib/utils/validate'

// ─────────────────────────────────────────────────────

describe('isValidDate — 날짜 존재 여부 확인', () => {

  it('정상 날짜: 1995-08-12는 유효해야 해요', () => {
    expect(isValidDate(1995, 8, 12)).toBe(true)
  })

  it('정상 날짜: 2000-02-29는 윤년이라 유효해야 해요', () => {
    expect(isValidDate(2000, 2, 29)).toBe(true)
  })

  it('잘못된 날짜: 2월 30일은 존재하지 않아야 해요', () => {
    expect(isValidDate(1995, 2, 30)).toBe(false)
  })

  it('잘못된 날짜: 윤년이 아닌 해의 2월 29일은 존재하지 않아야 해요', () => {
    expect(isValidDate(2001, 2, 29)).toBe(false)
  })

  it('잘못된 날짜: 4월 31일은 존재하지 않아야 해요', () => {
    expect(isValidDate(2000, 4, 31)).toBe(false)
  })

  it('정상 날짜: 12월 31일은 유효해야 해요', () => {
    expect(isValidDate(1990, 12, 31)).toBe(true)
  })

  it('정상 날짜: 1월 1일은 유효해야 해요', () => {
    expect(isValidDate(1900, 1, 1)).toBe(true)
  })

})

// ─────────────────────────────────────────────────────

describe('validateBirthForm — 입력 폼 전체 유효성 검사', () => {

  // ── 정상 케이스 ──────────────────────────────────────

  it('정상 입력 A (1995-08-12, 남성)은 에러가 없어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '8', day: '12', gender: 'male'
    })
    expect(result).toEqual({})
  })

  it('정상 입력 B (2001-11-03, 여성)은 에러가 없어야 해요', () => {
    const result = validateBirthForm({
      year: '2001', month: '11', day: '3', gender: 'female'
    })
    expect(result).toEqual({})
  })

  // ── 연도 오류 ────────────────────────────────────────

  it('연도가 빈 칸이면 "연도를 입력해 주세요" 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '', month: '8', day: '12', gender: 'male'
    })
    expect(result.year).toBe('태어난 연도를 입력해 주세요')
  })

  it('연도가 1899년이면 범위 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1899', month: '1', day: '1', gender: 'male'
    })
    expect(result.year).toContain('1900년')
  })

  it('미래 연도(2026년)이면 범위 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '2026', month: '1', day: '1', gender: 'male'
    })
    expect(result.year).toContain('2025년')
  })

  // ── 월 오류 ──────────────────────────────────────────

  it('월이 빈 칸이면 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '', day: '1', gender: 'male'
    })
    expect(result.month).toBeTruthy()
  })

  it('13월은 범위 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '13', day: '1', gender: 'male'
    })
    expect(result.month).toContain('1~12')
  })

  it('0월은 범위 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '0', day: '1', gender: 'male'
    })
    expect(result.month).toContain('1~12')
  })

  // ── 일 오류 ──────────────────────────────────────────

  it('32일은 범위 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '1', day: '32', gender: 'male'
    })
    expect(result.day).toContain('1~31')
  })

  it('0일은 범위 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '1', day: '0', gender: 'male'
    })
    expect(result.day).toContain('1~31')
  })

  // ── 날짜 조합 오류 ───────────────────────────────────

  it('2월 30일은 "존재하지 않는 날짜" 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '2', day: '30', gender: 'male'
    })
    expect(result.birth).toContain('존재하지 않는 날짜')
  })

  it('4월 31일은 "존재하지 않는 날짜" 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '2000', month: '4', day: '31', gender: 'female'
    })
    expect(result.birth).toContain('존재하지 않는 날짜')
  })

  it('2월 29일(윤년이 아닌 해)은 "존재하지 않는 날짜" 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '2001', month: '2', day: '29', gender: 'male'
    })
    expect(result.birth).toContain('존재하지 않는 날짜')
  })

  it('2월 29일(윤년 2000년)은 에러가 없어야 해요', () => {
    const result = validateBirthForm({
      year: '2000', month: '2', day: '29', gender: 'female'
    })
    expect(result.birth).toBeUndefined()
  })

  // ── 성별 오류 ────────────────────────────────────────

  it('성별 미선택이면 "성별을 선택해 주세요" 에러가 있어야 해요', () => {
    const result = validateBirthForm({
      year: '1995', month: '8', day: '12', gender: null
    })
    expect(result.gender).toBe('성별을 선택해 주세요')
  })

  it('성별을 선택하면 성별 에러가 없어야 해요', () => {
    const resultMale = validateBirthForm({ year: '1995', month: '8', day: '12', gender: 'male' })
    expect(resultMale.gender).toBeUndefined()

    const resultFemale = validateBirthForm({ year: '1995', month: '8', day: '12', gender: 'female' })
    expect(resultFemale.gender).toBeUndefined()
  })

  // ── 다중 오류 ────────────────────────────────────────

  it('연도·성별이 모두 없으면 두 가지 에러가 모두 있어야 해요', () => {
    const result = validateBirthForm({
      year: '', month: '8', day: '12', gender: null
    })
    expect(result.year).toBeTruthy()
    expect(result.gender).toBeTruthy()
  })

})
