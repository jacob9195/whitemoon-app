// =====================================================
// lib/saju/calculator.ts
//
// 사주 계산 로직이에요.
//
// ⚠️ CLAUDE.md 핵심 규칙:
//   - 이 파일의 계산은 반드시 코드가 담당해요.
//   - LLM(AI)이 천간/지지를 추측하면 절대 안 돼요.
//   - 계산 결과가 없으면 해석을 생성하지 않아요.
//
// 파일 구조:
//   1. 상수 테이블 — 천간·지지·오행 매핑
//   2. 순수 유틸 함수 — 시각→時 변환, 인덱스 계산 등
//   3. 주요 계산 함수 — calculateFourPillars, calculateFiveElements
//
// 현재 상태:
//   - 상수 테이블과 시각 변환 유틸은 구현 완료
//   - calculateFourPillars / calculateFiveElements 는 TODO
//     (만세력 라이브러리 연결 후 구현 예정)
// =====================================================

import type {
  BirthInput,
  FourPillars,
  FiveElements,
  HeavenlyStem,
  EarthlyBranch,
} from '@/lib/saju/types'

// ──────────────────────────────────────────────────────
// 1. 상수 테이블
// ──────────────────────────────────────────────────────

/** 천간(天干) 10개 — 인덱스 0(甲)부터 9(癸) */
export const HEAVENLY_STEMS: HeavenlyStem[] = [
  '甲', '乙', '丙', '丁', '戊',
  '己', '庚', '辛', '壬', '癸',
]

/** 천간 한글 읽기 — HEAVENLY_STEMS와 인덱스 일치 */
export const STEM_READINGS: string[] = [
  '갑', '을', '병', '정', '무',
  '기', '경', '신', '임', '계',
]

/** 천간의 오행 매핑 — 인덱스 순서는 HEAVENLY_STEMS와 동일 */
export const STEM_FIVE_ELEMENTS = [
  'wood',  // 甲
  'wood',  // 乙
  'fire',  // 丙
  'fire',  // 丁
  'earth', // 戊
  'earth', // 己
  'metal', // 庚
  'metal', // 辛
  'water', // 壬
  'water', // 癸
] as const

/** 지지(地支) 12개 — 인덱스 0(子)부터 11(亥) */
export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥',
]

/** 지지 한글 읽기 — EARTHLY_BRANCHES와 인덱스 일치 */
export const BRANCH_READINGS: string[] = [
  '자', '축', '인', '묘', '진', '사',
  '오', '미', '신', '유', '술', '해',
]

/** 지지의 오행 매핑 */
export const BRANCH_FIVE_ELEMENTS = [
  'water', // 子
  'earth', // 丑
  'wood',  // 寅
  'wood',  // 卯
  'earth', // 辰
  'fire',  // 巳
  'fire',  // 午
  'earth', // 未
  'metal', // 申
  'metal', // 酉
  'earth', // 戌
  'water', // 亥
] as const

/**
 * 시각(0~23시)에서 時(시) 인덱스를 반환해요.
 *
 * 사주에서 하루는 12개의 時(2시간 단위)로 나뉘어요:
 *   子時(자시): 23:00~00:59  → 인덱스 0
 *   丑時(축시): 01:00~02:59  → 인덱스 1
 *   寅時(인시): 03:00~04:59  → 인덱스 2
 *   卯時(묘시): 05:00~06:59  → 인덱스 3
 *   辰時(진시): 07:00~08:59  → 인덱스 4
 *   巳時(사시): 09:00~10:59  → 인덱스 5
 *   午時(오시): 11:00~12:59  → 인덱스 6
 *   未時(미시): 13:00~14:59  → 인덱스 7
 *   申時(신시): 15:00~16:59  → 인덱스 8
 *   酉時(유시): 17:00~18:59  → 인덱스 9
 *   戌時(술시): 19:00~20:59  → 인덱스 10
 *   亥時(해시): 21:00~22:59  → 인덱스 11
 *
 * @param hour 0~23 사이의 정수
 * @returns 0~11 사이의 時 인덱스
 * @throws 0~23 범위 밖이면 Error
 */
