// =====================================================
// app/layout.tsx — 다크 테마 레이아웃
// =====================================================

import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '월백당사주',
  description: '정통 명리학 기반의 깊이 있는 사주 풀이 — 당신의 운명을 구조적으로 해석합니다',
  keywords: ['월백당사주', '사주', '사주팔자', '정통사주', '명리학', '운세', '사주 리포트'],
  openGraph: {
    title: '월백당사주',
    description: '정통 명리학 기반의 깊이 있는 사주 풀이 — 당신의 운명을 구조적으로 해석합니다',
    locale: 'ko_KR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${notoSerifKR.variable} font-sans min-h-screen`}
        style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
      >
        {children}
      </body>
    </html>
  )
}
