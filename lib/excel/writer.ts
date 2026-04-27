// lib/excel/writer.ts
// 고객 데이터를 엑셀 파일에 행 추가

import path from 'path'
import fs from 'fs'
import type { SubmitData } from '@/app/api/submit/route'

// 엑셀 파일 경로 (data/ 폴더)
const EXCEL_PATH = path.join(process.cwd(), 'data', '월백당사주_DB.xlsx')

// 날짜 포맷 정규화: 19890529 → 1989-05-29
function normDate(raw: string): string {
  const clean = raw.replace(/[./]/g, '-')
  // YYYYMMDD → YYYY-MM-DD
  if (/^\d{8}$/.test(clean)) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`
  }
  return clean
}

export async function writeCustomerToExcel(data: SubmitData): Promise<void> {
  // openpyxl은 Python이므로 Node에서는 exceljs 사용
  const ExcelJS = (await import('exceljs')).default

  const wb = new ExcelJS.Workbook()

  // 파일이 있으면 불러오고, 없으면 새로 생성
  if (fs.existsSync(EXCEL_PATH)) {
    await wb.xlsx.readFile(EXCEL_PATH)
  } else {
    // 파일 없으면 헤더 포함해서 새 시트 생성
    const ws = wb.addWorksheet('고객 명단')
    ws.addRow([
      '이름', '성별', '양음력', '생년월일', '출생시각', '출생지',
      '파트너이름', '파트너성별', '파트너양음력', '파트너생년월일', '파트너출생시각', '파트너출생지',
      '상품', '이메일', '전화번호',
    ])
  }

  const ws = wb.getWorksheet('고객 명단')
  if (!ws) throw new Error('고객 명단 시트를 찾을 수 없습니다.')

  const p = data.person
  const pt = data.partner

  // 새 행 추가 (컬럼 순서: 엑셀 샘플과 동일)
  ws.addRow([
    p.name,                          // 이름
    p.gender,                        // 성별
    p.calType,                       // 양음력
    normDate(p.birthDate),           // 생년월일
    p.birthTime  ?? '',              // 출생시각
    p.birthPlace ?? '',              // 출생지
    pt?.name        ?? '',           // 파트너이름
    pt?.gender      ?? '',           // 파트너성별
    pt?.calType     ?? '',           // 파트너양음력
    pt ? normDate(pt.birthDate) : '',// 파트너생년월일
    pt?.birthTime   ?? '',           // 파트너출생시각
    pt?.birthPlace  ?? '',           // 파트너출생지
    data.product,                    // 상품
    data.email,                      // 이메일
    data.phone,                      // 전화번호
  ])

  await wb.xlsx.writeFile(EXCEL_PATH)
}
