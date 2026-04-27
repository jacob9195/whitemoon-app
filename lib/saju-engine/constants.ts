/**
 * lib/saju-engine/constants.ts
 *
 * 사주명리학 핵심 상수 테이블
 * - 천간(天干) 10개: 甲乙丙丁戊己庚辛壬癸
 * - 지지(地支) 12개: 子丑寅卯辰巳午未申酉戌亥
 * - 오행(五行): 木火土金水
 * - 음양(陰陽): 陽陰
 * - 십신(十神): 비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인
 * - 지장간(地藏干): 각 지지에 내장된 천간
 * - 절기(節氣) 12절: 사주 월주 결정 기준
 * - 한국 서머타임(DST) 이력
 */

// ── 천간(天干) ──────────────────────────────────────────────────
export type HeavenlyStemKey =
  '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'

export type EarthlyBranchKey =
  '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

export type FiveElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water'

export type YinYangKey = 'yang' | 'yin'

export type TenGodKey =
  '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' |
  '편관' | '정관' | '편인' | '정인'

// 천간 순서 인덱스 (0=甲 ~ 9=癸)
export const HEAVENLY_STEMS: HeavenlyStemKey[] = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
]

// 지지 순서 인덱스 (0=子 ~ 11=亥)
export const EARTHLY_BRANCHES: EarthlyBranchKey[] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
]

// 천간별 속성
export const STEM_INFO: Record<HeavenlyStemKey, {
  index: number          // 순서 (0~9)
  kor: string            // 한글 읽기
  element: FiveElementKey
  yinYang: YinYangKey
  meaning: string        // 상징 의미
  nature: string         // 성질
}> = {
  甲: { index: 0, kor: '갑', element: 'wood',  yinYang: 'yang', meaning: '큰 나무, 시작, 직진', nature: '양목(陽木)' },
  乙: { index: 1, kor: '을', element: 'wood',  yinYang: 'yin',  meaning: '풀, 덩굴, 유연함', nature: '음목(陰木)' },
  丙: { index: 2, kor: '병', element: 'fire',  yinYang: 'yang', meaning: '태양, 밝음, 열정', nature: '양화(陽火)' },
  丁: { index: 3, kor: '정', element: 'fire',  yinYang: 'yin',  meaning: '촛불, 섬세함, 따뜻함', nature: '음화(陰火)' },
  戊: { index: 4, kor: '무', element: 'earth', yinYang: 'yang', meaning: '큰 산, 포용, 중후함', nature: '양토(陽土)' },
  己: { index: 5, kor: '기', element: 'earth', yinYang: 'yin',  meaning: '논밭, 실용, 세심함', nature: '음토(陰土)' },
  庚: { index: 6, kor: '경', element: 'metal', yinYang: 'yang', meaning: '원석, 강인함, 결단', nature: '양금(陽金)' },
  辛: { index: 7, kor: '신', element: 'metal', yinYang: 'yin',  meaning: '보석, 날카로움, 예리함', nature: '음금(陰金)' },
  壬: { index: 8, kor: '임', element: 'water', yinYang: 'yang', meaning: '강·바다, 지혜, 포용', nature: '양수(陽水)' },
  癸: { index: 9, kor: '계', element: 'water', yinYang: 'yin',  meaning: '이슬·빗물, 섬세, 내면', nature: '음수(陰水)' },
}

