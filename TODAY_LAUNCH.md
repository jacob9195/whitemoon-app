# 오늘 소프트 런치 체크리스트

> 이 파일을 프린트하거나 옆에 띄워두고 위에서 아래로 따라 하세요.

---

## ✅ 1단계 — 배포 (30분)

### 로컬에서 빌드 확인
```bash
cd saju-app
npm install
npm run build
```
`✓ Compiled successfully` 메시지가 보이면 OK.

### GitHub에 올리기
```bash
git init
git add .
git commit -m "소프트 런치: 오늘의 사주 MVP"
git remote add origin https://github.com/내아이디/saju-app.git
git branch -M main
git push -u origin main
```

### Vercel 연결
1. https://vercel.com → GitHub로 로그인
2. "Add New Project" → saju-app 선택 → Import
3. **Environment Variables** 탭 클릭 → 아래 변수 추가:
   - `NEXT_PUBLIC_BASE_URL` = `https://앱이름.vercel.app` (배포 후 확인)
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY` = Toss 샌드박스 클라이언트 키
4. "Deploy" 클릭 → 2분 대기

배포 완료 확인: 초록색 체크 + `https://앱이름.vercel.app` 주소 생성

---

## ✅ 2단계 — 배포 후 화면 확인 (15분)

모바일(iPhone/Android)로 접속해서 직접 확인하세요.

- [ ] `/` 홈 화면 — 타이틀·버튼 보임
- [ ] `/input` — 생년월일·시간·성별 입력 가능
- [ ] 빈 칸 제출 → 한국어 오류 메시지 보임
- [ ] 정상 입력 → `/result` 이동
- [ ] 결과 화면 — 사주팔자·오행·성향·가이드 모두 보임
- [ ] "PDF로 저장하기" 버튼 → 인쇄 다이얼로그 열림
- [ ] `/landing` — 인스타 연결용 링크 페이지 보임
- [ ] `/premium` — 상품 선택·결제 버튼 보임 (샌드박스 배너 확인)

---

## ✅ 3단계 — Toss Payments 샌드박스 설정 (20분)

1. https://developers.tosspayments.com 접속 → 회원가입
2. "내 개발정보" → **테스트 클라이언트 키** 복사
3. Vercel → 프로젝트 → Settings → Environment Variables
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY` 값을 복사한 키로 교체
4. Vercel → Deployments → "Redeploy" 클릭 (환경변수 반영)
5. `/premium` 페이지에서 결제 버튼 클릭 → Toss 결제창 열리는지 확인
6. 테스트 카드번호 `4330 0000 0000 0015` 로 테스트 결제 진행
7. `/payment/success` 페이지로 이동하면 완료

---

## ✅ 4단계 — 인스타그램/인포크 연결 (10분)

### 공개 링크 정리
| 용도 | URL |
|------|-----|
| 메인 랜딩 (인포크 등록용) | `https://앱주소.vercel.app/landing` |
| 무료 사주 바로 가기 | `https://앱주소.vercel.app/input` |
| 프리미엄 결제 | `https://앱주소.vercel.app/premium` |

### 인스타그램 프로필 링크 설정
1. 인스타그램 → 프로필 → "프로필 편집"
2. "웹사이트" 칸에 `https://앱주소.vercel.app/landing` 입력
3. 저장

### 인포크(Linktree 대안) 설정
1. https://www.inpock.co.kr 회원가입
2. "링크 추가" → 아래 항목 추가:
   - **무료 사주 보기** → `https://앱주소.vercel.app/input`
   - **프리미엄 리포트** → `https://앱주소.vercel.app/premium`
3. 인포크 주소를 인스타 프로필에 등록

---

## ✅ 5단계 — 최종 점검 (5분)

- [ ] 모바일 Safari에서 전체 흐름 1회 완주
- [ ] 모바일 Chrome에서 전체 흐름 1회 완주
- [ ] "PDF로 저장하기" → PDF 파일 저장 확인
- [ ] `/landing` URL을 카카오톡으로 공유 → OG 이미지/제목 확인
- [ ] 샌드박스 결제 성공 → `/payment/success` 확인

---

## 오늘 미룬 것 (나중에 해도 됨)

| 항목 | 언제 |
|------|------|
| 실제 만세력 계산 구현 | v2 |
| AI 해석 문장 연결 | v2 |
| 결제 정식 오픈 (live 키 교체) | 사용자 검증 후 |
| Supabase 결과 저장 | v2 |
| 궁합 기능 | v3 |

---

## 문제 생겼을 때 빠른 해결

| 증상 | 해결 |
|------|------|
| 빌드 실패 | `npm install` 재실행 후 `npm run build` |
| Vercel 배포 실패 | Vercel 로그에서 빨간 줄 확인 → Claude에게 로그 붙여넣기 |
| 결제창 안 열림 | Toss 클라이언트 키 환경변수 확인 |
| 폰트 깨짐 | 인터넷 연결 확인 (Google Fonts 사용) |
