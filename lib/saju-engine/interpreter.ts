/**
 * lib/saju-engine/interpreter.ts
 *
 * 사주 해석 엔진
 *
 * 원칙:
 * 1. 계산 결과(SajuChart)를 반드시 기반으로 텍스트 생성
 * 2. 입력값에 따라 결과가 달라지는 구조 보장
 * 3. 일간(日干) × 월지(月支) × 오행분포 × 십신분포 조합
 * 4. 시주(時柱)까지 반영하여 같은 생년월일 다른 시간 → 다른 해석
 * 5. 과장·근거없는 예언체 금지, 구조적 분석 중심
 */

import {
  STEM_INFO, BRANCH_INFO, ELEMENT_KOR,
  type HeavenlyStemKey, type EarthlyBranchKey, type FiveElementKey,
} from './constants'
import type { SajuChart, Pillar, ElementBalance, DayMasterStrength } from './calculator'

// ── 일간별 핵심 성향 ───────────────────────────────────────────────

const DAY_MASTER_TRAITS: Record<HeavenlyStemKey, {
  nature: string        // 본질 성향
  strength: string      // 핵심 강점
  weakness: string      // 구조적 약점
  career: string        // 직업적 강점
  love: string          // 감정 방식
  wealthStyle: string   // 재물 운용 방식
  health: string        // 주의 건강
}> = {
  甲: {
    nature:      '甲木 일간은 곧게 자라는 대목(大木)의 기운입니다. 방향성이 분명하고 한번 정한 목표를 향해 직진하는 특성이 강합니다.',
    strength:    '추진력과 리더십이 뛰어나고, 새로운 것을 개척하는 능력이 있습니다. 조직에서 방향을 제시하는 역할에 강점을 보입니다.',
    weakness:    '유연성이 부족할 수 있어, 상황 변화에 빠르게 대응하기보다 자신의 방향을 고수하려는 경향이 있습니다. 타협과 절충이 과제입니다.',
    career:      '기획, 교육, 창업, 법조, 리더십이 필요한 분야에서 두각을 나타냅니다. 독립적인 환경에서 성과가 높습니다.',
    love:        '감정 표현이 직접적이고 관계에서 주도권을 가지려는 경향이 있습니다. 상대방의 의견을 수용하는 연습이 관계 안정에 도움이 됩니다.',
    wealthStyle: '큰 목표를 향해 적극적으로 투자하는 성향입니다. 장기적 관점의 자산 형성에 유리하나, 고집으로 인한 손실 주의가 필요합니다.',
    health:      '간담(肝膽) 계통과 눈, 근육·인대 계통을 주의해야 합니다. 과도한 스트레스가 쌓이면 관련 부위에 영향을 줄 수 있습니다.',
  },
  乙: {
    nature:      '乙木 일간은 넝쿨과 풀의 기운으로, 유연하게 환경에 적응하며 목표를 달성하는 특성이 있습니다.',
    strength:    '상황 적응력과 대인 관계 능력이 뛰어납니다. 협력과 조화를 추구하며, 섬세한 감수성으로 타인의 감정을 잘 파악합니다.',
    weakness:    '우유부단함이 나타날 수 있고, 타인의 시선을 지나치게 의식할 수 있습니다. 자신의 의사를 명확히 표현하는 것이 중요합니다.',
    career:      '교육, 예술, 상담, 서비스업, 디자인 등 사람과의 관계가 중심인 분야에서 강점을 보입니다.',
    love:        '배려심이 깊고 상대방에게 맞추려는 경향이 있습니다. 자신의 감정도 표현하는 균형이 건강한 관계를 만듭니다.',
    wealthStyle: '안정적이고 꾸준한 재물 관리를 선호합니다. 리스크를 피하려는 성향으로 안전 자산 중심의 포트폴리오가 적합합니다.',
    health:      '간담(肝膽), 신경계, 면역 계통을 주의해야 합니다. 감정 소모가 클 때 신체적 증상으로 나타날 수 있습니다.',
  },
  丙: {
    nature:      '丙火 일간은 태양의 기운으로, 밝고 따뜻하게 주변을 비추는 특성이 있습니다. 사교적이고 낙관적인 성향이 두드러집니다.',
    strength:    '활발한 대인 관계와 표현력이 뛰어납니다. 주변에 긍정적인 에너지를 전달하며 집단의 활력소 역할을 합니다.',
    weakness:    '집중력이 분산되거나 지속성이 약해질 수 있습니다. 처음의 열정을 끝까지 유지하는 훈련이 필요합니다.',
    career:      '방송, 마케팅, 영업, 교육, 연예, 서비스 분야에서 두각을 나타냅니다. 대중과 소통하는 직업에 적합합니다.',
    love:        '감정 표현이 솔직하고 적극적입니다. 관계에서 주도적인 역할을 하며, 상대방의 페이스를 존중하는 균형이 중요합니다.',
    wealthStyle: '적극적인 투자 성향이 있으나 충동적 지출 주의가 필요합니다. 철저한 계획 하에 투자하는 것이 재물 운용에 유리합니다.',
    health:      '심장·소장(心·小腸) 계통과 혈액순환, 눈 건강을 주의해야 합니다.',
  },
  丁: {
    nature:      '丁火 일간은 촛불의 기운으로, 섬세하고 따뜻한 빛을 내면서도 지속적인 집중력을 보이는 특성이 있습니다.',
    strength:    '세심한 관찰력과 예술적 감수성, 깊은 집중력이 강점입니다. 한 분야를 깊이 파고드는 전문성을 발휘합니다.',
    weakness:    '감정의 기복이 있을 수 있고, 상처를 받으면 오래 지속되는 경향이 있습니다. 감정 관리 능력이 삶의 질을 결정합니다.',
    career:      '예술, 의료, 연구, 교육, 상담, 디자인 분야에서 섬세함과 집중력이 빛을 발합니다.',
    love:        '감정이 풍부하고 헌신적인 사랑을 합니다. 상대에게 많은 것을 요구하기보다 자신의 감정을 솔직하게 표현하는 것이 관계를 성장시킵니다.',
    wealthStyle: '안정적이고 구체적인 재무 계획을 선호합니다. 투기보다는 꾸준한 저축과 안정적 투자가 맞습니다.',
    health:      '심장·소장, 혈압, 정신적 스트레스 관리에 주의해야 합니다.',
  },
  戊: {
    nature:      '戊土 일간은 큰 산의 기운으로, 묵직하고 포용력이 있으며 안정적인 특성이 있습니다.',
    strength:    '신뢰감과 포용력, 인내심이 강점입니다. 주변 사람들에게 든든한 존재가 되며, 장기적인 안목으로 일을 추진합니다.',
    weakness:    '변화에 저항이 있을 수 있고, 고집스럽게 자신의 방식을 고수할 수 있습니다. 유연성을 기르는 것이 성장에 도움이 됩니다.',
    career:      '행정, 부동산, 건설, 금융, 교육, 관리직 등 안정성이 요구되는 분야에서 두각을 나타냅니다.',
    love:        '책임감 있고 헌신적인 파트너입니다. 감정 표현이 절제되어 있어, 적극적인 표현으로 관계를 더 따뜻하게 만들 수 있습니다.',
    wealthStyle: '안정적인 투자와 꾸준한 자산 축적을 선호합니다. 부동산이나 안전 자산에 강점이 있습니다.',
    health:      '비위(脾胃) 계통, 소화 기능, 관절을 주의해야 합니다.',
  },
  己: {
    nature:      '己土 일간은 논밭의 기운으로, 실용적이고 세심하며 주변을 꼼꼼하게 챙기는 특성이 있습니다.',
    strength:    '세밀한 실행력과 배려심, 현실적인 판단력이 강점입니다. 복잡한 업무를 체계적으로 처리하는 능력이 뛰어납니다.',
    weakness:    '소심함이나 과도한 걱정으로 결정이 늦어질 수 있습니다. 자신감을 갖고 과감하게 결정하는 연습이 필요합니다.',
    career:      '회계, 의료, 식품, 세무, 서비스업, 행정 등 세밀함이 요구되는 분야에서 강점을 발휘합니다.',
    love:        '세심하게 상대를 챙기는 스타일입니다. 표현력을 높이고 관계에서 자신의 감정도 솔직하게 드러내는 것이 중요합니다.',
    wealthStyle: '꼼꼼한 재무 계획과 절약을 통해 안정적으로 자산을 형성합니다. 수익성보다 안정성을 우선합니다.',
    health:      '비위(脾胃), 피부, 근육 계통을 주의해야 합니다.',
  },
  庚: {
    nature:      '庚金 일간은 원석의 기운으로, 강인하고 의지가 굳으며 원칙을 중시하는 특성이 있습니다.',
    strength:    '결단력과 실행력, 원칙주의가 강점입니다. 어려운 상황에서도 흔들리지 않는 강한 의지를 가지고 있습니다.',
    weakness:    '융통성이 부족하거나 지나치게 강경하게 표현할 수 있습니다. 상황에 따른 유연한 대처가 관계와 성과를 높입니다.',
    career:      '군인, 경찰, 법조, 금융, 제조업, 기술직 등 강한 실행력과 원칙이 필요한 분야에 적합합니다.',
    love:        '책임감 강하고 헌신적이지만, 표현이 직접적이거나 강해서 상대방을 압박할 수 있습니다. 부드러운 표현 방식 개발이 도움이 됩니다.',
    wealthStyle: '적극적인 투자 성향이 있으며, 한번 정한 방향은 밀어붙입니다. 리스크 관리를 병행하면 좋습니다.',
    health:      '폐·대장(肺·大腸) 계통, 피부, 호흡기를 주의해야 합니다.',
  },
  辛: {
    nature:      '辛金 일간은 다듬어진 보석의 기운으로, 예리하고 세련되며 완성도를 중시하는 특성이 있습니다.',
    strength:    '예리한 판단력과 심미안, 완벽에 가까운 마무리 능력이 강점입니다. 높은 기준을 유지하며 질적 성과를 냅니다.',
    weakness:    '완벽주의로 인한 스트레스와 예민함이 나타날 수 있습니다. 충분히 좋은 것을 인정하는 유연함이 필요합니다.',
    career:      '디자인, 패션, 의료, 미용, IT, 분석이 필요한 분야에서 섬세함과 완성도가 빛을 발합니다.',
    love:        '이상적인 관계를 추구하며 세심하게 상대를 배려합니다. 완벽한 관계에 대한 기대를 현실적으로 조정하는 것이 관계 안정에 도움이 됩니다.',
    wealthStyle: '분석적이고 신중한 투자 접근을 선호합니다. 충분한 분석 후 결정하는 스타일이 강점입니다.',
    health:      '폐·대장, 피부, 신경계를 주의해야 합니다.',
  },
  壬: {
    nature:      '壬水 일간은 큰 강·바다의 기운으로, 포용력이 넓고 지혜롭게 상황을 흘러가게 하는 특성이 있습니다.',
    strength:    '포용력과 융통성, 빠른 상황 파악 능력이 강점입니다. 다양한 사람과 협력하며 복잡한 상황을 유연하게 해결합니다.',
    weakness:    '일관성이 부족하거나 지나치게 흘러가는 대로 결정할 수 있습니다. 명확한 방향 설정이 성과를 높입니다.',
    career:      '외교, 무역, 기획, 컨설팅, 교육, 언론 등 다양한 사람과 정보를 다루는 분야에 강점이 있습니다.',
    love:        '감정이 유연하고 상대방의 감정을 잘 받아들입니다. 일관된 감정 표현과 명확한 관계 방향 제시가 신뢰를 쌓습니다.',
    wealthStyle: '다양한 투자를 분산하는 전략이 맞습니다. 유동성 있는 자산 관리를 선호합니다.',
    health:      '신장·방광(腎·膀胱) 계통, 호르몬 균형, 수분 대사를 주의해야 합니다.',
  },
  癸: {
    nature:      '癸水 일간은 이슬·빗물의 기운으로, 섬세하고 감수성이 풍부하며 깊이 있는 내면을 가진 특성이 있습니다.',
    strength:    '섬세한 감수성과 직관력, 깊은 공감 능력이 강점입니다. 상대방의 마음을 잘 이해하며 진심을 전달하는 능력이 뛰어납니다.',
    weakness:    '감정의 기복과 지나친 내면 집중으로 결단력이 낮아질 수 있습니다. 실행력을 키우고 표현하는 연습이 필요합니다.',
    career:      '상담, 예술, 교육, 의료, 연구, 심리 분야 등 깊은 이해와 감수성이 필요한 분야에서 강점을 보입니다.',
    love:        '깊은 감정과 섬세한 배려로 상대를 감동시킵니다. 자신의 감정을 솔직하게 표현하고 명확하게 소통하는 것이 관계를 성장시킵니다.',
    wealthStyle: '안정적이고 신중한 재물 관리를 선호합니다. 충동적인 결정을 피하고 장기적 관점의 자산 계획이 유리합니다.',
    health:      '신장·방광, 호르몬 계통, 하체 혈액순환을 주의해야 합니다.',
  },
}

