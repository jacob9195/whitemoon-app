// =====================================================
// lib/utils/validate.ts
// 입력값 유효성 검사 함수 모음이에요.
// UI 코드와 분리해서 여기에 모아두면 나중에 수정하기 편해요.
// =====================================================

/** 날짜가 실제로 존재하는지 확인해요 (예: 2월 30일은 존재하지 않아요) */
export function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export type BirthFormErrors = {
  year?: string
  month?: string
  day?: string
  birth?: string   // 연/월/일 묶음 에러
  gender?: string
}

type RawInput = {
  year: string
  month: string
  day: string
  gender: 'male' | 'female' | null
}

/** 입력 폼 전체를 검사하고 에러 메시지 목록을 반환해요. 빈 객체면 이상 없음. */
export function validateBirthForm(input: RawInput): BirthFormErrors {
  const errors: BirthFormErrors = {}

  const y = Number(input.year)
  const m = Number(input.month)
  const d = Number(input.day)

  // 연도
  if (!input.year.trim()) {
    errors.year = '태어난 연도를 입력해 주세요'
  } else if (y < 1900 || y > 2025) {
    errors.year = '연도는 1900년부터 2025년 사이로 입력해 주세요'
  }

  // 월
  if (!input.month.trim()) {
    errors.month = '태어난 월을 입력해 주세요'
  } else if (m < 1 || m > 12) {
    errors.month = '월은 1~12 사이로 입력해 주세요'
  }

  // 일
  if (!input.day.trim()) {
    errors.day = '태어난 일을 입력해 주세요'
  } else if (d < 1 || d > 31) {
    errors.day = '일은 1~31 사이로 입력해 주세요'
  }

  // 날짜 조합이 실제로 존재하는지 (연/월/일이 모두 입력된 경우에만)
  if (!errors.year && !errors.month && !errors.day) {
    if (!isValidDate(y, m, d)) {
      errors.birth = `${m}월 ${d}일은 존재하지 않는 날짜예요. 다시 확인해 주세요`
    }
  }

  // 성별
  if (!input.gender) {
    errors.gender = '성별을 선택해 주세요'
  }

  return errors
}
