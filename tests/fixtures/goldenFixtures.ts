// =====================================================
// tests/fixtures/goldenFixtures.ts
//
// Golden Fixture — 만세력 참조값 비교용 테스트 데이터예요.
//
// 비개발자 설명:
//   "golden fixture"란 신뢰할 수 있는 참조 정답을 미리 저장해두고,
//   나중에 계산 모듈을 구현했을 때 결과가 이 정답과 일치하는지
//   자동으로 검사하는 방식이에요.
//
//   지금은 천간·지지 정답값이 TODO로 비어 있어요.
//   아래 "정답값 채우는 방법"을 보고 신뢰할 수 있는 출처에서
//   값을 직접 조회해서 채워주세요.
//
// 정답값 채우는 방법:
//   1. 신뢰할 수 있는 온라인 만세력에서 해당 날짜를 검색하세요.
//      추천: https://www.sajuplus.net  또는  https://manse.divination.kr
//   2. 연주·월주·일주·시주의 천간·지지를 확인해요.
//   3. 아래 TODO 주석 자리에 해당 값을 입력하세요.
//   4. 여러 출처에서 교차 확인하면 더 신뢰할 수 있어요.
//
// ⚠️ 주의:
//   - 절기(節氣) 기준을 쓰는 만세력을 사용하세요 (시간까지 표시되는 것).
//   - 자정을 기준으로 월주가 바뀌는 경우와 절기 시각 기준이 다를 수 있어요.
//   - 출처 URL을 주석으로 남겨두면 나중에 재확인하기 편해요.
// =====================================================

import type { HeavenlyStem, EarthlyBranch } from '@/lib/saju/types'

/** 기둥 하나의 참조값 구조 */
type PillarRef = {
  heavenlyStem:  HeavenlyStem  | null  // null = 아직 채우지 않음
  earthlyBranch: EarthlyBranch | null
  source?: string  // 출처 URL이나 책 이름
}

/** 사주팔자 참조값 구조 */
type FourPillarsRef = {
  year:  PillarRef
  month: PillarRef
  day:   PillarRef
  time:  PillarRef | null  // null = 시간 미입력
}

/** Golden Fixture 한 항목 */
export type GoldenFixture = {
  id:          string       // 테스트 식별자
  description: string       // 사람이 읽을 수 있는 설명
  input: {
    year:         number
    month:        number
    day:          number
    hour:         number | null
    gender:       'male' | 'female'
    calendarType: 'solar' | 'lunar'
  }
  expected: {
    fourPillars: FourPillarsRef
    fiveElements?: {
      // 비율이 아닌 "강함/약함" 정도만 기록해도 돼요
      strongest?: '목' | '화' | '토' | '금' | '수' | null
      weakest?:   '목' | '화' | '토' | '금' | '수' | null
    }
  }
  status: 'verified' | 'todo'  // 'todo' = 아직 정답값 미입력
}

// ──────────────────────────────────────────────────────
// Fixture 목록
// ──────────────────────────────────────────────────────

