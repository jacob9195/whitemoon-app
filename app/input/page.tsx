'use client'
// =====================================================
// app/input/page.tsx — 입력 화면 (다크 럭셔리 테마)
// =====================================================

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateBirthForm } from '@/lib/utils/validate'

type CalendarType = 'solar' | 'lunar'
type Gender = 'male' | 'female'

const BIRTH_HOURS = [
  { value: '23', label: '子時 (자시)  밤 11시 ~ 새벽 1시' },
  { value: '1',  label: '丑時 (축시)  새벽 1시 ~ 3시' },
  { value: '3',  label: '寅時 (인시)  새벽 3시 ~ 5시' },
  { value: '5',  label: '卯時 (묘시)  새벽 5시 ~ 7시' },
  { value: '7',  label: '辰時 (진시)  오전 7시 ~ 9시' },
  { value: '9',  label: '巳時 (사시)  오전 9시 ~ 11시' },
  { value: '11', label: '午時 (오시)  오전 11시 ~ 오후 1시' },
  { value: '13', label: '未時 (미시)  오후 1시 ~ 3시' },
  { value: '15', label: '申時 (신시)  오후 3시 ~ 5시' },
  { value: '17', label: '酉時 (유시)  오후 5시 ~ 7시' },
  { value: '19', label: '戌時 (술시)  오후 7시 ~ 9시' },
  { value: '21', label: '亥時 (해시)  오후 9시 ~ 11시' },
]

