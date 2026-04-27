// =====================================================
// lib/saju/normalizeInput.ts
//
// 문자열 입력값을 BirthInput 타입으로 변환하는 함수예요.
//
// 비개발자 설명:
//   URL 파라미터나 폼 데이터는 항상 "문자열"로 들어와요.
//   이 파일은 그 문자열을 계산에 쓸 수 있는 숫자/타입으로 바꿔줘요.
//   예: "1995" → 1995, "unknown" → null, "solar" → 'solar'
//
// getSajuResult.ts 에서 검증(validate) 이후에 이 함수를 쓰면 돼요.
// =====================================================

import type { BirthInput } from '@/lib/saju/types'

/** normalizeInput이 받는 원시 문자열 모음 */
export type RawBirthInput = {
  year:         string | null
  month:        string | null
  day:          string | null
  hour:         string | null   // 숫자 문자열, 'unknown', 또는 null
  gender:       string | null
  calendarType: string | null
}

/** 정규화 결과 — 성공이면 input, 실패면 오류 목록 */
export type NormalizeResult =
  | { ok: true;  input: BirthInput }
  | { ok: false; errors: Record<string, string> }

/**
 * 시각 문자열을 number | null 로 변환해요.
 *
 * 규칙:
 *   - null, '', 'unknown' → null (시주 미상)
 *   - '0'~'23' 범위 숫자 문자열 → 해당 숫자
 *   - 범위 밖이거나 숫자가 아니면 → null (오류 없이 무시)
 */
export function parseHour(raw: string | null): number | null {
  if (raw === null || raw.trim() === '' || raw === 'unknown') return null
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 23) return null
  return parsed
}

/**
 * calendarType 문자열을 'solar' | 'lunar' 로 변환해요.
 * 둘 다 아니면 기본값 'solar' 를 반환해요.
 */
export function parseCalendarType(raw: string | null): 'solar' | 'lunar' {
  if (raw === 'lunar') return 'lunar'
  return 'solar'
}

/**
 * gender 문자열을 'male' | 'female' 로 변환해요.
 * 유효하지 않으면 null 을 반환해요 (검증은 getSajuResult에서 담당).
 */
export function parseGender(raw: string | null): 'male' | 'female' | null {
  if (raw === 'male' || raw === 'female') return raw
  return null
}

/**
 * 문자열 입력 전체를 BirthInput 으로 정규화해요.
 * 필수 필드(year·month·day·gender)가 유효하지 않으면 ok:false 를 반환해요.
 *
 * 주의: 이 함수는 가벼운 타입 변환만 해요.
 *       날짜 존재 여부 같은 비즈니스 규칙 검증은 getSajuResult 가 담당해요.
 */
export function normalizeBirthInput(raw: RawBirthInput): NormalizeResult {
  const errors: Record<string, string> = {}

  const year  = Number(raw.year)
  const month = Number(raw.month)
  const day   = Number(raw.day)

  if (!raw.year  || isNaN(year))  errors.year  = 'year는 숫자여야 해요'
  if (!raw.month || isNaN(month)) errors.month = 'month는 숫자여야 해요'
  if (!raw.day   || isNaN(day))   errors.day   = 'day는 숫자여야 해요'

  const gender = parseGender(raw.gender)
  if (!gender) errors.gender = 'gender는 "male" 또는 "female" 이어야 해요'

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  return {
    ok: true,
    input: {
      year,
      month,
      day,
      hour:         parseHour(raw.hour),
      gender:       gender!,
      calendarType: parseCalendarType(raw.calendarType),
    },
  }
}
