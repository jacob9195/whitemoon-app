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

        {/* ── 섹션 5 제거됨 (페이지 길이 단축) ── */}

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

        {/* ── 섹션 6-2: 고객 후기 (코드 구현) ── */}
        <section style={{
          background: 'linear-gradient(180deg, #061020 0%, #041018 100%)',
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
              REAL REVIEWS
            </p>
            <h2 style={{
              fontSize: 22, fontWeight: 700, color: '#f0e6d0',
              margin: 0, marginBottom: 10,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.4,
            }}>
              월백당을 만난 분들의<br />이야기
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
              실제 사주 풀이를 받아보신 분들이<br />
              직접 남겨주신 후기입니다
            </p>
          </div>

          {/* 후기 카드 5장 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                name: '박**',
                age: '29세',
                content: '올해 이직 고민 때문에 상담받았는데 흐름을 너무 정확하게 짚어주셔서 놀랐어요. 말씀해주신 시기 지나고 바로 좋은 기회 들어왔습니다.',
              },
              {
                name: '김**',
                age: '35세',
                content: '재물운 상담 받았는데 현재 막혀있는 이유를 사주적으로 자세히 설명해주셔서 이해가 됐습니다. 조언대로 움직이니 금전 흐름이 훨씬 안정됐어요.',
              },
              {
                name: '이**',
                age: '27세',
                content: '연애운 상담인데 단순한 이야기보다 상대 성향이랑 관계 흐름을 디테일하게 봐주셔서 신뢰가 갔어요. 답답했던 마음이 많이 정리됐습니다.',
              },
              {
                name: '최**',
                age: '41세',
                content: '사업 방향 때문에 고민이 많았는데 제 사주에 맞는 타이밍과 사람운을 현실적으로 설명해주셔서 도움 많이 받았습니다. 상담 퀄리티가 정말 높았어요.',
              },
              {
                name: '정**',
                age: '33세',
                content: '사주를 여러 번 봤지만 이렇게 차분하고 깊게 풀이해주는 곳은 처음이었습니다. 좋은 말만 하는 게 아니라 조심해야 할 부분까지 정확하게 알려주셔서 더 믿음이 갔어요.',
              },
            ].map((review, idx) => (
              <div key={idx} style={{
                background: '#0d1e38',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 12,
                padding: '20px 18px 18px',
                position: 'relative',
              }}>
                {/* 큰 인용 부호 */}
                <div style={{
                  position: 'absolute',
                  top: 8, left: 14,
                  fontSize: 36,
                  color: 'rgba(201,168,76,0.3)',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1,
                }}>
                  &ldquo;
                </div>

                {/* 후기 본문 */}
                <p style={{
                  fontSize: 13.5,
                  color: 'rgba(240,230,208,0.85)',
                  lineHeight: 1.75,
                  margin: '0 0 14px',
                  paddingLeft: 14,
                  paddingTop: 4,
                }}>
                  {review.content}
                </p>

                {/* 구분선 */}
                <div style={{
                  width: 24, height: 1,
                  background: '#c9a84c',
                  opacity: 0.5,
                  marginLeft: 14,
                  marginBottom: 10,
                }} />

                {/* 작성자 */}
                <p style={{
                  fontSize: 12,
                  color: '#c9a84c',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  margin: 0,
                  paddingLeft: 14,
                }}>
                  {review.name} <span style={{ color: 'rgba(240,230,208,0.4)', fontWeight: 400 }}>· {review.age}</span>
                </p>
              </div>
            ))}
          </div>

          {/* 안내 문구 */}
          <p style={{
            fontSize: 10, color: 'rgba(240,230,208,0.35)',
            textAlign: 'center', marginTop: 22, marginBottom: 0,
            lineHeight: 1.6,
          }}>
            ※ 후기는 실제 고객분들이 작성하신 내용이며,<br />
            개인정보 보호를 위해 이름은 일부만 표기됩니다.
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
