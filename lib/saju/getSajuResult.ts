// =====================================================
// lib/saju/getSajuResult.ts
//
// 입력값 검증 → BirthInput 변환 → FreeResult 반환
// 계산 레이어와 해석 레이어를 연결하는 게이트웨이
// =====================================================

import type { BirthInput, FreeResult } from '@/lib/saju/types'
import { getMockFreeResult } from '@/lib/mock/mockResult'
import { isValidDate } from '@/lib/utils/validate'

export type SajuRequest = {
  year:         string | null
  month:        string | null
  day:          string | null
  hour:         string | null
  gender:       string | null
  calendarType: string | null
}

export type SajuApiErrors = {
  year?:         string
  month?:        string
  day?:          string
  birth?:        string
  gender?:       string
  calendarType?: string
  general?:      string
}

export type SajuResponse =
  | { ok: true;  result: FreeResult }
  | { ok: false; errors: SajuApiErrors }

// 기존 호환용 (route.ts 등에서 SajuResult를 쓰는 경우 대비)
export type { FreeResult as SajuResult }

export function getSajuResult(req: SajuRequest): SajuResponse {
  const errors: SajuApiErrors = {}

  const year  = Number(req.year)
  const month = Number(req.month)
  const day   = Number(req.day)

  if (!req.year  || req.year.trim()  === '') errors.year  = '태어난 연도를 입력해 주세요'
  else if (isNaN(year)  || year  < 1900 || year  > 2025) errors.year  = '연도는 1900~2025년 사이로 입력해 주세요'

  if (!req.month || req.month.trim() === '') errors.month = '태어난 월을 입력해 주세요'
  else if (isNaN(month) || month < 1    || month > 12)   errors.month = '월은 1~12 사이로 입력해 주세요'

  if (!req.day   || req.day.trim()   === '') errors.day   = '태어난 일을 입력해 주세요'
  else if (isNaN(day)   || day   < 1    || day   > 31)   errors.day   = '일은 1~31 사이로 입력해 주세요'

  if (!errors.year && !errors.month && !errors.day) {
    if (!isValidDate(year, month, day)) {
      errors.birth = `${month}월 ${day}일은 존재하지 않는 날짜예요`
    }
  }

  if (!req.gender || (req.gender !== 'male' && req.gender !== 'female')) {
    errors.gender = '성별을 선택해 주세요'
  }

  if (!req.calendarType || (req.calendarType !== 'solar' && req.calendarType !== 'lunar')) {
    errors.calendarType = '양력 또는 음력을 선택해 주세요'
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  let hour: number | null = null
  if (req.hour && req.hour !== 'unknown') {
    const parsed = Number(req.hour)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) hour = parsed
  }

  const input: BirthInput = {
    year, month, day, hour,
    gender:       req.gender   as 'male' | 'female',
    calendarType: req.calendarType as 'solar' | 'lunar',
  }

  // TODO: 실제 계산 모듈 완성 후 아래 한 줄 교체
  // const result = calculateAndInterpret(input)
  const result = getMockFreeResult(input)

  return { ok: true, result }
}