// ── 월지(月支)별 계절 특성 ───────────────────────────────────────

const MONTH_BRANCH_CONTEXT: Record<EarthlyBranchKey, {
  season: string
  temperament: string  // 조후(調候) 관점
  strengthNote: string
}> = {
  子: { season: '한겨울(冬)', temperament: '한수(寒水)가 강한 시기로 차갑고 고요한 기운이 지배합니다.', strengthNote: '水 기운이 왕성한 계절로, 水 일간은 강해지고 火 일간은 극제를 받을 수 있습니다.' },
  丑: { season: '겨울 끝(冬末)', temperament: '겨울이 끝나가는 시기로 차갑고 건조하며 변화의 기운이 시작됩니다.', strengthNote: '土 기운이 중심이 되고, 겨울 기운이 아직 강합니다.' },
  寅: { season: '초봄(早春)', temperament: '봄이 시작되는 시기로 만물이 움트는 생기가 있습니다.', strengthNote: '木 기운이 상승하는 계절로, 木 일간은 기세가 오르고 金 일간은 조심이 필요합니다.' },
  卯: { season: '봄(春)', temperament: '봄 기운이 왕성한 시기로 성장과 활동의 에너지가 강합니다.', strengthNote: '木 기운이 극성한 계절입니다.' },
  辰: { season: '늦봄(晩春)', temperament: '봄이 무르익는 시기로 활동과 전환이 활발합니다.', strengthNote: '土 기운이 강해지기 시작하며 계절 교체의 기운이 있습니다.' },
  巳: { season: '초여름(早夏)', temperament: '여름이 시작되며 열기가 오르기 시작합니다.', strengthNote: '火 기운이 상승하는 계절로, 火 일간은 힘을 얻고 水 일간은 설기(洩氣)가 강해집니다.' },
  午: { season: '여름(夏)', temperament: '한여름의 뜨거운 기운이 극성합니다.', strengthNote: '火 기운이 가장 강한 시기입니다. 水 일간은 극제를 받을 수 있어 조후(調候) 조절이 중요합니다.' },
  未: { season: '늦여름(晩夏)', temperament: '여름이 끝나가며 열기가 남아있으나 가을 기운이 시작됩니다.', strengthNote: '土 기운이 강하고 열기가 남아 있는 시기입니다.' },
  申: { season: '초가을(早秋)', temperament: '가을이 시작되며 서늘한 기운이 오기 시작합니다.', strengthNote: '金 기운이 상승하는 시기로, 金 일간은 힘을 얻습니다.' },
  酉: { season: '가을(秋)', temperament: '가을이 무르익어 서늘하고 맑은 기운이 강합니다.', strengthNote: '金 기운이 왕성한 계절입니다. 木 일간은 극제를 받을 수 있습니다.' },
  戌: { season: '늦가을(晩秋)', temperament: '가을이 끝나고 겨울이 다가오며 건조하고 차가워집니다.', strengthNote: '土 기운이 강하고 火 기운의 여운이 남아 있습니다.' },
  亥: { season: '초겨울(早冬)', temperament: '겨울이 시작되며 한기가 시작됩니다.', strengthNote: '水 기운이 상승하는 시기입니다.' },
}

