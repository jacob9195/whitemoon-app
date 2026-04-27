// =====================================================
// tests/unit/payment.test.ts
//
// 결제 로직 단위 테스트
// ─────────────────────────────────────────────────────
// 테스트 범위:
//   1. 입력값 검증 (validators)
//   2. 주문 생성·조회·상태 전이 (order-service)
//   3. 다운로드 토큰 발급·검증 (download-auth)
//   4. PremiumReport 데이터 구조 (interpret-premium)
// =====================================================

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  validateCreateOrderBody,
  validateConfirmBody,
  validateDownloadToken,
} from '@/lib/security/validators'

// ─────────────────────────────────────────────────────
// 1. 입력값 검증 테스트
// ─────────────────────────────────────────────────────

describe('validateCreateOrderBody', () => {

  const VALID = {
    productId: 'saju-basic',
    year: 1995, month: 8, day: 12,
    hour: 14, gender: 'male', calendarType: 'solar',
  }

  it('정상 입력 → ok:true', () => {
    const r = validateCreateOrderBody(VALID)
    expect(r.ok).toBe(true)
  })

  it('시간 모름(null) → ok:true', () => {
    const r = validateCreateOrderBody({ ...VALID, hour: null })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.hour).toBeNull()
  })

  it('productId 없음 → ok:false', () => {
    const r = validateCreateOrderBody({ ...VALID, productId: '' })
    expect(r.ok).toBe(false)
  })

  it('year 범위 초과 → ok:false', () => {
    const r = validateCreateOrderBody({ ...VALID, year: 2026 })
    expect(r.ok).toBe(false)
  })

  it('gender 잘못된 값 → ok:false', () => {
    const r = validateCreateOrderBody({ ...VALID, gender: 'other' })
    expect(r.ok).toBe(false)
  })

  it('calendarType 잘못된 값 → ok:false', () => {
    const r = validateCreateOrderBody({ ...VALID, calendarType: 'weekly' })
    expect(r.ok).toBe(false)
  })

  it('null body → ok:false', () => {
    const r = validateCreateOrderBody(null)
    expect(r.ok).toBe(false)
  })

})

describe('validateConfirmBody', () => {

  const VALID = {
    paymentKey: 'test_paymentKey_abc123',
    orderId:    'saju_1234567890_abc',
    amount:     2900,
  }

  it('정상 입력 → ok:true', () => {
    const r = validateConfirmBody(VALID)
    expect(r.ok).toBe(true)
  })

  it('paymentKey 없음 → ok:false', () => {
    const r = validateConfirmBody({ ...VALID, paymentKey: '' })
    expect(r.ok).toBe(false)
  })

  it('orderId 없음 → ok:false', () => {
    const r = validateConfirmBody({ ...VALID, orderId: '' })
    expect(r.ok).toBe(false)
  })

  it('amount 음수 → ok:false', () => {
    const r = validateConfirmBody({ ...VALID, amount: -100 })
    expect(r.ok).toBe(false)
  })

  it('amount 0 → ok:false', () => {
    const r = validateConfirmBody({ ...VALID, amount: 0 })
    expect(r.ok).toBe(false)
  })

  it('paymentKey 너무 길면 → ok:false', () => {
    const r = validateConfirmBody({ ...VALID, paymentKey: 'x'.repeat(301) })
    expect(r.ok).toBe(false)
  })

  it('orderId 특수문자 포함 → ok:false', () => {
    const r = validateConfirmBody({ ...VALID, orderId: 'saju/../../../etc' })
    expect(r.ok).toBe(false)
  })

})

describe('validateDownloadToken', () => {

  it('정상 문자열 → ok:true', () => {
    const r = validateDownloadToken('abc.def123')
    expect(r.ok).toBe(true)
  })

  it('null → ok:false', () => {
    const r = validateDownloadToken(null)
    expect(r.ok).toBe(false)
  })

  it('빈 문자열 → ok:false', () => {
    const r = validateDownloadToken('')
    expect(r.ok).toBe(false)
  })

  it('너무 긴 토큰 → ok:false', () => {
    const r = validateDownloadToken('x'.repeat(2001))
    expect(r.ok).toBe(false)
  })

  it('특수문자(슬래시) 포함 → ok:false', () => {
    const r = validateDownloadToken('abc/def')
    expect(r.ok).toBe(false)
  })

})

// ─────────────────────────────────────────────────────
// 2. 다운로드 토큰 발급·검증 테스트
// ─────────────────────────────────────────────────────

