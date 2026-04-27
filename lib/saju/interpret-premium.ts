// =====================================================
// lib/saju/interpret-premium.ts
//
// 프리미엄 PDF용 상세 해석 문장 생성
// ─────────────────────────────────────────────────────
// 원칙:
//   - 기존 계산 결과(FourPillars, FiveElements)를 입력으로 받음
//   - 계산값이 없는 항목은 임의 발명하지 않고 TODO 표시
//   - 각 섹션 최소 2~5문단 분량
//   - 단정적 표현("~입니다") 대신 "~편이에요", "~수 있어요" 사용
// =====================================================

import type { BirthInput, FourPillars, FiveElements } from '@/lib/saju/types'
import type { PremiumReportData, FreeReportData } from '@/lib/types/report'

const YEAR = new Date().getFullYear()

// 오행 이름 매핑
const ELEMENT_NAMES: Record<string, string> = {
  목: '목(木)', 화: '화(火)', 토: '토(土)', 금: '금(金)', 수: '수(水)',
}

const ELEMENT_TRAITS: Record<string, { strength: string; caution: string; complement: string }> = {
  목: {
    strength:   '창의성과 성장 의지가 강해요. 새로운 것을 시작하고 뻗어나가는 에너지가 풍부해요.',
    caution:    '지나치게 고집스럽거나 우유부단해질 수 있어요.',
    complement: '화(火)의 활동성과 결합할 때 가장 빛나는 편이에요.',
  },
  화: {
    strength:   '열정과 추진력이 뛰어나요. 사람들과 어울리며 에너지를 발산하는 힘이 강해요.',
    caution:    '급한 성격이나 과도한 흥분 상태로 번아웃이 올 수 있어요.',
    complement: '토(土)의 안정감이 보완되면 지속성이 높아져요.',
  },
  토: {
    strength:   '안정감과 신뢰감이 핵심이에요. 주변 사람들의 중심축 역할을 해요.',
    caution:    '변화에 느리게 반응하거나 지나친 걱정으로 판단이 흐려질 수 있어요.',
    complement: '금(金)의 결단력이 더해지면 균형잡힌 리더십이 나와요.',
  },
  금: {
    strength:   '의지력과 결단력이 강해요. 원칙을 지키며 체계적으로 일하는 힘이 있어요.',
    caution:    '지나치게 엄격하거나 융통성이 부족하게 보일 수 있어요.',
    complement: '수(水)의 유연함이 보완되면 관계와 협업이 부드러워져요.',
  },
  수: {
    strength:   '지혜와 유연함이 강해요. 상황에 따라 적응하며 깊이 있게 사고하는 능력이 있어요.',
    caution:    '우유부단하거나 흐름에 떠내려가는 경향이 생길 수 있어요.',
    complement: '목(木)의 방향성이 더해지면 지혜가 실천력으로 이어져요.',
  },
}