export default function InputPage() {
  const router = useRouter()

  const [calendar,    setCalendar]    = useState<CalendarType>('solar')
  const [year,        setYear]        = useState('')
  const [month,       setMonth]       = useState('')
  const [day,         setDay]         = useState('')
  const [hourUnknown, setHourUnknown] = useState(false)
  const [hour,        setHour]        = useState('')
  const [gender,      setGender]      = useState<Gender | null>(null)
  const [errors,      setErrors]      = useState<Record<string, string>>({})

  const yearRef   = useRef<HTMLInputElement>(null)
  const genderRef = useRef<HTMLDivElement>(null)

  function handleSubmit() {
    const found = validateBirthForm({ year, month, day, gender })
    setErrors(found)
    if (Object.keys(found).length > 0) {
      if (found.year || found.month || found.day || found.birth) {
        yearRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        yearRef.current?.focus()
      } else if (found.gender) {
        genderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    const params = new URLSearchParams({
      year, month, day, calendar,
      gender: gender!,
      hour: hourUnknown ? 'unknown' : (hour || 'unknown'),
    })
    router.push(`/result?${params.toString()}`)
  }

  function clearError(key: string) {
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  // ── 스타일 헬퍼 ──
  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-gold)',
    boxShadow: 'var(--shadow-card)',
  }

  const inputStyle = (hasErr?: string): React.CSSProperties => ({
    background: hasErr ? 'rgba(180,60,60,0.08)' : 'var(--bg-elevated)',
    border: `1px solid ${hasErr ? 'rgba(200,80,80,0.5)' : 'var(--border-gold)'}`,
    color: 'var(--text-primary)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    width: '100%',
    minHeight: '48px',
    outline: 'none',
    transition: 'border-color 0.2s',
  })

  const activeToggle: React.CSSProperties = {
    background: 'rgba(180,140,80,0.15)',
    border: '1px solid var(--border-gold-md)',
    color: 'var(--text-gold)',
  }
  const inactiveToggle: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 pt-8 pb-24"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm">

        {/* 헤더 */}
        <div className="mb-6">
          <Link href="/" className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ← 홈으로
          </Link>
        </div>
        <div className="text-center mb-8">
          <p className="label-overline mb-2">정보 입력</p>
          <h1 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            내 사주 입력하기
          </h1>
          <div className="divider-gold mx-auto w-20 mt-4" />
        </div>

        {/* 폼 카드 */}
        <div className="rounded-2xl p-6 space-y-7" style={cardStyle}>

          {/* 양력 / 음력 */}
          <div>
            <Label text="양력 / 음력" required />
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {(['solar', 'lunar'] as CalendarType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCalendar(t)}
                  className="py-3 rounded-xl text-sm font-medium transition-all min-h-[48px]"
                  style={calendar === t ? activeToggle : inactiveToggle}
                >
                  {t === 'solar' ? '양력' : '음력'}
                </button>
              ))}
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
              모르실 경우 양력을 선택해 주세요
            </p>
          </div>

          {/* 생년월일 */}
          <div>
            <Label text="생년월일" required />
            <div className="grid grid-cols-5 gap-2 mt-2.5">
              <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                placeholder="출생 연도"
                value={year}
                maxLength={4}
                onChange={e => { setYear(e.target.value.replace(/\D/g, '')); clearError('year') }}
                style={{ ...inputStyle(errors.year), gridColumn: 'span 3' }}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="월"
                value={month}
                maxLength={2}
                onChange={e => { setMonth(e.target.value.replace(/\D/g, '')); clearError('month') }}
                style={inputStyle(errors.month)}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="일"
                value={day}
                maxLength={2}
                onChange={e => { setDay(e.target.value.replace(/\D/g, '')); clearError('day') }}
                style={inputStyle(errors.day)}
              />
            </div>
            {errors.year  && <ErrMsg>{errors.year}</ErrMsg>}
            {errors.month && <ErrMsg>{errors.month}</ErrMsg>}
            {errors.day   && <ErrMsg>{errors.day}</ErrMsg>}
            {errors.birth && <ErrMsg>{errors.birth}</ErrMsg>}
          </div>

          {/* 출생 시간 */}
          <div>
            <Label text="출생 시간" subText="선택" />
            <div className="flex gap-2 mt-2.5">
              <select
                value={hour}
                onChange={e => setHour(e.target.value)}
                disabled={hourUnknown}
                style={{
                  ...inputStyle(),
                  flex: 1,
                  opacity: hourUnknown ? 0.4 : 1,
                  cursor: hourUnknown ? 'not-allowed' : 'pointer',
                }}
              >
                <option value="">시간 선택</option>
                {BIRTH_HOURS.map(h => (
                  <option key={h.value} value={h.value}
                    style={{ background: '#211c17', color: '#f5f0e8' }}>
                    {h.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => { setHourUnknown(v => !v); setHour('') }}
                className="min-w-[60px] px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={hourUnknown ? activeToggle : inactiveToggle}
              >
                모름
              </button>
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
              {hourUnknown
                ? '시주(時柱)는 미상으로 처리하고 나머지 결과를 분석해드려요'
                : '출생 시간을 알면 더 정밀한 분석이 가능해요'}
            </p>
          </div>

          {/* 성별 */}
          <div ref={genderRef}>
            <Label text="성별" required />
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {(['male', 'female'] as Gender[]).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => { setGender(g); clearError('gender') }}
                  className="py-3 rounded-xl text-sm font-medium transition-all min-h-[48px]"
                  style={gender === g ? activeToggle : inactiveToggle}
                >
                  {g === 'male' ? '남성' : '여성'}
                </button>
              ))}
            </div>
            {errors.gender && <ErrMsg>{errors.gender}</ErrMsg>}
          </div>

          {/* 제출 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary w-full py-4 text-sm font-semibold tracking-widest"
          >
            사주 분석 시작하기
          </button>
        </div>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          입력하신 정보는 저장되지 않아요
        </p>
      </div>
    </main>
  )
}

// ── 소형 컴포넌트 ─────────────────────────────────────

function Label({ text, required, subText }: {
  text: string; required?: boolean; subText?: string
}) {
  return (
    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-gold)' }}>
      {text}
      {required && <span style={{ color: '#e06060', marginLeft: '2px' }}>*</span>}
      {subText && (
        <span className="ml-1 font-normal normal-case tracking-normal" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          ({subText})
        </span>
      )}
    </p>
  )
}

function ErrMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: '#e08080' }}>
      <span>⚠</span> {children}
    </p>
  )
}