// 지지별 속성
export const BRANCH_INFO: Record<EarthlyBranchKey, {
  index: number
  kor: string
  element: FiveElementKey
  yinYang: YinYangKey
  month: number           // 사주 월 (1월=인월)
  hourStart: number       // 시작 시각(시두 기준, 시간)
  hourEnd: number         // 종료 시각(시두 기준, 시간)
  zodiac: string          // 띠
  season: string          // 계절
  mainHiddenStem: HeavenlyStemKey       // 지장간 정기(正氣)
  midHiddenStem?: HeavenlyStemKey       // 지장간 중기(中氣)
  initHiddenStem?: HeavenlyStemKey      // 지장간 여기(餘氣)
}> = {
  子: { index: 0,  kor: '자', element: 'water', yinYang: 'yang', month: 11, hourStart: 23, hourEnd: 1,  zodiac: '쥐',  season: '겨울', mainHiddenStem: '壬', initHiddenStem: '癸' },
  丑: { index: 1,  kor: '축', element: 'earth', yinYang: 'yin',  month: 12, hourStart: 1,  hourEnd: 3,  zodiac: '소',  season: '겨울', mainHiddenStem: '己', midHiddenStem: '癸', initHiddenStem: '辛' },
  寅: { index: 2,  kor: '인', element: 'wood',  yinYang: 'yang', month: 1,  hourStart: 3,  hourEnd: 5,  zodiac: '호랑이', season: '봄', mainHiddenStem: '甲', midHiddenStem: '丙', initHiddenStem: '戊' },
  卯: { index: 3,  kor: '묘', element: 'wood',  yinYang: 'yin',  month: 2,  hourStart: 5,  hourEnd: 7,  zodiac: '토끼', season: '봄', mainHiddenStem: '乙', initHiddenStem: '甲' },
  辰: { index: 4,  kor: '진', element: 'earth', yinYang: 'yang', month: 3,  hourStart: 7,  hourEnd: 9,  zodiac: '용',  season: '봄', mainHiddenStem: '戊', midHiddenStem: '乙', initHiddenStem: '癸' },
  巳: { index: 5,  kor: '사', element: 'fire',  yinYang: 'yin',  month: 4,  hourStart: 9,  hourEnd: 11, zodiac: '뱀',  season: '여름', mainHiddenStem: '丙', midHiddenStem: '庚', initHiddenStem: '戊' },
  午: { index: 6,  kor: '오', element: 'fire',  yinYang: 'yang', month: 5,  hourStart: 11, hourEnd: 13, zodiac: '말',  season: '여름', mainHiddenStem: '丁', midHiddenStem: '己', initHiddenStem: '丙' },
  未: { index: 7,  kor: '미', element: 'earth', yinYang: 'yin',  month: 6,  hourStart: 13, hourEnd: 15, zodiac: '양',  season: '여름', mainHiddenStem: '己', midHiddenStem: '丁', initHiddenStem: '乙' },
  申: { index: 8,  kor: '신', element: 'metal', yinYang: 'yang', month: 7,  hourStart: 15, hourEnd: 17, zodiac: '원숭이', season: '가을', mainHiddenStem: '庚', midHiddenStem: '壬', initHiddenStem: '戊' },
  酉: { index: 9,  kor: '유', element: 'metal', yinYang: 'yin',  month: 8,  hourStart: 17, hourEnd: 19, zodiac: '닭',  season: '가을', mainHiddenStem: '辛', initHiddenStem: '庚' },
  戌: { index: 10, kor: '술', element: 'earth', yinYang: 'yang', month: 9,  hourStart: 19, hourEnd: 21, zodiac: '개',  season: '가을', mainHiddenStem: '戊', midHiddenStem: '辛', initHiddenStem: '丁' },
  亥: { index: 11, kor: '해', element: 'water', yinYang: 'yin',  month: 10, hourStart: 21, hourEnd: 23, zodiac: '돼지', season: '겨울', mainHiddenStem: '壬', initHiddenStem: '甲' },
}

// 오행 상생(相生) 관계: key가 key2를 생함
export const ELEMENT_GENERATES: Record<FiveElementKey, FiveElementKey> = {
  wood:  'fire',
  fire:  'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
}

// 오행 상극(相剋) 관계: key가 key2를 극함
export const ELEMENT_CONTROLS: Record<FiveElementKey, FiveElementKey> = {
  wood:  'earth',
  earth: 'water',
  water: 'fire',
  fire:  'metal',
  metal: 'wood',
}

// 오행 한글 이름
export const ELEMENT_KOR: Record<FiveElementKey, string> = {
  wood:  '목(木)',
  fire:  '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
}

// ── 시두법(時頭法): 일간에 따른 자시(子時) 천간 ─────────────────
// 甲己日 → 甲子時부터, 乙庚日 → 丙子時부터
// 丙辛日 → 戊子時부터, 丁壬日 → 庚子時부터, 戊癸日 → 壬子時부터
export const HOUR_STEM_BASE: Record<string, HeavenlyStemKey> = {
  '甲': '甲', '己': '甲',
  '乙': '丙', '庚': '丙',
  '丙': '戊', '辛': '戊',
  '丁': '庚', '壬': '庚',
  '戊': '壬', '癸': '壬',
}

// ── 월건기법(月建起法): 연간(年干)에 따른 인월(寅月) 천간 ─────────
// 甲己年의 1월(인월)은 丙寅, 乙庚年은 戊寅, 丙辛年은 庚寅
// 丁壬年은 壬寅, 戊癸年은 甲寅
export const MONTH_STEM_BASE: Record<string, HeavenlyStemKey> = {
  '甲': '丙', '己': '丙',
  '乙': '戊', '庚': '戊',
  '丙': '庚', '辛': '庚',
  '丁': '壬', '壬': '壬',
  '戊': '甲', '癸': '甲',
}

