# 프로젝트 개발 규격 및 아키텍처 가이드 (SvelteKit + TypeScript)

## 1. 아키텍처: Feature-Based Structure
SvelteKit의 파일 기반 라우팅을 존중하되, 비즈니스 로직은 `src/lib` 내에서 기능별로 응집합니다.

- `src/lib/components/ui`: shadcn-svelte 등 공용 UI 컴포넌트
- `src/lib/features/{feature-name}`: 특정 기능(Auth, Todo)에 종속된 컴포넌트, 스토어, 유틸리티
- `src/lib/api`: Supabase 클라이언트 및 공통 API 로직
- `src/lib/types`: 전역 TypeScript 인터페이스 및 타입 정의

## 2. 코드 컨벤션
### 2.1 네이밍 규칙
- **Components:** PascalCase (e.g., `TodoItem.svelte`)
- **Variables/Functions:** camelCase (e.g., `const toggleTodo = () => {}`)
- **Constants:** SNAKE_UPPER_CASE (e.g., `const MAX_TITLE_LENGTH = 50`)
- **Stores:** `$` 접두사를 사용하는 Svelte 자동 구독 패턴 활용 (e.g., `$userStore`)

### 2.2 TypeScript 가이드
- `any` 사용 금지. 인터페이스 정의가 불분명할 경우 `unknown` 사용 후 Type Guard 적용.
- API 응답 및 Form 데이터 검증에는 `Zod` 스키마 라이브러리 사용 권장.
- Props 정의 시 `export let` 대신 Svelte 5 사용 시 `$props()` 룬(Runes) 검토 (현재 안정 버전 기준으로는 `export let` 사용).

### 2.3 Svelte 특화 규칙
- **Logic vs View:** 가급적 비즈니스 로직은 외부 `.ts` 파일이나 `store`로 분리하여 컴포넌트 파일의 크기를 500라인 이하로 유지.
- **Runes (Svelte 5 기준 전환 고려):** 상태 관리는 `$state`, `$derived`를 적극 활용하여 가독성 확보.

## 3. 상태 관리 및 데이터 페칭
- **Server State:** `TanStack Query (Svelte Query)`를 사용하여 캐싱, 로딩, 에러 핸들링 관리.
- **Global State:** 유저 세션, 다크모드 등은 `Svelte Stores` 활용.
- **Form State:** `sveltekit-superforms` 사용을 권장하여 서버-클라이언트 유효성 검사 일원화.

## 4. Git 전략
- **Commit Message:** Conventional Commits 준수 (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- **Branch:** `main` (Production) <- `develop` (Staging) <- `feature/{issue-number}`