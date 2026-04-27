// =====================================================
// tests/e2e/input.spec.ts
// 입력 화면 테스트예요. 가장 중요한 테스트 파일이에요.
//
// 비개발자 설명:
//   사용자가 정보를 입력하는 화면이 제대로 동작하는지 확인해요.
//   올바른 입력, 잘못된 입력, 빠진 입력 등 다양한 상황을 테스트해요.
// =====================================================

import { test, expect } from '@playwright/test'
import {
  fillBirthDate,
  selectGender,
  selectHour,
  fillAndSubmit,
  VALID_INPUT_A,
  VALID_INPUT_B,
  TIME_UNKNOWN_INPUT,
} from './helpers'

test.describe('입력 화면 — 화면 구성 확인', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/input')
  })

  // ── 테스트 1: 필수 항목이 모두 보이는지 ──────────────
  test('생년월일·양력음력·시간·성별 항목이 모두 보여야 해요', async ({ page }) => {
    // 생년월일 입력 칸
    await expect(page.getByPlaceholder('출생 연도')).toBeVisible()
    await expect(page.getByPlaceholder('월')).toBeVisible()
    await expect(page.getByPlaceholder('일')).toBeVisible()

    // 양력 / 음력 버튼
    await expect(page.getByRole('button', { name: '양력' })).toBeVisible()
    await expect(page.getByRole('button', { name: '음력' })).toBeVisible()

    // 출생 시간 선택과 "모름" 버튼
    await expect(page.locator('select')).toBeVisible()
    await expect(page.getByRole('button', { name: '모름' })).toBeVisible()

    // 성별 버튼
    await expect(page.getByRole('button', { name: '남성' })).toBeVisible()
    await expect(page.getByRole('button', { name: '여성' })).toBeVisible()

    // 제출 버튼
    await expect(page.getByRole('button', { name: '사주 풀어보기' })).toBeVisible()
  })

  // ── 테스트 2: 양력 기본 선택 확인 ───────────────────
  test('페이지 진입 시 양력이 기본 선택되어 있어야 해요', async ({ page }) => {
    // 양력 버튼이 활성화(amber) 스타일
    const solarBtn = page.getByRole('button', { name: '양력' })
    await expect(solarBtn).toHaveClass(/bg-amber-100/)
  })

  // ── 테스트 3: 모든 UI 텍스트가 한국어인지 ────────────
  test('페이지 제목과 레이블이 한국어여야 해요', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '내 사주 입력하기' })).toBeVisible()
    await expect(page.getByText('생년월일')).toBeVisible()
    await expect(page.getByText('출생 시간')).toBeVisible()
    await expect(page.getByText('성별')).toBeVisible()
    await expect(page.getByText('입력하신 정보는 저장되지 않아요')).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────

test.describe('입력 화면 — 유효성 검사 (에러 메시지)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/input')
  })

  // ── 테스트 4: 생년월일 없이 제출 ─────────────────────
  test('생년월일을 입력하지 않고 제출하면 한국어 오류 메시지가 보여야 해요', async ({ page }) => {
    // 성별만 선택하고 날짜는 비워둠
    await selectGender(page, 'male')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    // 한국어 오류 메시지 확인
    await expect(page.getByText('태어난 연도를 입력해 주세요')).toBeVisible()

    // 결과 페이지로 이동하면 안 됨
    await expect(page).toHaveURL('/input')
  })

  // ── 테스트 5: 성별 미선택 시 오류 ────────────────────
  test('성별을 선택하지 않으면 오류 메시지가 보여야 해요', async ({ page }) => {
    await fillBirthDate(page, '1995', '8', '12')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page.getByText('성별을 선택해 주세요')).toBeVisible()
    await expect(page).toHaveURL('/input')
  })

  // ── 테스트 6: 잘못된 날짜 (2월 30일) ─────────────────
  test('존재하지 않는 날짜(2월 30일)를 입력하면 오류 메시지가 보여야 해요', async ({ page }) => {
    await fillBirthDate(page, '1995', '2', '30')
    await selectGender(page, 'female')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    // "존재하지 않는 날짜" 오류 확인
    await expect(page.getByText(/존재하지 않는 날짜/)).toBeVisible()
    await expect(page).toHaveURL('/input')
  })

  // ── 테스트 7: 미래 연도 입력 ─────────────────────────
  test('미래 연도(2026년 이후)를 입력하면 오류 메시지가 보여야 해요', async ({ page }) => {
    // 앱의 연도 상한이 2025년이므로 2026년은 미래
    await fillBirthDate(page, '2026', '1', '1')
    await selectGender(page, 'male')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page.getByText(/1900년부터 2025년 사이/)).toBeVisible()
    await expect(page).toHaveURL('/input')
  })

  // ── 테스트 8: 월 범위 오류 ────────────────────────────
  test('13월처럼 잘못된 월을 입력하면 오류 메시지가 보여야 해요', async ({ page }) => {
    await fillBirthDate(page, '1995', '13', '1')
    await selectGender(page, 'male')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page.getByText(/1~12 사이/)).toBeVisible()
  })

  // ── 테스트 9: 에러 후 수정하면 에러가 사라지는지 ───────
  test('오류가 표시된 후 값을 수정하면 오류 메시지가 사라져야 해요', async ({ page }) => {
    // 연도 빈 칸으로 제출
    await selectGender(page, 'male')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()
    await expect(page.getByText('태어난 연도를 입력해 주세요')).toBeVisible()

    // 연도를 입력하면 에러 즉시 제거
    await page.getByPlaceholder('출생 연도').fill('1995')
    await expect(page.getByText('태어난 연도를 입력해 주세요')).not.toBeVisible()
  })

})

