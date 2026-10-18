import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import TodoItem from './TodoItem.svelte';
import type { Todo } from '$lib/types/todo';

// ─────────────────────────────────────────────
// Mock: TanStack Query hooks
// useUpdateTodo / useDeleteTodo 를 vi.mock으로 대체하여
// Supabase 연결 및 QueryClient 의존성을 제거한다.
// ─────────────────────────────────────────────
const mockUpdateMutate = vi.fn();
const mockDeleteMutateAsync = vi.fn();

vi.mock('$lib/features/todo/todoQueries', () => ({
	useUpdateTodo: () => ({ mutate: mockUpdateMutate, isPending: false }),
	useDeleteTodo: () => ({ mutateAsync: mockDeleteMutateAsync, isPending: false }),
	useCreateTodo: () => ({ mutate: vi.fn(), isPending: false })
}));

// ─────────────────────────────────────────────
// 공통 테스트 픽스처
// ─────────────────────────────────────────────
const baseTodo: Todo = {
	id: 'todo-1',
	user_id: 'user-1',
	title: '슈퍼베이스 마이그레이션',
	content: '데이터베이스 스키마를 마이그레이션한다',
	priority: 'high',
	is_completed: false,
	due_date: '2026-04-14',
	due_time: null,
	created_at: '2026-04-14T09:00:00.000Z'
};

/** 마감 시각 판정은 현재 시각에 의존하므로 과거/미래 날짜를 명시적으로 만든다. */
const pastDate = new Date(Date.now() - 7 * 86400000).toISOString();
const futureDate = new Date(Date.now() + 7 * 86400000).toISOString();

