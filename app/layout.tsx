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
  title: '오늘의 사주',
  description: '생년월일을 입력하면 나만의 사주팔자와 성향을 깊이 있게 풀어드려요',
  keywords: ['사주', '사주팔자', '오행', '운세', '무료 사주', '프리미엄 사주 리포트'],
  openGraph: {
    title: '오늘의 사주',
    description: '생년월일만 입력하면 나만의 사주를 깊이 분석해드려요',
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