// ── 12절기 → 월지(月支) 대응 ────────────────────────────────────
// 입춘=인월(寅月=1), 경칩=묘월(卯月=2), ... 소한=축월(丑月=12)
// month는 사주 월 기준 (1=인월부터)
export const JEOIGI_TO_BRANCH: { name: string; branch: EarthlyBranchKey; solarTermIndex: number }[] = [
  { name: '입춘(立春)', branch: '寅', solarTermIndex: 1  }, // 사주 1월 시작
  { name: '경칩(驚蟄)', branch: '卯', solarTermIndex: 2  }, // 사주 2월
  { name: '청명(淸明)', branch: '辰', solarTermIndex: 3  }, // 사주 3월
  { name: '입하(立夏)', branch: '巳', solarTermIndex: 4  }, // 사주 4월
  { name: '망종(芒種)', branch: '午', solarTermIndex: 5  }, // 사주 5월
  { name: '소서(小暑)', branch: '未', solarTermIndex: 6  }, // 사주 6월
  { name: '입추(立秋)', branch: '申', solarTermIndex: 7  }, // 사주 7월
  { name: '백로(白露)', branch: '酉', solarTermIndex: 8  }, // 사주 8월
  { name: '한로(寒露)', branch: '戌', solarTermIndex: 9  }, // 사주 9월
  { name: '입동(立冬)', branch: '亥', solarTermIndex: 10 }, // 사주 10월
  { name: '대설(大雪)', branch: '子', solarTermIndex: 11 }, // 사주 11월
  { name: '소한(小寒)', branch: '丑', solarTermIndex: 12 }, // 사주 12월
]

// ── 한국 서머타임(DST) 이력 ─────────────────────────────────────
// 출처: 위키백과, 나무위키, 국가기록원 교차 검증
// 서머타임 기간에는 실제 태양시 계산 시 -1시간 보정 필요
export interface DSTRecord {
  startMs: number    // UTC 밀리초
  endMs: number      // UTC 밀리초
  offsetHours: number // 추가된 시간 (보통 +1, 즉 실제시간 -1)
  note: string
}

export const KOREA_DST_RECORDS: DSTRecord[] = [
  // 1948년 (시작일 불규칙, 9월 두번째 일요일 종료)
  { startMs: Date.UTC(1948, 5, 1, 0, 0), endMs: Date.UTC(1948, 8, 12, 0, 0), offsetHours: 1, note: '1948년 서머타임' },
  { startMs: Date.UTC(1949, 3, 3, 0, 0), endMs: Date.UTC(1949, 8, 10, 0, 0), offsetHours: 1, note: '1949년 서머타임' },
  { startMs: Date.UTC(1950, 3, 1, 0, 0), endMs: Date.UTC(1950, 8, 9, 0, 0),  offsetHours: 1, note: '1950년 서머타임' },
  { startMs: Date.UTC(1951, 4, 6, 0, 0), endMs: Date.UTC(1951, 8, 8, 0, 0),  offsetHours: 1, note: '1951년 서머타임' },
  // 1955~1960년 (5월 첫째 일요일 ~ 9월 셋째 일요일)
  { startMs: Date.UTC(1955, 4, 5, 0, 0), endMs: Date.UTC(1955, 8, 18, 0, 0), offsetHours: 1, note: '1955년 서머타임' },
  { startMs: Date.UTC(1956, 4, 20, 0, 0), endMs: Date.UTC(1956, 8, 30, 0, 0), offsetHours: 1, note: '1956년 서머타임' },
  { startMs: Date.UTC(1957, 4, 5, 0, 0), endMs: Date.UTC(1957, 8, 22, 0, 0), offsetHours: 1, note: '1957년 서머타임' },
  { startMs: Date.UTC(1958, 2, 23, 0, 0), endMs: Date.UTC(1958, 8, 21, 0, 0), offsetHours: 1, note: '1958년 서머타임' },
  { startMs: Date.UTC(1959, 2, 15, 0, 0), endMs: Date.UTC(1959, 8, 20, 0, 0), offsetHours: 1, note: '1959년 서머타임' },
  { startMs: Date.UTC(1960, 3, 3, 0, 0), endMs: Date.UTC(1960, 8, 18, 0, 0), offsetHours: 1, note: '1960년 서머타임' },
  // 1987~1988년 (5월 두번째 일요일 02:00 ~ 10월 두번째 일요일 02:00)
  { startMs: Date.UTC(1987, 4, 10, 17, 0), endMs: Date.UTC(1987, 9, 11, 17, 0), offsetHours: 1, note: '1987년 서머타임(올림픽 준비)' },
  { startMs: Date.UTC(1988, 4, 8, 17, 0),  endMs: Date.UTC(1988, 9, 9, 17, 0),  offsetHours: 1, note: '1988년 서머타임(서울올림픽)' },
]