describe('download-auth: issueDownloadToken + verifyDownloadToken', () => {

  beforeEach(() => {
    // 환경변수 설정
    process.env.DOWNLOAD_TOKEN_SECRET = 'test-secret-key-at-least-32-chars-long!!'
  })

  it('정상 토큰 발급 → 검증 성공', async () => {
    const { issueDownloadToken, verifyDownloadToken } = await import('@/lib/payment/download-auth')
    const token   = issueDownloadToken('saju_test_001', 'saju-basic')
    const payload = verifyDownloadToken(token)

    expect(payload.orderId).toBe('saju_test_001')
    expect(payload.productId).toBe('saju-basic')
    expect(payload.expiresAt).toBeGreaterThan(Date.now())
    expect(payload.nonce).toBeTruthy()
  })

  it('서명 변조 → 검증 실패', async () => {
    const { issueDownloadToken, verifyDownloadToken } = await import('@/lib/payment/download-auth')
    const token  = issueDownloadToken('saju_test_002', 'saju-basic')
    const parts  = token.split('.')
    const forged = `${parts[0]}.FORGED_SIGNATURE`

    expect(() => verifyDownloadToken(forged)).toThrow()
  })

  it('페이로드 변조 → 검증 실패', async () => {
    const { issueDownloadToken, verifyDownloadToken } = await import('@/lib/payment/download-auth')
    const token       = issueDownloadToken('saju_test_003', 'saju-basic')
    const [, sig]     = token.split('.')
    const fakePayload = Buffer.from(JSON.stringify({ orderId: 'hacked', productId: 'free', issuedAt: 0, expiresAt: 9999999999999, nonce: 'x' })).toString('base64url')
    const forged      = `${fakePayload}.${sig}`

    expect(() => verifyDownloadToken(forged)).toThrow()
  })

  it('토큰 형식 오류 (점 없음) → 검증 실패', async () => {
    const { verifyDownloadToken } = await import('@/lib/payment/download-auth')
    expect(() => verifyDownloadToken('no-dot-here')).toThrow()
  })

  it('만료된 토큰 → 검증 실패 (시간 조작)', async () => {
    const { issueDownloadToken, verifyDownloadToken } = await import('@/lib/payment/download-auth')

    // Date.now()를 현재 시각보다 2시간 후로 조작 (토큰 만료 시뮬레이션)
    const realNow = Date.now()
    const twoHoursLater = realNow + 2 * 60 * 60 * 1000

    // 토큰을 과거 시각 기준으로 발급 (issueDownloadToken 내부의 Date.now() 조작)
    vi.spyOn(Date, 'now').mockReturnValueOnce(realNow - 2 * 60 * 60 * 1000) // 발급 시각: 2시간 전
    const token = issueDownloadToken('saju_test_004', 'saju-basic')
    vi.restoreAllMocks() // Date.now 복원 (현재 시각으로)

    // 검증 시각은 현재 (토큰이 이미 만료됨)
    expect(() => verifyDownloadToken(token)).toThrow()
  })

})

// ─────────────────────────────────────────────────────
// 3. 주문 서비스 테스트
// ─────────────────────────────────────────────────────

describe('order-service: createOrder + validateAndMarkPaid', () => {

  beforeEach(() => {
    process.env.DOWNLOAD_TOKEN_SECRET = 'test-secret-key-at-least-32-chars-long!!'
  })

  const BIRTH_INPUT = {
    productId: 'saju-basic',
    year: 1995, month: 8, day: 12,
    hour: 14, gender: 'male' as const, calendarType: 'solar' as const,
  }

  it('주문 생성 → orderId/amount/orderName 반환', async () => {
    const { createOrder } = await import('@/lib/payment/order-service')
    const order = await createOrder(BIRTH_INPUT)

    expect(order.orderId).toMatch(/^saju_/)
    expect(order.amount).toBe(2900)  // products.ts의 saju-basic 가격
    expect(order.orderName).toBeTruthy()
  })

  it('생성된 주문 조회 가능', async () => {
    const { createOrder, getOrder } = await import('@/lib/payment/order-service')
    const created = await createOrder(BIRTH_INPUT)
    const fetched = await getOrder(created.orderId)

    expect(fetched.orderId).toBe(created.orderId)
    expect(fetched.status).toBe('created')
    expect(fetched.amount).toBe(2900)
  })

  it('금액 불일치 → amountMismatch 에러', async () => {
    const { createOrder, validateAndMarkPaid } = await import('@/lib/payment/order-service')
    const created = await createOrder(BIRTH_INPUT)

    // 클라이언트가 amount를 변조한 상황
    await expect(
      validateAndMarkPaid(created.orderId, 'test_paymentKey', 1000)  // 실제 금액: 2900
    ).rejects.toMatchObject({ code: 'AMOUNT_MISMATCH' })
  })

  it('정상 금액 → paid 상태 전이', async () => {
    const { createOrder, validateAndMarkPaid, getOrder } = await import('@/lib/payment/order-service')
    const created = await createOrder(BIRTH_INPUT)

    const { isAlreadyPaid } = await validateAndMarkPaid(created.orderId, 'test_key', 2900)
    expect(isAlreadyPaid).toBe(false)

    const updated = await getOrder(created.orderId)
    expect(updated.status).toBe('paid')
    expect(updated.paymentKey).toBe('test_key')
  })

  it('이미 paid 주문 → isAlreadyPaid:true (멱등성)', async () => {
    const { createOrder, validateAndMarkPaid } = await import('@/lib/payment/order-service')
    const created = await createOrder(BIRTH_INPUT)

    await validateAndMarkPaid(created.orderId, 'test_key', 2900)
    const { isAlreadyPaid } = await validateAndMarkPaid(created.orderId, 'test_key', 2900)

    expect(isAlreadyPaid).toBe(true)
  })

  it('없는 orderId → orderNotFound 에러', async () => {
    const { validateAndMarkPaid } = await import('@/lib/payment/order-service')
    await expect(
      validateAndMarkPaid('saju_nonexistent_000', 'test_key', 2900)
    ).rejects.toMatchObject({ code: 'ORDER_NOT_FOUND' })
  })

})

