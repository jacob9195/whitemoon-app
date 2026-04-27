import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environmentMatchGlobs: [
      ['tests/unit/sajuRoute.test.ts', 'edge-runtime'],
      ['tests/unit/**/*.test.ts', 'node'],
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