// 천간(일간) 기반 특성
const STEM_TRAITS: Record<string, {
  base: string; strength: string; weakness: string
  career: string; love: string; wealth: string; health: string
}> = {
  甲: {
    base:     '갑목(甲木) — 큰 나무처럼 곧게 자라는 기운이에요.',
    strength: '리더십, 창의성, 개척 정신이 강해요.',
    weakness: '고집과 경직성으로 협력이 어려울 때가 있어요.',
    career:   '개척·창업·리더십이 필요한 분야에서 두각을 나타내요.',
    love:     '진심 어린 사랑을 하는 편이지만 고집으로 갈등이 생길 수 있어요.',
    wealth:   '도전적 투자에 끌리는 편이에요. 장기적 관점이 재물운을 높여요.',
    health:   '간·담 기능에 주의가 필요하며 스트레칭과 산책이 도움돼요.',
  },
  乙: {
    base:     '을목(乙木) — 유연하게 환경에 적응하는 작은 나무의 기운이에요.',
    strength: '유연성, 공감 능력, 세밀한 관찰력이 뛰어나요.',
    weakness: '우유부단하거나 타인의 시선에 영향을 많이 받을 수 있어요.',
    career:   '예술·교육·서비스처럼 섬세함이 요구되는 분야에 잘 맞아요.',
    love:     '배려 깊은 연애를 하지만 표현이 부족해 오해가 생길 수 있어요.',
    wealth:   '안정적 저축보다 실용적 소비 성향이 있어요. 꾸준한 절약이 재물을 지켜줘요.',
    health:   '과로에 주의하고 규칙적인 수면이 건강 열쇠예요.',
  },
  丙: {
    base:     '병화(丙火) — 태양처럼 밝고 따뜻한 에너지예요.',
    strength: '사교성, 낙관성, 추진력이 넘쳐요.',
    weakness: '산만하거나 깊이 없이 표면만 즐기는 경향이 있어요.',
    career:   '영업·마케팅·공연·방송처럼 사람과 소통하는 분야에서 빛나요.',
    love:     '활발하고 즐거운 연애를 하지만 지속성에 노력이 필요해요.',
    wealth:   '돈 씀씀이가 크고 넉넉하게 쓰는 편이에요. 예산 관리 습관이 재물운을 높여요.',
    health:   '심장·혈압에 주의하고 과도한 흥분을 조절하는 연습이 도움돼요.',
  },
  丁: {
    base:     '정화(丁火) — 촛불처럼 따뜻하고 세심한 불빛이에요.',
    strength: '섬세함, 예술적 감각, 헌신적 태도가 강해요.',
    weakness: '예민함으로 인해 상처를 쉽게 받거나 감정 기복이 있을 수 있어요.',
    career:   '예술·교육·상담·의료처럼 세심함과 감성이 필요한 분야가 맞아요.',
    love:     '진심을 다하는 연애를 하지만 감정 기복이 관계를 어렵게 할 수 있어요.',
    wealth:   '충동 구매 경향이 있어요. 지출 기록 습관이 도움이 돼요.',
    health:   '심장·소장 건강에 주의하고 명상이나 가벼운 운동이 좋아요.',
  },
  戊: {
    base:     '무토(戊土) — 넓은 산처럼 묵직하고 포용력 있는 기운이에요.',
    strength: '포용력, 안정감, 신뢰감이 탁월해요.',
    weakness: '변화에 느리고 고집스러울 수 있어요.',
    career:   '행정·부동산·건설·교육처럼 안정과 신뢰가 필요한 분야에 맞아요.',
    love:     '믿음직한 파트너지만 변화를 두려워해 관계가 정체될 수 있어요.',
    wealth:   '안정적 자산(부동산·적금) 선호. 꾸준한 저축으로 재물을 쌓아요.',
    health:   '소화기 계통에 주의하고 과식을 조심해요.',
  },
  己: {
    base:     '기토(己土) — 비옥한 논밭처럼 세심하고 실용적인 기운이에요.',
    strength: '세심함, 실용성, 배려심이 뛰어나요.',
    weakness: '지나친 걱정과 소심함으로 기회를 놓칠 수 있어요.',
    career:   '회계·영양사·의료·서비스처럼 꼼꼼함과 실용성이 요구되는 분야에 맞아요.',
    love:     '헌신적이지만 자기 감정 표현이 부족해 오해가 생길 수 있어요.',
    wealth:   '알뜰한 소비 성향이에요. 계획적 지출로 안정적 자산을 형성해요.',
    health:   '소화기·비장에 주의하고 규칙적 식사가 중요해요.',
  },
  庚: {
    base:     '경금(庚金) — 강인한 금속처럼 의지와 결단이 강한 기운이에요.',
    strength: '추진력, 원칙, 결단력이 탁월해요.',
    weakness: '융통성 부족으로 갈등을 일으킬 수 있어요.',
    career:   '기획·법·금융·군사처럼 결단력과 책임이 요구되는 분야에 맞아요.',
    love:     '진지한 사랑을 하지만 감정 표현이 서툴러 답답할 수 있어요.',
    wealth:   '큰 그림의 투자에 관심이 있어요. 리스크 관리가 재물운의 열쇠예요.',
    health:   '폐·대장 기능에 주의하고 충분한 수분 섭취가 중요해요.',
  },
  辛: {
    base:     '신금(辛金) — 섬세하게 다듬어진 보석처럼 예리하고 아름다운 기운이에요.',
    strength: '예리함, 미적 감각, 완벽주의적 집중력이 강해요.',
    weakness: '예민함과 완벽주의로 스트레스를 많이 받을 수 있어요.',
    career:   '디자인·패션·의료·회계처럼 정밀함과 미적 감각이 필요한 분야에 잘 맞아요.',
    love:     '높은 기준으로 이상적인 파트너를 찾아요. 현실적 기대 조율이 필요해요.',
    wealth:   '고급 소비 성향이에요. 수입 대비 지출 계획이 재물운을 안정시켜요.',
    health:   '폐·호흡기에 주의하고 공기 좋은 곳에서의 산책이 도움돼요.',
  },
  壬: {
    base:     '임수(壬水) — 넓은 바다처럼 깊고 자유로운 지혜의 기운이에요.',
    strength: '지혜, 유연성, 포용력이 풍부해요.',
    weakness: '우유부단하거나 일관성이 부족할 수 있어요.',
    career:   '연구·외교·컨설팅·예술처럼 창의적 사고와 유연함이 요구되는 분야에 맞아요.',
    love:     '깊고 자유로운 연애를 원해요. 구속은 관계를 힘들게 할 수 있어요.',
    wealth:   '흐름을 읽는 직관이 강해요. 단, 지속성 있는 투자 전략이 필요해요.',
    health:   '신장·방광에 주의하고 충분한 수분 섭취와 수면이 중요해요.',
  },
  癸: {
    base:     '계수(癸水) — 이슬처럼 섬세하고 깊은 지혜의 기운이에요.',
    strength: '섬세함, 직관력, 깊은 공감 능력이 뛰어나요.',
    weakness: '감수성이 예민해 상처를 쉽게 받을 수 있어요.',
    career:   '심리학·예술·문학·의료처럼 감성과 직관이 필요한 분야에 맞아요.',
    love:     '감성적이고 헌신적인 연애를 하지만 자기 보호도 중요해요.',
    wealth:   '충동적 소비 경향이 있어요. 고정 지출 자동이체가 재물 보호에 도움돼요.',
    health:   '신장·방광·생식기 건강에 주의하고 과도한 감정 소모를 피해요.',
  },
}

