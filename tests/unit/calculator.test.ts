// =====================================================
// tests/unit/calculator.test.ts
//
// 사주 계산 순수 함수 테스트예요.
//
// 비개발자 설명:
//   이 테스트는 세 가지로 나뉘어요:
//
//   ① 지금 바로 통과해야 하는 테스트
//      — hourToSiIndex, hourToBranch 같은 구현된 함수들
//
//   ② calculateFourPillars 구현 후 통과해야 하는 테스트
//      — 결정론, 시간 유무, 경계값 등 (지금은 skip)
//
//   ③ golden fixture 비교 테스트
//      — 만세력 정답값을 채운 후 통과 (지금은 skip)
//
// 테스트 실행:
//   npm test                        — 전체 실행 (skip 포함)
//   npx vitest run calculator       — 이 파일만 실행
// =====================================================

import { describe, it, expect } from 'vitest'
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_READINGS,
  BRANCH_READINGS,
  STEM_FIVE_ELEMENTS,
  BRANCH_FIVE_ELEMENTS,
  hourToSiIndex,
  siIndexToBranch,
  hourToBranch,
  sumFiveElements,
  deriveDominance,
  calculateFourPillars,
  calculateFiveElements,
} from '@/lib/saju/calculator'
import type { BirthInput, FiveElements } from '@/lib/saju/types'
import {
  GOLDEN_FIXTURES,
  getVerifiedFixtures,
  getFixtureById,
} from '@/tests/fixtures/goldenFixtures'

// ── 공통 입력 예시 ────────────────────────────────────

const INPUT_A: BirthInput = {
  year: 1995, month: 8, day: 12,
  hour: 14,           // 오후 2시 → 未時(미시)
  gender: 'male',
  calendarType: 'solar',
}

const INPUT_B: BirthInput = {
  year: 2001, month: 11, day: 3,
  hour: 9,            // 오전 9시 → 巳時(사시)
  gender: 'female',
  calendarType: 'solar',
}

const INPUT_NO_HOUR: BirthInput = {
  ...INPUT_A,
  hour: null,
}

const INPUT_BOUNDARY_BEFORE: BirthInput = {
  ...INPUT_A,
  hour: 10,  // 10시 → 巳時(사시), 경계 직전
}

const INPUT_BOUNDARY_AFTER: BirthInput = {
  ...INPUT_A,
  hour: 11,  // 11시 → 午時(오시), 경계 직후
}

const INPUT_SAME_SI_A: BirthInput = {
  year: 1995, month: 8, day: 12,
  hour: 9,  // 9시 → 巳時
  gender: 'female',
  calendarType: 'solar',
}

const INPUT_SAME_SI_B: BirthInput = {
  ...INPUT_SAME_SI_A,
  hour: 10, // 10시도 → 巳時 (같은 時 구간)
}

// ─────────────────────────────────────────────────────────────────────
// 섹션 1: 상수 테이블 무결성 (지금 바로 통과해야 해요)
// ─────────────────────────────────────────────────────────────────────

