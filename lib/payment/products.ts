// =====================================================
// lib/payment/products.ts
// 상품 목록 — 가격은 서버에서만 확정
// =====================================================

export type ProductId =
  | 'saju-love'
  | 'saju-wealth'
  | 'saju-classic'
  | 'saju-match'
  | 'saju-allinone'

export type Product = {
  id:          ProductId
  name:        string        // 결제창 표시명
  shortName:   string        // 카드 표시 짧은 이름
  price:       number        // 원 단위 (서버 확정)
  badge?:      string        // 추천 배지 문구
  tagline:     string        // 한 줄 설명
  description: string        // 상세 설명
  includes:    string[]      // 포함 항목
  isFeatured:  boolean       // 대표 상품 여부
  isBundle:    boolean       // 패키지 여부
}

export const PRODUCTS: Product[] = [
  {
    id:          'saju-classic',
    name:        '정통 사주 리포트',
    shortName:   '정통 사주',
    price:       15900,
    badge:       '가장 많이 선택',
    tagline:     '사주팔자 전체를 바탕으로 성격·관계·운의 흐름을 깊이 분석합니다',
    description: '원국 구조부터 오행 분포, 십신 해석, 올해의 시기 흐름까지 — 처음 사주를 제대로 보고 싶은 분께 가장 먼저 권하는 리포트입니다.',
    includes: [
      '원국 구조 요약 및 일간 해석',
      '오행 강약 분석',
      '핵심 성격과 기질 분석',
      '강점과 약점',
      '인간관계 스타일',
      '연애 성향 요약',
      '직업·적성 방향',
      '재물 흐름 요약',
      `${new Date().getFullYear()}년 시기 흐름`,
      '주의 포인트와 실천 조언',
    ],
    isFeatured: true,
    isBundle:   false,
  },
  {
    id:          'saju-love',
    name:        '연애 리포트',
    shortName:   '연애',
    price:       9900,
    tagline:     '감정 패턴, 연애 방식, 관계에서 반복되는 구조를 분석합니다',
    description: '사랑하는 방식, 감정 표현의 결, 집착과 거리두기 패턴, 맞는 상대의 성향까지 — 연애에서 반복되는 문제의 구조를 읽어드립니다.',
    includes: [
      '감정 표현 방식과 결',
      '연애 패턴 분석',
      '집착·거리두기 패턴',
      '맞는 상대 성향',
      '피해야 할 관계 유형',
      '관계에서 반복되는 문제',
      '연애 시기 흐름',
      '감정 소모 포인트와 개선 조언',
    ],
    isFeatured: false,
    isBundle:   false,
  },
  {
    id:          'saju-wealth',
    name:        '재물·직업 리포트',
    shortName:   '재물·직업',
    price:       9900,
    tagline:     '돈을 다루는 방식, 직업 적성, 커리어 흐름을 분석합니다',
    description: '재물을 불리는 구조인지 지키는 구조인지, 조직형인지 독립형인지 — 일과 돈에서 나의 강점과 주의점을 구체적으로 분석합니다.',
    includes: [
      '돈을 다루는 방식',
      '안정형·확장형·승부형 성향',
      '직업 적성과 환경',
      '일하는 방식과 강점',
      '조직형·독립형 성향',
      '재물 관리 주의점',
      '커리어 전환 포인트',
      '실무형 조언',
    ],
    isFeatured: false,
    isBundle:   false,
  },
  {
    id:          'saju-match',
    name:        '궁합 리포트',
    shortName:   '궁합',
    price:       19900,
    tagline:     '두 사람의 구조를 비교해 끌림과 충돌의 지점을 분석합니다',
    description: '왜 끌리는지, 어디서 부딪히는지, 장기 관계에서 무엇을 조율해야 하는지 — 두 사람의 사주 구조를 비교 분석합니다.',
    includes: [
      '두 사람 원국 구조 비교',
      '끌리는 포인트 분석',
      '충돌 구조 분석',
      '감정 리듬 차이',
      '관계 운영 방식 비교',
      '장기 관계 적합성',
      '조율 포인트',
      '관계 유지 실천 팁',
    ],
    isFeatured: false,
    isBundle:   false,
  },
  {
    id:          'saju-allinone',
    name:        '올인원 패키지',
    shortName:   '올인원',
    price:       29900,
    badge:       '최고의 가성비',
    tagline:     '모든 리포트를 한번에 — 삶의 전 영역을 입체적으로 분석합니다',
    description: '정통 사주 + 연애 + 재물·직업 + 궁합까지 — 개별 구매 시 55,700원을 올인원으로 29,900원에 받아보세요.',
    includes: [
      '정통 사주 리포트 전체',
      '연애 리포트 전체',
      '재물·직업 리포트 전체',
      '궁합 리포트 전체',
      '종합 실천 가이드',
    ],
    isFeatured: false,
    isBundle:   true,
  },
]

export const FEATURED_PRODUCT = PRODUCTS.find(p => p.isFeatured)!
export const BUNDLE_PRODUCT   = PRODUCTS.find(p => p.isBundle)!

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}
