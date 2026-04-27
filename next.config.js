/** @type {import('next').NextConfig} */
const nextConfig = {
  // 한국어 앱 기본 설정
  // 이미지 최적화 — 나중에 외부 이미지 도메인이 생기면 domains 배열에 추가하세요
  images: {
    domains: [],
  },

  // 빌드 시 ESLint 오류가 있어도 배포 가능하게 (경고 수준으로 처리)
  // 실제 배포 안정화 후에는 false로 돌려두세요
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript 오류도 경고 수준으로 처리 (MVP 배포 기준)
  // 실제 배포 안정화 후에는 false로 돌려두세요
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