// ── 무료 결과 데이터 생성 ─────────────────────────────

export function buildFreeReportData(
  input: BirthInput,
  pillars: FourPillars,
  elements: FiveElements,
): FreeReportData {
  const dayStem    = pillars.day.heavenlyStem
  const trait      = STEM_TRAITS[dayStem]
  const strongest  = ELEMENT_NAMES[elements.strongest]
  const weakest    = ELEMENT_NAMES[elements.weakest]

  return {
    basicChart: { fourPillars: pillars, fiveElements: elements },

    elementsSummary:
      `${strongest}의 기운이 가장 강하고, ${weakest}의 기운이 상대적으로 부족해요.`,

    personalityShort:
      trait
        ? `${trait.base} ${trait.strength}`
        : `${dayStem} 일간의 기운은 고유한 개성과 강인한 내면을 나타내요.`,

    careerShort:
      trait
        ? `${trait.career.split('.')[0]}. 상세 분석은 PDF에서 확인하세요.`
        : `일간의 기운에 맞는 직업 분석을 PDF에서 확인하세요.`,

    loveShort:
      trait
        ? `${trait.love.split('.')[0]}. 상세 분석은 PDF에서 확인하세요.`
        : `연애 성향 분석을 PDF에서 확인하세요.`,

    cautionShort:
      trait
        ? `${trait.weakness.split('.')[0]}. 상세 조언은 PDF에서 확인하세요.`
        : `주의점 분석을 PDF에서 확인하세요.`,
  }
}

