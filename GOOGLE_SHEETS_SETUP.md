# Google Sheets 연동 설정 가이드

고객이 신청하면 내 Google 스프레드시트에 자동으로 행이 추가됩니다.
**딱 한 번만** 설정하면 됩니다. 약 10~15분 소요.

---

## 1단계: Google Cloud 프로젝트 만들기

1. https://console.cloud.google.com 접속 (Google 계정으로 로그인)
2. 상단 "프로젝트 선택" → **"새 프로젝트"**
3. 프로젝트 이름: `월백당사주` → 만들기

---

## 2단계: Google Sheets API 활성화

1. 좌측 메뉴 → **"API 및 서비스"** → **"라이브러리"**
2. 검색창에 `Google Sheets API` 입력
3. 클릭 → **"사용 설정"** 버튼 클릭

---

## 3단계: 서비스 계정 만들기

1. 좌측 메뉴 → **"API 및 서비스"** → **"사용자 인증 정보"**
2. 상단 **"+ 사용자 인증 정보 만들기"** → **"서비스 계정"**
3. 서비스 계정 이름: `월백당사주` → 만들고 완료
4. 만들어진 서비스 계정 이메일 복사 (예: `월백당사주@프로젝트명.iam.gserviceaccount.com`)

---

## 4단계: 키(JSON) 파일 다운로드

1. 방금 만든 서비스 계정 클릭
2. 상단 **"키"** 탭 → **"키 추가"** → **"새 키 만들기"**
3. **JSON** 선택 → 만들기 → JSON 파일 자동 다운로드

JSON 파일 안에 이런 내용이 있어요:
```json
{
  "client_email": "월백당사주@프로젝트명.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

---

## 5단계: Google 스프레드시트 만들기 & 공유

1. https://sheets.google.com 에서 **새 스프레드시트 만들기**
2. 시트 이름을 **`고객 명단`** 으로 변경 (하단 탭 더블클릭)
3. **1행에 헤더 입력** (아래 순서 그대로):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 이름 | 성별 | 양음력 | 생년월일 | 출생시각 | 출생지 | 파트너이름 | 파트너성별 | 파트너양음력 | 파트너생년월일 | 파트너출생시각 | 파트너출생지 | 상품 | 이메일 | 전화번호 | 신청일시 |

4. 우측 상단 **"공유"** 버튼 클릭
5. **3단계에서 복사한 서비스 계정 이메일** 붙여넣기
6. 권한: **편집자** 선택 → 공유

7. 주소창의 URL에서 시트 ID 복사:
   ```
   https://docs.google.com/spreadsheets/d/【여기가_SHEET_ID】/edit
   ```

---

## 6단계: Vercel 환경변수 설정

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

| 변수명 | 값 |
|--------|-----|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | JSON의 `client_email` 값 |
| `GOOGLE_PRIVATE_KEY` | JSON의 `private_key` 값 (따옴표 포함해서 그대로) |
| `GOOGLE_SHEET_ID` | 5단계에서 복사한 ID |
| `NEXT_PUBLIC_BANK_NAME` | 내 은행 이름 |
| `NEXT_PUBLIC_ACCOUNT_NUM` | 내 계좌번호 |
| `NEXT_PUBLIC_ACCOUNT_NAME` | 예금주 이름 |

---

## 7단계: 재배포

Vercel에서 **Redeploy** 버튼 클릭 → 완료!

---

## ✅ 테스트

신청 폼 작성 → 제출하면 → Google 시트에 즉시 행 추가됩니다.

---

## ❓ 자주 묻는 질문

**Q: 월백당사주 프로그램에서 엑셀로 내보내려면?**
Google 시트 메뉴 → 파일 → 다운로드 → Microsoft Excel(.xlsx)

**Q: GOOGLE_PRIVATE_KEY 값을 Vercel에 넣을 때 오류가 나요**
값을 넣을 때 큰따옴표(`"`) 없이 `-----BEGIN PRIVATE KEY-----` 부터 그대로 붙여넣으세요.
줄바꿈(`\n`)은 Vercel이 자동 처리합니다.
