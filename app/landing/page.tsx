// =====================================================
// app/landing/page.tsx
//
// 인스타그램/인포크 프로필 링크용 랜딩 페이지예요.
// URL: https://여러분도메인.vercel.app/landing
//
// 이 URL을 인스타그램 프로필 또는 인포크에 등록하세요.
// =====================================================

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '오늘의 사주 — 무료 사주 풀이',
  description: '생년월일만 입력하면 나만의 사주팔자를 무료로 풀어드려요. 회원가입 불필요.',
  openGraph: {
    title: '오늘의 사주 — 무료 사주 풀이',
    description: '생년월일만 입력하면 나만의 사주팔자를 무료로 풀어드려요.',
    locale: 'ko_KR',
    type: 'website',
  },
}

const LINKS = [
  {
    href: '/input',
    emoji: '🎴',
    label: '무료 사주 보기',
    desc: '생년월일 입력 → 바로 결과 확인',
    primary: true,
  },
  {
    href: '/premium',
    emoji: '✨',
    label: '프리미엄 리포트',
    desc: '더 자세한 분석 · 2,900원~',
    primary: false,
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-16 bg-stone-50">
      <div className="w-full max-w-xs">

        {/* 프로필 영역 */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-300">
            <span className="text-4xl">☯️</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-800">오늘의 사주</h1>
          <p className="text-stone-500 text-sm mt-2 leading-relaxed">
            쉬운 한국어로 풀어드리는<br />무료 사주 풀이 서비스
          </p>
        </div>

        {/* 링크 목록 */}
        <div className="space-y-3">
          {LINKS.map(({ href, emoji, label, desc, primary }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-medium transition-all active:scale-[0.98] ${
                primary
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-sm'
              }`}
            >
              <span className="text-2xl shrink-0">{emoji}</span>
              <div className="text-left">
                <p className={`font-bold text-sm ${primary ? 'text-white' : 'text-stone-800'}`}>
                  {label}
                </p>
                <p className={`text-xs mt-0.5 ${primary ? 'text-amber-100' : 'text-stone-400'}`}>
                  {desc}
                </p>
              </div>
              <span className={`ml-auto text-lg ${primary ? 'text-amber-200' : 'text-stone-300'}`}>
                →
              </span>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-stone-400 mt-8">
          회원가입 불필요 · 개인정보 저장 없음
        </p>
      </div>
    </main>
  )
}
