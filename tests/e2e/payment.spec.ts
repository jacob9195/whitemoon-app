// =====================================================
// tests/e2e/payment.spec.ts
//
// 결제 흐름 E2E 테스트
// ─────────────────────────────────────────────────────
// 테스트 범위:
//   1. 프론트엔드: CTA 노출, 페이지 진입, confirm 흐름
//   2. 보안: URL 위조, 토큰 없는 PDF 접근 차단
// =====================================================

import { test, expect } from '@playwright/test'

// 사주 입력값 URL 파라미터 (무료 결과 → 프리미엄 진입용)
const SAJU_PARAMS = 'year=1995&month=8&day=12&hour=14&gender=male&calendar=solar'

test.describe('무료 결과 페이지 — 프리미엄 CTA', () => {

  test('무료 결과 하단에 "상세 PDF 리포트" CTA가 보여야 해요', async ({ page }) => {
    await page.goto(`/result?${SAJU_PARAMS}`)

    // PremiumTeaser 컴포넌트의 CTA 버튼
    const cta = page.getByRole('link', { name: /상세 PDF 받기/ })
    await expect(cta).toBeVisible()
  })

  test('CTA 클릭 시 /premium 페이지로 이동해야 해요', async ({ page }) => {
    await page.goto(`/result?${SAJU_PARAMS}`)
    await page.getByRole('link', { name: /상세 PDF 받기/ }).click()
    await expect(page).toHaveURL(/\/premium/)
  })

})

test.describe('프리미엄 페이지', () => {

  test('입력값 없이 접근하면 에러 메시지가 보여야 해요', async ({ page }) => {
    await page.goto('/premium')
    // 입력값 없으면 주문 생성 실패 메시지 표시
    await expect(page.getByText(/사주 정보가 없어요/)).toBeVisible({ timeout: 5000 })
  })

  test('사주 파라미터가 있으면 주문 준비 UI가 보여야 해요', async ({ page }) => {
    await page.goto(`/premium?${SAJU_PARAMS}`)
    // 주문 생성 중 로딩 스피너
    await expect(page.getByText(/주문 준비 중/)).toBeVisible()
  })

  test('포함 항목 목록이 표시되어야 해요', async ({ page }) => {
    await page.goto(`/premium?${SAJU_PARAMS}`)
    await expect(page.getByText('직업·적성·일하는 방식')).toBeVisible()
    await expect(page.getByText('연애·결혼 성향 상세 분석')).toBeVisible()
    await expect(page.getByText('재물운·소비 성향·돈 관리')).toBeVisible()
  })

})

test.describe('결제 실패 페이지', () => {

  test('취소 코드 시 취소 메시지가 보여야 해요', async ({ page }) => {
    await page.goto(`/payment/fail?code=PAY_PROCESS_CANCELED&${SAJU_PARAMS}`)
    await expect(page.getByText('결제를 취소했어요')).toBeVisible()
    await expect(page.getByText('카드 청구는 발생하지 않았어요')).toBeVisible()
  })

  test('재결제 버튼이 프리미엄 페이지로 연결되어야 해요', async ({ page }) => {
    await page.goto(`/payment/fail?code=PAY_PROCESS_CANCELED&${SAJU_PARAMS}`)
    await page.getByRole('link', { name: '다시 결제하기' }).click()
    await expect(page).toHaveURL(/\/premium/)
  })

})

