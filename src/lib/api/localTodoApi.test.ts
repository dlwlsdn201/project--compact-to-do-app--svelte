import { describe, it, expect, beforeEach } from 'vitest';
import { localTodoApi } from './localTodoApi';

// localTodoApi는 순수 localStorage 기반 CRUD이므로 외부 의존성이 없다.
// jsdom 환경의 localStorage를 직접 사용하고 beforeEach에서 초기화한다.

describe('localTodoApi', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe('getTodos()', () => {
		it('localStorage가 비어있으면 빈 배열을 반환한다', async () => {
			const todos = await localTodoApi.getTodos();
			expect(todos).toEqual([]);
		});

		it('저장된 Todo 목록을 반환한다', async () => {
			await localTodoApi.createTodo({
				title: '테스트 할 일',
				content: null,
				priority: 'medium',
				is_completed: false,
				due_date: null
			});

			const todos = await localTodoApi.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('테스트 할 일');
		});
	});

	describe('createTodo()', () => {
		it('새 Todo를 생성하고 자동 필드(id, user_id, created_at)를 설정한다', async () => {
			const dto = {
				title: '새 할 일',
				content: '내용',
				priority: 'high' as const,
				is_completed: false,
				due_date: '2026-04-20'
			};

			const created = await localTodoApi.createTodo(dto);

			expect(created.id).toBeTruthy();
			expect(created.user_id).toBe('guest');
			expect(created.created_at).toBeTruthy();
			expect(created.title).toBe('새 할 일');
			expect(created.content).toBe('내용');
			expect(created.priority).toBe('high');
			expect(created.is_completed).toBe(false);
			expect(created.due_date).toBe('2026-04-20');
		});

		it('생성 후 getTodos()에서 조회할 수 있다', async () => {
			await localTodoApi.createTodo({
				title: '할 일 A',
				content: null,
				priority: 'low',
				is_completed: false,
				due_date: null
			});
			await localTodoApi.createTodo({
				title: '할 일 B',
				content: null,
				priority: 'medium',
				is_completed: true,
				due_date: null
			});

			const todos = await localTodoApi.getTodos();
			expect(todos).toHaveLength(2);
		});

		it('가장 최근 생성된 항목이 목록 앞에 위치한다', async () => {
			await localTodoApi.createTodo({
				title: '먼저 생성',
				content: null,
				priority: 'low',
				is_completed: false,
				due_date: null
			});
			await localTodoApi.createTodo({
				title: '나중에 생성',
				content: null,
				priority: 'low',
				is_completed: false,
				due_date: null
			});

			const todos = await localTodoApi.getTodos();
			expect(todos[0].title).toBe('나중에 생성');
		});
	});

	describe('updateTodo()', () => {
		it('기존 Todo를 업데이트하고 변경된 항목을 반환한다', async () => {
			const created = await localTodoApi.createTodo({
				title: '원래 제목',
				content: null,
				priority: 'low',
				is_completed: false,
				due_date: null
			});

			const updated = await localTodoApi.updateTodo(created.id, {
				title: '변경된 제목',
				is_completed: true
			});

			expect(updated.id).toBe(created.id);
			expect(updated.title).toBe('변경된 제목');
			expect(updated.is_completed).toBe(true);
		});

		it('업데이트 후 getTodos()에서 변경사항이 반영된다', async () => {
			const created = await localTodoApi.createTodo({
				title: '원래',
				content: null,
				priority: 'medium',
				is_completed: false,
				due_date: null
			});

			await localTodoApi.updateTodo(created.id, { is_completed: true });

			const todos = await localTodoApi.getTodos();
			expect(todos[0].is_completed).toBe(true);
		});
	});

	describe('deleteTodo()', () => {
		it('지정한 id의 Todo를 삭제한다', async () => {
			const todo = await localTodoApi.createTodo({
				title: '삭제할 할 일',
				content: null,
				priority: 'low',
				is_completed: false,
				due_date: null
			});

			await localTodoApi.deleteTodo(todo.id);

			const todos = await localTodoApi.getTodos();
			expect(todos).toHaveLength(0);
		});

		it('여러 항목 중 해당 id만 삭제한다', async () => {
			const todoA = await localTodoApi.createTodo({
				title: '삭제 대상',
				content: null,
				priority: 'low',
				is_completed: false,
				due_date: null
			});
			await localTodoApi.createTodo({
				title: '유지되어야 함',
				content: null,
				priority: 'medium',
				is_completed: false,
				due_date: null
			});

			await localTodoApi.deleteTodo(todoA.id);

			const todos = await localTodoApi.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('유지되어야 함');
		});
	});
});
