// =====================================================
// tests/unit/apiRoute.test.ts
//
// POST /api/saju Route Handler 테스트예요.
//
// 비개발자 설명:
//   이 테스트는 "창구(API)"가 제대로 응답하는지 확인해요.
//   실제 HTTP 서버를 켜지 않고, Next.js의 Request/Response 객체를
//   직접 만들어서 테스트해요. 그래서 매우 빠르게 실행돼요.
// =====================================================

import { describe, it, expect } from 'vitest'
import { POST, GET } from '@/app/api/saju/route'

// ── Next.js Request 객체를 테스트용으로 만드는 헬퍼 ───────
// 비개발자 설명: "가짜 HTTP 요청"을 만들어요.
function makeRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/saju', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// 정상 입력 예시
const VALID_BODY_A = {
  year: '1995', month: '8', day: '12',
  calendarType: 'solar', hour: '13', gender: 'male',
}

const VALID_BODY_B = {
  year: '2001', month: '11', day: '3',
  calendarType: 'solar', hour: '9', gender: 'female',
}

// =======================================================

describe('POST /api/saju — 성공 케이스', () => {

  it('정상 입력 A — HTTP 200, ok:true 반환', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.result).toBeDefined()
  })

  it('정상 입력 B — HTTP 200, ok:true 반환', async () => {
    const req = makeRequest(VALID_BODY_B)
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })

  it('성공 응답 JSON에 fourPillars 필드가 있어야 해요', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req as any)
    const json = await res.json()

    expect(json.result.fourPillars).toBeDefined()
    expect(json.result.fourPillars.year).toBeDefined()
    expect(json.result.fourPillars.day).toBeDefined()
  })

  it('성공 응답 JSON에 fiveElements 필드가 있어야 해요', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req as any)
    const json = await res.json()

    expect(json.result.fiveElements).toBeDefined()
    expect(typeof json.result.fiveElements.wood).toBe('number')
  })

  it('성공 응답 JSON에 interpretation 필드가 있어야 해요', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req as any)
    const json = await res.json()

    expect(json.result.interpretation.personality).toBeTruthy()
    expect(json.result.interpretation.career).toBeTruthy()
    expect(json.result.interpretation.love).toBeTruthy()
    expect(json.result.interpretation.caution).toBeTruthy()
  })

  it('isMock 필드가 응답에 포함되어야 해요 (mock/실제 구분 가능)', async () => {
    const req = makeRequest(VALID_BODY_A)
    const res = await POST(req as any)
    const json = await res.json()

    // 현재는 mock 단계이므로 true
    expect(json.result.isMock).toBe(true)
  })

  it('hour=unknown 입력 — HTTP 200, fourPillars.time이 null이어야 해요', async () => {
    const req = makeRequest({ ...VALID_BODY_A, hour: 'unknown' })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.result.fourPillars.time).toBeNull()
  })

})

// =======================================================

describe('POST /api/saju — 실패 케이스 (HTTP 400)', () => {

  it('year 누락 — HTTP 400, errors.year에 한국어 메시지 반환', async () => {
    const req = makeRequest({ ...VALID_BODY_A, year: undefined })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.errors.year).toContain('연도')
  })

  it('잘못된 날짜(4월 31일) — HTTP 400, 날짜 오류 반환', async () => {
    const req = makeRequest({ ...VALID_BODY_A, month: '4', day: '31' })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.errors.birth).toContain('존재하지 않는 날짜')
  })

  it('미래 연도(2026년) — HTTP 400, 연도 오류 반환', async () => {
    const req = makeRequest({ ...VALID_BODY_A, year: '2026' })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.errors.year).toBeTruthy()
  })

  it('calendarType 누락 — HTTP 400, 오류 반환', async () => {
    const req = makeRequest({ ...VALID_BODY_A, calendarType: undefined })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.errors.calendarType).toContain('양력 또는 음력')
  })

  it('gender 누락 — HTTP 400, 한국어 오류 반환', async () => {
    const req = makeRequest({ ...VALID_BODY_A, gender: undefined })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.errors.gender).toContain('성별')
  })

  it('빈 body 전송 — HTTP 400, 다중 오류 반환', async () => {
    const req = makeRequest({})
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.ok).toBe(false)
    // 여러 필드가 동시에 오류
    expect(json.errors.year).toBeTruthy()
    expect(json.errors.gender).toBeTruthy()
  })

})

// =======================================================

describe('GET /api/saju — 허용하지 않는 메서드', () => {

  it('GET 요청은 HTTP 405로 거부되어야 해요', async () => {
    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(405)
    expect(json.ok).toBe(false)
    expect(json.errors.general).toContain('POST')
  })

})

// =======================================================

describe('POST /api/saju — 깨진 JSON 요청', () => {

  it('JSON이 아닌 body를 보내면 HTTP 500 반환', async () => {
    const req = new Request('http://localhost:3000/api/saju', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ 이건 올바른 JSON이 아니에요 !!!',
    })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.ok).toBe(false)
    expect(json.errors.general).toBeTruthy()
  })

})
