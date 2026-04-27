// =====================================================
// app/api/saju/route.ts
//
// Next.js App Router의 API 엔드포인트예요.
// 브라우저나 앱에서 POST /api/saju 로 요청을 보내면
// 사주 결과를 JSON으로 돌려줘요.
//
// 비개발자 설명:
//   이 파일은 "창구" 역할이에요.
//   실제 계산은 lib/saju/getSajuResult.ts 가 하고,
//   여기서는 HTTP 요청을 받아서 결과를 JSON으로 포장해 돌려줄 뿐이에요.
//
// 테스트 방법:
//   curl -X POST http://localhost:3000/api/saju \
//     -H "Content-Type: application/json" \
//     -d '{"year":"1995","month":"8","day":"12","gender":"male","calendarType":"solar","hour":"13"}'
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { getSajuResult } from '@/lib/saju/getSajuResult'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = getSajuResult({
      year:         body.year         ?? null,
      month:        body.month        ?? null,
      day:          body.day          ?? null,
      hour:         body.hour         ?? null,
      gender:       body.gender       ?? null,
      calendarType: body.calendarType ?? null,
    })

    if (!response.ok) {
      // 입력값 오류 — 400 Bad Request
      return NextResponse.json(
        { ok: false, errors: response.errors },
        { status: 400 }
      )
    }

    // 성공 — 200 OK
    return NextResponse.json(
      { ok: true, result: response.result },
      { status: 200 }
    )

  } catch {
    // JSON 파싱 오류 등 예상치 못한 상황
    return NextResponse.json(
      { ok: false, errors: { general: '요청을 처리하는 중 오류가 발생했어요. 다시 시도해 주세요.' } },
      { status: 500 }
    )
  }
}

// GET 요청은 허용하지 않아요
export async function GET() {
  return NextResponse.json(
    { ok: false, errors: { general: 'POST 요청만 허용돼요.' } },
    { status: 405 }
  )
}