// ── 프리미엄 PDF 해석 생성 ────────────────────────────

export function buildPremiumReportData(
  input: BirthInput,
  pillars: FourPillars,
  elements: FiveElements,
): PremiumReportData {
  const dayStem   = pillars.day.heavenlyStem
  const trait     = STEM_TRAITS[dayStem] ?? {
    base: `${dayStem} 일간`, strength: '고유한 에너지', weakness: '균형 조율 필요',
    career: '다양한 분야', love: '진심 어린 관계', wealth: '꾸준한 재물 관리', health: '균형 잡힌 생활',
  }

  const strongest  = elements.strongest
  const weakest    = elements.weakest
  const strongName = ELEMENT_NAMES[strongest]
  const weakName   = ELEMENT_NAMES[weakest]
  const strongData = ELEMENT_TRAITS[strongest]
  const weakData   = ELEMENT_TRAITS[weakest]

  const calLabel    = input.calendarType === 'lunar' ? '음력' : '양력'
  const genderLabel = input.gender === 'male' ? '남성' : '여성'
  const timeLabel   = input.hour !== null ? `${input.hour}시` : '(시간 미상)'

  return {
    // 1. 기본 정보 요약
    chartOverview: `
${calLabel} ${input.year}년 ${input.month}월 ${input.day}일 ${timeLabel} 출생 ${genderLabel}의 사주 분석입니다.

사주는 태어난 순간의 우주적 에너지 패턴을 네 개의 기둥(四柱)으로 나타내요. 연주(年柱)는 태어난 해의 큰 기운을, 월주(月柱)는 자라온 환경의 기운을, 일주(日柱)는 나 자신의 본래 기운을, 시주(時柱)는 미래와 내면의 지향점을 나타내요.

이 리포트는 현재 계산 가능한 범위 안에서 가장 밀도 있는 해석을 제공해요. 십성(十星)·대운(大運)은 만세력 계산 모듈이 완성되면 더 정밀하게 업데이트될 예정이에요.
    `.trim(),

    // 2. 사주팔자 전체 구조 설명
    fourPillarsDetail: `
연주(年柱): ${pillars.year.heavenlyStem}${pillars.year.earthlyBranch} (${pillars.year.stemReading}${pillars.year.branchReading})
태어난 해의 기운이에요. ${pillars.year.stemMeaning}의 에너지와 ${pillars.year.branchMeaning}의 에너지가 결합되어, 조상으로부터 물려받은 기질과 사회적 환경의 영향을 나타내요. 이 에너지는 어린 시절부터 10대까지의 성장 환경에 강하게 작용해요.

월주(月柱): ${pillars.month.heavenlyStem}${pillars.month.earthlyBranch} (${pillars.month.stemReading}${pillars.month.branchReading})
태어난 달의 기운이에요. ${pillars.month.stemMeaning}의 에너지와 ${pillars.month.branchMeaning}의 에너지가 결합되어, 부모와의 관계 및 자라온 가정환경의 영향을 담고 있어요. 직업적 성향과 사회성이 가장 직접적으로 드러나는 기둥이에요.

일주(日柱): ${pillars.day.heavenlyStem}${pillars.day.earthlyBranch} (${pillars.day.stemReading}${pillars.day.branchReading})
나 자신을 나타내는 가장 핵심적인 기둥이에요. 천간인 ${pillars.day.heavenlyStem}(일간)은 나의 본질적 기운이고, 지지인 ${pillars.day.earthlyBranch}(일지)는 나의 심리적 내면을 나타내요. 특히 일간은 성향·적성·관계 방식 해석의 기준점이 돼요.

${pillars.time ? `시주(時柱): ${pillars.time.heavenlyStem}${pillars.time.earthlyBranch} (${pillars.time.stemReading}${pillars.time.branchReading})
태어난 시각의 기운이에요. ${pillars.time.stemMeaning}의 에너지와 ${pillars.time.branchMeaning}의 에너지가 결합되어, 자녀와의 인연, 노후의 흐름, 내면 깊숙한 소망과 욕구를 나타내요.` : `시주(時柱): 미상
출생 시간이 입력되지 않아 시주를 알 수 없어요. 시주는 자녀 인연·노후 흐름·내면 소망 분석에 영향을 줘요. 출생 시간을 알게 되면 더 정밀한 분석이 가능해요.`}
    `.trim(),

    // 3. 일간 중심 성향 해석
    dayMasterDetail: `
${trait.base}

${dayStem} 일간을 가진 분의 핵심 강점은 ${trait.strength} 이러한 자질은 인생의 여러 상황에서 강력한 원동력이 되어 주변에서 인정을 받는 기반이 돼요.

다만 ${trait.weakness} 이 부분을 인식하고 의식적으로 보완한다면, 강점이 더욱 빛을 발할 수 있어요.

일지인 ${pillars.day.earthlyBranch}(${pillars.day.branchReading})는 심리적 내면을 나타내요. ${pillars.day.branchMeaning}의 에너지가 일간의 겉 모습과 상호작용하며, 타인에게는 드러나지 않는 내면적 욕구와 감정 패턴을 만들어요.

전반적으로 이 일주 조합은 겉으로 드러나는 모습과 내면이 조화를 이루거나 때로 갈등을 일으킬 수 있어요. 자신의 진짜 욕구에 귀를 기울이며 행동과 내면을 일치시키는 연습이 균형 잡힌 삶의 기초가 돼요.
    `.trim(),

    // 4. 오행 강약 상세 분석
    elementsDetail: `
이 사주에서 가장 강한 기운은 ${strongName}이고, 가장 부족한 기운은 ${weakName}이에요.

${strongName}의 특성: ${strongData?.strength ?? '강한 에너지를 가지고 있어요.'} ${strongData?.complement ?? ''}

${strongName}이 강하다는 것은 이 에너지의 특성이 삶 전반에 강하게 드러남을 의미해요. 긍정적으로 활용되면 큰 강점이 되지만, 지나치게 편중되면 균형을 잃을 수 있어요. ${strongData?.caution ?? ''}

부족한 ${weakName}은 보완이 필요한 영역을 알려줘요. ${weakData?.strength ?? ''} 이 기운이 약한 경우, 해당 특성을 의식적으로 개발하거나 이 기운을 가진 환경·사람과 어울림으로써 보완할 수 있어요.

오행 분포:
- 목(木) ${elements.wood}% · 화(火) ${elements.fire}% · 토(土) ${elements.earth}% · 금(金) ${elements.metal}% · 수(水) ${elements.water}%

오행 균형을 위한 실천: ${weakData?.complement ?? '보완 기운을 의식적으로 활용해 보세요.'}
    `.trim(),

    // 5. 십성 상세 해석
    // TODO: 십성 계산 모듈 완성 후 실제 값 대입
    tenGodsDetail: `
십성(十星)은 일간과 나머지 7개 글자(7자) 사이의 관계를 10가지 역할로 분류한 개념이에요. 비겁·식상·재성·관성·인성이 각각 나와 동일한 기운, 내가 생하는 기운, 내가 극하는 기운, 나를 극하는 기운, 나를 생하는 기운을 나타내요.

[현재 상태] 십성 정밀 계산은 만세력 기반 계산 모듈 완성 후 제공될 예정이에요. 현재 버전에서는 일간(${dayStem}) 기준의 추정 해석을 제공해요.

${dayStem} 일간의 특성상, ${trait.base} 이를 십성 관점에서 보면, 비겁(동료·경쟁자)의 에너지가 자아 강화로 작용하고, 관성(사회적 역할·규범)과의 균형이 삶의 중요한 테마가 될 수 있어요.

재성(재물·여성 인연/남성의 경우)과의 관계에서는 ${trait.wealth} 인성(학문·모성적 지원)의 영향으로는 직관과 학습 능력이 강점이 될 수 있어요.

십성 계산 모듈이 완성되면 이 섹션은 더 정밀한 개인 맞춤 해석으로 업데이트돼요.
    `.trim(),

    // 6. 성격 장점·약점
    personalityDetail: `
【 핵심 장점 】
${trait.strength} 이러한 특성은 주변 사람들에게 신뢰와 안정감을 주는 기반이 돼요. 어려운 상황에서도 흔들리지 않는 심리적 중심축을 가지고 있어서, 위기 상황에서 특히 두각을 나타낼 수 있어요.

또한 ${strongName}의 기운이 강한 만큼, ${strongData?.strength ?? '이 에너지의 긍정적 특성이'} 일상적인 결정과 행동 방식에 자연스럽게 드러나요.

【 보완이 필요한 영역 】
${trait.weakness} 이 부분을 스스로 인식하고 있다면, 의식적인 노력으로 충분히 개선 가능해요. 특히 ${weakName}의 기운이 부족한 만큼, 이 에너지와 관련된 특성(${weakData?.strength ?? '유연함과 균형'})을 개발하는 것이 성장의 핵심이에요.

【 자기 이해 포인트 】
겉으로 보이는 모습과 내면의 욕구 사이에 차이가 있을 수 있어요. 일지인 ${pillars.day.earthlyBranch}(${pillars.day.branchMeaning})의 에너지가 내면에서 조용히 작동하며, 혼자 있을 때나 편안한 관계에서 본래의 자신이 더 잘 드러나요.
    `.trim(),

    // 7. 인간관계 스타일
    relationshipDetail: `
인간관계에서는 ${trait.base.split('—')[1]?.trim() ?? dayStem + ' 일간의'} 특성이 그대로 드러나요.

강점 측면에서는, ${trait.strength} 이런 특성이 사람들로 하여금 당신에게 신뢰와 안정감을 느끼게 해요. 특히 어려운 상황에서 주변 사람들을 지지하고 이끄는 역할을 자연스럽게 맡게 되는 편이에요.

주의할 점은, ${trait.weakness} 특히 관계에서 기대치가 높거나 원칙을 강하게 주장할 때 마찰이 생길 수 있어요. 상대방의 다른 방식도 인정하는 연습이 관계의 깊이를 더해줘요.

사회적 역할에서는 ${strongName}의 에너지가 두드러지므로, ${strongData?.strength ?? '강한 에너지로 주목받을 수 있어요.'} 그러나 ${weakName}이 부족한 만큼, ${weakData?.strength?.split('.')[0] ?? '유연함'} 같은 특성을 발휘하는 데 의식적인 노력이 필요해요.

팀이나 집단에서는 자신의 강점을 발휘하면서도, 다른 사람들의 에너지를 수용하는 균형 잡힌 태도가 장기적인 관계 만족도를 높여줘요.
    `.trim(),

    // 8. 연애·결혼 성향
    loveMarriageDetail: `
연애에서는 ${trait.love} 상대방을 깊이 신뢰하고 진심을 다하는 편이에요.

${dayStem} 일간의 경우, 감정을 겉으로 잘 드러내지 않거나 표현 방식이 독특할 수 있어요. 상대방이 이를 오해하지 않도록, 말이나 행동으로 감정을 표현하는 연습이 관계 만족도를 높여줘요.

결혼에서는 안정적이고 신뢰할 수 있는 파트너를 원하는 경향이 있어요. 처음 만남보다 오랜 시간을 함께하며 신뢰가 쌓인 후 더 깊은 유대감을 형성하는 편이에요.

궁합 관점에서는, ${weakName}의 기운이 부족한 만큼 ${weakData?.strength?.split('.')[0] ?? '이 기운을 가진'} 상대방과의 만남이 상호 보완적 관계를 만들 수 있어요.

【 연애 성장 포인트 】
${trait.love.split('.').slice(-1)[0]?.trim() ?? '감정 표현을 조금 더 적극적으로 해보세요.'} 완벽한 상대를 기다리기보다, 현재 관계에서 진심으로 노력하는 태도가 결국 이상적인 파트너십을 만들어줘요.
    `.trim(),

    // 9. 직업·적성·일하는 방식
    careerDetail: `
직업 적성에서는 ${trait.career} 이 분야에서 강점을 발휘할 수 있는 이유는, ${trait.strength} 때문이에요.

일하는 방식에서는 ${strongName}의 에너지가 강한 만큼, ${strongData?.strength ?? '이 기운의 특성으로'} 목표를 향해 집중적으로 움직이는 스타일이에요. 특히 명확한 목표와 구조가 있는 환경에서 능력을 십분 발휘할 수 있어요.

리더십 측면에서는 자신의 기준과 원칙을 바탕으로 팀을 이끄는 스타일이 자연스러워요. 다만 ${trait.weakness.split('.')[0]}는 팀 협업에서 주의가 필요한 부분이에요.

재능을 꽃피우기 위한 환경: ${weakData?.complement ?? '보완적 환경과 사람들과 협력하세요.'} 혼자 모든 것을 해결하려 하기보다 팀원들의 다양한 강점을 인정하고 활용하는 리더십이 장기적인 커리어 성장을 만들어줘요.

추천 분야 (일간 기준): ${trait.career}
    `.trim(),

    // 10. 재물운·소비 성향·돈 관리
    wealthDetail: `
재물운에서는 ${trait.wealth} ${strongName}의 기운이 강한 만큼, 이 에너지의 특성이 돈을 대하는 방식에도 영향을 줘요.

소비 성향: ${dayStem} 일간은 가치 있다고 느끼는 것에 아낌없이 투자하는 경향이 있어요. 이는 장기적으로 좋은 자산이 되기도 하지만, 충동적 지출로 이어질 수 있어요.

재물 관리 포인트:
1. 고정 지출 자동화 — 저축과 투자를 급여 수령 즉시 자동 이체로 설정하면 지출 조절이 쉬워져요.
2. 수입의 20~30% 저축 목표 — 작은 금액이라도 꾸준히 쌓는 것이 재물운의 기반이에요.
3. ${weakName}의 기운이 부족한 만큼, ${weakData?.strength?.split('.')[0] ?? '유연하고 여유 있는'} 재무 계획이 장기적 안정을 만들어줘요.

투자 성향: ${trait.wealth} 리스크 관리와 꾸준한 수익을 동시에 고려하는 균형 잡힌 전략이 중요해요.
    `.trim(),

    // 11. 건강·생활 습관
    healthDetail: `
건강 측면에서 ${dayStem} 일간은 ${trait.health}

${strongName}의 기운이 강한 경우, 이 에너지가 신체적으로도 강하게 작동해요. 활동적이고 에너지가 넘치는 시기와 소진되는 시기가 번갈아 나타날 수 있어요. 에너지 사이클을 인식하고 충분한 회복 시간을 갖는 것이 중요해요.

${weakName}이 부족한 경우, 신체적으로는 이 오행과 관련된 장기와 기능에 더 주의가 필요할 수 있어요.

권장 생활 습관:
- 규칙적인 수면 (오후 11시 이전 수면 권장)
- 일주일 3회 이상 30분 이상 유산소 운동
- 과식·과음 조절 — 소화기 건강과 직결돼요
- 명상 또는 호흡 운동으로 스트레스 해소

특히 목표 지향적 성격이 강한 만큼, 과로와 번아웃 방지를 위해 의식적으로 쉬는 시간을 스케줄에 포함시키는 것이 장기적 건강 관리의 핵심이에요.
    `.trim(),

    // 12. 시기 흐름 요약
    // TODO: 대운/세운 계산 모듈 완성 후 개인 맞춤 흐름 제공
    timingDetail: `
【 ${YEAR}년 전반적 흐름 】
현재 연도의 기운과 개인 사주의 상호작용으로 보면, ${strongName}의 기운이 강한 시기에는 이 에너지의 특성이 더욱 부각될 수 있어요.

상반기 (1~6월): 새로운 시작과 계획의 에너지가 흐르는 시기예요. 오랫동안 미뤄온 결정을 실행에 옮기기 좋은 때예요. 특히 ${trait.career.split('·')[0]} 관련 방향에서 진전을 기대할 수 있어요.

하반기 (7~12월): 상반기의 씨앗이 결실로 나타나는 시기예요. 관계와 협력에서 좋은 기운이 들어오고, 재물 흐름에서도 안정을 찾아가는 경향이 있어요.

월별 참고 흐름:
- 1~3월: 계획·준비의 시기. 에너지 충전과 방향 설정에 집중하세요.
- 4~6월: 실행·추진의 시기. 목표를 향해 적극적으로 움직이기 좋아요.
- 7~9월: 조율·협력의 시기. 관계에서의 균형과 소통이 중요해요.
- 10~12월: 결실·정리의 시기. 올해의 성과를 돌아보고 다음 해를 준비하세요.

[안내] 대운(大運)과 세운(歲運) 기반의 정밀 시기 예측은 만세력 계산 모듈 완성 후 제공될 예정이에요.
    `.trim(),

    // 13. 실천 조언
    actionGuide: `
이 사주 분석을 바탕으로, 지금 당신에게 가장 도움이 되는 실천 조언을 정리했어요.

【 1. 강점을 적극 활용하세요 】
${trait.strength} 이 강점을 발휘할 수 있는 환경과 역할을 의식적으로 선택하는 것이 삶의 만족도를 높여줘요.

【 2. 부족한 기운을 보완하세요 】
${weakName}이 부족한 만큼, ${weakData?.complement ?? '이 기운을 보완하는 활동과 관계를 늘려보세요.'} 작은 실천이 장기적으로 큰 균형을 만들어요.

【 3. 관계에서 표현을 늘려보세요 】
${trait.love.split('.')[0]}. 감정과 생각을 조금 더 표현하는 연습이 인간관계 전반을 따뜻하게 만들어줘요.

【 4. 건강 루틴을 만드세요 】
${trait.health.split('.')[0]}. 규칙적인 수면·운동·식사 습관이 에너지 수준을 높여 모든 분야에서 더 좋은 결과를 만들어줘요.

【 5. 행운 정보 】
행운의 색상: ${strongest === '금' ? '흰색, 금색' : strongest === '화' ? '빨강, 주황' : strongest === '목' ? '초록, 파랑' : strongest === '수' ? '검정, 진청' : '노랑, 갈색'}
행운의 방향: ${strongest === '금' ? '서쪽' : strongest === '화' ? '남쪽' : strongest === '목' ? '동쪽' : strongest === '수' ? '북쪽' : '중앙'}
보완 추천 활동: ${weakData?.complement?.split('.')[0] ?? '명상, 자연 속 산책, 독서'}
    `.trim(),

    // 14. 전체 요약
    finalSummary: `
이 사주 분석의 핵심을 한마디로 요약하면: ${trait.base}

당신은 ${trait.strength} 이 강점은 삶의 어떤 영역에서도 흔들리지 않는 기반이 돼요.

보완할 부분인 ${trait.weakness.split('.')[0]}은 인식만으로도 절반은 해결돼요. 나머지 절반은 꾸준한 실천과 주변 사람들의 도움으로 채워가면 돼요.

직업에서는 ${trait.career.split('.')[0]}에서 가장 큰 성취를 이룰 수 있어요. 사랑에서는 ${trait.love.split('.')[0]}. 건강에서는 ${trait.health.split('.')[0]}.

재물은 ${trait.wealth.split('.')[0]}. 꾸준한 저축 습관이 장기적인 재물운의 기반이에요.

마지막으로, 사주는 운명을 결정하는 것이 아니라 타고난 기질과 에너지 패턴을 보여줘요. 이 리포트는 자신을 더 깊이 이해하고, 강점을 살리며, 약점을 보완하는 나침반으로 활용해 주세요. 더 나은 선택과 행동이 더 나은 삶을 만들어간다는 것을 잊지 마세요.
    `.trim(),
  }
}
