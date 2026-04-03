# 📝 Product Requirements Document (PRD): Flash Do

## 1. 프로젝트 개요
- **서비스명**: Flash Do (플래시 두)
- **한 줄 정의**: "생각은 짧게, 기록은 빠르게" - 오늘과 내일에 집중하는 미니멀 할 일 관리 도구
- **배경**: Notion 등 기존 도구의 과도한 기능으로 인한 사용성 저하를 해결하고, 모바일 환경에서 즉각적으로 할 일을 기록하고 관리하기 위함
- **핵심 목표**: 
  - 카카오 로그인을 통한 빠른 진입 (3초 이내)
  - 오늘/내일 할 일의 직관적인 관리 및 시각적 피드백
  - 과거 이력의 효율적인 검색 및 보관

---

## 2. 사용자 및 타겟 유저
- **주요 사용자**: 복잡한 일정 관리 앱에 피로감을 느끼고 핵심 기능만 원하는 전연령층
- **사용 환경**: 모바일 웹 최적화(PWA 권장) 및 데스크탑 웹 브라우저

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 회원가입 및 인증
| 기능 | 설명 | 우선순위 |
| :--- | :--- | :--- |
| **카카오 로그인** | Supabase Auth를 이용한 Kakao OAuth 2.0 구현 | P0 |
| **세션 유지** | 재접속 시 자동 로그인을 통해 메인 대시보드로 즉각 진입 | P0 |
| **로그아웃** | 사이드바 또는 설정 메뉴를 통한 계정 로그아웃 | P1 |

### 3.2 할 일(Todo) 관리
| 기능 | 설명 | 비고 |
| :--- | :--- | :--- |
| **할 일 등록** | 제목(필수), 내용(옵션), 우선순위(낮음/중간/높음), 날짜(오늘/내일) | FAB 또는 상단 UI |
| **상태 업데이트** | 체크박스 클릭 시 완료 처리 (취소선, 배경색 Gray/Green 변경) | 낙관적 업데이트 적용 |
| **할 일 편집** | 기존 등록된 할 일의 제목, 내용, 우선순위 수정 기능 | - |
| **할 일 삭제** | 항목 삭제 시 사용자 재확인(Confirm) 거친 후 데이터 삭제 | - |

### 3.3 탭(Tab) 시스템 및 뷰(View)
| 구분 | 기능 상세 | UI 타입 |
| :--- | :--- | :--- |
| **지난 할 일** | 과거 모든 데이터 리스트 노출, 제목/내용 기반 검색 필터 제공 | 리스트 |
| **오늘 할 일** | 오늘 날짜의 할 일 관리 | 리스트 / 2x2 그리드 선택 |
| **내일 할 일** | 내일 예정된 할 일을 미리 등록 및 확인 | 리스트 |

---

## 4. 비기능 요구사항 (Non-Functional Requirements)
- **사용성 (UX)**: 모바일 터치 타겟(최소 44x44px) 확보 및 즉각적인 인터랙션 피드백 제공
- **성능**: SvelteKit의 SSR/CSR 최적화 및 TanStack Query를 통한 서버 데이터 캐싱
- **디자인**: 
  - **다크 모드 지원**: OS 테마 연동 및 수동 토글 지원
  - **디자인 시스템**: Tailwind CSS 및 Shadcn-svelte 기반의 일관된 UI 구성

---

## 5. 기술 스택 (Tech Stack)
- **Frontend**: SvelteKit, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn-svelte
- **State/Query**: Svelte Stores, TanStack Query (Svelte Query)
- **Backend**: Supabase (Database, Auth, RLS)
- **Deployment**: Vercel 또는 Netlify

---

## 6. 데이터베이스 스키마 (Database Schema)

### `public.todos` Table
| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | gen_random_uuid() | 고유 식별자 (PK) |
| `user_id` | UUID | auth.uid() | 작성자 식별자 (FK) |
| `title` | TEXT | - | 할 일 제목 (Not Null) |
| `content` | TEXT | NULL | 상세 내용 (Optional) |
| `priority` | TEXT | 'low' | 우선순위 (low, medium, high) |
| `is_completed` | BOOLEAN | false | 완료 여부 |
| `due_date` | DATE | - | 할 일 예정 날짜 |
| `created_at` | TIMESTAMPTZ | now() | 생성 일시 |

---

## 7. 마일스톤 (Milestones)
1. **Phase 1 (Setup)**: 프로젝트 초기 환경 구축 및 Supabase 카카오 인증 연동
2. **Phase 2 (Core)**: 오늘/내일 Todo CRUD 및 메인 탭 UI 구현
3. **Phase 3 (UX/UI)**: 다크모드, 2x2 그리드 뷰, 애니메이션(Svelte Transition) 적용
4. **Phase 4 (Search)**: '지난 할 일' 검색 및 필터 기능 완성
5. **Phase 5 (Deploy)**: 최종 테스트 및 Vercel 배포