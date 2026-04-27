// =====================================================
// lib/payment/download-auth.ts
//
// 다운로드 권한 토큰 발급 및 검증
// ─────────────────────────────────────────────────────
// 방식: HMAC-SHA256 서명된 JSON 페이로드 (Base64URL 인코딩)
// 구조: base64url(payload) + "." + base64url(signature)
//
// 보안 특성:
//   - 서버만 서명 가능 (DOWNLOAD_TOKEN_SECRET 비공개)
//   - 만료 시간 포함 (기본 TTL: 1시간)
//   - 일회성 논스 포함 (동일 토큰 복사 재사용 억제)
//   - orderId 포함 → PDF API에서 주문 상태 재검증
//
// 제한:
//   - 이 토큰만으로 PDF 발급 안 됨
//   - PDF API에서 토큰 검증 + 저장소의 paid 상태 확인 필수
// =====================================================

import { createHmac, timingSafeEqual } from 'crypto'
import type { DownloadTokenPayload } from '@/lib/types/payment'
import { tokenInvalid, tokenExpired } from '@/lib/security/errors'

// TTL: 1시간 (밀리초)
const TOKEN_TTL_MS = 60 * 60 * 1000

function getSecret(): string {
  const s = process.env.DOWNLOAD_TOKEN_SECRET
  if (!s || s.length < 32) {
    throw new Error('DOWNLOAD_TOKEN_SECRET 환경변수가 설정되지 않았거나 너무 짧아요 (최소 32자)')
  }
  return s
}

function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64urlDecode(str: string): string {
  // padding 복원
  const padded = str + '==='.slice((str.length + 3) % 4)
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

// ── 토큰 발급 ─────────────────────────────────────────

export function issueDownloadToken(orderId: string, productId: string): string {
  const now: DownloadTokenPayload = {
    orderId,
    productId,
    issuedAt:  Date.now(),
    expiresAt: Date.now() + TOKEN_TTL_MS,
    nonce:     Math.random().toString(36).slice(2),
  }

  const payload   = base64urlEncode(JSON.stringify(now))
  const signature = sign(payload, getSecret())

  return `${payload}.${signature}`
}

// ── 토큰 검증 ─────────────────────────────────────────
// 반환: DownloadTokenPayload (검증 성공 시)
// 실패: AppError throw (tokenInvalid 또는 tokenExpired)

export function verifyDownloadToken(token: string): DownloadTokenPayload {
  const parts = token.split('.')
  if (parts.length !== 2) throw tokenInvalid()

  const [encodedPayload, signature] = parts

  // 서명 검증 (timing-safe 비교로 timing attack 방지)
  const expectedSig = sign(encodedPayload, getSecret())
  const sigBuffer   = Buffer.from(signature,    'base64url')
  const expBuffer   = Buffer.from(expectedSig,  'base64url')

  if (sigBuffer.length !== expBuffer.length) throw tokenInvalid()

  const isValid = timingSafeEqual(sigBuffer, expBuffer)
  if (!isValid) throw tokenInvalid()

  // 페이로드 파싱
  let payload: DownloadTokenPayload
  try {
    payload = JSON.parse(base64urlDecode(encodedPayload)) as DownloadTokenPayload
  } catch {
    throw tokenInvalid()
  }

  // 필수 필드 존재 확인
  if (
    typeof payload.orderId   !== 'string' ||
    typeof payload.productId !== 'string' ||
    typeof payload.issuedAt  !== 'number' ||
    typeof payload.expiresAt !== 'number' ||
    typeof payload.nonce     !== 'string'
  ) {
    throw tokenInvalid()
  }

  // 만료 확인
  if (Date.now() > payload.expiresAt) throw tokenExpired()

  return payload
}