export const GOLDEN_FIXTURES: GoldenFixture[] = [

  // ── Fixture A: 1995-08-12 / 양력 / 14:30 / 남성 ──────
  {
    id: 'A-1995-08-12-solar-14h-male',
    description: '정상 입력 A — 1995년 8월 12일 양력 오후 2시 30분 (未時) 남성',
    input: {
      year: 1995, month: 8, day: 12,
      hour: 14,  // 14시 → 未時(미시) 인덱스 7
      gender: 'male',
      calendarType: 'solar',
    },
    expected: {
      fourPillars: {
        year: {
          heavenlyStem:  null, // TODO: 만세력 조회 후 채우세요 (예: '乙')
          earthlyBranch: null, // TODO: (예: '亥')
          source: 'TODO: https://만세력사이트.com/결과URL',
        },
        month: {
          heavenlyStem:  null, // TODO:
          earthlyBranch: null, // TODO:
        },
        day: {
          heavenlyStem:  null, // TODO:
          earthlyBranch: null, // TODO:
        },
        time: {
          heavenlyStem:  null, // TODO: 일간 기반 시주 계산 필요
          earthlyBranch: '未', // 14시 → 未時 — 이건 hourToBranch()로 검증 가능
        },
      },
      fiveElements: {
        strongest: null, // TODO:
        weakest:   null, // TODO:
      },
    },
    status: 'todo',
  },

  // ── Fixture B: 2001-11-03 / 양력 / 09:10 / 여성 ──────
  {
    id: 'B-2001-11-03-solar-09h-female',
    description: '정상 입력 B — 2001년 11월 3일 양력 오전 9시 10분 (巳時) 여성',
    input: {
      year: 2001, month: 11, day: 3,
      hour: 9,   // 9시 → 巳時(사시) 인덱스 5
      gender: 'female',
      calendarType: 'solar',
    },
    expected: {
      fourPillars: {
        year: {
          heavenlyStem:  null, // TODO:
          earthlyBranch: null, // TODO:
        },
        month: {
          heavenlyStem:  null, // TODO:
          earthlyBranch: null, // TODO:
        },
        day: {
          heavenlyStem:  null, // TODO:
          earthlyBranch: null, // TODO:
        },
        time: {
          heavenlyStem:  null, // TODO:
          earthlyBranch: '巳', // 9시 → 巳時 — hourToBranch()로 검증 가능
        },
      },
    },
    status: 'todo',
  },

  // ── Fixture C: 시간 모름 (시주 null) ─────────────────
  {
    id: 'C-1995-08-12-solar-unknown-male',
    description: '시간 모름 — 시주가 null이어야 해요',
    input: {
      year: 1995, month: 8, day: 12,
      hour: null,
      gender: 'male',
      calendarType: 'solar',
    },
    expected: {
      fourPillars: {
        year:  { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일값
        month: { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일값
        day:   { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일값
        time:  null, // 시간 없음 → 시주 null
      },
    },
    status: 'todo',
  },

  // ── Fixture D: 시주 경계 — 10:59 (巳時 마지막) ───────
  {
    id: 'D-boundary-before-11h',
    description: '시주 경계 전 — 10:59는 巳時(사시)여야 해요',
    input: {
      year: 1995, month: 8, day: 12,
      hour: 10,  // 10시 → 巳時(사시) 인덱스 5
      gender: 'male',
      calendarType: 'solar',
    },
    expected: {
      fourPillars: {
        year:  { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일
        month: { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일
        day:   { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일
        time: {
          heavenlyStem:  null,
          earthlyBranch: '巳', // 10시 → 巳時 — hourToBranch()로 검증 가능
        },
      },
    },
    status: 'todo',
  },

  // ── Fixture E: 시주 경계 — 11:00 (午時 시작) ─────────
  {
    id: 'E-boundary-at-11h',
    description: '시주 경계 후 — 11:00는 午時(오시)여야 해요',
    input: {
      year: 1995, month: 8, day: 12,
      hour: 11,  // 11시 → 午時(오시) 인덱스 6
      gender: 'male',
      calendarType: 'solar',
    },
    expected: {
      fourPillars: {
        year:  { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일
        month: { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일
        day:   { heavenlyStem: null, earthlyBranch: null }, // TODO: A와 동일
        time: {
          heavenlyStem:  null,
          earthlyBranch: '午', // 11시 → 午時 — hourToBranch()로 검증 가능
        },
      },
    },
    status: 'todo',
  },

]

/**
 * status가 'verified'인 fixture만 뽑아요.
 * 정답값을 다 채운 항목이 생기면 이 함수로 필터링해서 테스트해요.
 */
export function getVerifiedFixtures(): GoldenFixture[] {
  return GOLDEN_FIXTURES.filter(f => f.status === 'verified')
}

/**
 * 특정 id의 fixture를 가져와요.
 */
export function getFixtureById(id: string): GoldenFixture | undefined {
  return GOLDEN_FIXTURES.find(f => f.id === id)
}
