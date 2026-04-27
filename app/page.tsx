// app/page.tsx — 월백당사주 상세 랜딩페이지 (조선 궁궐 스타일)
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main style={{ background: '#041018', color: '#f0e6d0', fontFamily: 'Georgia, serif', overflowX: 'hidden' }}>

      {/* ══ 히어로 ══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        background: 'linear-gradient(180deg, #041018 0%, #0b2235 45%, #0a1a2a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 24px 52px', textAlign: 'center', overflow: 'hidden',
      }}>
        {/* 별 */}
        {[{t:'14px',l:'18%'},{t:'28px',r:'20%'},{t:'8px',l:'60%'},{t:'50px',l:'35%'},{t:'20px',r:'40%'}].map((s,i)=>(
          <div key={i} style={{position:'absolute',top:s.t,left:(s as any).l,right:(s as any).r,width:i===4?'3px':'2px',height:i===4?'3px':'2px',borderRadius:'50%',background:'#fffde0',opacity:0.6+i*0.05}} />
        ))}

        {/* 달 */}
        <div style={{
          position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
          width: 68, height: 68, borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, #fffadd, #e8c85a 55%, #b07e20)',
          boxShadow: '0 0 28px rgba(220,180,60,0.38), 0 0 70px rgba(220,180,60,0.12)',
        }} />

        {/* 지붕 SVG */}
        <div style={{ position: 'absolute', top: 84, left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: 420 }}>
          <svg viewBox="0 0 420 60" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
            <path d="M0 57 Q55 24 95 16 Q210 0 325 16 Q365 24 420 57 Z" fill="#0c3050" stroke="#c9a84c" strokeWidth="1"/>
            <path d="M65 42 Q210 10 355 42" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.55"/>
            <path d="M40 53 Q210 20 380 53" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.35"/>
            <circle cx="20" cy="52" r="5" fill="#c9a84c" opacity="0.65"/>
            <circle cx="400" cy="52" r="5" fill="#c9a84c" opacity="0.65"/>
            <path d="M207 3 L210 -1 L213 3" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
            <circle cx="210" cy="1" r="2.5" fill="#c9a84c"/>
          </svg>
        </div>

        {/* 기둥 */}
        {[{side:'left',pos:'calc(50% - 130px)'},{side:'right',pos:'calc(50% - 130px)'}].map((col,i)=>(
          <div key={i} style={{
            position: 'absolute', top: 138, [col.side]: col.pos,
            width: 8, height: 220,
            background: 'linear-gradient(90deg, #0b2e4e, #174870, #0b2e4e)',
            border: '0.5px solid rgba(201,168,76,0.25)',
          }} />
        ))}

        {/* 구름 */}
        <svg style={{ position: 'absolute', top: 152, left: 6, opacity: 0.42 }} width="80" height="42" viewBox="0 0 80 42">
          <ellipse cx="28" cy="30" rx="26" ry="12" fill="#1a5a70"/>
          <ellipse cx="50" cy="26" rx="22" ry="10" fill="#1a5a70"/>
          <ellipse cx="18" cy="26" rx="14" ry="8" fill="#c9a84c" opacity="0.12"/>
        </svg>
        <svg style={{ position: 'absolute', top: 146, right: 6, opacity: 0.42, transform: 'scaleX(-1)' }} width="80" height="42" viewBox="0 0 80 42">
          <ellipse cx="28" cy="30" rx="26" ry="12" fill="#1a5a70"/>
          <ellipse cx="50" cy="26" rx="22" ry="10" fill="#1a5a70"/>
          <ellipse cx="18" cy="26" rx="14" ry="8" fill="#c9a84c" opacity="0.12"/>
        </svg>

        {/* 물결 하단 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, opacity: 0.32 }}>
          <svg viewBox="0 0 420 70" style={{ width: '100%', height: '100%' }}>
            <path d="M0 36 Q52 14 105 36 Q157 58 210 36 Q262 14 315 36 Q367 58 420 36 L420 70 L0 70 Z" fill="#0d4a70"/>
            <path d="M0 50 Q52 28 105 50 Q157 68 210 50 Q262 28 315 50 Q367 68 420 50 L420 70 L0 70 Z" fill="#0a3550" opacity="0.8"/>
          </svg>
        </div>

        {/* 로고 원형 */}
        <div style={{
          width: 148, height: 148, borderRadius: '50%',
          border: '2px solid rgba(201,168,76,0.55)',
          background: 'radial-gradient(circle, #0d2a42, #061624)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 26, position: 'relative', zIndex: 2,
          boxShadow: '0 0 32px rgba(201,168,76,0.2), 0 0 70px rgba(13,42,69,0.9)',
          overflow: 'hidden',
        }}>
          <Image src="/logo.png" alt="월백당사주" width={148} height={148} style={{ objectFit: 'cover', borderRadius: '50%' }} />
        </div>

        <p style={{ fontSize: 11, letterSpacing: 6, color: '#c9a84c', marginBottom: 14, position: 'relative', zIndex: 2 }}>
          正 統 四 柱 命 理
        </p>
        <h1 style={{ fontSize: 'clamp(26px,7vw,52px)', fontWeight: 700, lineHeight: 1.35, marginBottom: 16, position: 'relative', zIndex: 2, textShadow: '0 2px 24px rgba(0,0,0,0.9)' }}>
          당신의 사주,<br />
          <span style={{ color: '#c9a84c' }}>깊이 있게</span> 풀어드립니다
        </h1>
        <div style={{ width: 48, height: 1, background: '#c9a84c', margin: '0 auto 18px', opacity: 0.55, position: 'relative', zIndex: 2 }} />
        <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(240,220,180,0.58)', marginBottom: 32, position: 'relative', zIndex: 2 }}>
          정통 명리학 기반 직접 풀이<br />
          타고난 기운과 삶의 흐름을 분석합니다
        </p>

        {/* 통계 뱃지 */}
        <div style={{
          display: 'flex', border: '1px solid rgba(201,168,76,0.28)', borderRadius: 10,
          overflow: 'hidden', background: 'rgba(4,12,20,0.7)',
          marginBottom: 28, position: 'relative', zIndex: 2,
        }}>
          {[{l:'분량',v:'50~100p'},{l:'방식',v:'직접풀이'},{l:'문의',v:'30일'},{l:'상품',v:'4가지'}].map((s,i)=>(
            <div key={i} style={{ flex:1, padding:'12px 10px', borderRight: i<3?'1px solid rgba(201,168,76,0.18)':'none', textAlign:'center' }}>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.58)', marginBottom:4, fontFamily:'sans-serif' }}>{s.l}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#c9a84c' }}>{s.v}</div>
            </div>
          ))}
        </div>

        <Link href="/apply" style={{
          display: 'inline-block', padding: '17px 46px',
          background: 'linear-gradient(135deg, #c9a84c, #8a6d2a)',
          color: '#041018', fontWeight: 700, fontSize: 15, letterSpacing: 2,
          borderRadius: 4, textDecoration: 'none', position: 'relative', zIndex: 2,
          boxShadow: '0 8px 32px rgba(201,168,76,0.38)', fontFamily: 'sans-serif',
        }}>
          사주 신청하기
        </Link>
        <p style={{ fontSize: 11, color: 'rgba(240,220,180,0.3)', marginTop: 13, position: 'relative', zIndex: 2, fontFamily: 'sans-serif' }}>
          입금 확인 후 순서대로 분석이 시작됩니다
        </p>
      </section>

      {/* ══ 공감 ══════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: 'linear-gradient(180deg,#041018,#0d2035)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: '#c9a84c', marginBottom: 14, fontFamily: 'sans-serif' }}>EMPATHY</p>
        <h2 style={{ fontSize: 'clamp(22px,5vw,34px)', fontWeight: 700, marginBottom: 6 }}>지금 이 마음,</h2>
        <h2 style={{ fontSize: 'clamp(22px,5vw,34px)', fontWeight: 700, color: '#c9a84c', marginBottom: 36 }}>잘 알고 있어요</h2>
        <div style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['💼','직업·이직'],['💰','재물운'],['💕','연애·결혼'],['🔮','미래 불안'],['❤️','건강운'],['🌊','인생 흐름']].map(([icon,text],i)=>(
            <div key={i} style={{ padding:'14px', borderRadius:10, background:'rgba(13,42,69,0.5)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <span style={{ fontSize:13, color:'rgba(240,220,180,0.8)' }}>| {text} |</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 목차 ══════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: '#041018', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: '#c9a84c', marginBottom: 14, fontFamily: 'sans-serif' }}>CONTENTS</p>
        <h2 style={{ fontSize: 'clamp(22px,5vw,34px)', fontWeight: 700, marginBottom: 8 }}>리포트에 담기는 것들</h2>
        <p style={{ fontSize: 13, color: 'rgba(201,168,76,0.55)', marginBottom: 32, fontFamily: 'sans-serif' }}>50~100페이지 · 필요한 내용만, 깊게</p>
        <div style={{ maxWidth: 480, margin: '0 auto', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 12, overflow: 'hidden', textAlign: 'left' }}>
          {[['1장','당신은 이런 사람입니다','本性'],['2장','타고난 강점과 약점','強弱'],['3장','자주 반복되는 인생 장면','反復場面'],['4장','사람과 사람 사이 — 관계·연애','人緣'],['5장','일과 성취 — 직업·적성','事業'],['6장','돈의 흐름 — 재물 체질','財運'],['7장','건강과 체질 — 몸의 지도','體質'],['8장','앞으로의 흐름 — 대운·연운','運流'],['9장','당신께 드리는 마지막 한 마디','結語']].map(([n,t,s],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 18px', background: i%2===0?'rgba(13,42,69,0.5)':'transparent', borderBottom: i<8?'1px solid rgba(201,168,76,0.1)':'none' }}>
              <span style={{ fontSize:13 }}>
                <span style={{ color:'#c9a84c', fontWeight:700, marginRight:12 }}>{n}</span>{t}
              </span>
              <span style={{ fontSize:10, color:'rgba(201,168,76,0.4)', fontStyle:'italic', flexShrink:0, marginLeft:8 }}>{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 차별점 ════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: '#0d2035', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: '#c9a84c', marginBottom: 14, fontFamily: 'sans-serif' }}>DIFFERENCE</p>
        <h2 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 700, marginBottom: 36, lineHeight: 1.45 }}>
          단순한 정보가 아니라<br />
          <span style={{ color: '#c9a84c' }}>당신만의 이야기</span>를 씁니다
        </h2>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div style={{ padding:'22px 16px', borderRadius:'12px 0 0 12px', background:'rgba(4,12,20,0.85)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize:11, color:'rgba(240,220,180,0.28)', marginBottom:16, fontFamily:'sans-serif', letterSpacing:1 }}>AI / 일반 사주앱</p>
            {['동일 생년월일 → 동일 결과','학습된 패턴 조합','시주 미반영','단편적 해석','대운·연운 없음'].map((t,i)=>(
              <p key={i} style={{ fontSize:12, color:'rgba(240,220,180,0.38)', padding:'6px 0', borderBottom:i<4?'1px solid rgba(255,255,255,0.04)':'none' }}>{t}</p>
            ))}
          </div>
          <div style={{ padding:'22px 16px', borderRadius:'0 12px 12px 0', background:'rgba(13,42,69,0.9)', border:'1px solid rgba(201,168,76,0.35)' }}>
            <p style={{ fontSize:11, color:'#c9a84c', marginBottom:16, fontWeight:700, fontFamily:'sans-serif', letterSpacing:1 }}>월백당사주</p>
            {['고유 원국 분석','명리학 직접 풀이','시주까지 반영','전체 흐름 연계','대운+연운 포함'].map((t,i)=>(
              <p key={i} style={{ fontSize:12, color:'#f0e6d0', padding:'6px 0', borderBottom:i<4?'1px solid rgba(201,168,76,0.1)':'none' }}>✦ {t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 상품/가격 ══════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', background: '#041018', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: '#c9a84c', marginBottom: 14, fontFamily: 'sans-serif' }}>PRODUCTS</p>
        <h2 style={{ fontSize: 'clamp(22px,5vw,34px)', fontWeight: 700, marginBottom: 36 }}>상품 선택</h2>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n:'정통사주', d:'사주팔자 전체 종합 분석', p:'100,000원', hot:true },
            { n:'연애·결혼', d:'인연과 결혼운 집중 분석', p:'80,000원', hot:false },
            { n:'재물·사업', d:'재물운과 직업 적성 분석', p:'80,000원', hot:false },
            { n:'궁합',     d:'두 사람의 인연과 조화 분석', p:'120,000원', hot:false },
          ].map((prod,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderRadius:12, background: prod.hot?'rgba(13,42,69,0.85)':'rgba(13,42,69,0.35)', border: prod.hot?'1px solid rgba(201,168,76,0.45)':'1px solid rgba(201,168,76,0.15)' }}>
              <div style={{ textAlign:'left' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:16, fontWeight:700 }}>{prod.n}</span>
                  {prod.hot && <span style={{ fontSize:10, background:'#c9a84c', color:'#041018', padding:'2px 8px', borderRadius:20, fontWeight:700, fontFamily:'sans-serif' }}>인기</span>}
                </div>
                <span style={{ fontSize:12, color:'rgba(240,220,180,0.48)', fontFamily:'sans-serif' }}>{prod.d}</span>
              </div>
              <span style={{ fontSize:17, fontWeight:700, color:'#c9a84c', whiteSpace:'nowrap' }}>{prod.p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 최종 CTA ══════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px 96px', background: 'linear-gradient(180deg,#041018,#020c14)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, opacity:0.28 }}>
          <svg viewBox="0 0 420 80" style={{ width:'100%', height:'100%' }}>
            <path d="M0 40 Q52 16 105 40 Q157 64 210 40 Q262 16 315 40 Q367 64 420 40 L420 80 L0 80 Z" fill="#0d4a70"/>
          </svg>
        </div>
        <div style={{ width:92, height:92, borderRadius:'50%', border:'2px solid rgba(201,168,76,0.5)', background:'radial-gradient(circle,#0d2a42,#061624)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 0 24px rgba(201,168,76,0.18)', overflow:'hidden', position:'relative', zIndex:2 }}>
          <Image src="/logo.png" alt="월백당사주" width={92} height={92} style={{ objectFit:'cover', borderRadius:'50%' }} />
        </div>
        <h2 style={{ fontSize:'clamp(22px,5vw,36px)', fontWeight:700, lineHeight:1.4, marginBottom:14, position:'relative', zIndex:2 }}>
          지금, 당신의 사주를<br />
          <span style={{ color:'#c9a84c' }}>펼쳐보세요</span>
        </h2>
        <p style={{ fontSize:14, color:'rgba(240,220,180,0.52)', lineHeight:1.85, marginBottom:36, position:'relative', zIndex:2, fontFamily:'sans-serif' }}>
          입금 확인 후 순서대로 분석을 시작합니다<br />
          완성된 리포트는 이메일로 발송됩니다
        </p>
        <Link href="/apply" style={{ display:'inline-block', padding:'18px 52px', background:'linear-gradient(135deg,#c9a84c,#8a6d2a)', color:'#041018', fontWeight:700, fontSize:16, letterSpacing:2, borderRadius:4, textDecoration:'none', boxShadow:'0 8px 36px rgba(201,168,76,0.42)', position:'relative', zIndex:2, fontFamily:'sans-serif' }}>
          사주 신청하기
        </Link>
        <p style={{ fontSize:11, color:'rgba(240,220,180,0.22)', marginTop:22, position:'relative', zIndex:2 }}>月白堂 · 사주풀이</p>
      </section>

    </main>
  )
}
