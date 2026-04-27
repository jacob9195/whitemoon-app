// =====================================================
// tests/unit/sajuRoute.test.ts
//
// Route Handler(POST /api/saju) 테스트예요.
//
// 비개발자 설명:
//   실제 HTTP 서버를 켜지 않고, Next.js의 Request/Response 객체를
//   직접 만들어서 route handler를 호출해요.
//   "창구(route)가 제대로 JSON을 주고받는지" 검사해요.
//   getSajuResult 함수 테스트와 역할이 달라요:
//     getSajuResult → 내부 로직 검사
//     sajuRoute     → HTTP 계층(상태코드·JSON 포장) 검사
// =====================================================

import { describe, it, expect } from 'vitest'
import { POST, GET } from '@/app/api/saju/route'
import { NextRequest } from 'next/server'

// ── 테스트용 Request 생성 도우미 ─────────────────────
function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/saju', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ── 공통 정상 입력 ───────────────────────────────────
const VALID_BODY_A = {
  year: '1995', month: '8', day: '12',
  hour: '13', gender: 'male', calendarType: 'solar',
}

const VALID_BODY_B = {
  year: '2001', month: '11', day: '3',
  hour: '9', gender: 'female', calendarType: 'solar',
}

// ─────────────────────────────────────────────────────────────────────

describe('POST /api/saju — 정상 요청', () => {

  // ── 테스트 1: 정상 입력 A → 200 OK ──────────────────
  it('정상 입력 A — HTTP 200과 ok:true를 반환해야 해요', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req)

    expect(res.status).toBe(200)

    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.result).toBeDefined()
  })

  // ── 테스트 2: 정상 입력 B → 200 OK ──────────────────
  it('정상 입력 B(여성) — HTTP 200과 ok:true를 반환해야 해요', async () => {
    const req = makeRequest(VALID_BODY_B)
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  // ── 테스트 3: 응답 JSON 구조 검증 ────────────────────
  it('응답 JSON에 result.fourPillars·fiveElements·interpretation이 있어야 해요', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req)
    const json = await res.json()

    expect(json.result).toHaveProperty('fourPillars')
    expect(json.result).toHaveProperty('fiveElements')
    expect(json.result).toHaveProperty('interpretation')
    expect(json.result).toHaveProperty('isMock')
  })

  // ── 테스트 4: 시간 모름 → 200 OK ────────────────────
  it('hour:"unknown" 요청 — HTTP 200과 ok:true를 반환해야 해요', async () => {
    const req = makeRequest({ ...VALID_BODY_A, hour: 'unknown' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    // 시주는 null이어야 해요
    expect(json.result.fourPillars.time).toBeNull()
  })

  // ── 테스트 5: hour 필드 없어도 OK ───────────────────
  it('hour 필드 자체가 없어도 HTTP 200을 반환해야 해요 (선택 항목)', async () => {
    const { hour: _, ...bodyWithoutHour } = VALID_BODY_A
    const req = makeRequest(bodyWithoutHour)
    const res = await POST(req)

    expect(res.status).toBe(200)
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('POST /api/saju — 잘못된 요청 (실패 케이스)', () => {

  // ── 테스트 6: 생년월일 누락 → 400 ───────────────────
  it('year 누락 — HTTP 400과 ok:false, 한국어 오류 메시지를 반환해야 해요', async () => {
    const { year: _, ...bodyWithoutYear } = VALID_BODY_A
    const req = makeRequest(bodyWithoutYear)
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.ok).toBe(false)
    expect(json.errors).toBeDefined()
    expect(json.errors.year).toBeDefined()
    // 한국어 메시지인지 확인
    expect(/[\uAC00-\uD7A3]/.test(json.errors.year)).toBe(true)
  })

  it('month 누락 — HTTP 400과 월 관련 오류를 반환해야 해요', async () => {
    const { month: _, ...body } = VALID_BODY_A
    const req = makeRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.errors.month).toBeDefined()
  })

  it('day 누락 — HTTP 400과 일 관련 오류를 반환해야 해요', async () => {
    const { day: _, ...body } = VALID_BODY_A
    const req = makeRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.errors.day).toBeDefined()
  })

  // ── 테스트 7: 양력/음력 누락 → 400 ─────────────────
  it('calendarType 누락 — HTTP 400과 양력/음력 오류를 반환해야 해요', async () => {
    const { calendarType: _, ...body } = VALID_BODY_A
    const req = makeRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.errors.calendarType).toBeDefined()
    expect(json.errors.calendarType).toMatch(/양력|음력/)
  })

  // ── 테스트 8: 존재하지 않는 날짜 → 400 ──────────────
  it('2월 30일(없는 날짜) — HTTP 400과 날짜 오류를 반환해야 해요', async () => {
    const req = makeRequest({ ...VALID_BODY_A, month: '2', day: '30' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.errors.birth).toMatch(/존재하지 않는 날짜/)
  })

  // ── 테스트 9: 미래 연도 → 400 ────────────────────────
  it('미래 연도(2026) — HTTP 400과 연도 범위 오류를 반환해야 해요', async () => {
    const req = makeRequest({ ...VALID_BODY_A, year: '2026' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.errors.year).toBeDefined()
    expect(json.errors.year).toMatch(/2025/)
  })

  // ── 테스트 10: 잘못된 성별 값 → 400 ─────────────────
  it('gender가 "other"인 경우 — HTTP 400을 반환해야 해요', async () => {
    const req = makeRequest({ ...VALID_BODY_A, gender: 'other' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.errors.gender).toBeDefined()
  })

  // ── 테스트 11: 빈 body → 400 ─────────────────────────
  it('빈 body 요청 — HTTP 400과 여러 오류를 반환해야 해요', async () => {
    const req = makeRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.ok).toBe(false)
    // 여러 필드 오류가 있어야 해요
    expect(Object.keys(json.errors).length).toBeGreaterThan(0)
  })

  // ── 테스트 12: 잘못된 JSON → 400/500 ────────────────
  it('JSON이 아닌 body — 오류 응답을 반환해야 해요', async () => {
    const req = new NextRequest('http://localhost:3000/api/saju', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json-string',
    })
    const res = await POST(req)

    // 400 또는 500 — 어떤 오류든 ok:false여야 해요
    expect(res.status).toBeGreaterThanOrEqual(400)
    const json = await res.json()
    expect(json.ok).toBe(false)
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('GET /api/saju — 허용되지 않는 메서드', () => {

  it('GET 요청은 405 또는 오류 응답을 반환해야 해요', async () => {
    const res = await GET()

    // GET은 허용하지 않아요
    expect(res.status).toBeGreaterThanOrEqual(400)
    const json = await res.json()
    expect(json.ok).toBe(false)
  })

})

// ─────────────────────────────────────────────────────────────────────

describe('POST /api/saju — 동일 입력 반복 요청', () => {

  it('같은 body로 2번 요청해도 동일한 fourPillars.day를 반환해야 해요', async () => {
    const res1 = await POST(makeRequest(VALID_BODY_A))
    const res2 = await POST(makeRequest(VALID_BODY_A))

    const json1 = await res1.json()
    const json2 = await res2.json()

    expect(json1.result.fourPillars.day.heavenlyStem)
      .toBe(json2.result.fourPillars.day.heavenlyStem)
    expect(json1.result.fiveElements)
      .toEqual(json2.result.fiveElements)
  })

})
