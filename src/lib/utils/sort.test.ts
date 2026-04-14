import { describe, it, expect } from 'vitest';
import { sortTodos } from './sort';
import type { Todo } from '$lib/types/todo';

// ─────────────────────────────────────────────
// 테스트용 팩토리 함수
// ─────────────────────────────────────────────
function makeTodo(priority: Todo['priority'], id = priority): Todo {
	return {
		id,
		user_id: 'user-1',
		title: `${priority} 우선순위 할 일`,
		content: null,
		priority,
		is_completed: false,
		due_date: '2026-04-14',
		created_at: new Date().toISOString()
	};
}

// ─────────────────────────────────────────────
// sortTodos
// ─────────────────────────────────────────────
describe('sortTodos', () => {
	describe('priority-desc (높음 우선)', () => {
		it('high → medium → low 순서로 정렬한다', () => {
			const todos = [makeTodo('low'), makeTodo('high'), makeTodo('medium')];
			const result = sortTodos(todos, 'priority-desc');
			expect(result.map((t) => t.priority)).toEqual(['high', 'medium', 'low']);
		});

		it('기본값(order 미지정)은 priority-desc이다', () => {
			const todos = [makeTodo('low'), makeTodo('high')];
			const result = sortTodos(todos);
			expect(result[0].priority).toBe('high');
			expect(result[1].priority).toBe('low');
		});
	});

	describe('priority-asc (낮음 우선)', () => {
		it('low → medium → high 순서로 정렬한다', () => {
			const todos = [makeTodo('high'), makeTodo('low'), makeTodo('medium')];
			const result = sortTodos(todos, 'priority-asc');
			expect(result.map((t) => t.priority)).toEqual(['low', 'medium', 'high']);
		});
	});

	describe('불변성', () => {
		it('원본 배열을 변경하지 않는다', () => {
			const todos = [makeTodo('low'), makeTodo('high'), makeTodo('medium')];
			const original = todos.map((t) => ({ ...t }));
			sortTodos(todos, 'priority-desc');
			expect(todos.map((t) => t.priority)).toEqual(original.map((t) => t.priority));
		});
	});

	describe('엣지 케이스', () => {
		it('빈 배열을 입력하면 빈 배열을 반환한다', () => {
			expect(sortTodos([], 'priority-desc')).toEqual([]);
		});

		it('항목이 하나면 그대로 반환한다', () => {
			const todos = [makeTodo('medium')];
			expect(sortTodos(todos, 'priority-desc')).toHaveLength(1);
		});

		it('같은 우선순위 항목은 입력 순서를 유지한다 (안정 정렬)', () => {
			const todos = [
				{ ...makeTodo('high'), id: 'first' },
				{ ...makeTodo('high'), id: 'second' },
				{ ...makeTodo('high'), id: 'third' }
			];
			const result = sortTodos(todos, 'priority-desc');
			expect(result.map((t) => t.id)).toEqual(['first', 'second', 'third']);
		});

		it('모두 동일한 우선순위일 때 원본 순서를 유지한다', () => {
			const todos = [
				{ ...makeTodo('low'), id: 'a' },
				{ ...makeTodo('low'), id: 'b' }
			];
			const result = sortTodos(todos, 'priority-asc');
			expect(result.map((t) => t.id)).toEqual(['a', 'b']);
		});
	});
});
