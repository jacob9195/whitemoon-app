// =====================================================
// tests/e2e/result.spec.ts
// 결과 화면 테스트예요.
//
// 비개발자 설명:
//   사주 결과 화면의 모든 섹션이 올바르게 보이는지,
//   시간 미입력 시 안내 문구가 표시되는지 확인해요.
//   지금은 mock 데이터이므로 "어떤 섹션이 보이는가"만 검사해요.
// =====================================================

import { test, expect } from '@playwright/test'
import { fillAndSubmit, TIME_UNKNOWN_INPUT, VALID_INPUT_A, VALID_INPUT_B } from './helpers'

// 입력 페이지에서 제출해 결과 페이지로 이동하는 공통 헬퍼
async function goToResult(page: any, input: typeof VALID_INPUT_A) {
  await page.goto('/input')
  await fillAndSubmit(page, input)
  await page.waitForURL(/\/result/)
}

// ─────────────────────────────────────────────────────

test.describe('결과 화면 — 시간 입력한 경우', () => {

  test.beforeEach(async ({ page }) => {
    await goToResult(page, VALID_INPUT_A)
  })

  // ── 테스트 1: 결과 페이지 제목 확인 ─────────────────
  test('결과 페이지에 사용자 생년이 제목에 표시되어야 해요', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '1995년생의 사주' })).toBeVisible()
  })

  // ── 테스트 2: 입력 정보 표시 확인 ───────────────────
  test('양력/생년월일/성별 정보가 부제목에 표시되어야 해요', async ({ page }) => {
    await expect(page.getByText(/양력.*1995년.*8월.*12일/)).toBeVisible()
    await expect(page.getByText(/남성/)).toBeVisible()
  })

  // ── 테스트 3: 4개 섹션이 모두 보이는지 ──────────────
  test('사주팔자·오행 분포·성향 요약·인생 가이드 섹션이 모두 보여야 해요', async ({ page }) => {
    await expect(page.getByText('사주팔자 四柱八字')).toBeVisible()
    await expect(page.getByText('오행 분포 五行')).toBeVisible()
    await expect(page.getByText('성향 요약')).toBeVisible()
    await expect(page.getByText('인생 가이드')).toBeVisible()
  })

  // ── 테스트 4: 오행 5가지가 모두 보이는지 ─────────────
  test('오행(목·화·토·금·수) 5가지가 모두 표시되어야 해요', async ({ page }) => {
    await expect(page.getByText(/목.*木/)).toBeVisible()
    await expect(page.getByText(/화.*火/)).toBeVisible()
    await expect(page.getByText(/토.*土/)).toBeVisible()
    await expect(page.getByText(/금.*金/)).toBeVisible()
    await expect(page.getByText(/수.*水/)).toBeVisible()
  })

  // ── 테스트 5: 인생 가이드 탭 3개 확인 ───────────────
  test('직업·연애·주의점 탭 버튼이 모두 보여야 해요', async ({ page }) => {
    await expect(page.getByRole('button', { name: /직업/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /연애/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /주의점/ })).toBeVisible()
  })

  // ── 테스트 6: 탭 전환 동작 확인 ────────────────────
  test('연애 탭을 클릭하면 연애 관련 내용이 보여야 해요', async ({ page }) => {
    await page.getByRole('button', { name: /연애/ }).click()
    // mock 데이터의 연애 텍스트 일부 확인
    await expect(page.getByText(/깊고 진지한 사랑/)).toBeVisible()
  })

  test('주의점 탭을 클릭하면 주의점 관련 내용이 보여야 해요', async ({ page }) => {
    await page.getByRole('button', { name: /주의점/ }).click()
    await expect(page.getByText(/스트레스/)).toBeVisible()
  })

  // ── 테스트 7: 시간 미입력 배너가 없어야 함 ────────────
  test('시간을 입력했을 때 "시간 없음" 안내 배너가 보이면 안 돼요', async ({ page }) => {
    await expect(page.getByText(/출생 시간을 입력하면 더 정확한/)).not.toBeVisible()
  })

  // ── 테스트 8: 다시 입력하기 링크 확인 ───────────────
  test('"다시 입력하기" 링크가 보이고 입력 페이지로 이동해야 해요', async ({ page }) => {
    await page.getByRole('link', { name: '다시 입력하기' }).first().click()
    await expect(page).toHaveURL('/input')
  })

})

// ─────────────────────────────────────────────────────

test.describe('결과 화면 — 시간 모름인 경우', () => {

  test.beforeEach(async ({ page }) => {
    await goToResult(page, { ...TIME_UNKNOWN_INPUT, hour: 'unknown' })
  })

  // ── 테스트 9: 시간 없음 안내 배너 표시 ───────────────
  test('출생 시간 미입력 시 안내 배너가 보여야 해요', async ({ page }) => {
    await expect(
      page.getByText(/출생 시간을 입력하면 더 정확한/)
    ).toBeVisible()
  })

  // ── 테스트 10: 시주가 "미상"으로 표시 ─────────────────
  test('시주(시간 기둥) 자리에 "미상" 또는 "시간 미입력" 문구가 표시되어야 해요', async ({ page }) => {
    await expect(page.getByText('시간 미입력')).toBeVisible()
  })

  // ── 테스트 11: 시간 없어도 나머지 섹션은 모두 표시 ─────
  test('시간 미입력이어도 사주팔자·오행·성향·가이드 섹션은 모두 보여야 해요', async ({ page }) => {
    await expect(page.getByText('사주팔자 四柱八字')).toBeVisible()
    await expect(page.getByText('오행 분포 五行')).toBeVisible()
    await expect(page.getByText('성향 요약')).toBeVisible()
    await expect(page.getByText('인생 가이드')).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────

test.describe('결과 화면 — 정상 입력 B (여성)', () => {

  test(`${VALID_INPUT_B.label} — 결과가 정상적으로 표시되어야 해요`, async ({ page }) => {
    await goToResult(page, VALID_INPUT_B)
    await expect(page.getByRole('heading', { name: '2001년생의 사주' })).toBeVisible()
    await expect(page.getByText(/여성/)).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────

test.describe('결과 화면 — 잘못된 URL 접근', () => {

  // ── 테스트 12: 파라미터 없이 직접 접근 시 리다이렉트 ───
  test('파라미터 없이 /result에 접근하면 /input으로 리다이렉트되어야 해요', async ({ page }) => {
    await page.goto('/result')
    await expect(page).toHaveURL('/input')
  })

  // ── 테스트 13: 잘못된 날짜로 직접 접근 시 리다이렉트 ───
  test('존재하지 않는 날짜(2월 30일)로 직접 접근하면 /input으로 리다이렉트되어야 해요', async ({ page }) => {
    await page.goto('/result?year=1995&month=2&day=30&gender=male&calendar=solar&hour=unknown')
    await expect(page).toHaveURL('/input')
  })

})

// ─────────────────────────────────────────────────────

test.describe('결과 화면 — 모바일 뷰포트', () => {

  test('모바일(390px)에서도 사주팔자·오행·성향 섹션이 정상 표시되어야 해요', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/input')
    await fillAndSubmit(page, VALID_INPUT_A)
    await page.waitForURL(/\/result/)

    await expect(page.getByText('사주팔자 四柱八字')).toBeVisible()
    await expect(page.getByText('오행 분포 五行')).toBeVisible()
    await expect(page.getByText('성향 요약')).toBeVisible()
  })

})