// 1955~1960년에는 한국 표준시가 동경 127도 30분(UTC+8:30) 사용
// → 현재 UTC+9와 30분 차이 → 사주 계산 시 -30분 추가 보정
export const KOREA_UTC_OFFSET_CHANGE: { startMs: number; endMs: number; utcOffsetMinutes: number }[] = [
  { startMs: Date.UTC(1908, 3, 1), endMs: Date.UTC(1911, 11, 31), utcOffsetMinutes: 8.5 * 60 }, // UTC+8:30
  { startMs: Date.UTC(1912, 0, 1), endMs: Date.UTC(1954, 2, 21), utcOffsetMinutes: 9 * 60 },    // UTC+9
  { startMs: Date.UTC(1954, 2, 22), endMs: Date.UTC(1961, 7, 10), utcOffsetMinutes: 8.5 * 60 }, // UTC+8:30 (표준시 변경)
  { startMs: Date.UTC(1961, 7, 10), endMs: Date.UTC(9999, 11, 31), utcOffsetMinutes: 9 * 60 },  // UTC+9 (현재)
]

// ── 십신(十神) 계산 규칙 ─────────────────────────────────────────
// 일간(dayMaster)을 기준으로 다른 천간과의 관계
// 1. 오행이 같고 음양이 같으면: 비견(比肩)
// 2. 오행이 같고 음양이 다르면: 겁재(劫財)
// 3. 일간이 생(生)하는 오행, 음양 같으면: 식신(食神)
// 4. 일간이 생(生)하는 오행, 음양 다르면: 상관(傷官)
// 5. 일간이 극(剋)하는 오행, 음양 같으면: 편재(偏財)
// 6. 일간이 극(剋)하는 오행, 음양 다르면: 정재(正財)
// 7. 일간을 극(剋)하는 오행, 음양 같으면: 편관(偏官)
// 8. 일간을 극(剋)하는 오행, 음양 다르면: 정관(正官)
// 9. 일간을 생(生)하는 오행, 음양 같으면: 편인(偏印)
// 10. 일간을 생(生)하는 오행, 음양 다르면: 정인(正印)

// 십이운성(十二運星) — 일간의 지지에 대한 왕쇠 상태
export type TwelveStageKey =
  '장생' | '목욕' | '관대' | '건록' | '제왕' | '쇠' |
  '병'   | '사'   | '묘'   | '절'   | '태'   | '양'

// 12운성 순서 (양간 기준 순행)
export const TWELVE_STAGES: TwelveStageKey[] = [
  '장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양',
]

// 각 일간의 '장생(長生)' 지지 인덱스 (양간 순행, 음간 역행)
export const DAY_MASTER_LONGEVITY_BRANCH: Record<HeavenlyStemKey, { branchIdx: number; direction: 'forward' | 'reverse' }> = {
  甲: { branchIdx: EARTHLY_BRANCHES.indexOf('亥'), direction: 'forward' },  // 甲은 亥에서 장생
  乙: { branchIdx: EARTHLY_BRANCHES.indexOf('午'), direction: 'reverse' },  // 乙은 午에서 장생(역행)
  丙: { branchIdx: EARTHLY_BRANCHES.indexOf('寅'), direction: 'forward' },  // 丙은 寅에서 장생
  丁: { branchIdx: EARTHLY_BRANCHES.indexOf('酉'), direction: 'reverse' },  // 丁은 酉에서 장생(역행)
  戊: { branchIdx: EARTHLY_BRANCHES.indexOf('寅'), direction: 'forward' },  // 戊는 寅에서 장생
  己: { branchIdx: EARTHLY_BRANCHES.indexOf('酉'), direction: 'reverse' },  // 己는 酉에서 장생(역행)
  庚: { branchIdx: EARTHLY_BRANCHES.indexOf('巳'), direction: 'forward' },  // 庚은 巳에서 장생
  辛: { branchIdx: EARTHLY_BRANCHES.indexOf('子'), direction: 'reverse' },  // 辛은 子에서 장생(역행)
  壬: { branchIdx: EARTHLY_BRANCHES.indexOf('申'), direction: 'forward' },  // 壬은 申에서 장생
  癸: { branchIdx: EARTHLY_BRANCHES.indexOf('卯'), direction: 'reverse' },  // 癸는 卯에서 장생(역행)
}

// 합(合)·충(衝)·형(刑)·파(破)·해(害) 관계
export const STEM_COMBINATION: [HeavenlyStemKey, HeavenlyStemKey][] = [
  ['甲', '己'], ['乙', '庚'], ['丙', '辛'], ['丁', '壬'], ['戊', '癸'],
]

export const BRANCH_SIX_COMBINATION: [EarthlyBranchKey, EarthlyBranchKey][] = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
]

export const BRANCH_THREE_COMBINATION: [EarthlyBranchKey, EarthlyBranchKey, EarthlyBranchKey][] = [
  ['申', '子', '辰'], // 수국(水局)
  ['亥', '卯', '未'], // 목국(木局)
  ['寅', '午', '戌'], // 화국(火局)
  ['巳', '酉', '丑'], // 금국(金局)
]

export const BRANCH_SIX_CLASH: [EarthlyBranchKey, EarthlyBranchKey][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
]