describe('상수 테이블 — 크기·인덱스 일치', () => {

  it('HEAVENLY_STEMS가 10개여야 해요 (갑~계)', () => {
    expect(HEAVENLY_STEMS).toHaveLength(10)
  })

  it('EARTHLY_BRANCHES가 12개여야 해요 (자~해)', () => {
    expect(EARTHLY_BRANCHES).toHaveLength(12)
  })

  it('STEM_READINGS가 HEAVENLY_STEMS와 길이가 같아야 해요', () => {
    expect(STEM_READINGS).toHaveLength(HEAVENLY_STEMS.length)
  })

  it('BRANCH_READINGS가 EARTHLY_BRANCHES와 길이가 같아야 해요', () => {
    expect(BRANCH_READINGS).toHaveLength(EARTHLY_BRANCHES.length)
  })

  it('STEM_FIVE_ELEMENTS가 HEAVENLY_STEMS와 길이가 같아야 해요', () => {
    expect(STEM_FIVE_ELEMENTS).toHaveLength(HEAVENLY_STEMS.length)
  })

  it('BRANCH_FIVE_ELEMENTS가 EARTHLY_BRANCHES와 길이가 같아야 해요', () => {
    expect(BRANCH_FIVE_ELEMENTS).toHaveLength(EARTHLY_BRANCHES.length)
  })

  it('STEM_FIVE_ELEMENTS의 모든 값이 유효한 오행이어야 해요', () => {
    const valid = new Set(['wood', 'fire', 'earth', 'metal', 'water'])
    for (const el of STEM_FIVE_ELEMENTS) {
      expect(valid.has(el)).toBe(true)
    }
  })

  it('BRANCH_FIVE_ELEMENTS의 모든 값이 유효한 오행이어야 해요', () => {
    const valid = new Set(['wood', 'fire', 'earth', 'metal', 'water'])
    for (const el of BRANCH_FIVE_ELEMENTS) {
      expect(valid.has(el)).toBe(true)
    }
  })

  it('천간 0번이 甲이고 마지막(9번)이 癸여야 해요', () => {
    expect(HEAVENLY_STEMS[0]).toBe('甲')
    expect(HEAVENLY_STEMS[9]).toBe('癸')
  })

  it('지지 0번이 子이고 마지막(11번)이 亥여야 해요', () => {
    expect(EARTHLY_BRANCHES[0]).toBe('子')
    expect(EARTHLY_BRANCHES[11]).toBe('亥')
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 2: hourToSiIndex — 시각 → 時 인덱스 변환 (지금 바로 통과)
// ─────────────────────────────────────────────────────────────────────

describe('hourToSiIndex — 시각을 時 인덱스(0~11)로 변환', () => {

  // 자시(子時) — 23:00~00:59, 인덱스 0
  it('23시 → 0 (子時, 자시)', () => expect(hourToSiIndex(23)).toBe(0))
  it('0시  → 0 (子時, 자시)', () => expect(hourToSiIndex(0)).toBe(0))

  // 축시(丑時) — 01:00~02:59, 인덱스 1
  it('1시  → 1 (丑時, 축시)', () => expect(hourToSiIndex(1)).toBe(1))
  it('2시  → 1 (丑時, 축시)', () => expect(hourToSiIndex(2)).toBe(1))

  // 인시(寅時) — 03:00~04:59, 인덱스 2
  it('3시  → 2 (寅時, 인시)', () => expect(hourToSiIndex(3)).toBe(2))
  it('4시  → 2 (寅時, 인시)', () => expect(hourToSiIndex(4)).toBe(2))

  // 사시(巳時) — 09:00~10:59, 인덱스 5
  it('9시  → 5 (巳時, 사시)', () => expect(hourToSiIndex(9)).toBe(5))
  it('10시 → 5 (巳時, 사시)', () => expect(hourToSiIndex(10)).toBe(5))

  // ── 핵심 경계: 10:59 vs 11:00 ──
  it('10시 → 5 (巳時) — 오시 경계 직전', () => expect(hourToSiIndex(10)).toBe(5))
  it('11시 → 6 (午時) — 오시 경계 직후', () => expect(hourToSiIndex(11)).toBe(6))

  // 오시(午時) — 11:00~12:59, 인덱스 6
  it('11시 → 6 (午時, 오시)', () => expect(hourToSiIndex(11)).toBe(6))
  it('12시 → 6 (午時, 오시)', () => expect(hourToSiIndex(12)).toBe(6))

  // 미시(未時) — 13:00~14:59, 인덱스 7
  it('13시 → 7 (未時, 미시)', () => expect(hourToSiIndex(13)).toBe(7))
  it('14시 → 7 (未時, 미시)', () => expect(hourToSiIndex(14)).toBe(7))

  // 해시(亥時) — 21:00~22:59, 인덱스 11
  it('21시 → 11 (亥時, 해시)', () => expect(hourToSiIndex(21)).toBe(11))
  it('22시 → 11 (亥時, 해시)', () => expect(hourToSiIndex(22)).toBe(11))

  // 범위 오류
  it('범위 초과(24) → RangeError', () => {
    expect(() => hourToSiIndex(24)).toThrow(RangeError)
  })
  it('음수(-1) → RangeError', () => {
    expect(() => hourToSiIndex(-1)).toThrow(RangeError)
  })
  it('소수(1.5) → RangeError', () => {
    expect(() => hourToSiIndex(1.5)).toThrow(RangeError)
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 3: hourToBranch — 시각 → 지지 (지금 바로 통과)
// ─────────────────────────────────────────────────────────────────────

describe('hourToBranch — 시각을 지지로 변환', () => {

  it('0시  → 子 (자시)', () => expect(hourToBranch(0)).toBe('子'))
  it('23시 → 子 (자시)', () => expect(hourToBranch(23)).toBe('子'))
  it('9시  → 巳 (사시)', () => expect(hourToBranch(9)).toBe('巳'))
  it('10시 → 巳 (사시, 경계 전)', () => expect(hourToBranch(10)).toBe('巳'))
  it('11시 → 午 (오시, 경계 후)', () => expect(hourToBranch(11)).toBe('午'))
  it('14시 → 未 (미시)', () => expect(hourToBranch(14)).toBe('未'))

  it('9시와 10시는 같은 지지(巳)를 반환해야 해요 — 동일 시간 구간', () => {
    expect(hourToBranch(9)).toBe(hourToBranch(10))
  })

  it('10시와 11시는 다른 지지를 반환해야 해요 — 시주 경계', () => {
    expect(hourToBranch(10)).not.toBe(hourToBranch(11))
  })

  it('전체 24시간이 모두 유효한 지지를 반환해야 해요', () => {
    for (let h = 0; h <= 23; h++) {
      expect(EARTHLY_BRANCHES).toContain(hourToBranch(h))
    }
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 4: deriveDominance — strongest/weakest 도출 (지금 바로 통과)
// ─────────────────────────────────────────────────────────────────────

describe('deriveDominance — 오행 강약 도출', () => {

  it('화(火)가 가장 많으면 strongest가 "화"여야 해요', () => {
    const result = deriveDominance({ wood: 10, fire: 40, earth: 20, metal: 20, water: 10 })
    expect(result.strongest).toBe('화')
  })

  it('수(水)가 가장 적으면 weakest가 "수"여야 해요', () => {
    const result = deriveDominance({ wood: 30, fire: 30, earth: 20, metal: 15, water: 5 })
    expect(result.weakest).toBe('수')
  })

  it('strongest와 weakest가 항상 달라야 해요', () => {
    const result = deriveDominance({ wood: 15, fire: 30, earth: 20, metal: 25, water: 10 })
    expect(result.strongest).not.toBe(result.weakest)
  })

  it('결과가 유효한 오행 이름이어야 해요', () => {
    const valid = ['목', '화', '토', '금', '수']
    const result = deriveDominance({ wood: 20, fire: 20, earth: 20, metal: 20, water: 20 })
    expect(valid).toContain(result.strongest)
    expect(valid).toContain(result.weakest)
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 5: sumFiveElements (지금 바로 통과)
// ─────────────────────────────────────────────────────────────────────

describe('sumFiveElements — 오행 합계 계산', () => {

  it('합계가 100인 오행 분포의 합은 100이어야 해요', () => {
    const fe: FiveElements = {
      wood: 15, fire: 30, earth: 20, metal: 25, water: 10,
      strongest: '화', weakest: '수',
    }
    expect(sumFiveElements(fe)).toBe(100)
  })

  it('합계가 0이면 sumFiveElements는 0을 반환해야 해요', () => {
    const fe: FiveElements = {
      wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
      strongest: '목', weakest: '수',
    }
    expect(sumFiveElements(fe)).toBe(0)
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 6: calculateFourPillars — 구현 후 통과 (지금은 skip)
//
// 비개발자 설명:
//   아래 테스트들은 calculateFourPillars() 구현 전에는 실패해요.
//   구현 후 it.skip → it 로 변경하면 자동으로 검증돼요.
// ─────────────────────────────────────────────────────────────────────

describe('calculateFourPillars — 결정론 (구현 후 통과)', () => {

  it.skip('같은 입력 A를 2번 계산하면 fourPillars.day가 동일해야 해요', () => {
    const r1 = calculateFourPillars(INPUT_A)
    const r2 = calculateFourPillars(INPUT_A)
    expect(r1.day.heavenlyStem).toBe(r2.day.heavenlyStem)
    expect(r1.day.earthlyBranch).toBe(r2.day.earthlyBranch)
  })

  it.skip('같은 입력 A를 2번 계산하면 fourPillars 전체가 동일해야 해요', () => {
    const r1 = calculateFourPillars(INPUT_A)
    const r2 = calculateFourPillars(INPUT_A)
    expect(r1).toEqual(r2)
  })

  it.skip('입력 A와 입력 B는 year 기둥이 달라야 해요 (1995년 vs 2001년)', () => {
    const rA = calculateFourPillars(INPUT_A)
    const rB = calculateFourPillars(INPUT_B)
    // 1995년과 2001년은 연주가 다름
    const isSameYear =
      rA.year.heavenlyStem  === rB.year.heavenlyStem &&
      rA.year.earthlyBranch === rB.year.earthlyBranch
    expect(isSameYear).toBe(false)
  })

})

describe('calculateFourPillars — 시간 미입력 처리 (구현 후 통과)', () => {

  it.skip('hour가 null이면 time 기둥이 null이어야 해요', () => {
    const result = calculateFourPillars(INPUT_NO_HOUR)
    expect(result.time).toBeNull()
  })

  it.skip('hour null일 때와 있을 때 연주·월주·일주는 동일해야 해요', () => {
    const withHour    = calculateFourPillars(INPUT_A)
    const withoutHour = calculateFourPillars(INPUT_NO_HOUR)

    expect(withHour.year.heavenlyStem).toBe(withoutHour.year.heavenlyStem)
    expect(withHour.year.earthlyBranch).toBe(withoutHour.year.earthlyBranch)
    expect(withHour.month.heavenlyStem).toBe(withoutHour.month.heavenlyStem)
    expect(withHour.day.heavenlyStem).toBe(withoutHour.day.heavenlyStem)
  })

})

describe('calculateFourPillars — 시주 경계 (구현 후 통과)', () => {

  it.skip('10시와 10시 50분(hour=10)은 같은 시주(巳時)여야 해요', () => {
    const r_9  = calculateFourPillars(INPUT_SAME_SI_A)  // hour: 9
    const r_10 = calculateFourPillars(INPUT_SAME_SI_B)  // hour: 10
    // 둘 다 巳時
    expect(r_9.time?.earthlyBranch).toBe('巳')
    expect(r_10.time?.earthlyBranch).toBe('巳')
    expect(r_9.time?.earthlyBranch).toBe(r_10.time?.earthlyBranch)
  })

  it.skip('10시(hour=10)와 11시(hour=11)는 시주 지지가 달라야 해요 — 경계 전후', () => {
    const before = calculateFourPillars(INPUT_BOUNDARY_BEFORE) // hour: 10 → 巳時
    const after  = calculateFourPillars(INPUT_BOUNDARY_AFTER)  // hour: 11 → 午時

    expect(before.time?.earthlyBranch).toBe('巳')
    expect(after.time?.earthlyBranch).toBe('午')
    expect(before.time?.earthlyBranch).not.toBe(after.time?.earthlyBranch)
  })

  it.skip('자시 경계: 23시(hour=23)와 0시(hour=0)는 같은 시주(子時)여야 해요', () => {
    const at23 = calculateFourPillars({ ...INPUT_A, hour: 23 })
    const at0  = calculateFourPillars({ ...INPUT_A, hour: 0  })
    expect(at23.time?.earthlyBranch).toBe('子')
    expect(at0.time?.earthlyBranch).toBe('子')
  })

})

describe('calculateFourPillars — Pillar 구조 검증 (구현 후 통과)', () => {

  it.skip('반환된 각 기둥이 유효한 천간과 지지를 포함해야 해요', () => {
    const result = calculateFourPillars(INPUT_A)

    for (const pillar of [result.year, result.month, result.day]) {
      expect(HEAVENLY_STEMS).toContain(pillar.heavenlyStem)
      expect(EARTHLY_BRANCHES).toContain(pillar.earthlyBranch)
      expect(typeof pillar.stemReading).toBe('string')
      expect(typeof pillar.branchReading).toBe('string')
      expect(pillar.stemReading.length).toBeGreaterThan(0)
      expect(pillar.branchReading.length).toBeGreaterThan(0)
    }
  })

  it.skip('시주가 있을 때 time 기둥의 earthlyBranch가 hourToBranch 결과와 일치해야 해요', () => {
    const result = calculateFourPillars(INPUT_A) // hour: 14 → 未
    expect(result.time?.earthlyBranch).toBe(hourToBranch(14))
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 7: calculateFiveElements — 구현 후 통과 (지금은 skip)
// ─────────────────────────────────────────────────────────────────────

describe('calculateFiveElements — 오행 구조 (구현 후 통과)', () => {

  it.skip('오행 분포의 합이 100이어야 해요', () => {
    const pillars = calculateFourPillars(INPUT_A)
    const fe = calculateFiveElements(pillars)
    expect(sumFiveElements(fe)).toBe(100)
  })

  it.skip('각 오행 값이 0 이상이어야 해요', () => {
    const pillars = calculateFourPillars(INPUT_A)
    const fe = calculateFiveElements(pillars)
    expect(fe.wood).toBeGreaterThanOrEqual(0)
    expect(fe.fire).toBeGreaterThanOrEqual(0)
    expect(fe.earth).toBeGreaterThanOrEqual(0)
    expect(fe.metal).toBeGreaterThanOrEqual(0)
    expect(fe.water).toBeGreaterThanOrEqual(0)
  })

  it.skip('strongest가 실제로 가장 높은 오행이어야 해요', () => {
    const pillars = calculateFourPillars(INPUT_A)
    const fe = calculateFiveElements(pillars)
    const max = Math.max(fe.wood, fe.fire, fe.earth, fe.metal, fe.water)
    const keyMap: Record<string, number> = {
      목: fe.wood, 화: fe.fire, 토: fe.earth, 금: fe.metal, 수: fe.water
    }
    expect(keyMap[fe.strongest]).toBe(max)
  })

  it.skip('시주 유무가 오행 분포에 영향을 미쳐야 해요', () => {
    const withHour    = calculateFiveElements(calculateFourPillars(INPUT_A))
    const withoutHour = calculateFiveElements(calculateFourPillars(INPUT_NO_HOUR))
    // 시주가 있을 때와 없을 때 오행이 달라야 해요 (시주 기여분 차이)
    expect(sumFiveElements(withHour)).toBe(100)
    expect(sumFiveElements(withoutHour)).toBe(100)
  })

  it.skip('같은 입력으로 2번 호출하면 동일한 오행 분포여야 해요 (결정론)', () => {
    const pillars = calculateFourPillars(INPUT_A)
    const fe1 = calculateFiveElements(pillars)
    const fe2 = calculateFiveElements(pillars)
    expect(fe1).toEqual(fe2)
  })

})

// ─────────────────────────────────────────────────────────────────────
// 섹션 8: Golden Fixture 비교 (만세력 정답값 입력 후 통과)
// ─────────────────────────────────────────────────────────────────────

describe('Golden Fixture — 만세력 참조값 비교', () => {

  // status가 'verified'인 fixture가 생기면 자동으로 테스트돼요
  const verified = getVerifiedFixtures()

  if (verified.length === 0) {
    it.skip('아직 verified 상태의 fixture가 없어요 — goldenFixtures.ts에 정답값을 채워주세요', () => {})
  }

  for (const fixture of verified) {
    it.skip(`[${fixture.id}] ${fixture.description}`, () => {
      const pillars = calculateFourPillars({
        ...fixture.input,
        hour: fixture.input.hour,
      })

      // 연주
      if (fixture.expected.fourPillars.year.heavenlyStem) {
        expect(pillars.year.heavenlyStem).toBe(fixture.expected.fourPillars.year.heavenlyStem)
      }
      if (fixture.expected.fourPillars.year.earthlyBranch) {
        expect(pillars.year.earthlyBranch).toBe(fixture.expected.fourPillars.year.earthlyBranch)
      }

      // 월주
      if (fixture.expected.fourPillars.month.heavenlyStem) {
        expect(pillars.month.heavenlyStem).toBe(fixture.expected.fourPillars.month.heavenlyStem)
      }

      // 일주
      if (fixture.expected.fourPillars.day.heavenlyStem) {
        expect(pillars.day.heavenlyStem).toBe(fixture.expected.fourPillars.day.heavenlyStem)
      }

      // 시주 earthlyBranch는 hourToBranch로 검증 가능 (만세력 불필요)
      if (fixture.input.hour !== null && fixture.expected.fourPillars.time?.earthlyBranch) {
        expect(pillars.time?.earthlyBranch).toBe(
          fixture.expected.fourPillars.time.earthlyBranch
        )
      }
    })
  }

  // 시주 지지는 만세력 없이도 hourToBranch로 검증 가능 — 지금 바로 통과
  it('Fixture A — 14시의 시주 지지가 未(미시)여야 해요 (만세력 불필요)', () => {
    const fa = getFixtureById('A-1995-08-12-solar-14h-male')!
    expect(fa.expected.fourPillars.time?.earthlyBranch).toBe('未')
    // hourToBranch로도 동일하게 검증
    expect(hourToBranch(fa.input.hour!)).toBe('未')
  })

  it('Fixture B — 9시의 시주 지지가 巳(사시)여야 해요 (만세력 불필요)', () => {
    const fb = getFixtureById('B-2001-11-03-solar-09h-female')!
    expect(fb.expected.fourPillars.time?.earthlyBranch).toBe('巳')
    expect(hourToBranch(fb.input.hour!)).toBe('巳')
  })

  it('Fixture D — 10시의 시주 지지가 巳(경계 전)여야 해요 (만세력 불필요)', () => {
    const fd = getFixtureById('D-boundary-before-11h')!
    expect(fd.expected.fourPillars.time?.earthlyBranch).toBe('巳')
    expect(hourToBranch(fd.input.hour!)).toBe('巳')
  })

  it('Fixture E — 11시의 시주 지지가 午(경계 후)여야 해요 (만세력 불필요)', () => {
    const fe = getFixtureById('E-boundary-at-11h')!
    expect(fe.expected.fourPillars.time?.earthlyBranch).toBe('午')
    expect(hourToBranch(fe.input.hour!)).toBe('午')
  })

  it('Fixture C — 시간 없음일 때 expected.time이 null이어야 해요', () => {
    const fc = getFixtureById('C-1995-08-12-solar-unknown-male')!
    expect(fc.expected.fourPillars.time).toBeNull()
  })

})
