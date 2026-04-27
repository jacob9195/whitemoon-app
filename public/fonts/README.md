# PDF 한글 폰트 폴더

## 여기에 TTF 폰트 파일을 직접 넣어주세요

### 필요한 파일 (2개)

| 파일명 | 용도 | 필수 |
|--------|------|------|
| `NotoSansKR-Regular-Subset.ttf` | 본문 폰트 (일반) | ✅ |
| `NotoSansKR-Bold-Subset.ttf` | 제목 폰트 (굵게) | ✅ |

---

### 폰트 구하는 방법

#### 방법 1: Google Fonts에서 직접 다운로드 (권장)
1. https://fonts.google.com/noto/specimen/Noto+Sans+KR 접속
2. "Download family" 클릭
3. 압축 해제하면 `NotoSansKR-Regular.ttf`, `NotoSansKR-Bold.ttf` 등이 있어요
4. 이 폴더에 복사하고 아래 이름으로 변경:
   - `NotoSansKR-Regular.ttf` → `NotoSansKR-Regular-Subset.ttf`
   - `NotoSansKR-Bold.ttf`    → `NotoSansKR-Bold-Subset.ttf`

#### 방법 2: 다른 TTF 폰트 사용
다른 한글 TTF 폰트도 가능해요. 넣은 후 파일명만 맞춰주세요.
- 나눔고딕, 나눔바른고딕, KoPub바탕 등 모두 가능

---

### ⚠️ 주의사항
- **TTF** 또는 **OTF** 파일만 가능 (`woff`, `woff2`는 작동 안 함)
- 파일명을 정확히 맞춰야 해요:
  - `NotoSansKR-Regular-Subset.ttf`
  - `NotoSansKR-Bold-Subset.ttf`
- Vercel 배포 시 git에 이 파일들을 포함해야 해요

---

### 파일 크기 참고
- Google Fonts Noto Sans KR 전체: ~12MB/개
- 서브셋(한글+한자만): ~1.5MB/개 (작업 중 제공된 파일)
- 파일 크기가 커도 PDF 생성에는 문제없어요