// ── 시주(時柱)별 성향 수식어 ────────────────────────────────────

const HOUR_BRANCH_MODIFIER: Record<EarthlyBranchKey, {
  personality: string
  career: string
  tendency: string
}> = {
  子: { personality: '자시(子時)는 음의 극점에서 양이 시작되는 시각으로, 내면이 깊고 통찰력이 있습니다.', career: '집중력이 필요한 연구·창작 분야에서 두각을 나타냅니다.', tendency: '야간 집중력이 높고 혼자 깊이 파고드는 경향이 있습니다.' },
  丑: { personality: '축시(丑時) 출생은 인내심과 꾸준함이 두드러지며, 묵묵히 일을 해내는 능력이 있습니다.', career: '안정적이고 꾸준한 성과가 필요한 분야에 강합니다.', tendency: '느리지만 확실하게 목표를 달성하는 스타일입니다.' },
  寅: { personality: '인시(寅時) 출생은 적극성과 추진력이 강하며, 새벽같이 먼저 시작하는 기상이 있습니다.', career: '개척과 도전이 필요한 분야에서 강점을 발휘합니다.', tendency: '먼저 시작하고 앞장서려는 경향이 강합니다.' },
  卯: { personality: '묘시(卯時) 출생은 유연하고 섬세하며, 사람과의 관계에서 부드럽게 상황을 풀어나갑니다.', career: '대인 관계와 소통이 중요한 분야에 적합합니다.', tendency: '부드럽게 상황에 적응하며 갈등을 피하는 경향이 있습니다.' },
  辰: { personality: '진시(辰時) 출생은 변화에 적응하는 능력이 뛰어나고, 변혁을 주도하는 에너지가 있습니다.', career: '혁신과 변화가 필요한 분야에서 두각을 나타냅니다.', tendency: '기존 방식을 바꾸려는 성향이 있어 혁신적 사고를 발휘합니다.' },
  巳: { personality: '사시(巳時) 출생은 지혜롭고 신중하며, 신중한 판단으로 중요한 결정을 잘 합니다.', career: '분석과 판단이 중요한 분야에서 강점을 보입니다.', tendency: '겉으로는 조용하지만 내면에 강한 의지와 전략적 사고가 있습니다.' },
  午: { personality: '오시(午時) 출생은 열정적이고 표현력이 강하며, 주변에 활기를 불어넣는 에너지가 있습니다.', career: '사람들 앞에 서는 역할이나 표현이 중요한 분야에 적합합니다.', tendency: '감정을 솔직하게 표현하고 주도적으로 분위기를 이끕니다.' },
  未: { personality: '미시(未時) 출생은 온화하고 포용력이 있으며, 공동체에서 화합을 이끄는 역할을 합니다.', career: '팀워크와 협력이 중요한 환경에서 강점을 발휘합니다.', tendency: '배려심이 깊고 주변을 편안하게 만드는 능력이 있습니다.' },
  申: { personality: '신시(申時) 출생은 기지와 판단력이 뛰어나며, 빠르게 상황을 파악하고 대응합니다.', career: '빠른 판단과 실행이 필요한 분야에 강합니다.', tendency: '상황 대응력이 뛰어나고 다양한 방법을 모색합니다.' },
  酉: { personality: '유시(酉時) 출생은 정확성과 완성도를 중시하며, 높은 기준을 유지하는 성향이 있습니다.', career: '정밀함이 요구되는 분야에서 탁월한 성과를 냅니다.', tendency: '완벽을 추구하며 자신의 기준에 맞지 않으면 다시 시도합니다.' },
  戌: { personality: '술시(戌時) 출생은 의리와 신뢰를 중시하며, 한번 맺은 인연을 소중히 여깁니다.', career: '신뢰와 책임이 요구되는 분야에서 인정받습니다.', tendency: '충성스럽고 끝까지 함께하는 성격으로 신뢰를 쌓습니다.' },
  亥: { personality: '해시(亥時) 출생은 깊은 감수성과 창의적 상상력이 풍부하며, 내면 세계가 풍요롭습니다.', career: '창의성과 감수성이 필요한 예술·연구 분야에서 강점을 발휘합니다.', tendency: '직관적이고 감수성이 예민하여 분위기를 잘 파악합니다.' },
}

