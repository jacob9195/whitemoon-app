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

        {/* ── 섹션 6 ── */}
        <div style={{ lineHeight: 0 }}>
          <img src="/section6.png" alt="이런 분들께 추천합니다" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

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
