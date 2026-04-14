import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TodoItem from './TodoItem.svelte';
import type { Todo } from '$lib/types/todo';

// ─────────────────────────────────────────────
// Mock: TanStack Query hooks
// useUpdateTodo / useDeleteTodo 를 vi.mock으로 대체하여
// Supabase 연결 및 QueryClient 의존성을 제거한다.
// ─────────────────────────────────────────────
const mockUpdateMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock('$lib/features/todo/todoQueries', () => ({
	useUpdateTodo: () => ({ mutate: mockUpdateMutate, isPending: false }),
	useDeleteTodo: () => ({ mutate: mockDeleteMutate, isPending: false }),
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
	created_at: '2026-04-14T09:00:00.000Z'
};

describe('TodoItem', () => {
	beforeEach(() => {
		mockUpdateMutate.mockClear();
		mockDeleteMutate.mockClear();
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

		it('삭제 버튼 클릭 후 confirm 승인 → deleteTodo.mutate가 todo id로 호출된다', async () => {
			vi.spyOn(window, 'confirm').mockReturnValue(true);
			const { getByRole } = render(TodoItem, { props: { todo: baseTodo } });
			const deleteBtn = getByRole('button', { name: /delete todo/i });
			await fireEvent.click(deleteBtn);
			expect(window.confirm).toHaveBeenCalled();
			expect(mockDeleteMutate).toHaveBeenCalledWith('todo-1');
		});

		it('삭제 버튼 클릭 후 confirm 취소 → deleteTodo.mutate가 호출되지 않는다', async () => {
			vi.spyOn(window, 'confirm').mockReturnValue(false);
			const { getByRole } = render(TodoItem, { props: { todo: baseTodo } });
			const deleteBtn = getByRole('button', { name: /delete todo/i });
			await fireEvent.click(deleteBtn);
			expect(mockDeleteMutate).not.toHaveBeenCalled();
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
