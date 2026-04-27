'use client'
// app/apply/page.tsx — 사주 신청 폼 (고객 정보 입력)

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ── 상수 ──────────────────────────────────────────────────
const PRODUCTS = ['정통사주', '연애결혼', '재물사업', '궁합'] as const
type Product = typeof PRODUCTS[number]

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

// ── 서브컴포넌트: 한 사람 입력 블록 ──────────────────────

interface PersonFields {
  name:       string
  gender:     '남성' | '여성' | ''
  calType:    '양력' | '음력' | ''
  birthYear:  string
  birthMonth: string
  birthDay:   string
  birthHour:  string
  birthPlace: string
}

function emptyPerson(): PersonFields {
  return { name: '', gender: '', calType: '양력', birthYear: '', birthMonth: '', birthDay: '', birthHour: '', birthPlace: '' }
}

interface PersonBlockProps {
  title:    string
  value:    PersonFields
  onChange: (v: PersonFields) => void
}

function PersonBlock({ title, value: v, onChange }: PersonBlockProps) {
  const set = (k: keyof PersonFields, val: string) => onChange({ ...v, [k]: val })

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
    >
      <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--text-gold)' }}>
        {title}
      </p>

      {/* 이름 */}
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          이름 <span style={{ color: 'var(--text-gold)' }}>*</span>
        </label>
        <input
          value={v.name}
          onChange={e => set('name', e.target.value)}
          placeholder="홍길동"
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{
            background: 'var(--bg-base)',
            border:     '1px solid var(--border-gold)',
            color:      'var(--text-primary)',
          }}
        />
      </div>

      {/* 성별 */}
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          성별 <span style={{ color: 'var(--text-gold)' }}>*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['남성', '여성'] as const).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set('gender', g)}
              className="py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: v.gender === g ? 'var(--accent-bronze)' : 'var(--bg-base)',
                border:     `1px solid ${v.gender === g ? 'var(--accent-gold)' : 'var(--border-gold)'}`,
                color:      v.gender === g ? '#fff' : 'var(--text-secondary)',
                fontWeight: v.gender === g ? 600 : 400,
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 양음력 */}
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          양력 / 음력 <span style={{ color: 'var(--text-gold)' }}>*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['양력', '음력'] as const).map(c => (
            <button
              key={c}
              type="button"
              onClick={() => set('calType', c)}
              className="py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: v.calType === c ? 'var(--accent-bronze)' : 'var(--bg-base)',
                border:     `1px solid ${v.calType === c ? 'var(--accent-gold)' : 'var(--border-gold)'}`,
                color:      v.calType === c ? '#fff' : 'var(--text-secondary)',
                fontWeight: v.calType === c ? 600 : 400,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 생년월일 */}
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          생년월일 <span style={{ color: 'var(--text-gold)' }}>*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <input
            value={v.birthYear}
            onChange={e => set('birthYear', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="1989"
            maxLength={4}
            inputMode="numeric"
            className="rounded-lg px-3 py-2.5 text-sm text-center outline-none"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
          />
          <input
            value={v.birthMonth}
            onChange={e => set('birthMonth', e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="05"
            maxLength={2}
            inputMode="numeric"
            className="rounded-lg px-3 py-2.5 text-sm text-center outline-none"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
          />
          <input
            value={v.birthDay}
            onChange={e => set('birthDay', e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="29"
            maxLength={2}
            inputMode="numeric"
            className="rounded-lg px-3 py-2.5 text-sm text-center outline-none"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
          />
        </div>
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>년 · 월 · 일 순으로 입력</p>
      </div>

      {/* 출생 시각 */}
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          출생 시각 <span style={{ color: 'var(--text-muted)' }}>(모르면 빈칸)</span>
        </label>
        <select
          value={v.birthHour}
          onChange={e => set('birthHour', e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
        >
          {BIRTH_HOURS.map(h => (
            <option key={h.value} value={h.value}>{h.label}</option>
          ))}
        </select>
      </div>

      {/* 출생지 */}
      <div>
        <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          출생지 <span style={{ color: 'var(--text-muted)' }}>(모르면 빈칸)</span>
        </label>
        <select
          value={v.birthPlace}
          onChange={e => set('birthPlace', e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
        >
          <option value="">선택 안 함</option>
          {PLACES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── 메인 폼 ─────────────────────────────────────────────

function ApplyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const initProduct = (params.get('product') as Product | null) ?? '정통사주'

  const [product,  setProduct]  = useState<Product>(initProduct)
  const [person,   setPerson]   = useState<PersonFields>(emptyPerson())
  const [partner,  setPartner]  = useState<PersonFields>(emptyPerson())
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const isGungham = product === '궁합'

  // 폼 검증
  function validate(): string {
    if (!person.name.trim())        return '이름을 입력해주세요.'
    if (!person.gender)             return '성별을 선택해주세요.'
    if (!person.calType)            return '양력/음력을 선택해주세요.'
    if (!person.birthYear || !person.birthMonth || !person.birthDay) return '생년월일을 모두 입력해주세요.'
    if (isGungham) {
      if (!partner.name.trim())     return '파트너 이름을 입력해주세요.'
      if (!partner.gender)          return '파트너 성별을 선택해주세요.'
      if (!partner.birthYear || !partner.birthMonth || !partner.birthDay) return '파트너 생년월일을 모두 입력해주세요.'
    }
    if (!email.includes('@'))       return '올바른 이메일을 입력해주세요.'
    if (phone.replace(/\D/g,'').length < 10) return '전화번호를 올바르게 입력해주세요.'
    return ''
  }

  async function handleSubmit() {
    setError('')
    const msg = validate()
    if (msg) { setError(msg); return }
    setLoading(true)

    const makeDateStr = (p: PersonFields) =>
      `${p.birthYear}-${p.birthMonth.padStart(2,'0')}-${p.birthDay.padStart(2,'0')}`

    const makeHourStr = (p: PersonFields) => {
      if (!p.birthHour) return undefined
      return `${p.birthHour.padStart(2,'0')}:00`
    }

    const body = {
      product,
      email,
      phone: phone.replace(/[^0-9-]/g, ''),
      person: {
        name:       person.name.trim(),
        gender:     person.gender,
        calType:    person.calType,
        birthDate:  makeDateStr(person),
        birthTime:  makeHourStr(person),
        birthPlace: person.birthPlace || undefined,
      },
      ...(isGungham && {
        partner: {
          name:       partner.name.trim(),
          gender:     partner.gender,
          calType:    partner.calType || '양력',
          birthDate:  makeDateStr(partner),
          birthTime:  makeHourStr(partner),
          birthPlace: partner.birthPlace || undefined,
        },
      }),
    }

    try {
      const res  = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.message); setLoading(false); return }
      // 성공 → 계좌 안내 페이지
      router.push(`/confirm?product=${encodeURIComponent(product)}&name=${encodeURIComponent(person.name)}`)
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen px-4 py-10 pb-32"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <p className="label-overline mb-2">월백당사주</p>
          <h1 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            사주 신청
          </h1>
        </div>

        {/* 상품 선택 */}
        <div className="mb-6">
          <p className="text-xs mb-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>
            상품 선택 <span style={{ color: 'var(--text-gold)' }}>*</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCTS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setProduct(p)}
                className="py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: product === p ? 'var(--accent-bronze)' : 'var(--bg-card)',
                  border:     `1px solid ${product === p ? 'var(--accent-gold)' : 'var(--border-gold)'}`,
                  color:      product === p ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 본인 정보 */}
        <div className="mb-4">
          <PersonBlock
            title={isGungham ? '본인 정보' : '출생 정보'}
            value={person}
            onChange={setPerson}
          />
        </div>

        {/* 파트너 정보 (궁합) */}
        {isGungham && (
          <div className="mb-4">
            <PersonBlock
              title="파트너 정보"
              value={partner}
              onChange={setPartner}
            />
          </div>
        )}

        {/* 연락처 */}
        <div
          className="rounded-2xl p-5 mb-6 space-y-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
        >
          <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--text-gold)' }}>
            연락처
          </p>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              이메일 <span style={{ color: 'var(--text-gold)' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
            />
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              사주 결과 전달용 이메일
            </p>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              전화번호 <span style={{ color: 'var(--text-gold)' }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* 에러 */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-4 text-sm"
            style={{ background: 'rgba(180,50,50,0.15)', border: '1px solid rgba(180,50,50,0.3)', color: '#f4a0a0' }}
          >
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full py-4 text-sm font-semibold tracking-widest disabled:opacity-50"
        >
          {loading ? '접수 중...' : '신청 완료하기'}
        </button>

        <p className="text-[11px] text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          입력 정보는 사주 풀이 목적으로만 사용됩니다
        </p>
      </div>
    </main>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--text-muted)' }}>불러오는 중...</p>
      </div>
    }>
      <ApplyForm />
    </Suspense>
  )
}
