'use client'
// app/apply/page.tsx — 사주 신청 폼 (섹션 이미지 스타일)

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PRODUCTS = ['정통사주', '연애결혼', '재물사업', '궁합'] as const
type Product = typeof PRODUCTS[number]

const PRODUCT_PRICES: Record<Product, string> = {
  '정통사주': '24,900원',
  '연애결혼':  '12,900원',
  '재물사업':  '12,900원',
  '궁합':     '15,900원',
}

const PRODUCT_LABELS: Record<Product, string> = {
  '정통사주': '정통사주',
  '연애결혼': '연애와 결혼운',
  '재물사업': '재물과 사업운',
  '궁합':     '궁합',
}

const PLACES = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

const BIRTH_HOURS = [
  { value: '',   label: '모름 / 미입력' },
  { value: '23', label: '子時 — 밤 11시 ~ 새벽 1시' },
  { value: '1',  label: '丑時 — 새벽 1시 ~ 3시' },
  { value: '3',  label: '寅時 — 새벽 3시 ~ 5시' },
  { value: '5',  label: '卯時 — 새벽 5시 ~ 7시' },
  { value: '7',  label: '辰時 — 오전 7시 ~ 9시' },
  { value: '9',  label: '巳時 — 오전 9시 ~ 11시' },
  { value: '11', label: '午時 — 오전 11시 ~ 오후 1시' },
  { value: '13', label: '未時 — 오후 1시 ~ 3시' },
  { value: '15', label: '申時 — 오후 3시 ~ 5시' },
  { value: '17', label: '酉時 — 오후 5시 ~ 7시' },
  { value: '19', label: '戌時 — 오후 7시 ~ 9시' },
  { value: '21', label: '亥時 — 오후 9시 ~ 11시' },
]

// ── 색상 / 스타일 상수 ────────────────────────────────────
const C = {
  bg:        '#0a1628',
  card:      '#0d1e38',
  cardInner: '#081424',
  gold:      '#c9a84c',
  goldDim:   'rgba(201,168,76,0.25)',
  goldBorder:'rgba(201,168,76,0.4)',
  text:      '#f0e6d0',
  textMuted: 'rgba(240,230,208,0.55)',
  textDim:   'rgba(240,230,208,0.35)',
  active:    'linear-gradient(135deg,#c9a84c,#8a6d2a)',
  error:     'rgba(180,60,60,0.18)',
  errorBorder:'rgba(200,80,80,0.35)',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontSize: 14,
  background: C.cardInner, border: `1px solid ${C.goldBorder}`,
  borderRadius: 10, color: C.text, outline: 'none',
  fontFamily: 'sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, marginBottom: 8,
  color: C.textMuted, fontFamily: 'sans-serif',
}

// ── 개인 정보 블록 ────────────────────────────────────────
interface PersonFields {
  name: string; gender: '남성'|'여성'|''; calType: '양력'|'음력'|''
  birthYear: string; birthMonth: string; birthDay: string
  birthHour: string; birthPlace: string
}
function emptyPerson(): PersonFields {
  return { name:'', gender:'', calType:'양력', birthYear:'', birthMonth:'', birthDay:'', birthHour:'', birthPlace:'' }
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      flex: 1, padding: '12px 8px', fontSize: 14, borderRadius: 10,
      background: active ? C.active : C.cardInner,
      border: `1px solid ${active ? C.gold : C.goldBorder}`,
      color: active ? '#041018' : C.textMuted,
      fontWeight: active ? 700 : 400, cursor: 'pointer',
      fontFamily: 'sans-serif', transition: 'all 0.15s',
    }}>{label}</button>
  )
}

