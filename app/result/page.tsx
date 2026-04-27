// =====================================================
// app/result/page.tsx  —  프리미엄 사주 결과 화면
//
// 구조:
//   1. 입력 정보 요약 헤더
//   2. 불확실성 경고 (있을 때만)
//   3. 사주팔자 + 오행 분포
//   4. 성향 요약 (무료)
//   5. 직업·연애 teaser (무료 — 상세는 유료)
//   6. 유료 전환 섹션
//   7. 상품 카드들
//   8. Sticky CTA
// =====================================================

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSajuResult } from '@/lib/saju/getSajuResult'
import FourPillarsGrid from '@/components/FourPillarsGrid'
import FiveElementsChart from '@/components/FiveElementsChart'
import PremiumIntroSection from '@/components/result/PremiumIntroSection'
import PremiumProductsSection from '@/components/result/PremiumProductsSection'
import StickyBottomCTA from '@/components/result/StickyBottomCTA'
import ResultWarningNotice from '@/components/result/ResultWarningNotice'

type SearchParams = { [key: string]: string | string[] | undefined }

function getParam(p: SearchParams, k: string): string | null {
  const v = p[k]
  return typeof v === 'string' ? v : null
}

export default function ResultPage({ searchParams }: { searchParams: SearchParams }) {

  const response = getSajuResult({
    year:         getParam(searchParams, 'year'),
    month:        getParam(searchParams, 'month'),
    day:          getParam(searchParams, 'day'),
    hour:         getParam(searchParams, 'hour'),
    gender:       getParam(searchParams, 'gender'),
    calendarType: getParam(searchParams, 'calendar'),
  })

  if (!response.ok) redirect('/input')

  const { result } = response
  const { year, month, day, gender, calendarType, hour } = result.input

  const calLabel    = calendarType === 'lunar' ? '음력' : '양력'
  const genderLabel = gender === 'male' ? '남성' : '여성'
  const timeLabel   = hour !== null ? `${hour}시` : '시간 미상'

  const inputParams = new URLSearchParams({
    year:     String(year),
    month:    String(month),
    day:      String(day),
    hour:     hour !== null ? String(hour) : 'unknown',
    gender,
    calendar: calendarType,
  }).toString()

  // 불확실성 경고 생성
  const warnings: string[] = []
  if (hour === null) {
    warnings.push('출생 시간이 입력되지 않아 시주(時柱)를 산출하지 못했습니다. 시주가 포함되면 성향·적성·인간관계 해석의 정밀도가 높아집니다.')
  }
  // isMock 경고 제거 — 60갑자 결정론적 계산 적용 중

  const dayStem = result.fourPillars.day.heavenlyStem

  return (
    <>
      <main
        className="min-h-screen flex flex-col items-center px-4 pt-8 pb-32"
        style={{ background: 'var(--bg-base)' }}
      >
        <div className="w-full max-w-sm">

          {/* ── 상단 내비 ── */}
          <div className="mb-6">
            <Link
              href="/input"
              className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              ← 다시 입력하기
            </Link>
          </div>

          {/* ── 입력 정보 헤더 ── */}
          <div className="text-center mb-8">
            <p className="label-overline mb-3">사주 분석 결과</p>
            <h1
              className="font-serif text-2xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {year}년생의 사주
            </h1>

            {/* 입력값 칩 */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {[calLabel, `${year}.${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')}`, timeLabel, genderLabel].map(chip => (
                <span
                  key={chip}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-gold)',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="divider-gold mt-6" />
          </div>

          {/* ── 불확실성 경고 ── */}
          {warnings.length > 0 && (
            <div className="mb-6">
              <ResultWarningNotice warnings={warnings} />
            </div>
          )}

          {/* ── 섹션 1: 사주팔자 ── */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                사주팔자 四柱八字
              </h2>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
            >
              <FourPillarsGrid pillars={result.fourPillars} />
            </div>
          </section>

          {/* ── 섹션 2: 오행 분포 ── */}
          <section className="mb-6">
            <h2 className="text-sm font-semibold tracking-wide mb-4" style={{ color: 'var(--text-secondary)' }}>
              오행 분포 五行
            </h2>
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
            >
              <FiveElementsChart
                elements={result.fiveElements}
                summary={result.interpretation.fiveElementsSummary}
              />
            </div>
          </section>

          {/* ── 섹션 3: 성향 요약 ── */}
          <section className="mb-6">
            <h2 className="text-sm font-semibold tracking-wide mb-4" style={{ color: 'var(--text-secondary)' }}>
              핵심 성향
            </h2>
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
            >
              {/* 일간 태그 */}
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg mb-4"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-gold-md)' }}
              >
                <span
                  className="font-serif text-2xl font-bold"
                  style={{ color: 'var(--text-gold)' }}
                >
                  {dayStem}
                </span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    일간 {result.fourPillars.day.stemReading}({dayStem})
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {result.fourPillars.day.stemMeaning}
                  </p>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--text-secondary)' }}
              >
                {result.interpretation.personality}
              </p>
            </div>
          </section>

          {/* ── 섹션 4: 직업·연애 teaser ── */}
          <section className="mb-6">
            <h2 className="text-sm font-semibold tracking-wide mb-4" style={{ color: 'var(--text-secondary)' }}>
              직업 · 연애 미리보기
            </h2>
            <div className="space-y-3">

              {/* 직업 teaser */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-gold)' }}>
                  직업 · 적성
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {result.interpretation.careerTeaser}
                </p>
              </div>

              {/* 연애 teaser */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-gold)' }}>
                  연애 · 관계
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {result.interpretation.loveTeaser}
                </p>
              </div>
            </div>
          </section>

          {/* ── 유료 전환 섹션 ── */}
          <PremiumIntroSection />

          {/* ── 상품 카드들 ── */}
          <PremiumProductsSection inputParams={inputParams} />

          {/* ── 하단 버튼 ── */}
          <div className="mt-10 space-y-2">
            <Link
              href="/input"
              className="block w-full py-3.5 text-center text-sm rounded-xl transition-colors"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-gold)',
              }}
            >
              다시 입력하기
            </Link>
            <Link
              href="/"
              className="block w-full py-3 text-center text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              ← 처음으로
            </Link>
          </div>

          <p
            className="text-xs text-center mt-4 mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            입력하신 정보는 서버에 저장되지 않아요
          </p>

        </div>
      </main>

      {/* ── Sticky CTA ── */}
      <StickyBottomCTA inputParams={inputParams} />
    </>
  )
}
