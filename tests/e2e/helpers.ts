// =====================================================
// tests/e2e/helpers.ts
// 여러 테스트 파일에서 공통으로 쓰는 도우미 함수들이에요.
//
// 비개발자 설명:
//   반복되는 동작(예: 날짜 입력, 성별 선택)을 함수로 묶어서
//   테스트 코드를 간결하게 유지해요.
// =====================================================

import type { Page } from '@playwright/test'

// 정상 입력 예시들 — 테스트 전체에서 재사용해요
export const VALID_INPUT_A = {
  year: '1995', month: '8', day: '12',
  calendar: 'solar' as const,
  hour: '13', // 未時 (미시) — 오후 1시~3시
  gender: 'male' as const,
  label: '정상 입력 A (1995-08-12, 양력, 미시, 남성)',
}

export const VALID_INPUT_B = {
  year: '2001', month: '11', day: '3',
  calendar: 'solar' as const,
  hour: '7',  // 辰時 (진시) — 오전 7시~9시
  gender: 'female' as const,
  label: '정상 입력 B (2001-11-03, 양력, 진시, 여성)',
}

export const TIME_UNKNOWN_INPUT = {
  year: '1995', month: '8', day: '12',
  calendar: 'solar' as const,
  hour: 'unknown' as const,
  gender: 'male' as const,
  label: '시간 모름 입력 (1995-08-12, 양력, 모름, 남성)',
}

/**
 * 입력 폼에 날짜를 채워요.
 * 비개발자 설명: 사람이 타이핑하는 것처럼 년/월/일 칸에 숫자를 입력해요.
 */
export async function fillBirthDate(
  page: Page,
  year: string,
  month: string,
  day: string
) {
  await page.getByPlaceholder('출생 연도').fill(year)
  await page.getByPlaceholder('월').fill(month)
  await page.getByPlaceholder('일').fill(day)
}

/**
 * 성별 버튼을 클릭해요.
 */
export async function selectGender(page: Page, gender: 'male' | 'female') {
  await page.getByRole('button', { name: gender === 'male' ? '남성' : '여성' }).click()
}

/**
 * 출생 시간을 선택해요. 'unknown'이면 "모름" 버튼을 클릭해요.
 */
export async function selectHour(page: Page, hour: string | 'unknown') {
  if (hour === 'unknown') {
    await page.getByRole('button', { name: '모름' }).click()
  } else {
    // select 요소에서 value로 선택 (예: '13' → 未時 옵션)
    await page.locator('select').selectOption(hour)
  }
}

/**
 * 입력 → 제출까지 한 번에 처리해요. 결과 페이지로 이동하는 정상 흐름에 써요.
 */
export async function fillAndSubmit(
  page: Page,
  input: {
    year: string
    month: string
    day: string
    hour: string | 'unknown'
    gender: 'male' | 'female'
  }
) {
  await fillBirthDate(page, input.year, input.month, input.day)
  await selectHour(page, input.hour)
  await selectGender(page, input.gender)
  await page.getByRole('button', { name: '사주 풀어보기' }).click()
}
