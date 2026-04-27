// lib/google/sheets.ts
// Google Sheets API v4 — Service Account 인증 + 행 추가
// googleapis 패키지 없이 Node.js 내장 crypto만 사용

import crypto from 'crypto'

function getEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`환경변수 미설정: ${key}`)
  return val
}

// JWT 생성 (RS256)
function base64url(data: string): string {
  return Buffer.from(data).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function makeJWT(email: string, privateKey: string): string {
  const now     = Math.floor(Date.now() / 1000)
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({
    iss:   email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  }))
  const unsigned = `${header}.${payload}`
  const pem      = privateKey.replace(/\\n/g, '\n')
  const sign     = crypto.createSign('RSA-SHA256')
  sign.update(unsigned)
  const sig = sign.sign(pem, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return `${unsigned}.${sig}`
}

// Access Token 발급
async function getAccessToken(): Promise<string> {
  const jwt = makeJWT(
    getEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    getEnv('GOOGLE_PRIVATE_KEY'),
  )
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  })
  if (!res.ok) throw new Error(`Google 인증 실패: ${await res.text()}`)
  const { access_token } = await res.json()
  return access_token as string
}

// 시트에 행 추가
export async function appendToSheet(values: (string | number | null)[]): Promise<void> {
  const sheetId     = getEnv('GOOGLE_SHEET_ID')
  const accessToken = await getAccessToken()
  const range       = encodeURIComponent('고객 명단!A:P')
  const url         = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [values] }),
  })
  if (!res.ok) throw new Error(`Sheets 저장 실패: ${await res.text()}`)
}
