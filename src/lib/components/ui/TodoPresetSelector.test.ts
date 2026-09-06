import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import TodoPresetSelector from './TodoPresetSelector.svelte';
import type { TodoPreset } from '$lib/types/preset';

// ─────────────────────────────────────────────
// Mock: 프리셋 쿼리 훅
// Supabase env 및 QueryClient 의존성을 제거한다.
// ─────────────────────────────────────────────
const mockCreateMutate = vi.fn();
const mockDeleteMutate = vi.fn();
let mockPresets: TodoPreset[] = [];

vi.mock('$lib/features/todo/presetQueries', () => ({
	usePresets: () => ({
		get data() {
			return mockPresets;
		},
		isLoading: false
	}),
	useCreatePreset: () => ({ mutate: mockCreateMutate, isPending: false }),
	useDeletePreset: () => ({ mutate: mockDeleteMutate, isPending: false })
}));

const weeklyReport: TodoPreset = {
	id: 'preset-1',
	user_id: 'guest',
	name: '주간 보고',
	title: '주간 업무 보고 작성',
	content: '지난주 성과 / 이번주 계획',
	priority: 'high',
	created_at: '2026-09-06T00:00:00.000Z'
};

describe('TodoPresetSelector', () => {
	beforeEach(() => {
		mockCreateMutate.mockClear();
		mockDeleteMutate.mockClear();
		mockPresets = [];
	});

	describe('Render', () => {
		it('프리셋이 없으면 안내 문구를 표시한다', () => {
			render(TodoPresetSelector, { props: { onApply: vi.fn() } });
			expect(screen.getByText(/저장된 프리셋이 없어요/)).toBeInTheDocument();
		});

		it('저장된 프리셋을 칩으로 표시한다', () => {
			mockPresets = [weeklyReport];
			render(TodoPresetSelector, { props: { onApply: vi.fn() } });
			expect(screen.getByTestId('preset-chip').textContent?.trim()).toBe('주간 보고');
		});
	});

	describe('프리셋 적용', () => {
		it('칩을 클릭하면 onApply에 해당 프리셋을 전달한다', async () => {
			mockPresets = [weeklyReport];
			const onApply = vi.fn();
			render(TodoPresetSelector, { props: { onApply } });

			await fireEvent.click(screen.getByTestId('preset-chip'));

			expect(onApply).toHaveBeenCalledWith(weeklyReport);
		});
	});

	describe('프리셋 저장', () => {
		it('제목이 비어 있으면 이름 입력 폼 대신 안내 에러를 표시한다', async () => {
			render(TodoPresetSelector, { props: { onApply: vi.fn(), title: '   ' } });

			await fireEvent.click(screen.getByTestId('preset-save-start'));
			await tick();

			expect(screen.getByText('프리셋으로 저장하려면 제목을 먼저 입력해주세요.')).toBeInTheDocument();
			expect(screen.queryByTestId('preset-name-form')).not.toBeInTheDocument();
			expect(mockCreateMutate).not.toHaveBeenCalled();
		});

		it('제목이 있으면 이름 입력 폼이 열리고 제목이 기본 이름으로 채워진다', async () => {
			render(TodoPresetSelector, { props: { onApply: vi.fn(), title: '주간 업무 보고 작성' } });

			await fireEvent.click(screen.getByTestId('preset-save-start'));
			await tick();

			const nameInput = screen.getByLabelText('프리셋 이름') as HTMLInputElement;
			expect(nameInput.value).toBe('주간 업무 보고 작성');
		});

		it('이름을 입력하고 저장하면 현재 폼 값으로 createPreset을 호출한다', async () => {
			render(TodoPresetSelector, {
				props: {
					onApply: vi.fn(),
					title: '주간 업무 보고 작성',
					content: '지난주 성과 / 이번주 계획',
					priority: 'high'
				}
			});

			await fireEvent.click(screen.getByTestId('preset-save-start'));
			await tick();
			await fireEvent.input(screen.getByLabelText('프리셋 이름'), {
				target: { value: '주간 보고' }
			});
			await fireEvent.click(screen.getByRole('button', { name: '저장' }));

			expect(mockCreateMutate).toHaveBeenCalledWith(
				{
					name: '주간 보고',
					title: '주간 업무 보고 작성',
					content: '지난주 성과 / 이번주 계획',
					priority: 'high'
				},
				expect.any(Object)
			);
		});

		it('이름을 비우고 저장하면 에러를 표시하고 호출하지 않는다', async () => {
			render(TodoPresetSelector, { props: { onApply: vi.fn(), title: '제목' } });

			await fireEvent.click(screen.getByTestId('preset-save-start'));
			await tick();
			await fireEvent.input(screen.getByLabelText('프리셋 이름'), { target: { value: '  ' } });
			await fireEvent.click(screen.getByRole('button', { name: '저장' }));

			expect(screen.getByText('프리셋 이름을 입력해주세요.')).toBeInTheDocument();
			expect(mockCreateMutate).not.toHaveBeenCalled();
		});

		it('취소하면 이름 입력 폼이 닫힌다', async () => {
			render(TodoPresetSelector, { props: { onApply: vi.fn(), title: '제목' } });

			await fireEvent.click(screen.getByTestId('preset-save-start'));
			await tick();
			await fireEvent.click(screen.getByRole('button', { name: '취소' }));
			await tick();

			expect(screen.queryByTestId('preset-name-form')).not.toBeInTheDocument();
		});
	});

	describe('프리셋 삭제', () => {
		it('삭제 버튼을 누르면 해당 id로 deletePreset을 호출한다', async () => {
			mockPresets = [weeklyReport];
			render(TodoPresetSelector, { props: { onApply: vi.fn() } });

			await fireEvent.click(screen.getByRole('button', { name: '주간 보고 프리셋 삭제' }));

			expect(mockDeleteMutate).toHaveBeenCalledWith('preset-1');
		});
	});
});
