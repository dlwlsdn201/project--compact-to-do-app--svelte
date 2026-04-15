# ✅ Todomorrow

**Todomorrow**은 매일의 할 일에 집중하고, 지나간 기록과 다가올 내일을 아주 게으르고 즉흥 성향이 강한 사람도 최소한의 노력으로 관리할 수 있도록 돕는 미니멀리즘 투두(To-Do) 애플리케이션입니다.

"오늘 할 일", "내일 할 일", "지난 이력"의 세 가지 직관적인 뷰(View)를 제공하여 미완료된 업무를 효과적으로 추적하고 복원할 수 있습니다.

![Project Status](https://img.shields.io/badge/version-1.1.0-blue.svg) ![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 🔗 Live 서비스 주소

: https://todomorrow.vercel.app

## 🖥️ 프리뷰 (Preview)

### Desktop 

<img width="1626" height="1024" alt="Result_데스크탑 화면" src="https://github.com/user-attachments/assets/8f796cd1-08e2-45fa-af5f-a7191743b0cd" />

### Mobile 

<img width="614" height="878" alt="Result_모바일 화면" src="https://github.com/user-attachments/assets/c6ba5646-0d27-4f45-aac2-395cde5883bb" />



## ✨ 핵심 기능 (Features)

- **소셜 로그인 (Kakao OAuth)**: Supabase Auth를 이용한 원클릭 카카오 로그인 환경 구축
- **날짜 기반 인텔리전트 필터링**:
  - `오늘`: 오늘 기한인 미완료/완료 투두 목록 관리
  - `내일`: 내일을 위해 미리 계획하고 바로 내일 날짜로 데이터 생성
  - `지난 이력`: 기한이 지났지만 미완료된 항목들을 시각적으로 강조(**빨간불 경고**)하고 과거의 완료된 기록들을 조회
- **부활(Restore) 액션**: 지난 이력에 남아 방치된 할 일을 '오늘 하기' 또는 '내일 하기' 버튼 클릭 한 번으로 새 탭으로 끌어오기
- **우선순위 정렬**: 낮음/보통/높음 등의 우선순위 데이터를 기반으로 실시간 정렬(내림차순/오름차순) 적용
- **다크/라이트 모드 지원**: 사용자 인터페이스 최적화를 위한 시스템 테마 지원

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: `SvelteKit` (Svelte 5 Runes)
- **Styling**: `Tailwind CSS` (유틸리티 클래스 기반 디자인 시스템)
- **State & Data Fetching**: `@tanstack/svelte-query` (서버 상태 관리 및 옵티미스틱 업데이트)
- **Icons**: `lucide-svelte`
- **Language**: `TypeScript`

### Backend / Database
- **BaaS**: `Supabase`
- **Database**: PostgreSQL (Row Level Security 정책 적용)
- **Auth**: Supabase Authentication (Kakao Provider 연동)

---

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬에서 실행하기 위한 방법입니다.

### 요구 사항
- `Node.js` (v20 이상 권장)
- `pnpm` (권장 패키지 매니저)

### 설치 및 환경 설정

1. 프로젝트 클론 및 데모 폴더 진입
```bash
git clone https://github.com/your-username/compact-to-do-app.git
cd compact-to-do-app
```

2. 패키지 설치
```bash
pnpm install
```

3. 환경 변수 세팅
루트 경로에 `.env` 파일을 생성하고 Supabase 관련 키를 입력합니다.
```env
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 개발 서버 실행
```bash
pnpm dev
# 외부 모바일 기기 등을 통해 ngrok 혹은 로컬 네트워크 테스트시: pnpm dev --host
```

---

## 📅 다음 할 일 (Next To-Dos)

프로젝트 고도화를 위해 기획 중인 백로그(Backlog)입니다.

- [ ] **Voice-to-Todo (음성 자동 등록)**
  - 타이핑 대신 "내일 은행 가기", "오늘 저녁에 공부하기" 처럼 음성으로 명령.
  - LLM(OpenAI)과 STT(Web Speech API)를 결합하여 사용자 발언을 파싱한 뒤 적절한 탭 요소에 자동 배치.
  - 상세 기획안: [`docs/next-todo/feature-voice-to-todo.mdc`](docs/next-todo/feature-voice-to-todo.mdc) 참고.
- [ ] **Vercel 프로덕션 라이브 배포 (CI/CD)**
  - GitHub 푸시 트리거 기반의 Vercel 정식 배포 파이프라인 구성.
- [ ] **Push Notifications (푸시 알림)**
  - 기한 초과(지난 이력) 투두가 발생했을 때 모바일/웹 환경으로 리마인드 푸시 제공.
- [ ] **유료 도메인 구매**
  - `*.vercel.app` 도메인이 아닌 정식 도메인으로 변경.