// ── 오행 균형에 따른 해석 ────────────────────────────────────────

function interpretElementBalance(balance: ElementBalance): {
  summary: string
  dominant: string
  deficient: string
  overall: string
} {
  const domEl = balance.dominant
  const defEl = balance.deficient
  const domKor = ELEMENT_KOR[domEl]
  const defKor = ELEMENT_KOR[defEl]
  const domPct = balance[`${domEl}Pct` as keyof typeof balance] as number
  const defPct = balance[`${defEl}Pct` as keyof typeof balance] as number

  const dominantNotes: Record<FiveElementKey, string> = {
    wood:  '목(木) 기운이 강한 사주는 성장 의지와 추진력이 뛰어납니다. 계획을 세우고 개척하는 데 강점이 있으나, 지나치면 고집이 나타날 수 있습니다.',
    fire:  '화(火) 기운이 강한 사주는 열정과 표현력이 풍부합니다. 적극적이고 사교적이나, 지나치면 충동적이고 지속성이 부족할 수 있습니다.',
    earth: '토(土) 기운이 강한 사주는 안정감과 포용력이 높습니다. 신중하고 믿음직하나, 지나치면 변화에 대한 저항이 생길 수 있습니다.',
    metal: '금(金) 기운이 강한 사주는 의지력과 원칙이 강합니다. 결단력이 있으나, 지나치면 경직되거나 강압적으로 보일 수 있습니다.',
    water: '수(水) 기운이 강한 사주는 지혜와 유연성이 뛰어납니다. 융통성이 있으나, 지나치면 일관성이 부족하거나 방향을 잃을 수 있습니다.',
  }

  const deficientNotes: Record<FiveElementKey, string> = {
    wood:  '목(木) 기운이 부족하면 계획과 성장 의지가 약해질 수 있습니다. 창의적 활동, 새로운 시작, 자연 친화적 생활이 균형에 도움이 됩니다.',
    fire:  '화(火) 기운이 부족하면 표현력이나 열정이 약해질 수 있습니다. 적극적인 사교 활동과 자신을 드러내는 연습이 균형을 만듭니다.',
    earth: '토(土) 기운이 부족하면 안정감이나 현실 감각이 약해질 수 있습니다. 규칙적인 생활 패턴과 실용적 계획 수립이 도움이 됩니다.',
    metal: '금(金) 기운이 부족하면 결단력이나 원칙이 흔들릴 수 있습니다. 명확한 기준 설정과 실행력 강화가 균형을 만듭니다.',
    water: '수(水) 기운이 부족하면 유연성이나 지혜가 약해질 수 있습니다. 학습, 명상, 다양한 경험 축적이 균형에 도움이 됩니다.',
  }

  const isPolarized = domPct >= 40 || defPct === 0

  return {
    summary: `오행 분포에서 ${domKor}(${domPct}%)이 가장 강하고 ${defKor}(${defPct}%)이 가장 약합니다.`,
    dominant: dominantNotes[domEl],
    deficient: deficientNotes[defEl],
    overall: isPolarized
      ? `오행이 한쪽으로 편중된 구조입니다. 강점이 분명하게 나타나지만, 균형을 위한 의식적 보완이 필요합니다.`
      : `오행이 비교적 균형있게 분포된 구조입니다. 다양한 상황에 유연하게 대응하는 능력을 갖추고 있습니다.`,
  }
}

