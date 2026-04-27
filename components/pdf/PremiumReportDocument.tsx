// components/pdf/PremiumReportDocument.tsx
//
// @react-pdf/renderer 기반 PDF 문서
// 폰트: 로컬 TTF 서브셋 (NotoSansKR) — 한글 완전 지원
// woff2 사용 금지 (react-pdf는 TTF/OTF만 지원)

import {
  Document, Page, View, Text, StyleSheet, Font,
} from '@react-pdf/renderer'
import path from 'path'
import type { PremiumPdfInput } from '@/lib/types/report'

// ── 폰트 등록: 로컬 TTF (서브셋) ─────────────────────────
// process.cwd() = Next.js 프로젝트 루트
// public/fonts/ 에 위치한 서브셋 TTF 사용
const FONT_DIR = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src:        path.join(FONT_DIR, 'NotoSansKR-Regular-Subset.ttf'),
      fontWeight: 400,
    },
    {
      src:        path.join(FONT_DIR, 'NotoSansKR-Bold-Subset.ttf'),
      fontWeight: 700,
    },
  ],
})

// 하이픈 자동 삽입 비활성화 (한글 단어 잘림 방지)
Font.registerHyphenationCallback((word) => [word])

// ── 색상 상수 ─────────────────────────────────────────────
const C = {
  bg:         '#ffffff',
  coverBg:    '#0f1117',
  gold:       '#b48c50',
  goldLight:  '#c9a96e',
  text:       '#1c1917',
  textMuted:  '#57534e',
  textLight:  '#a8a29e',
  border:     '#e7e5e4',
  cardBg:     '#fafaf9',
  coverText:  '#f5f0e8',
  coverMuted: '#a09080',
}

