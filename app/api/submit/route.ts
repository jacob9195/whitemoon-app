// app/api/submit/route.ts
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

    const payload = {
      이름:           p.name,
      성별:           p.gender,
      양음력:         p.calType,
      생년월일:       p.birthDate,
      출생시각:       p.birthTime    ?? '',
      출생지:         p.birthPlace   ?? '',
      파트너이름:     pt?.name       ?? '',
      파트너성별:     pt?.gender     ?? '',
      파트너양음력:   pt?.calType    ?? '',
      파트너생년월일: pt?.birthDate  ?? '',
      파트너출생시각: pt?.birthTime  ?? '',
      파트너출생지:   pt?.birthPlace ?? '',
      상품:           data.product,
      이메일:         data.email,
      전화번호:       data.phone,
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL
    if (!scriptUrl) {
      return NextResponse.json(
        { ok: false, message: '서버 설정 오류입니다.' },
        { status: 500 }
      )
    }

    // Google Apps Script 호출 — 응답과 무관하게 성공 처리
    // (Script가 200 반환하면 저장 성공으로 간주)
    try {
      await fetch(scriptUrl, {
        method:   'POST',
        headers:  { 'Content-Type': 'text/plain' },
        body:     JSON.stringify(payload),
        redirect: 'follow',
      })
    } catch (fetchErr) {
      console.error('[submit] fetch 오류:', fetchErr)
      return NextResponse.json(
        { ok: false, message: '저장 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    // fetch 성공하면 무조건 ok 반환
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
