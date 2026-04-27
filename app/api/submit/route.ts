// app/api/submit/route.ts
// 고객 신청 → Google Apps Script → 구글 시트 자동 저장

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const personSchema = z.object({
  name:       z.string().min(1, '이름을 입력해주세요'),
  gender:     z.enum(['남성', '여성']),
  calType:    z.enum(['양력', '음력']),
  birthDate:  z.string().min(8, '생년월일을 입력해주세요'),
  birthTime:  z.string().optional(),
  birthPlace: z.string().optional(),
})

export const submitSchema = z.object({
  product: z.enum(['정통사주', '연애결혼', '재물사업', '궁합']),
  email:   z.string().email('올바른 이메일을 입력해주세요'),
  phone:   z.string().min(10, '전화번호를 입력해주세요'),
  person:  personSchema,
  partner: personSchema.optional(),
})

export type SubmitData = z.infer<typeof submitSchema>

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = submitSchema.parse(body)

    if (data.product === '궁합' && !data.partner) {
      return NextResponse.json(
        { ok: false, message: '궁합 상품은 파트너 정보가 필요합니다.' },
        { status: 400 }
      )
    }

    const p  = data.person
    const pt = data.partner

    // Google Apps Script로 전송할 데이터
    const payload = {
      이름:          p.name,
      성별:          p.gender,
      양음력:        p.calType,
      생년월일:      p.birthDate,
      출생시각:      p.birthTime   ?? '',
      출생지:        p.birthPlace  ?? '',
      파트너이름:    pt?.name      ?? '',
      파트너성별:    pt?.gender    ?? '',
      파트너양음력:  pt?.calType   ?? '',
      파트너생년월일: pt?.birthDate ?? '',
      파트너출생시각: pt?.birthTime ?? '',
      파트너출생지:  pt?.birthPlace ?? '',
      상품:          data.product,
      이메일:        data.email,
      전화번호:      data.phone,
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL
    if (!scriptUrl) {
      console.error('[submit] GOOGLE_SCRIPT_URL 환경변수가 없습니다.')
      return NextResponse.json(
        { ok: false, message: '서버 설정 오류입니다. 관리자에게 문의해주세요.' },
        { status: 500 }
      )
    }

    const res = await fetch(scriptUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      redirect: 'follow',
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[submit] Google Script 오류:', text)
      return NextResponse.json(
        { ok: false, message: '저장 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    const result = await res.json()
    if (!result.ok) {
      console.error('[submit] Script 응답 오류:', result)
      return NextResponse.json(
        { ok: false, message: '저장 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: err.errors[0].message },
        { status: 400 }
      )
    }
    console.error('[submit] error:', err)
    return NextResponse.json(
      { ok: false, message: '저장 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
