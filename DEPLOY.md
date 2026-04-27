# 배포 체크리스트 — 오늘의 사주

> 비개발자도 따라 할 수 있도록 단계별로 작성했어요.
> 처음 배포할 때 이 파일을 위에서 아래로 순서대로 읽으면서 따라 하세요.

---

## 배포 전 최종 상태 확인 (로컬에서)

```bash
# 1. 의존성 설치 (처음 한 번만)
npm install

# 2. 빌드가 성공하는지 확인
npm run build

# 3. 단위 테스트 통과 확인
npm test

# 4. 로컬 서버에서 직접 눈으로 확인
npm run dev
# → http://localhost:3000 열어서 홈 / 입력 / 결과 화면 확인
```

빌드 성공 메시지: `✓ Compiled successfully` 또는 `Route (app)` 목록이 보이면 OK예요.

---

## 1단계 — GitHub에 올리기

> GitHub는 코드를 저장하고 Vercel과 연결하는 "창고" 역할이에요.

### 처음 올리는 경우

```bash
# 프로젝트 폴더에서 실행하세요

# Git 시작
git init

# 모든 파일 추가 (.gitignore에 있는 파일은 자동으로 제외돼요)
git add .

# 첫 번째 저장 (메시지는 자유롭게)
git commit -m "초기 배포: 오늘의 사주 MVP"

# GitHub에 올리기
# → GitHub.com에서 새 저장소(Repository)를 만들고
#   아래 명령어에서 YOUR_USERNAME과 saju-app을 실제 값으로 바꾸세요
git remote add origin https://github.com/YOUR_USERNAME/saju-app.git
git branch -M main
git push -u origin main
```

### 이후 수정 사항을 올릴 때

```bash
git add .
git commit -m "변경 내용 설명"
git push
```

---

## 2단계 — Vercel 연결하기

> Vercel은 코드를 받아서 인터넷에 공개해주는 서비스예요. 무료로 쓸 수 있어요.

1. **https://vercel.com** 에 접속해요
2. "Sign Up" → **GitHub로 로그인**해요
3. 로그인 후 **"Add New Project"** 클릭
4. GitHub 저장소 목록에서 **saju-app** 선택 후 "Import" 클릭
5. 설정 화면이 나와요:
   - **Framework Preset**: `Next.js` (자동으로 감지돼요)
   - **Root Directory**: 그대로 두세요 (변경 없음)
   - **Build Command**: `npm run build` (자동 설정)
   - **Output Directory**: `.next` (자동 설정)
6. **환경변수 설정** (지금 MVP 단계에서는 입력하지 않아도 돼요)
   - Supabase, Claude API는 나중에 연결할 때 여기서 추가하면 돼요
7. **"Deploy" 클릭** → 1~3분 기다리면 배포 완료!

배포 성공 시 `https://saju-app-xxxx.vercel.app` 형태의 주소가 생겨요.

---

## 3단계 — 배포 후 확인 체크리스트

### 화면 동작 확인 (모바일 기준)

- [ ] 홈 화면 — "오늘의 사주" 제목과 "내 사주 보기" 버튼이 보이는지
- [ ] "내 사주 보기" 클릭 → 입력 화면으로 이동하는지
- [ ] 입력 화면 — 양력/음력, 생년월일, 출생시간, 성별 항목이 모두 보이는지
- [ ] "모름" 버튼 클릭 → 시간 선택이 비활성화되는지
- [ ] 생년월일 없이 제출 → 한국어 오류 메시지가 보이는지
- [ ] 정상 입력 후 제출 → 결과 화면으로 이동하는지
- [ ] 결과 화면 — 사주팔자 / 오행 분포 / 성향 요약 / 인생 가이드가 보이는지
- [ ] 직업 / 연애 / 주의점 탭 전환이 되는지
- [ ] "다시 입력하기" 클릭 → 입력 화면으로 돌아가는지
- [ ] 출생 시간 없이 제출 → 결과 화면에 안내 배너가 보이는지

### 모바일 기기에서 직접 확인

- [ ] iPhone Safari에서 홈 화면이 정상으로 보이는지
- [ ] Android Chrome에서 홈 화면이 정상으로 보이는지
- [ ] 버튼이 손가락으로 탭하기 충분히 큰지 (최소 48px 높이)
- [ ] 글씨가 너무 작지 않은지

### 기술 항목 확인

- [ ] 주소창에 `https://` 가 있는지 (SSL 자동 적용됨)
- [ ] 브라우저 탭 제목이 "오늘의 사주"로 보이는지
- [ ] 카카오톡 링크 공유 시 제목/설명이 잘 나오는지

---

## 환경변수 — 지금 당장 필요한 것은 없어요

| 환경변수 | 필요 시점 | 설명 |
|----------|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 결과 저장 기능 추가 시 | Supabase DB 연결 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 위와 동일 | Supabase 인증 키 |
| `ANTHROPIC_API_KEY` | AI 해석 기능 연결 시 | Claude API 키 |

환경변수가 필요해지면:
1. Vercel 프로젝트 → Settings → Environment Variables
2. 키 이름과 값 입력 → Save
3. 프로젝트를 다시 배포 (Redeploy) 하면 반영돼요

---

## 이후 수정 사항을 반영하는 방법

코드를 수정하고 GitHub에 올리면 Vercel이 **자동으로 새 버전을 배포**해요.

```bash
# 파일 수정 후
git add .
git commit -m "수정 내용 설명"
git push
# → 1~2분 후 vercel.app 주소에 자동 반영
```

---

## 지금 MVP에서 제외된 기능 (나중에 추가 예정)

| 기능 | 추가 방법 |
|------|-----------|
| 사주 실제 계산 | `lib/saju/calculator.ts` 구현 |
| AI 해석 문장 생성 | Claude API 연결 (`ANTHROPIC_API_KEY` 설정) |
| 결과 저장 / 히스토리 | Supabase 연결 |
| 궁합 보기 | 별도 페이지 추가 |
| 오늘의 운세 | 대운/세운 계산 모듈 추가 |
