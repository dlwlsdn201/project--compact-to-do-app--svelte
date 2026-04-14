import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import TodoFormModal from './TodoFormModal.svelte';
import type { Todo } from '$lib/types/todo';

// ─────────────────────────────────────────────
// Mock: TanStack Query hooks
// Supabase 연결 및 QueryClient 의존성을 제거한다.
// ─────────────────────────────────────────────
const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();

vi.mock('$lib/features/todo/todoQueries', () => ({
	useCreateTodo: () => ({ mutate: mockCreateMutate, isPending: false }),
	useUpdateTodo: () => ({ mutate: mockUpdateMutate, isPending: false }),
	useDeleteTodo: () => ({ mutate: vi.fn(), isPending: false })
}));

// ─────────────────────────────────────────────
// 공통 테스트 픽스처
// ─────────────────────────────────────────────
const editingTodo: Todo = {
	id: 'todo-1',
	user_id: 'user-1',
	title: '기존 할 일 제목',
	content: '기존 내용',
	priority: 'medium',
	is_completed: false,
	due_date: '2026-04-14',
	created_at: '2026-04-14T09:00:00.000Z'
};

describe('TodoFormModal', () => {
	beforeEach(() => {
		mockCreateMutate.mockClear();
		mockUpdateMutate.mockClear();
	});

	// ──────────────────────────────────────────
	// Render
	// ──────────────────────────────────────────
	describe('Render', () => {
		it('isOpen=true이면 모달 헤더가 DOM에 나타난다', () => {
			render(TodoFormModal, { props: { isOpen: true } });
			expect(screen.getByRole('heading', { name: '새 할 일 추가' })).toBeInTheDocument();
		});

		it('isOpen=false이면 모달이 DOM에 존재하지 않는다', () => {
			render(TodoFormModal, { props: { isOpen: false } });
			expect(screen.queryByRole('heading', { name: '새 할 일 추가' })).not.toBeInTheDocument();
		});

		it('editingTodo 미전달 시 "새 할 일 추가" 헤더가 표시된다', () => {
			render(TodoFormModal, { props: { isOpen: true } });
			expect(screen.getByRole('heading', { name: '새 할 일 추가' })).toBeInTheDocument();
		});

		it('editingTodo 전달 시 "할 일 수정" 헤더가 표시된다', () => {
			render(TodoFormModal, { props: { isOpen: true, editingTodo } });
			expect(screen.getByRole('heading', { name: '할 일 수정' })).toBeInTheDocument();
		});

		it('수정 모드에서 editingTodo.title이 입력창에 채워진다', async () => {
			render(TodoFormModal, { props: { isOpen: true, editingTodo } });
			await tick(); // $effect 실행 대기
			const input = screen.getByLabelText('* 제목') as HTMLInputElement;
			expect(input.value).toBe('기존 할 일 제목');
		});
	});

	// ──────────────────────────────────────────
	// Interaction
	// ──────────────────────────────────────────
	describe('Interaction', () => {
		it('유효한 제목 입력 후 제출 시 createTodo.mutate가 호출된다', async () => {
			render(TodoFormModal, { props: { isOpen: true, defaultDate: '2026-04-14T00:00:00.000Z' } });
			const input = screen.getByLabelText('* 제목');
			await fireEvent.input(input, { target: { value: '새로운 할 일' } });
			const form = document.querySelector('form')!;
			await fireEvent.submit(form);
			expect(mockCreateMutate).toHaveBeenCalledWith(
				expect.objectContaining({ title: '새로운 할 일', is_completed: false }),
				expect.any(Object)
			);
		});

		it('수정 모드에서 제출 시 updateTodo.mutate가 editingTodo.id와 함께 호출된다', async () => {
			render(TodoFormModal, { props: { isOpen: true, editingTodo } });
			await tick();
			const form = document.querySelector('form')!;
			await fireEvent.submit(form);
			expect(mockUpdateMutate).toHaveBeenCalledWith(
				expect.objectContaining({ id: 'todo-1' }),
				expect.any(Object)
			);
		});

		it('X 버튼 클릭 시 모달이 DOM에서 사라진다', async () => {
			const { container } = render(TodoFormModal, { props: { isOpen: true } });
			// 헤더의 닫기 버튼: rounded-full 클래스로 식별
			const closeBtn = container.querySelector('button.rounded-full') as HTMLButtonElement;
			expect(closeBtn).not.toBeNull();
			await fireEvent.click(closeBtn);
			await tick();
			expect(screen.queryByRole('heading', { name: '새 할 일 추가' })).not.toBeInTheDocument();
		});

		it('오버레이(배경) 클릭 시 모달이 DOM에서 사라진다', async () => {
			const { container } = render(TodoFormModal, { props: { isOpen: true } });
			// 최상위 고정 div가 오버레이
			const overlay = container.querySelector('div.fixed') as HTMLDivElement;
			expect(overlay).not.toBeNull();
			await fireEvent.click(overlay);
			await tick();
			expect(screen.queryByRole('heading', { name: '새 할 일 추가' })).not.toBeInTheDocument();
		});
	});

	// ──────────────────────────────────────────
	// Edge Case (Validation)
	// ──────────────────────────────────────────
	describe('유효성 검사', () => {
		it('제목 미입력 제출 → "제목을 입력해주세요." 에러가 표시된다', async () => {
			render(TodoFormModal, { props: { isOpen: true } });
			const form = document.querySelector('form')!;
			await fireEvent.submit(form);
			expect(screen.getByText('제목을 입력해주세요.')).toBeInTheDocument();
		});

		it('71자 입력 시 oninput 핸들러가 70자로 잘라낸다', async () => {
			render(TodoFormModal, { props: { isOpen: true } });
			const input = screen.getByLabelText('* 제목') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: 'a'.repeat(71) } });
			expect(input.value).toHaveLength(70);
		});

		it('제목 미입력 제출 시 createTodo.mutate가 호출되지 않는다', async () => {
			render(TodoFormModal, { props: { isOpen: true } });
			const form = document.querySelector('form')!;
			await fireEvent.submit(form);
			expect(mockCreateMutate).not.toHaveBeenCalled();
		});

		it('정확히 50자 제목은 에러 없이 createTodo.mutate를 호출한다', async () => {
			render(TodoFormModal, { props: { isOpen: true } });
			const input = screen.getByLabelText('* 제목');
			await fireEvent.input(input, { target: { value: 'a'.repeat(50) } });
			const form = document.querySelector('form')!;
			await fireEvent.submit(form);
			expect(screen.queryByText('제목은 70자를 넘을 수 없습니다.')).not.toBeInTheDocument();
			expect(mockCreateMutate).toHaveBeenCalled();
		});
	});
});
