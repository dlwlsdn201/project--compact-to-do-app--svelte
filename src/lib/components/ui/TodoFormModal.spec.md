# Component: TodoFormModal

> **Status**: Completed
> **TDD Level**: Strict (Red-Green-Refactor)

## 🎯 Responsibility

Todo 생성/수정 모달. `isOpen`($bindable) prop으로 노출 여부를 제어하고,
`editingTodo` 유무로 생성/수정 모드를 자동 전환한다.
Zod 스키마를 통해 제목 필수·50자 제한을 클라이언트에서 검증하며,
검증 통과 시 `createTodo` 또는 `updateTodo` 뮤테이션을 호출한다.

## 🧪 Test Scenarios (Red Phase)

### Render
- [x] **모달 표시**: `isOpen=true`이면 모달 헤더가 DOM에 나타남
- [x] **모달 숨김**: `isOpen=false`이면 모달이 DOM에 없음
- [x] **생성 모드 제목**: `editingTodo` 미전달 시 "새 할 일 추가" 헤더
- [x] **수정 모드 제목**: `editingTodo` 전달 시 "할 일 수정" 헤더
- [x] **수정 모드 값 채움**: 기존 `editingTodo.title`이 입력창에 채워짐

### Interaction
- [x] **생성 제출**: 유효한 제목 입력 후 제출 → `createTodo.mutate` 호출
- [x] **수정 제출**: 수정 모드에서 제출 → `updateTodo.mutate({ id: ... })` 호출
- [x] **X 버튼**: 닫기 버튼 클릭 → 모달이 DOM에서 사라짐
- [x] **오버레이 클릭**: 배경 클릭 → 모달이 DOM에서 사라짐

### Edge Case (Validation)
- [x] **제목 미입력**: 빈 제목 제출 → "제목을 입력해주세요." 에러 메시지
- [x] **50자 초과**: 51자 제목 제출 → "제목은 50자를 넘을 수 없습니다." 에러 메시지
- [x] **정확히 50자**: 50자 제목 → 에러 없이 mutate 호출

## 💻 Implementation (Green Phase)

기존 `src/lib/components/ui/TodoFormModal.svelte` 코드가 위 시나리오를 모두 충족한다.

**Mock 전략 (테스트 파일)**:
- `$lib/features/todo/todoQueries` 전체를 `vi.mock`으로 대체
- 닫기/오버레이 클릭 후 DOM 반응성 확인에는 `tick()`(svelte) 사용