// ─────────────────────────────────────────────────────
// 4. 해석 로직 테스트
// ─────────────────────────────────────────────────────

describe('interpret-premium: buildFreeReportData + buildPremiumReportData', () => {

  const { fourPillars, fiveElements } = (() => {
    // 테스트용 mock 데이터
    const pillars = {
      year:  { heavenlyStem: '甲' as const, earthlyBranch: '子' as const, stemReading: '갑', branchReading: '자', stemMeaning: '나무', branchMeaning: '쥐' },
      month: { heavenlyStem: '丙' as const, earthlyBranch: '午' as const, stemReading: '병', branchReading: '오', stemMeaning: '불',   branchMeaning: '말' },
      day:   { heavenlyStem: '庚' as const, earthlyBranch: '辰' as const, stemReading: '경', branchReading: '진', stemMeaning: '쇠',   branchMeaning: '용' },
      time:  null,
    }
    const elements = {
      wood: 15, fire: 30, earth: 20, metal: 25, water: 10,
      strongest: '화' as const, weakest: '수' as const,
    }
    return { fourPillars: pillars, fiveElements: elements }
  })()

  const INPUT = {
    year: 1995, month: 8, day: 12, hour: null,
    gender: 'male' as const, calendarType: 'solar' as const,
  }

  it('buildFreeReportData — 필수 필드가 모두 있어야 해요', async () => {
    const { buildFreeReportData } = await import('@/lib/saju/interpret-premium')
    const data = buildFreeReportData(INPUT, fourPillars, fiveElements)

    expect(data.basicChart).toBeDefined()
    expect(data.elementsSummary.length).toBeGreaterThan(0)
    expect(data.personalityShort.length).toBeGreaterThan(0)
    expect(data.careerShort.length).toBeGreaterThan(0)
    expect(data.loveShort.length).toBeGreaterThan(0)
    expect(data.cautionShort.length).toBeGreaterThan(0)
  })

  it('buildPremiumReportData — 14개 섹션이 모두 있어야 해요', async () => {
    const { buildPremiumReportData } = await import('@/lib/saju/interpret-premium')
    const data = buildPremiumReportData(INPUT, fourPillars, fiveElements)

    const REQUIRED_KEYS = [
      'chartOverview', 'fourPillarsDetail', 'dayMasterDetail', 'elementsDetail',
      'tenGodsDetail', 'personalityDetail', 'relationshipDetail', 'loveMarriageDetail',
      'careerDetail', 'wealthDetail', 'healthDetail', 'timingDetail',
      'actionGuide', 'finalSummary',
    ]
    for (const key of REQUIRED_KEYS) {
      const val = (data as Record<string, string>)[key]
      expect(val, `${key} 필드가 없어요`).toBeTruthy()
      expect(val.length, `${key} 내용이 너무 짧아요`).toBeGreaterThan(20)
    }
  })

  it('buildPremiumReportData — 모든 섹션이 한국어를 포함해야 해요', async () => {
    const { buildPremiumReportData } = await import('@/lib/saju/interpret-premium')
    const data = buildPremiumReportData(INPUT, fourPillars, fiveElements)
    const hasKorean = (s: string) => /[\uAC00-\uD7A3]/.test(s)

    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'string') {
        expect(hasKorean(val), `${key}에 한국어가 없어요`).toBe(true)
      }
    }
  })

  it('시간 미상일 때도 정상 동작해야 해요', async () => {
    const { buildFreeReportData, buildPremiumReportData } = await import('@/lib/saju/interpret-premium')
    const noHourInput = { ...INPUT, hour: null }
    // 에러 없이 실행되어야 함
    expect(() => buildFreeReportData(noHourInput, fourPillars, fiveElements)).not.toThrow()
    expect(() => buildPremiumReportData(noHourInput, fourPillars, fiveElements)).not.toThrow()
  })

  it('freeData와 premiumData는 서로 다른 깊이여야 해요', async () => {
    const { buildFreeReportData, buildPremiumReportData } = await import('@/lib/saju/interpret-premium')
    const free    = buildFreeReportData(INPUT, fourPillars, fiveElements)
    const premium = buildPremiumReportData(INPUT, fourPillars, fiveElements)

    // premium이 free보다 훨씬 더 자세해야 함 (전체 문자 수 비교)
    const freeTotal    = Object.values(free).filter(v => typeof v === 'string').join('').length
    const premiumTotal = Object.values(premium).filter(v => typeof v === 'string').join('').length

    expect(premiumTotal).toBeGreaterThan(freeTotal * 3)
  })

})