export function hourToSiIndex(hour: number): number {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError(`hour는 0~23 사이의 정수여야 해요. 받은 값: ${hour}`)
  }
  // 子時(자시)는 23:00~00:59로 자정을 걸쳐요.
  // 23시는 0번(子時), 0~1시는 0번, 2~22시는 (hour + 1) / 2 내림
  if (hour === 23) return 0
  return Math.floor((hour + 1) / 2)
}

/**
 * 時 인덱스(0~11)에 해당하는 지지를 반환해요.
 * hourToSiIndex() 결과를 바로 넣으면 돼요.
 */
export function siIndexToBranch(siIndex: number): EarthlyBranch {
  if (siIndex < 0 || siIndex > 11) {
    throw new RangeError(`siIndex는 0~11 사이여야 해요. 받은 값: ${siIndex}`)
  }
  return EARTHLY_BRANCHES[siIndex]
}

/**
 * 시각(0~23)을 바로 지지로 변환하는 편의 함수예요.
 * hourToSiIndex + siIndexToBranch 를 합친 것이에요.
 */
export function hourToBranch(hour: number): EarthlyBranch {
  return siIndexToBranch(hourToSiIndex(hour))
}

/**
 * FiveElements의 합계를 계산해요 (검증용).
 * 정규화된 비율이라면 100에 가까워야 해요.
 */
export function sumFiveElements(fe: FiveElements): number {
  return fe.wood + fe.fire + fe.earth + fe.metal + fe.water
}

/**
 * FiveElements에서 strongest / weakest 를 도출해요.
 * 계산 모듈 완성 후 결과 검증에 사용해요.
 */
export function deriveDominance(fe: Omit<FiveElements, 'strongest' | 'weakest'>): {
  strongest: FiveElements['strongest']
  weakest:   FiveElements['weakest']
} {
  const entries = [
    { key: '목' as const, val: fe.wood  },
    { key: '화' as const, val: fe.fire  },
    { key: '토' as const, val: fe.earth },
    { key: '금' as const, val: fe.metal },
    { key: '수' as const, val: fe.water },
  ]
  entries.sort((a, b) => b.val - a.val)
  return {
    strongest: entries[0].key,
    weakest:   entries[entries.length - 1].key,
  }
}

// ──────────────────────────────────────────────────────
// 3. 주요 계산 함수 (TODO: 만세력 라이브러리 연결 후 구현)
// ──────────────────────────────────────────────────────

/**
 * 사주팔자를 계산해요.
 *
 * TODO: lunar-javascript 또는 node-saju 같은 만세력 라이브러리를
 *       연결해서 실제 계산을 구현하세요.
 *
 * 구현 가이드:
 *   1. npm install lunar-javascript 설치
 *   2. 양력 날짜 → 절기 기준 연주/월주/일주 계산
 *   3. hour !== null → hourToSiIndex + 일간 기반 시주 계산
 *   4. 각 기둥의 천간·지지를 HEAVENLY_STEMS / EARTHLY_BRANCHES 인덱스로 조회
 */
export function calculateFourPillars(input: BirthInput): FourPillars {
  throw new Error(
    '사주 계산 모듈이 아직 구현되지 않았어요. lib/saju/calculator.ts 를 완성해 주세요.\n' +
    '구현 방법: README.md의 "다음 단계" 섹션을 참고하세요.'
  )
}

/**
 * 사주팔자에서 오행 분포를 계산해요.
 *
 * TODO: 각 기둥의 천간·지지를 STEM_FIVE_ELEMENTS / BRANCH_FIVE_ELEMENTS 로
 *       매핑하고 비율을 계산하세요.
 *
 * 구현 가이드:
 *   1. 각 천간·지지의 오행을 조회 (8글자 = 최대 8개 오행)
 *   2. 오행별 빈도 집계
 *   3. 전체 합이 100이 되도록 정규화
 *   4. deriveDominance() 로 strongest/weakest 도출
 */
export function calculateFiveElements(pillars: FourPillars): FiveElements {
  throw new Error(
    '오행 계산 모듈이 아직 구현되지 않았어요. lib/saju/calculator.ts 를 완성해 주세요.'
  )
}
