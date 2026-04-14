# Component: TodoItem

> **Status**: Completed
> **TDD Level**: Strict (Red-Green-Refactor)

## 🎯 Responsibility

단일 Todo 항목을 렌더링하고 완료 토글 / 수정 / 삭제 인터랙션을 처리하는 컴포넌트.
`isHistoryArea=true`일 때는 기한이 지난 항목을 오늘 또는 내일로 복구하는 버튼을 추가로 노출한다.
우선순위(high/medium/low)에 따라 색상 뱃지를 표시하며, `showDate=true`이면 등록일을 함께 보여준다.

## 🧪 Test Scenarios (Red Phase)

### Render
- [x] **제목 렌더링**: 전달된 `todo.title`이 화면에 나타나야 함
- [x] **완료 취소선**: `is_completed=true`인 항목의 제목에 `line-through` 스타일 적용
- [x] **우선순위 뱃지**: high → "우선순위 높음", medium → "우선순위 보통", low → "우선순위 낮음" 텍스트 표시

### Interaction
- [x] **완료 토글**: 체크박스 버튼 클릭 시 `updateTodo.mutate({ id, updates: { is_completed: !current } })` 호출
- [x] **삭제 확인**: 삭제 버튼 클릭 → `window.confirm` 표시 → 승인 시 `deleteTodo.mutate(id)` 호출
- [x] **삭제 취소**: `confirm` 취소 시 `deleteTodo.mutate`가 호출되지 않음
- [x] **수정 콜백**: 수정 버튼 클릭 시 `onEdit(todo)` 호출

### Edge Case
- [x] **복구 버튼 노출**: `isHistoryArea=true` + 미완료 → "오늘 하기", "내일 하기" 버튼 표시
- [x] **복구 버튼 숨김**: `isHistoryArea=false` → 복구 버튼 없음
- [x] **완료 시 복구 없음**: `isHistoryArea=true` + 완료 → 복구 버튼 없음
- [x] **날짜 표시**: `showDate=true` → 등록일 렌더링
- [x] **수정 버튼 숨김**: `onEdit` prop 미전달 시 수정 버튼 없음

## 💻 Implementation (Green Phase)

기존 `src/lib/components/ui/TodoItem.svelte` 코드가 위 시나리오를 모두 충족한다.

**Mock 전략 (테스트 파일)**:
- `$lib/features/todo/todoQueries` 전체를 `vi.mock`으로 대체하여 Supabase/QueryClient 의존성 제거
- `window.confirm`은 `vi.spyOn`으로 제어
