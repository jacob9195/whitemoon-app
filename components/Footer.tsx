// components/Footer.tsx — 사이트 공통 하단 정보 표기

// ── 회사 정보 (수정이 필요하면 이 객체만 바꾸면 됨) ──────────
const COMPANY = {
  name:        '플랜제이스튜디오',
  ceo:         '허성준',
  bizNumber:   '701-06-02632',
  mailOrder:   '2024-고양덕양구-2366',
  address:     '경기도 고양시 덕양구 향기로 70, 102호',
  tel:         '070-4544-7648',
  email:       'whitemoondang@naver.com',
  hosting:     'Vercel Inc.',
} as const

// ── 색상 (apply 페이지와 동일 팔레트) ──────────────────────
const C = {
  bg:        '#061020',
  border:    'rgba(201,168,76,0.2)',
  gold:      '#c9a84c',
  text:      'rgba(240,230,208,0.75)',
  textMuted: 'rgba(240,230,208,0.5)',
  textDim:   'rgba(240,230,208,0.35)',
}

export default function Footer() {
  return (
    <footer style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      padding: '32px 20px 28px',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* 브랜드 라벨 */}
        <div style={{ marginBottom: 18 }}>
          <p style={{
            fontSize: 11, letterSpacing: 5, color: C.gold,
            margin: 0, marginBottom: 4,
          }}>
            月 白 堂
          </p>
          <p style={{
            fontSize: 12, color: C.textMuted, margin: 0,
          }}>
            진심을 담은 사주풀이
          </p>
        </div>

        {/* 구분선 */}
        <div style={{
          height: 1, background: C.border, marginBottom: 18,
        }} />

        {/* 사업자 정보 */}
        <dl style={{
          margin: 0, padding: 0,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 12, rowGap: 6,
          fontSize: 11, lineHeight: 1.6,
        }}>
          <dt style={{ color: C.textDim }}>상호</dt>
          <dd style={{ color: C.text, margin: 0 }}>{COMPANY.name}</dd>

          <dt style={{ color: C.textDim }}>대표자</dt>
          <dd style={{ color: C.text, margin: 0 }}>{COMPANY.ceo}</dd>

          <dt style={{ color: C.textDim }}>사업자등록번호</dt>
          <dd style={{ color: C.text, margin: 0 }}>{COMPANY.bizNumber}</dd>

          <dt style={{ color: C.textDim }}>통신판매업신고</dt>
          <dd style={{ color: C.text, margin: 0 }}>{COMPANY.mailOrder}</dd>

          <dt style={{ color: C.textDim }}>주소</dt>
          <dd style={{ color: C.text, margin: 0 }}>{COMPANY.address}</dd>

          <dt style={{ color: C.textDim }}>고객센터</dt>
          <dd style={{ color: C.text, margin: 0 }}>
            <a href={`tel:${COMPANY.tel.replace(/-/g, '')}`}
               style={{ color: C.text, textDecoration: 'none' }}>
              {COMPANY.tel}
            </a>
          </dd>

          <dt style={{ color: C.textDim }}>이메일</dt>
          <dd style={{ color: C.text, margin: 0 }}>
            <a href={`mailto:${COMPANY.email}`}
               style={{ color: C.text, textDecoration: 'none' }}>
              {COMPANY.email}
            </a>
          </dd>

          <dt style={{ color: C.textDim }}>호스팅</dt>
          <dd style={{ color: C.text, margin: 0 }}>{COMPANY.hosting}</dd>
        </dl>

        {/* 안내 문구 */}
        <p style={{
          fontSize: 10, color: C.textDim, lineHeight: 1.7,
          marginTop: 18, marginBottom: 0,
        }}>
          본 서비스에서 제공되는 사주 풀이는 전통 명리학에 기반한 참고 자료이며,
          개인의 미래를 단정하지 않습니다. 입력하신 개인정보는 사주 분석 및
          결과 전달 목적으로만 사용됩니다.
        </p>

        {/* 카피라이트 */}
        <p style={{
          fontSize: 10, color: C.textDim, textAlign: 'center',
          marginTop: 18, marginBottom: 0,
          letterSpacing: 0.5,
        }}>
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
