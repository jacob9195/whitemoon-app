import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-noto-sans-kr)', 'sans-serif'],
        serif: ['var(--font-noto-serif-kr)', 'serif'],
      },
      colors: {
        // 디자인 시스템 색상 — CSS 변수와 연동
        saju: {
          base:    '#0f0d0b',
          surface: '#1a1612',
          card:    '#211c17',
          elevated:'#2a231c',
          gold:    '#b8924a',
          bronze:  '#8a6d35',
          text:    '#f5f0e8',
          sub:     '#9e9080',
          muted:   '#6b6055',
        },
      },
      borderColor: {
        gold:  'rgba(180,140,80,0.20)',
        'gold-md': 'rgba(180,140,80,0.35)',
      },
    },
  },
  plugins: [],
}

export default config
