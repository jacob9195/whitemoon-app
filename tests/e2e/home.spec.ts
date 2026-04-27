// =====================================================
// tests/e2e/home.spec.ts
// 홈 화면 테스트예요.
//
// 비개발자 설명:
//   앱의 첫 화면(오늘의 사주)이 제대로 보이는지,
//   버튼을 누르면 입력 화면으로 잘 이동하는지 확인해요.
// =====================================================

import { test, expect } from '@playwright/test'

test.describe('홈 화면', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── 테스트 1: 한국어 소개 문구 확인 ──────────────────
  test('한국어 타이틀과 소개 문구가 보여야 해요', async ({ page }) => {
    // 앱 이름
    await expect(page.getByRole('heading', { name: '오늘의 사주' })).toBeVisible()

    // 소개 문구
    await expect(page.getByText('생년월일만 입력하면')).toBeVisible()
    await expect(page.getByText('쉬운 한국어로 풀어드려요')).toBeVisible()

    // 특징 카드 3개
    await expect(page.getByText('사주팔자')).toBeVisible()
    await expect(page.getByText('오행 분포')).toBeVisible()
    await expect(page.getByText('성향 해석')).toBeVisible()
  })

  // ── 테스트 2: "내 사주 보기" 버튼 존재 확인 ──────────
  test('"내 사주 보기" 버튼이 보여야 해요', async ({ page }) => {
    const btn = page.getByRole('link', { name: '내 사주 보기' })
    await expect(btn).toBeVisible()
  })

  // ── 테스트 3: 버튼 클릭 시 입력 페이지로 이동 ─────────
  test('"내 사주 보기" 클릭 시 입력 페이지로 이동해야 해요', async ({ page }) => {
    await page.getByRole('link', { name: '내 사주 보기' }).click()
    await expect(page).toHaveURL('/input')
    await expect(page.getByRole('heading', { name: '내 사주 입력하기' })).toBeVisible()
  })

  // ── 테스트 4: 회원가입 불필요 안내 확인 ──────────────
  test('회원가입 불필요 안내 문구가 보여야 해요', async ({ page }) => {
    await expect(page.getByText('회원가입 불필요')).toBeVisible()
  })

  // ── 테스트 5: 모바일 뷰포트에서도 정상 표시 ──────────
  test('모바일 화면(390px)에서도 타이틀과 버튼이 보여야 해요', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.reload()
    await expect(page.getByRole('heading', { name: '오늘의 사주' })).toBeVisible()
    await expect(page.getByRole('link', { name: '내 사주 보기' })).toBeVisible()
  })

})