function PersonBlock({ title, value: v, onChange }: { title: string; value: PersonFields; onChange: (v: PersonFields) => void }) {
  const set = (k: keyof PersonFields, val: string) => onChange({ ...v, [k]: val })

  return (
    <div style={{ background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: '20px 18px', marginBottom: 14 }}>
      {/* 섹션 제목 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 3, height: 18, background: C.gold, borderRadius: 2 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 2, fontFamily: 'sans-serif' }}>
          {title}
        </span>
      </div>

      {/* 이름 */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>이름 <span style={{ color: C.gold }}>*</span></label>
        <input value={v.name} onChange={e => set('name', e.target.value)}
          placeholder="홍길동" style={inputStyle} />
      </div>

      {/* 성별 */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>성별 <span style={{ color: C.gold }}>*</span></label>
        <div style={{ display: 'flex', gap: 8 }}>
          <ToggleBtn label="남성" active={v.gender==='남성'} onClick={() => set('gender','남성')} />
          <ToggleBtn label="여성" active={v.gender==='여성'} onClick={() => set('gender','여성')} />
        </div>
      </div>

      {/* 양음력 */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>양력 / 음력 <span style={{ color: C.gold }}>*</span></label>
        <div style={{ display: 'flex', gap: 8 }}>
          <ToggleBtn label="양력" active={v.calType==='양력'} onClick={() => set('calType','양력')} />
          <ToggleBtn label="음력" active={v.calType==='음력'} onClick={() => set('calType','음력')} />
        </div>
      </div>

      {/* 생년월일 */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>생년월일 <span style={{ color: C.gold }}>*</span></label>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
          {[
            { val: v.birthYear,  key:'birthYear',  ph:'1989', max:4 },
            { val: v.birthMonth, key:'birthMonth', ph:'05',   max:2 },
            { val: v.birthDay,   key:'birthDay',   ph:'29',   max:2 },
          ].map(f => (
            <input key={f.key} value={f.val}
              onChange={e => set(f.key as keyof PersonFields, e.target.value.replace(/\D/g,'').slice(0,f.max))}
              placeholder={f.ph} maxLength={f.max} inputMode="numeric"
              style={{ ...inputStyle, textAlign: 'center', padding: '12px 6px' }} />
          ))}
        </div>
        <p style={{ fontSize: 11, color: C.textDim, marginTop: 6, fontFamily:'sans-serif' }}>년 · 월 · 일 순으로 입력</p>
      </div>

      {/* 출생 시각 */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>
          출생 시각 <span style={{ color: C.textDim }}>(모르면 빈칸)</span>
        </label>
        <select value={v.birthHour} onChange={e => set('birthHour', e.target.value)}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
          {BIRTH_HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
        </select>
      </div>

      {/* 출생지 */}
      <div>
        <label style={labelStyle}>
          출생지 <span style={{ color: C.textDim }}>(모르면 빈칸)</span>
        </label>
        <select value={v.birthPlace} onChange={e => set('birthPlace', e.target.value)}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
          <option value="">선택 안 함</option>
          {PLACES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── 메인 폼 ──────────────────────────────────────────────
function ApplyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const initProduct = (params.get('product') as Product | null) ?? '정통사주'

  const [product, setProduct] = useState<Product>(initProduct)
  const [person,  setPerson]  = useState<PersonFields>(emptyPerson())
  const [partner, setPartner] = useState<PersonFields>(emptyPerson())
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const isGungham = product === '궁합'

  function validate(): string {
    if (!person.name.trim())    return '이름을 입력해주세요.'
    if (!person.gender)         return '성별을 선택해주세요.'
    if (!person.birthYear || !person.birthMonth || !person.birthDay) return '생년월일을 모두 입력해주세요.'
    if (isGungham) {
      if (!partner.name.trim()) return '파트너 이름을 입력해주세요.'
      if (!partner.gender)      return '파트너 성별을 선택해주세요.'
      if (!partner.birthYear || !partner.birthMonth || !partner.birthDay) return '파트너 생년월일을 입력해주세요.'
    }
    if (!email.includes('@'))   return '올바른 이메일을 입력해주세요.'
    if (phone.replace(/\D/g,'').length < 10) return '전화번호를 올바르게 입력해주세요.'
    return ''
  }

  async function handleSubmit() {
    setError('')
    const msg = validate()
    if (msg) { setError(msg); return }
    setLoading(true)

    const mkDate = (p: PersonFields) => `${p.birthYear}-${p.birthMonth.padStart(2,'0')}-${p.birthDay.padStart(2,'0')}`
    const mkHour = (p: PersonFields) => p.birthHour ? `${p.birthHour.padStart(2,'0')}:00` : undefined

    const body = {
      product, email,
      phone: phone.replace(/[^0-9]/g, ''),
      person: { name: person.name.trim(), gender: person.gender, calType: person.calType, birthDate: mkDate(person), birthTime: mkHour(person), birthPlace: person.birthPlace || undefined },
      ...(isGungham && { partner: { name: partner.name.trim(), gender: partner.gender, calType: partner.calType||'양력', birthDate: mkDate(partner), birthTime: mkHour(partner), birthPlace: partner.birthPlace || undefined } }),
    }

    try {
      const res  = await fetch('/api/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      const data = await res.json()
      if (!data.ok) { setError(data.message); setLoading(false); return }
      router.push(`/confirm?product=${encodeURIComponent(product)}&name=${encodeURIComponent(person.name)}`)
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, paddingBottom: 60 }}>
      {/* 상단 헤더 */}
      <div style={{
        background: `linear-gradient(180deg, #061020 0%, ${C.bg} 100%)`,
        padding: '40px 20px 28px', textAlign: 'center',
        borderBottom: `1px solid ${C.goldDim}`,
        marginBottom: 24,
      }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: C.gold, marginBottom: 8, fontFamily:'sans-serif' }}>
          月 白 堂 사주
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: 'Georgia, serif' }}>
          사주 신청
        </h1>
        <div style={{ width: 40, height: 1, background: C.gold, margin: '12px auto 0', opacity: 0.6 }} />
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>

        {/* 상품 선택 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 3, height: 18, background: C.gold, borderRadius: 2 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 2, fontFamily:'sans-serif' }}>
              상품 선택
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PRODUCTS.map(p => (
              <button key={p} type="button" onClick={() => setProduct(p)} style={{
                padding: '14px 8px', borderRadius: 12,
                background: product===p ? C.active : C.card,
                border: `1px solid ${product===p ? C.gold : C.goldBorder}`,
                color: product===p ? '#041018' : C.textMuted,
                cursor: 'pointer', fontFamily:'sans-serif',
                boxShadow: product===p ? '0 4px 16px rgba(201,168,76,0.3)' : 'none',
                transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 14, fontWeight: product===p ? 700 : 400 }}>
                  {PRODUCT_LABELS[p]}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: product===p ? '#041018' : C.gold }}>
                  {PRODUCT_PRICES[p]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 본인 정보 */}
        <PersonBlock title={isGungham ? '본인 정보' : '출생 정보'} value={person} onChange={setPerson} />

        {/* 파트너 정보 (궁합) */}
        {isGungham && (
          <PersonBlock title="파트너 정보" value={partner} onChange={setPartner} />
        )}

        {/* 연락처 */}
        <div style={{ background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: '20px 18px', marginBottom: 20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <div style={{ width:3, height:18, background:C.gold, borderRadius:2 }} />
            <span style={{ fontSize:13, fontWeight:700, color:C.gold, letterSpacing:2, fontFamily:'sans-serif' }}>연락처</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>이메일 <span style={{ color:C.gold }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com" style={inputStyle} />
            <p style={{ fontSize:11, color:C.textDim, marginTop:6, fontFamily:'sans-serif' }}>
              사주 결과 전달용 이메일
            </p>
          </div>

          <div>
            <label style={labelStyle}>전화번호 <span style={{ color:C.gold }}>*</span></label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="01012345678" style={inputStyle} />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div style={{
            background: C.error, border: `1px solid ${C.errorBorder}`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 16,
            fontSize: 14, color: '#f4a0a0', fontFamily:'sans-serif',
          }}>
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '16px',
          background: loading ? 'rgba(201,168,76,0.4)' : C.active,
          border: 'none', borderRadius: 12,
          color: '#041018', fontWeight: 700, fontSize: 16,
          letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'sans-serif',
          boxShadow: '0 6px 24px rgba(201,168,76,0.4)',
          transition: 'all 0.15s',
        }}>
          {loading ? '접수 중...' : '신청 완료하기'}
        </button>

        <p style={{ textAlign:'center', fontSize:11, color:C.textDim, marginTop:14, fontFamily:'sans-serif' }}>
          입력 정보는 사주 풀이 목적으로만 사용됩니다
        </p>
      </div>
    </main>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a1628' }}>
        <p style={{ color:'rgba(240,230,208,0.4)', fontFamily:'sans-serif' }}>불러오는 중...</p>
      </div>
    }>
      <ApplyForm />
    </Suspense>
  )
}