// ── 스타일 ────────────────────────────────────────────────
const S = StyleSheet.create({
  // 페이지 기본
  page: {
    fontFamily:    'NotoSansKR',
    fontSize:       10.5,
    color:          C.text,
    backgroundColor: C.bg,
    paddingTop:     44,
    paddingBottom:  56,
    paddingLeft:    50,
    paddingRight:   50,
    lineHeight:     1.75,
  },
  coverPage: {
    fontFamily:    'NotoSansKR',
    fontSize:       10.5,
    backgroundColor: C.coverBg,
    paddingTop:     0,
    paddingBottom:  0,
    paddingLeft:    0,
    paddingRight:   0,
  },

  // ── 커버 페이지 ──────────────────────────────────────────
  coverHero: {
    paddingTop:    60,
    paddingBottom: 50,
    paddingLeft:   50,
    paddingRight:  50,
    minHeight:     320,
  },
  coverTag: {
    fontSize:      8.5,
    color:         C.gold,
    letterSpacing: 2,
    marginBottom:  16,
    fontWeight:    700,
  },
  coverTitle: {
    fontSize:      32,
    fontWeight:    700,
    color:         C.coverText,
    lineHeight:    1.3,
    marginBottom:  10,
  },
  coverSubtitle: {
    fontSize:      13,
    color:         C.coverMuted,
    marginBottom:  30,
  },
  coverDivider: {
    height:         1,
    backgroundColor: C.gold,
    opacity:         0.35,
    marginBottom:   28,
  },
  coverMetaRow: {
    flexDirection: 'row',
    gap:            24,
    marginBottom:   8,
  },
  coverMetaLabel: {
    fontSize:      8.5,
    color:         C.gold,
    fontWeight:    700,
    letterSpacing: 0.5,
    marginBottom:  3,
  },
  coverMetaValue: {
    fontSize:      11,
    color:         C.coverText,
    fontWeight:    700,
  },
  coverFooterBar: {
    backgroundColor: '#191c27',
    paddingVertical:  20,
    paddingHorizontal: 50,
  },
  coverFooterText: {
    fontSize:  8,
    color:     C.coverMuted,
    textAlign: 'center',
    lineHeight: 1.6,
  },

  // ── 사주팔자 그리드 ──────────────────────────────────────
  pillarsSection: {
    backgroundColor: '#13161f',
    paddingVertical:  28,
    paddingHorizontal: 50,
  },
  pillarsSectionTitle: {
    fontSize:      10,
    color:         C.gold,
    fontWeight:    700,
    letterSpacing: 1.5,
    marginBottom:  16,
    textAlign:     'center',
  },
  pillarsRow: {
    flexDirection: 'row',
    gap:            10,
    justifyContent: 'center',
  },
  pillarBox: {
    flex:            1,
    border:          `1px solid ${C.gold}40`,
    borderRadius:    8,
    padding:         12,
    alignItems:      'center',
    backgroundColor: '#1a1e2c',
    maxWidth:        110,
  },
  pillarBoxDay: {
    borderColor:     C.gold,
    borderWidth:     1.5,
    backgroundColor: '#1e1a12',
  },
  pillarLabel: {
    fontSize:      7.5,
    color:         C.coverMuted,
    marginBottom:  6,
    textAlign:     'center',
  },
  pillarStemChar: {
    fontSize:      28,
    fontWeight:    700,
    color:         C.goldLight,
    lineHeight:    1,
  },
  pillarStemRead: {
    fontSize:      8,
    color:         C.coverMuted,
    marginBottom:  6,
  },
  pillarBranchChar: {
    fontSize:      24,
    fontWeight:    700,
    color:         C.coverText,
    lineHeight:    1,
  },
  pillarBranchRead: {
    fontSize:  7.5,
    color:     C.coverMuted,
    marginTop: 2,
  },
  pillarMeaning: {
    fontSize:  7,
    color:     '#70665a',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 1.4,
  },
  pillarUnknown: {
    fontSize:   12,
    color:      '#3a3630',
    fontWeight: 700,
    marginVertical: 12,
  },
  pillarTenGod: {
    fontSize:      7.5,
    color:         C.gold,
    marginTop:     4,
    fontWeight:    700,
  },

  // ── 일반 페이지 ──────────────────────────────────────────
  // 섹션 제목
  sectionTitle: {
    fontSize:    13.5,
    fontWeight:  700,
    color:       C.text,
    marginTop:   22,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom:  `1.5px solid ${C.gold}`,
  },
  sectionNumber: {
    fontSize:   9,
    color:      C.gold,
    fontWeight: 700,
    marginBottom: 3,
  },
  sectionBody: {
    fontSize:    10.5,
    color:       C.text,
    lineHeight:  1.85,
    marginBottom: 8,
  },
  divider: {
    height:         0.5,
    backgroundColor: C.border,
    marginVertical:  16,
  },

  // 오행 바
  elementRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  7,
    gap:           10,
  },
  elementLabel: {
    width:      45,
    fontSize:   9.5,
    color:      C.textMuted,
    fontWeight: 700,
  },
  elementTrack: {
    flex:            1,
    height:          9,
    backgroundColor: '#f0ede8',
    borderRadius:    5,
    overflow:        'hidden',
  },
  elementBar: {
    height:       9,
    borderRadius: 5,
  },
  elementPct: {
    width:     30,
    fontSize:  9,
    color:     C.textMuted,
    textAlign: 'right',
  },

  // 핵심 포인트 박스
  keyPointBox: {
    backgroundColor: '#fdf8f0',
    border:          `1px solid ${C.gold}40`,
    borderLeft:      `3px solid ${C.gold}`,
    borderRadius:    6,
    padding:         12,
    marginVertical:  10,
  },
  keyPointTitle: {
    fontSize:    9,
    color:       C.gold,
    fontWeight:  700,
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  keyPointItem: {
    fontSize:    9.5,
    color:       C.textMuted,
    lineHeight:  1.7,
  },

  // 푸터
  footer: {
    position:  'absolute',
    bottom:    22,
    left:      50,
    right:     50,
  },
  footerLine: {
    height:          0.5,
    backgroundColor: C.border,
    marginBottom:    8,
  },
  footerContent: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  footerBrand: {
    fontSize:   8,
    color:      C.gold,
    fontWeight: 700,
  },
  footerText: {
    fontSize: 7.5,
    color:    C.textLight,
  },
  footerPage: {
    fontSize: 8,
    color:    C.textLight,
  },

  // 면책 박스
  disclaimerBox: {
    backgroundColor: '#f8f7f5',
    border:          `0.5px solid ${C.border}`,
    borderRadius:    6,
    padding:         12,
    marginTop:       20,
  },
  disclaimerText: {
    fontSize:   8.5,
    color:      C.textMuted,
    lineHeight: 1.7,
  },
})

// ── 오행 설정 ──────────────────────────────────────────────
const ELEMENTS = [
  { key: 'wood',  label: '목(木)',  color: '#4ade80', bg: '#14532d30' },
  { key: 'fire',  label: '화(火)',  color: '#f87171', bg: '#7f1d1d30' },
  { key: 'earth', label: '토(土)',  color: '#fbbf24', bg: '#78350f30' },
  { key: 'metal', label: '금(金)',  color: '#94a3b8', bg: '#1e293b30' },
  { key: 'water', label: '수(水)',  color: '#60a5fa', bg: '#1e3a5f30' },
]