// ── 일간 강약에 따른 해석 ────────────────────────────────────────

function interpretDayMasterStrength(strength: DayMasterStrength, dayMaster: HeavenlyStemKey): string {
  const dmNature = STEM_INFO[dayMaster].nature
  if (strength.isStrong) {
    return `${dmNature} 일간이 신강(身强)한 구조입니다. ${strength.seasonStrength} ` +
      `강한 일간은 자신의 에너지를 밖으로 발산하는 것이 중요하며, 식상(食傷)·재성(財星)·관성(官星)을 활용하는 방향이 좋습니다. ` +
      `지나치게 강하면 자기중심적으로 흐를 수 있어, 타인의 의견을 경청하는 훈련이 필요합니다.`
  } else {
    return `${dmNature} 일간이 신약(身弱)한 구조입니다. ${strength.seasonStrength} ` +
      `약한 일간은 비겁(比劫)·인성(印星)의 도움을 받는 것이 유리합니다. ` +
      `자신의 에너지를 보존하고 집중하는 방향이 중요합니다.`
  }
}

// ── 메인 해석 함수 ───────────────────────────────────────────────

export interface SajuInterpretation {
  // 구조 분석
  chartOverview: string       // 원국 전체 구조 요약
  dayMasterAnalysis: string   // 일간 분석
  seasonContext: string       // 월령·계절감
  elementAnalysis: string     // 오행 분포 분석
  dayMasterStrength: string   // 일간 강약