describe('TodoItem', () => {
	beforeEach(() => {
		mockUpdateMutate.mockClear();
		mockDeleteMutateAsync.mockReset();
		mockDeleteMutateAsync.mockResolvedValue(undefined);
		vi.restoreAllMocks();
	});

	// ──────────────────────────────────────────
	// Render
	// ──────────────────────────────────────────
	describe('Render', () => {
		it('todo.title이 화면에 렌더링된다', () => {
			const { getByText } = render(TodoItem, { props: { todo: baseTodo } });
			expect(getByText('슈퍼베이스 마이그레이션')).toBeInTheDocument();
		});

		it('is_completed=true인 제목에 line-through 스타일이 적용된다', () => {
			const completedTodo = { ...baseTodo, is_completed: true };
			const { getByText } = render(TodoItem, { props: { todo: completedTodo } });
			expect(getByText('슈퍼베이스 마이그레이션')).toHaveClass('line-through');
		});

		it('is_completed=false인 제목에는 line-through가 없다', () => {
			const { getByText } = render(TodoItem, { props: { todo: baseTodo } });
			expect(getByText('슈퍼베이스 마이그레이션')).not.toHaveClass('line-through');
		});

		it('priority "high" → "우선순위 높음" 뱃지가 표시된다', () => {
			const { getByText } = render(TodoItem, { props: { todo: baseTodo } });
			expect(getByText('우선순위 높음')).toBeInTheDocument();
		});

		it('priority "medium" → "우선순위 보통" 뱃지가 표시된다', () => {
			const mediumTodo = { ...baseTodo, priority: 'medium' as const };
			const { getByText } = render(TodoItem, { props: { todo: mediumTodo } });
			expect(getByText('우선순위 보통')).toBeInTheDocument();
		});

		it('priority "low" → "우선순위 낮음" 뱃지가 표시된다', () => {
			const lowTodo = { ...baseTodo, priority: 'low' as const };
			const { getByText } = render(TodoItem, { props: { todo: lowTodo } });
			expect(getByText('우선순위 낮음')).toBeInTheDocument();
		});
	});

	// ──────────────────────────────────────────
	// Interaction
	// ──────────────────────────────────────────
	describe('Interaction', () => {
		it('휴지통 클릭 시 화면 안에 삭제 확인을 표시한다', async () => {
			render(TodoItem, { props: { todo: baseTodo } });
			await fireEvent.click(screen.getByRole('button', { name: 'Delete todo' }));
			expect(screen.getByRole('alertdialog')).toHaveTextContent('정말로 이 할 일을 삭제하시겠습니까?');
		});

		it('삭제 실패 시 오류를 표시하고 확인창을 유지한다', async () => {
			mockDeleteMutateAsync.mockRejectedValue(new Error('삭제 권한 없음'));
			render(TodoItem, { props: { todo: baseTodo } });
			await fireEvent.click(screen.getByRole('button', { name: 'Delete todo' }));
			await fireEvent.click(screen.getByRole('button', { name: '삭제 확정' }));
			await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('삭제하지 못했습니다'));
			expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		});
		it('체크박스 버튼 클릭 시 updateTodo.mutate가 is_completed 반전 값으로 호출된다', async () => {
			const { getByRole } = render(TodoItem, { props: { todo: baseTodo } });
			const checkbox = getByRole('button', { name: /toggle completion/i });
			await fireEvent.click(checkbox);
			expect(mockUpdateMutate).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'todo-1',
					updates: { is_completed: true }
				})
			);
		});

		it('완료 상태 항목의 체크박스 클릭 시 is_completed: false로 호출된다', async () => {
			const completedTodo = { ...baseTodo, is_completed: true };
			const { getByRole } = render(TodoItem, { props: { todo: completedTodo } });
			const checkbox = getByRole('button', { name: /toggle completion/i });
			await fireEvent.click(checkbox);
			expect(mockUpdateMutate).toHaveBeenCalledWith(
				expect.objectContaining({ updates: { is_completed: false } })
			);
		});

		it('삭제 확인 후 삭제 요청에 할 일 id를 전달한다', async () => {
			const { getByRole } = render(TodoItem, { props: { todo: baseTodo } });
			const deleteBtn = getByRole('button', { name: /delete todo/i });
			await fireEvent.click(deleteBtn);
			await fireEvent.click(getByRole('button', { name: '삭제 확정' }));
			expect(mockDeleteMutateAsync).toHaveBeenCalledWith('todo-1');
		});

		it('삭제 취소 시 요청하지 않는다', async () => {
			const { getByRole } = render(TodoItem, { props: { todo: baseTodo } });
			const deleteBtn = getByRole('button', { name: /delete todo/i });
			await fireEvent.click(deleteBtn);
			await fireEvent.click(getByRole('button', { name: '취소' }));
			expect(mockDeleteMutateAsync).not.toHaveBeenCalled();
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
		});

		it('수정 버튼 클릭 시 onEdit(todo)가 호출된다', async () => {
			const onEdit = vi.fn();
			const { getByRole } = render(TodoItem, { props: { todo: baseTodo, onEdit } });
			const editBtn = getByRole('button', { name: /edit todo/i });
			await fireEvent.click(editBtn);
			expect(onEdit).toHaveBeenCalledWith(baseTodo);
		});
	});

	// ──────────────────────────────────────────
	// Edge Case
	// ──────────────────────────────────────────
	// ──────────────────────────────────────────
	// 마감 시각
	// ──────────────────────────────────────────
	describe('마감 시각', () => {
		it('due_time이 없으면 마감 시각 배지를 표시하지 않는다', () => {
			const { queryByTestId } = render(TodoItem, { props: { todo: baseTodo } });
			expect(queryByTestId('due-time-badge')).toBeNull();
		});

		it('due_time이 있으면 한국어 표기로 배지를 표시한다', () => {
			const { getByTestId } = render(TodoItem, {
				props: { todo: { ...baseTodo, due_date: futureDate, due_time: '18:30' } }
			});
			expect(getByTestId('due-time-badge').textContent).toContain('오후 6:30');
		});

		it('마감 시각이 지난 미완료 항목은 경고 색상과 "마감" 표기로 강조한다', () => {
			const { getByTestId } = render(TodoItem, {
				props: { todo: { ...baseTodo, due_date: pastDate, due_time: '09:00' } }
			});
			const badge = getByTestId('due-time-badge');
			expect(badge.textContent).toContain('마감');
			expect(badge.className).toContain('text-red-800');
		});

		it('마감 시각이 지났어도 완료된 항목은 강조하지 않는다', () => {
			const { getByTestId } = render(TodoItem, {
				props: {
					todo: { ...baseTodo, due_date: pastDate, due_time: '09:00', is_completed: true }
				}
			});
			const badge = getByTestId('due-time-badge');
			expect(badge.textContent).not.toContain('마감');
			expect(badge.className).not.toContain('text-red-800');
		});
	});

	describe('Edge Case', () => {
		it('isHistoryArea=true + 미완료 → "오늘 하기", "내일 하기" 버튼이 표시된다', () => {
			const { getByText } = render(TodoItem, { props: { todo: baseTodo, isHistoryArea: true } });
			expect(getByText('오늘 하기')).toBeInTheDocument();
			expect(getByText('내일 하기')).toBeInTheDocument();
		});

		it('isHistoryArea=false → 복구 버튼이 표시되지 않는다', () => {
			const { queryByText } = render(TodoItem, { props: { todo: baseTodo, isHistoryArea: false } });
			expect(queryByText('오늘 하기')).not.toBeInTheDocument();
			expect(queryByText('내일 하기')).not.toBeInTheDocument();
		});

		it('isHistoryArea 기본값(undefined) → 복구 버튼이 표시되지 않는다', () => {
			const { queryByText } = render(TodoItem, { props: { todo: baseTodo } });
			expect(queryByText('오늘 하기')).not.toBeInTheDocument();
		});

		it('isHistoryArea=true + 완료 → 복구 버튼이 표시되지 않는다', () => {
			const completedTodo = { ...baseTodo, is_completed: true };
			const { queryByText } = render(TodoItem, { props: { todo: completedTodo, isHistoryArea: true } });
			expect(queryByText('오늘 하기')).not.toBeInTheDocument();
			expect(queryByText('내일 하기')).not.toBeInTheDocument();
		});

		it('showDate=true → 등록일이 한국어 형식으로 표시된다', () => {
			const { container } = render(TodoItem, { props: { todo: baseTodo, showDate: true } });
			const expected = new Date(baseTodo.created_at).toLocaleDateString('ko-KR');
			expect(container).toHaveTextContent(expected);
		});

		it('showDate=false(기본값) → 날짜 텍스트가 표시되지 않는다', () => {
			const { container } = render(TodoItem, { props: { todo: baseTodo } });
			const dateText = new Date(baseTodo.created_at).toLocaleDateString('ko-KR');
			expect(container).not.toHaveTextContent(dateText);
		});

		it('onEdit prop 미전달 → 수정 버튼이 표시되지 않는다', () => {
			const { queryByRole } = render(TodoItem, { props: { todo: baseTodo } });
			expect(queryByRole('button', { name: /edit todo/i })).not.toBeInTheDocument();
		});
	});
});