test.describe('보안 — PDF 직접 접근 차단', () => {

  // ── 보안 테스트 1: 토큰 없는 PDF 접근 차단 ──────────
  test('토큰 없이 /api/pdf 접근 시 403을 반환해야 해요', async ({ request }) => {
    const res = await request.get('/api/pdf')
    expect(res.status()).toBe(403)

    const body = await res.json()
    expect(body.ok).toBe(false)
    expect(body.code).toMatch(/TOKEN/)
  })

  // ── 보안 테스트 2: 위조 토큰 차단 ───────────────────
  test('위조된 토큰으로 /api/pdf 접근 시 403을 반환해야 해요', async ({ request }) => {
    const res = await request.get('/api/pdf?token=FORGED.INVALID_SIGNATURE')
    expect(res.status()).toBe(403)

    const body = await res.json()
    expect(body.ok).toBe(false)
    expect(['TOKEN_INVALID', 'TOKEN_MISSING']).toContain(body.code)
  })

  // ── 보안 테스트 3: 랜덤 문자열 토큰 차단 ────────────
  test('임의 문자열 토큰으로 접근 시 403을 반환해야 해요', async ({ request }) => {
    const res = await request.get('/api/pdf?token=abc123.xyz789randomstring')
    expect(res.status()).toBe(403)
  })

  // ── 보안 테스트 4: confirm 없는 PDF 접근 ────────────
  test('orderId만 알아도 토큰 없이 PDF 다운로드가 불가능해야 해요', async ({ request }) => {
    // 먼저 주문 생성
    const createRes = await request.post('/api/orders/create', {
      data: {
        productId: 'saju-basic',
        year: 1995, month: 8, day: 12,
        hour: 14, gender: 'male', calendarType: 'solar',
      }
    })
    const { orderId } = await createRes.json()

    // orderId만으로 PDF 접근 시도 (토큰 없음)
    const pdfRes = await request.get(`/api/pdf?orderId=${orderId}`)
    expect(pdfRes.status()).toBe(403)
  })

  // ── 보안 테스트 5: confirm URL 복사 접근 차단 ────────
  test('결제 성공 URL을 복사해 접근해도 confirm 없이 PDF가 나오면 안 돼요', async ({ request }) => {
    // successUrl 파라미터를 직접 조작해도 토큰 없이는 차단
    const res = await request.get(
      '/api/pdf?paymentKey=fake&orderId=saju_fake_000&amount=2900'
    )
    expect(res.status()).toBe(403)
  })

})

test.describe('결제 confirm API', () => {

  // ── API 테스트 1: 필수 파라미터 누락 ─────────────────
  test('paymentKey 누락 시 400을 반환해야 해요', async ({ request }) => {
    const res = await request.post('/api/payments/confirm', {
      data: { orderId: 'saju_test', amount: 2900 }  // paymentKey 없음
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.ok).toBe(false)
  })

  test('amount 변조(음수) 시 400을 반환해야 해요', async ({ request }) => {
    const res = await request.post('/api/payments/confirm', {
      data: { paymentKey: 'test_key', orderId: 'saju_test', amount: -999 }
    })
    expect(res.status()).toBe(400)
  })

  // ── API 테스트 2: 없는 주문 ───────────────────────────
  test('없는 orderId → 404를 반환해야 해요', async ({ request }) => {
    const res = await request.post('/api/payments/confirm', {
      data: {
        paymentKey: 'test_paymentKey',
        orderId:    'saju_nonexistent_000',
        amount:     2900,
      }
    })
    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body.code).toBe('ORDER_NOT_FOUND')
  })

  // ── API 테스트 3: 금액 불일치 ────────────────────────
  test('주문 금액과 다른 amount → 400을 반환해야 해요', async ({ request }) => {
    // 먼저 주문 생성
    const createRes = await request.post('/api/orders/create', {
      data: {
        productId: 'saju-basic',
        year: 1995, month: 8, day: 12,
        hour: null, gender: 'female', calendarType: 'solar',
      }
    })
    const { orderId } = await createRes.json()

    // 금액을 변조해서 confirm 시도
    const res = await request.post('/api/payments/confirm', {
      data: { paymentKey: 'test_key', orderId, amount: 100 }  // 실제 금액: 2900
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('AMOUNT_MISMATCH')
  })

})

test.describe('주문 생성 API', () => {

  test('정상 입력 → 200 + orderId/amount 반환', async ({ request }) => {
    const res = await request.post('/api/orders/create', {
      data: {
        productId: 'saju-basic',
        year: 2000, month: 1, day: 1,
        hour: null, gender: 'female', calendarType: 'solar',
      }
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.orderId).toMatch(/^saju_/)
    expect(body.amount).toBe(2900)  // 서버 확정 금액
  })

  test('알 수 없는 productId → 400', async ({ request }) => {
    const res = await request.post('/api/orders/create', {
      data: {
        productId: 'unknown-product',
        year: 1990, month: 5, day: 20,
        hour: null, gender: 'male', calendarType: 'solar',
      }
    })
    expect(res.status()).toBe(400)
  })

  test('잘못된 날짜 → 400', async ({ request }) => {
    const res = await request.post('/api/orders/create', {
      data: {
        productId: 'saju-basic',
        year: 2026, month: 1, day: 1,  // 미래 연도
        hour: null, gender: 'male', calendarType: 'solar',
      }
    })
    expect(res.status()).toBe(400)
  })

})