// ─────────────────────────────────────────────────────

test.describe('입력 화면 — 출생 시간 "모름" 기능', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/input')
  })

  // ── 테스트 10: 모름 클릭 시 select 비활성화 ──────────
  test('"모름" 버튼을 클릭하면 시간 선택란이 비활성화되어야 해요', async ({ page }) => {
    const select = page.locator('select')
    await expect(select).toBeEnabled()  // 처음엔 활성화

    await page.getByRole('button', { name: '모름' }).click()
    await expect(select).toBeDisabled() // 모름 선택 후 비활성화

    // 안내 문구 변경 확인
    await expect(page.getByText(/시주.*미상으로 표시/)).toBeVisible()
  })

  // ── 테스트 11: 모름 선택 후 결과 페이지로 이동 ─────────
  test('시간 "모름" 선택 후 정보를 모두 입력하면 결과 페이지로 이동해야 해요', async ({ page }) => {
    await fillBirthDate(page, TIME_UNKNOWN_INPUT.year, TIME_UNKNOWN_INPUT.month, TIME_UNKNOWN_INPUT.day)
    await selectHour(page, 'unknown')
    await selectGender(page, TIME_UNKNOWN_INPUT.gender)
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page).toHaveURL(/\/result/)
  })

})

// ─────────────────────────────────────────────────────

test.describe('입력 화면 — 정상 흐름', () => {

  // ── 테스트 12: 정상 입력 A (1995-08-12, 남성) ─────────
  test(`${VALID_INPUT_A.label} — 결과 페이지로 이동해야 해요`, async ({ page }) => {
    await page.goto('/input')
    await fillAndSubmit(page, VALID_INPUT_A)
    await expect(page).toHaveURL(/\/result/)
    await expect(page.getByText('1995년생의 사주')).toBeVisible()
  })

  // ── 테스트 13: 정상 입력 B (2001-11-03, 여성) ─────────
  test(`${VALID_INPUT_B.label} — 결과 페이지로 이동해야 해요`, async ({ page }) => {
    await page.goto('/input')
    await fillAndSubmit(page, VALID_INPUT_B)
    await expect(page).toHaveURL(/\/result/)
    await expect(page.getByText('2001년생의 사주')).toBeVisible()
  })

  // ── 테스트 14: 음력 선택 후 이동 ─────────────────────
  test('음력을 선택하고 제출하면 결과 페이지 URL에 calendar=lunar가 포함되어야 해요', async ({ page }) => {
    await page.goto('/input')
    await page.getByRole('button', { name: '음력' }).click()
    await fillBirthDate(page, '1990', '5', '10')
    await selectGender(page, 'female')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page).toHaveURL(/calendar=lunar/)
  })

})

// ─────────────────────────────────────────────────────

test.describe('입력 화면 — 경계값 테스트', () => {

  // ── 테스트 15: 오전 10시 59분 (경계 테스트 A) ─────────
  // 사주에서 시간은 2시간 단위(時)로 묶여요.
  // 巳時(사시): 9시~11시. 즉, 10:59는 巳時(value=9)에 해당해요.
  test('경계값 A — 1995-08-12, 10:59(巳時) → 결과 페이지로 이동해야 해요', async ({ page }) => {
    await page.goto('/input')
    // 10:59는 巳時(사시, value='9') 범위 안
    await fillBirthDate(page, '1995', '8', '12')
    await page.locator('select').selectOption('9') // 巳時
    await selectGender(page, 'male')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page).toHaveURL(/\/result/)
  })

  // ── 테스트 16: 오전 11시 정각 (경계 테스트 B) ─────────
  // 11:00은 午時(오시, value='11') 시작. 다른 時에 해당해요.
  test('경계값 B — 1995-08-12, 11:00(午時) → 결과 페이지로 이동해야 해요', async ({ page }) => {
    await page.goto('/input')
    await fillBirthDate(page, '1995', '8', '12')
    await page.locator('select').selectOption('11') // 午時
    await selectGender(page, 'male')
    await page.getByRole('button', { name: '사주 풀어보기' }).click()

    await expect(page).toHaveURL(/\/result/)
    // URL에 hour=11이 포함되어야 해요
    await expect(page).toHaveURL(/hour=11/)
  })

})

// ─────────────────────────────────────────────────────

test.describe('입력 화면 — 모바일 뷰포트', () => {

  test('모바일(390px)에서도 모든 입력 항목이 정상적으로 보여야 해요', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/input')

    await expect(page.getByPlaceholder('출생 연도')).toBeVisible()
    await expect(page.getByRole('button', { name: '양력' })).toBeVisible()
    await expect(page.getByRole('button', { name: '모름' })).toBeVisible()
    await expect(page.getByRole('button', { name: '남성' })).toBeVisible()
    await expect(page.getByRole('button', { name: '사주 풀어보기' })).toBeVisible()
  })

})
