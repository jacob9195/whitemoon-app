// app/page.tsx
// 7개 섹션 이미지 랜딩페이지
// - img 태그, width:100%, height:auto, display:block
// - background-image / object-fit:cover 금지
// - CTA 버튼은 absolute 투명 클릭 영역
// - 섹션7: 상품별 클릭 영역 + 하단 CTA 버튼 영역

import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ background: '#041018', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── 섹션 1: 히어로 — "내 사주 분석 받기" 버튼 영역 ── */}
        <div style={{ position: 'relative', lineHeight: 0 }}>
          <img src="/section1.png" alt="월백당사주 메인" style={{ width: '100%', height: 'auto', display: 'block' }} />
          {/* 버튼 위치: 이미지 높이 기준 약 47% 지점 */}
          <Link href="/apply" style={{
            position: 'absolute', top: '47%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '55%', height: '6%',
            display: 'block', background: 'transparent', cursor: 'pointer', borderRadius: 40,
          }} aria-label="내 사주 분석 받기" />
        </div>

        {/* ── 섹션 2 ── */}
        <div style={{ lineHeight: 0 }}>
          <img src="/section2.png" alt="왜 내 인생은 이렇게 흘러가는 걸까" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* ── 섹션 3 ── */}
        <div style={{ lineHeight: 0 }}>
          <img src="/section3.png" alt="핵심 분석 요소" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* ── 섹션 4 ── */}
        <div style={{ lineHeight: 0 }}>
          <img src="/section4.png" alt="80~100페이지 프리미엄 사주 리포트" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* ── 섹션 5 ── */}
        <div style={{ lineHeight: 0 }}>
          <img src="/section5.png" alt="월백당 사주 리포트 구성" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* ── 섹션 6: 샘플 리포트 미리보기 (코드 구현) ── */}
        <section style={{
          background: 'linear-gradient(180deg, #041018 0%, #061020 100%)',
          padding: '40px 20px 36px',
          fontFamily: 'sans-serif',
          borderTop: '1px solid rgba(201,168,76,0.15)',
        }}>
          {/* 섹션 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{
              fontSize: 11, letterSpacing: 4, color: '#c9a84c',
              margin: 0, marginBottom: 8,
            }}>
              SAMPLE REPORT
            </p>
            <h2 style={{
              fontSize: 22, fontWeight: 700, color: '#f0e6d0',
              margin: 0, marginBottom: 10,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.4,
            }}>
              실제 리포트는<br />이런 모습입니다
            </h2>
            <div style={{
              width: 30, height: 1,
              background: '#c9a84c', opacity: 0.6,
              margin: '12px auto 12px',
            }} />
            <p style={{
              fontSize: 13, color: 'rgba(240,230,208,0.6)',
              margin: 0, lineHeight: 1.6,
            }}>
              80~100페이지 분량의 정통사주 리포트<br />
              일부를 미리 만나보세요
            </p>
          </div>

          {/* 샘플 카드 4장 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                src: '/sample-cover.png',
                title: '표지',
                desc: '한 권의 책처럼 정중하게 시작합니다',
              },
              {
                src: '/sample-toc.png',
                title: '목차 — 13장 구성',
                desc: '본성·강점·관계·사업·재물·체질·시기 등 인생의 핵심을 짚어드립니다',
              },
              {
                src: '/sample-saju.png',
                title: '사주팔자 명식',
                desc: '천간·지지·음양오행·십성·지장간을 한눈에 풀이합니다',
              },
              {
                src: '/sample-analysis.png',
                title: '오행 분포와 본문 풀이',
                desc: '차트와 함께 자주 마주치는 인생의 장면을 풀어냅니다',
              },
            ].map((card) => (
              <div key={card.src} style={{
                background: '#0d1e38',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}>
                {/* 카드 이미지 */}
                <div style={{ background: '#f5efdf', lineHeight: 0 }}>
                  <img
                    src={card.src}
                    alt={`샘플 리포트 - ${card.title}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                {/* 카드 캡션 */}
                <div style={{ padding: '14px 16px' }}>
                  <p style={{
                    fontSize: 14, fontWeight: 700, color: '#c9a84c',
                    margin: 0, marginBottom: 4,
                    letterSpacing: 0.5,
                  }}>
                    {card.title}
                  </p>
                  <p style={{
                    fontSize: 12, color: 'rgba(240,230,208,0.6)',
                    margin: 0, lineHeight: 1.6,
                  }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 안내 문구 */}
          <p style={{
            fontSize: 11, color: 'rgba(240,230,208,0.4)',
            textAlign: 'center', marginTop: 24, marginBottom: 0,
            lineHeight: 1.6,
          }}>
            ※ 샘플은 일부 페이지이며, 실제 리포트는 80~100페이지 분량으로 발송됩니다.
          </p>
        </section>

        {/* ── 섹션 7: 가격표 — 상품별 클릭 영역 ── */}
        <div style={{ position: 'relative', lineHeight: 0 }}>
          <img src="/section7.png" alt="원하는 리포트를 선택하세요" style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* 정통사주 (좌상단 카드) */}
          <Link href="/apply?product=정통사주" style={{
            position: 'absolute', top: '20%', left: '2%',
            width: '48%', height: '24%',
            display: 'block', background: 'transparent', cursor: 'pointer',
          }} aria-label="정통사주 신청" />

          {/* 연애와 결혼운 (우상단 카드) */}
          <Link href="/apply?product=연애결혼" style={{
            position: 'absolute', top: '20%', left: '51%',
            width: '48%', height: '24%',
            display: 'block', background: 'transparent', cursor: 'pointer',
          }} aria-label="연애결혼 신청" />

          {/* 재물과 사업운 (좌하단 카드) */}
          <Link href="/apply?product=재물사업" style={{
            position: 'absolute', top: '46%', left: '2%',
            width: '48%', height: '22%',
            display: 'block', background: 'transparent', cursor: 'pointer',
          }} aria-label="재물사업 신청" />

          {/* 궁합 (우하단 카드) */}
          <Link href="/apply?product=궁합" style={{
            position: 'absolute', top: '46%', left: '51%',
            width: '48%', height: '22%',
            display: 'block', background: 'transparent', cursor: 'pointer',
          }} aria-label="궁합 신청" />

          {/* "지금 리포트 신청하기" CTA 버튼 */}
          <Link href="/apply" style={{
            position: 'absolute', top: '80%', left: '8%',
            width: '84%', height: '6%',
            display: 'block', background: 'transparent', cursor: 'pointer', borderRadius: 40,
          }} aria-label="지금 리포트 신청하기" />
        </div>

        {/* ── 하단 고정 CTA ── */}
        <div style={{
          position: 'sticky', bottom: 0, width: '100%',
          background: 'rgba(4,10,18,0.96)',
          padding: '12px 20px',
          borderTop: '1px solid rgba(201,168,76,0.3)',
          zIndex: 100,
        }}>
          <Link href="/apply" style={{
            display: 'block', width: '100%', padding: '15px',
            background: 'linear-gradient(135deg, #c9a84c, #8a6d2a)',
            color: '#041018', fontWeight: 700, fontSize: 16,
            letterSpacing: 2, textAlign: 'center',
            borderRadius: 8, textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(201,168,76,0.45)',
            fontFamily: 'sans-serif',
          }}>
            지금 리포트 신청하기 →
          </Link>
        </div>

      </div>
    </main>
  )
}
