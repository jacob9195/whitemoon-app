// =====================================================
// playwright.config.ts
// Playwright(브라우저 자동화 테스트) 설정 파일이에요.
//
// 비개발자 설명:
//   이 파일은 "테스트를 어떤 브라우저로, 어떤 주소에서 실행할지"를
//   설정하는 곳이에요. 직접 수정할 일은 거의 없어요.
// =====================================================

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // 테스트 파일이 있는 폴더
  testDir: './tests/e2e',

  // 테스트 실패 시 최대 2번 재시도
  retries: process.env.CI ? 2 : 0,

  // 테스트를 동시에 실행 (빠른 실행을 위해)
  fullyParallel: true,

  // 리포터 — 결과를 보기 좋게 출력
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // 테스트할 앱 주소 (로컬 개발 서버)
    baseURL: 'http://localhost:3000',

    // 테스트 실패 시 스크린샷 자동 저장
    screenshot: 'only-on-failure',

    // 한국어 환경 설정
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  },

  // 테스트할 브라우저 목록
  projects: [
    // 데스크톱 Chrome
    {
      name: '데스크톱 Chrome',
      use: { ...devices['Desktop Chrome'] },
    },

    // 모바일 (iPhone 14 기준)
    {
      name: '모바일 iPhone',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // 테스트 시작 전에 Next.js 개발 서버를 자동으로 켜요
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // 서버 시작 최대 2분 대기
  },
})