  // 생활 영역
  personality: string         // 성격·기질
  relationships: string       // 인간관계
  love: string                // 연애·결혼
  career: string              // 직업·적성
  wealth: string              // 재물
  health: string              // 건강

  // 시주 반영
  hourPillarInfluence: string | null  // 시주 영향 (시주 있을 때)

  // 올해 흐름
  yearlyFlow: string

  // 요약
  keyStrengths: string[]
  keyWeaknesses: string[]
  actionGuide: string
}

export function interpretChart(chart: SajuChart, birthYear: number): SajuInterpretation {
  const { fourPillars, elementBalance, dayMasterStrength: dmStrength } = chart
  const dayMaster = fourPillars.day.stem
  const traits = DAY_MASTER_TRAITS[dayMaster]
  const monthBranch = fourPillars.month.branch
  const monthContext = MONTH_BRANCH_CONTEXT[monthBranch]
  const stemInfo = STEM_INFO[dayMaster]
  const elementInterp = interpretElementBalance(elementBalance)

  // 시주 영향
  let hourPillarInfluence: string | null = null
  if (fourPillars.hour) {
    const hourBranch = fourPillars.hour.branch
    const modifier = HOUR_BRANCH_MODIFIER[hourBranch]
    const hourInfo = BRANCH_INFO[hourBranch]
    hourPillarInfluence = [
      `시주는 ${hourInfo.kor}(${hourBranch})으로 ${hourInfo.zodiac}띠 시간대입니다.`,
      modifier.personality,
      modifier.tendency,
    ].join(' ')
  }

  // 연간 분석
  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear + 1
  const luckPillarAge = Math.floor((age - chart.luckCycle.startAge) / 10)
  const currentLuckIdx = Math.min(Math.max(luckPillarAge, 0), 9)
  const currentLuck = chart.luckCycle.pillars[currentLuckIdx]

  let yearlyFlow = `현재(${currentYear}년, ${age}세)는 대운 ${currentLuck?.gapja ?? '?'}의 기운 아래 있습니다. `
  if (currentLuck) {
    yearlyFlow += `${currentLuck.stemKor}(${currentLuck.stem}) 천간과 ${currentLuck.branchKor}(${currentLuck.branch}) 지지가 조화를 이루는 시기로, `
    yearlyFlow += `${elementInterp.dominant} ` +
      (chart.dayMasterStrength.isStrong
        ? `신강한 일간에 활력을 더하는 흐름이 있습니다. 새로운 도전이나 확장 기회를 잘 살피세요.`
        : `신약한 일간을 보완하는 흐름이 있습니다. 지지와 협력을 통해 성과를 만들어 나가세요.`)
  }

  return {
    chartOverview: [
      `연주(年柱) ${fourPillars.year.gapja}, 월주(月柱) ${fourPillars.month.gapja}, 일주(日柱) ${fourPillars.day.gapja}`,
      fourPillars.hour ? `, 시주(時柱) ${fourPillars.hour.gapja}` : ' (시주 미산출)',
      '로 구성된 사주입니다.',
      `일간(日干)은 ${stemInfo.kor}(${dayMaster}) ${stemInfo.nature}으로, 자신의 본질적 기운입니다.`,
      `월지(月支)는 ${monthContext.season}의 기운을 반영합니다.`,
    ].join(''),

    dayMasterAnalysis: [
      traits.nature,
      traits.strength,
    ].join(' '),

    seasonContext: [
      `월지 ${monthBranch}(${BRANCH_INFO[monthBranch].kor})는 ${monthContext.season}에 해당합니다.`,
      monthContext.temperament,
      monthContext.strengthNote,
    ].join(' '),

    elementAnalysis: [
      elementInterp.summary,
      elementInterp.dominant,
      elementInterp.deficient,
      elementInterp.overall,
    ].join('\n'),

    dayMasterStrength: interpretDayMasterStrength(dmStrength, dayMaster),

    personality: [
      traits.nature,
      traits.strength,
      traits.weakness,
      hourPillarInfluence ? `시주의 영향: ${HOUR_BRANCH_MODIFIER[fourPillars.hour!.branch].personality}` : '',
    ].filter(Boolean).join('\n\n'),

    relationships: [
      `${stemInfo.nature} 일간은 인간관계에서 ${
        chart.tenGodProfile.bigyeon + chart.tenGodProfile.geobje > 2
          ? '비겁(比劫)이 강하여 경쟁적이거나 독립적인 관계를 선호하는 경향이 있습니다.'
          : '균형잡힌 관계 형성 능력을 갖추고 있습니다.'
      }`,
      `사주 내 관성(官星)이 ${chart.tenGodProfile.pyeongwan + chart.tenGodProfile.jeonggwan > 0 ? '있어 사회적 역할과 책임에 민감합니다.' : '약하여 규칙이나 권위에 덜 구속되는 자유로운 스타일입니다.'}`,
      `인성(印星)이 ${chart.tenGodProfile.pyeonin + chart.tenGodProfile.jeongin > 0 ? '있어 학습과 배움을 통한 성장을 중시합니다.' : '약하여 이론보다 경험과 실행을 중시하는 경향이 있습니다.'}`,
    ].join('\n'),

    love: [
      traits.love,
      `사주 구조상 ${
        chart.tenGodProfile.jeonggwan + chart.tenGodProfile.pyeongwan > 0
          ? '관성(官星)이 있어 책임감 있는 관계를 중시하며, 안정적인 파트너십을 추구합니다.'
          : '관성(官星)이 약하여 형식에 구애받지 않는 자유로운 관계를 선호할 수 있습니다.'
      }`,
      hourPillarInfluence
        ? `시주 기운: ${HOUR_BRANCH_MODIFIER[fourPillars.hour!.branch].tendency}`
        : '',
    ].filter(Boolean).join('\n'),

    career: [
      traits.career,
      `구조적으로 ${
        dmStrength.isStrong
          ? '신강(身强)하여 독립적인 활동이나 주도적인 역할에 강점이 있습니다.'
          : '신약(身弱)하여 협력과 지원을 통해 성과를 내는 구조입니다. 팀워크가 중요합니다.'
      }`,
      hourPillarInfluence
        ? `시주 적성: ${HOUR_BRANCH_MODIFIER[fourPillars.hour!.branch].career}`
        : '',
    ].filter(Boolean).join('\n'),

    wealth: [
      traits.wealthStyle,
      `사주 내 재성(財星)이 ${
        chart.tenGodProfile.pyeonje + chart.tenGodProfile.jeongje > 1
          ? '두 개 이상으로 재물에 대한 욕구가 강하고 다양한 수입원을 만들 수 있습니다.'
          : chart.tenGodProfile.pyeonje + chart.tenGodProfile.jeongje === 1
          ? '하나 있어 재물을 안정적으로 관리하는 구조입니다.'
          : '없어 재물보다 명예나 관계를 우선시하는 경향이 있을 수 있습니다.'
      }`,
    ].join('\n'),

    health: [
      traits.health,
      `${monthContext.temperament}에 태어난 ${stemInfo.nature} 일간은 ${
        elementBalance.waterPct < 10
          ? '수분 섭취와 신장 계통 건강에 특별히 주의가 필요합니다.'
          : elementBalance.firePct < 10
          ? '체온 유지와 심혈관 계통 건강에 주의가 필요합니다.'
          : '오행 균형을 유지하는 규칙적인 생활이 건강의 핵심입니다.'
      }`,
    ].join('\n'),

    hourPillarInfluence,
    yearlyFlow,

    keyStrengths: [
      `${stemInfo.nature}의 ${traits.strength.split('.')[0]}`,
      `${elementInterp.dominant.split('.')[0]}`,
      dmStrength.isStrong ? '강한 일간으로 자신감과 추진력' : '신중한 판단력과 협력 능력',
    ],

    keyWeaknesses: [
      traits.weakness.split('.')[0],
      `${ELEMENT_KOR[elementBalance.deficient]} 기운 부족`,
    ],

    actionGuide: [
      `강점인 ${stemInfo.nature}을 살리되, ${traits.weakness.split('.')[0]}에 주의하세요.`,
      `${ELEMENT_KOR[elementBalance.deficient]} 기운이 부족하므로, 이를 보완하는 활동과 관계를 의식적으로 늘리세요.`,
      `현재 대운(${currentLuck?.gapja ?? '미산출'})의 기운을 활용하여 ${
        chart.dayMasterStrength.isStrong
          ? '외부 활동과 도전에 적극적으로 임하는 것이 유리합니다.'
          : '내실을 다지고 협력 관계를 강화하는 것이 유리합니다.'
      }`,
    ].join('\n'),
  }
}