// ── 헬퍼 ──────────────────────────────────────────────────
function formatKorDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

// ── 서브 컴포넌트 ─────────────────────────────────────────

function Footer({ pageNum, total }: { pageNum: number; total: number }) {
  return (
    <View style={S.footer} fixed>
      <View style={S.footerLine} />
      <View style={S.footerContent}>
        <Text style={S.footerBrand}>오늘의 사주</Text>
        <Text style={S.footerText}>본 리포트는 사주명리학에 근거한 분석입니다.</Text>
        <Text style={S.footerPage}>{pageNum} / {total}</Text>
      </View>
    </View>
  )
}

function SectionBlock({
  num, title, body,
}: {
  num: number
  title: string
  body: string
}) {
  return (
    <View>
      <Text style={S.sectionNumber}>{String(num).padStart(2, '0')}</Text>
      <Text style={S.sectionTitle}>{title}</Text>
      <Text style={S.sectionBody}>{body || '(내용이 입력되지 않았습니다.)'}</Text>
    </View>
  )
}

// ── 메인 문서 ─────────────────────────────────────────────

type Props = { data: PremiumPdfInput }

export default function PremiumReportDocument({ data }: Props) {
  const { input, freeData, premiumData, isMock, orderId, paidAt } = data
  const { fourPillars: pillars, fiveElements: fe } = freeData.basicChart

  const calLabel    = input.calendarType === 'lunar' ? '음력' : '양력'
  const genderLabel = input.gender === 'male' ? '남성' : '여성'
  const timeLabel   = input.hour !== null ? `${input.hour}시` : '시간 미상'
  const birthInfo   = `${calLabel} ${input.year}년 ${input.month}월 ${input.day}일 ${timeLabel} (${genderLabel})`

  const sections = [
    { title: '사주 원국 구조 해설',       body: premiumData.chartOverview      },
    { title: '사주팔자 전체 풀이',         body: premiumData.fourPillarsDetail  },
    { title: '일간(日干) 중심 해석',       body: premiumData.dayMasterDetail    },
    { title: '오행(五行) 강약 분석',       body: premiumData.elementsDetail     },
    { title: '십성(十星) 구조 해석',       body: premiumData.tenGodsDetail      },
    { title: '성격과 기질',               body: premiumData.personalityDetail  },
    { title: '인간관계 스타일',            body: premiumData.relationshipDetail },
    { title: '연애·결혼 성향',            body: premiumData.loveMarriageDetail },
    { title: '직업·적성·일하는 방식',     body: premiumData.careerDetail       },
    { title: '재물운·돈 관리 성향',        body: premiumData.wealthDetail       },
    { title: '건강·생활 습관 주의점',      body: premiumData.healthDetail       },
    { title: '시기 흐름과 대운 요약',      body: premiumData.timingDetail       },
    { title: '실천 조언',                 body: premiumData.actionGuide        },
    { title: '전체 요약 및 마무리',        body: premiumData.finalSummary       },
  ]

  const totalPages = 5

  return (
    <Document
      title={`오늘의 사주 프리미엄 리포트 — ${input.year}년생`}
      author="오늘의 사주"
      language="ko"
    >
      {/* ══════════════════════════════════════════
          1페이지: 커버
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.coverPage}>

        {/* 히어로 영역 */}
        <View style={S.coverHero}>
          <Text style={S.coverTag}>사주명리학 종합 분석 리포트</Text>
          <Text style={S.coverTitle}>오늘의 사주{'\n'}프리미엄 리포트</Text>
          <Text style={S.coverSubtitle}>PREMIUM SAJU ANALYSIS REPORT</Text>
          <View style={S.coverDivider} />

          {isMock && (
            <Text style={{ fontSize: 8, color: '#f59e0b', marginBottom: 12 }}>
              ⚠ 예시 데이터 기반 (계산 결과 확인 필요)
            </Text>
          )}

          {/* 메타 정보 */}
          <View style={S.coverMetaRow}>
            <View>
              <Text style={S.coverMetaLabel}>출생 정보</Text>
              <Text style={S.coverMetaValue}>{birthInfo}</Text>
            </View>
          </View>
          <View style={S.coverMetaRow}>
            <View>
              <Text style={S.coverMetaLabel}>발행일</Text>
              <Text style={S.coverMetaValue}>{formatKorDate(paidAt)}</Text>
            </View>
            <View>
              <Text style={S.coverMetaLabel}>주문번호</Text>
              <Text style={[S.coverMetaValue, { fontSize: 9, color: C.coverMuted }]}>{orderId}</Text>
            </View>
          </View>
        </View>

        {/* 사주팔자 그리드 */}
        <View style={S.pillarsSection}>
          <Text style={S.pillarsSectionTitle}>사주팔자 四柱八字</Text>
          <View style={S.pillarsRow}>
            {([
              { label: '연주 年柱', p: pillars.year,  isDay: false },
              { label: '월주 月柱', p: pillars.month, isDay: false },
              { label: '일주 日柱', p: pillars.day,   isDay: true  },
              { label: '시주 時柱', p: pillars.time,  isDay: false },
            ] as const).map(({ label, p, isDay }) => (
              <View key={label} style={[S.pillarBox, isDay ? S.pillarBoxDay : {}]}>
                <Text style={S.pillarLabel}>{label}{isDay ? ' ★' : ''}</Text>
                {p ? (
                  <>
                    <Text style={S.pillarStemChar}>{p.heavenlyStem}</Text>
                    <Text style={S.pillarStemRead}>{p.stemReading}</Text>
                    <Text style={S.pillarBranchChar}>{p.earthlyBranch}</Text>
                    <Text style={S.pillarBranchRead}>{p.branchReading}</Text>
                    {p.stemMeaning ? (
                      <Text style={S.pillarMeaning}>{p.stemMeaning}</Text>
                    ) : null}
                  </>
                ) : (
                  <Text style={S.pillarUnknown}>미상</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 커버 푸터 */}
        <View style={S.coverFooterBar}>
          <Text style={S.coverFooterText}>
            본 리포트는 사주명리학(四柱命理學)에 근거한 전문 분석으로, 삶의 참고 자료로 활용하시기 바랍니다.{'\n'}
            오늘의 사주 | saju.today
          </Text>
        </View>
      </Page>

      {/* ══════════════════════════════════════════
          2페이지: 오행 분포 + 1~3번 섹션
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>

        {/* 오행 분포 */}
        <Text style={S.sectionNumber}>01</Text>
        <Text style={S.sectionTitle}>오행(五行) 분포</Text>
        {ELEMENTS.map(({ key, label, color }) => {
          const pct = (fe as Record<string, unknown>)[key] as number ?? 0
          return (
            <View key={key} style={S.elementRow}>
              <Text style={S.elementLabel}>{label}</Text>
              <View style={S.elementTrack}>
                <View style={[S.elementBar, { width: `${Math.max(pct, 0)}%`, backgroundColor: color }]} />
              </View>
              <Text style={S.elementPct}>{pct}%</Text>
            </View>
          )
        })}

        <View style={S.divider} />

        {sections.slice(0, 2).map((s, i) => (
          <SectionBlock key={s.title} num={i + 2} title={s.title} body={s.body} />
        ))}

        <Footer pageNum={2} total={totalPages} />
      </Page>

      {/* ══════════════════════════════════════════
          3페이지: 섹션 3~6
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        {sections.slice(2, 6).map((s, i) => (
          <SectionBlock key={s.title} num={i + 4} title={s.title} body={s.body} />
        ))}
        <Footer pageNum={3} total={totalPages} />
      </Page>

      {/* ══════════════════════════════════════════
          4페이지: 섹션 7~10
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        {sections.slice(6, 10).map((s, i) => (
          <SectionBlock key={s.title} num={i + 8} title={s.title} body={s.body} />
        ))}
        <Footer pageNum={4} total={totalPages} />
      </Page>

      {/* ══════════════════════════════════════════
          5페이지: 섹션 11~14 + 면책
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        {sections.slice(10).map((s, i) => (
          <SectionBlock key={s.title} num={i + 12} title={s.title} body={s.body} />
        ))}

        <View style={S.disclaimerBox}>
          <Text style={[S.disclaimerText, { fontWeight: 700, marginBottom: 4 }]}>
            알림 및 면책 사항
          </Text>
          <Text style={S.disclaimerText}>
            · 본 리포트는 사주명리학(四柱命理學)에 근거한 일반적인 경향 분석입니다.{'\n'}
            · 사주는 삶의 정해진 답이 아니라, 자신을 이해하고 방향을 설계하는 참고 자료입니다.{'\n'}
            · 실제 삶의 결과는 본인의 선택·노력·환경에 따라 달라질 수 있습니다.{'\n'}
            · 법률, 의료, 재무 관련 결정은 전문가와 상담하시기 바랍니다.
          </Text>
        </View>

        <Footer pageNum={5} total={totalPages} />
      </Page>
    </Document>
  )
}
