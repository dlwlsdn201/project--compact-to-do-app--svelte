import { supabase } from './supabase';
import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

// In-memory mock data to persist between API calls
let MOCK_TODOS: Todo[] = [
	{
		id: 'm1',
		user_id: 'u1',
		title: '슈퍼베이스 마이그레이션',
		content: '로컬 환경 구성 완료하기',
		priority: 'high',
		is_completed: false,
		due_date: new Date().toISOString(),
		created_at: new Date().toISOString()
	},
	{
		id: 'm2',
		user_id: 'u1',
		title: '카카오 로그인 설정',
		content: '키값 받고 연동 셋업',
		priority: 'medium',
		is_completed: true,
		due_date: new Date().toISOString(),
		created_at: new Date(Date.now() - 86400000).toISOString()
	}
];

export const todoApi = {
	async getTodos(): Promise<Todo[]> {
		const { data, error } = await supabase
			.from('todos')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching todos:', error);
			// RETURN IN-MEMORY MOCK DATA
			return [...MOCK_TODOS];
		}
		return data as Todo[];
	},

	async createTodo(todo: CreateTodoDTO): Promise<Todo> {
		const { data, error } = await supabase
			.from('todos')
			.insert([todo])
			.select()
			.single();

		if (error) {
			console.error('Error creating todo:', error);
			// ADD TO IN-MEMORY MOCK DATA
			const newTodo: Todo = { 
				...todo, 
				id: crypto.randomUUID(), 
				user_id: 'mock', 
				content: todo.content || null,
				created_at: new Date().toISOString() 
			};
			MOCK_TODOS = [newTodo, ...MOCK_TODOS];
			return newTodo;
		}
		return data as Todo;
	},

	async updateTodo(id: string, updates: UpdateTodoDTO): Promise<Todo> {
		const { data, error } = await supabase
			.from('todos')
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating todo:', error);
			// UPDATE IN-MEMORY MOCK DATA
			MOCK_TODOS = MOCK_TODOS.map(t => t.id === id ? { ...t, ...updates } : t);
			return MOCK_TODOS.find(t => t.id === id) as Todo;
		}
		return data as Todo;
	},

	async deleteTodo(id: string): Promise<void> {
		const { error } = await supabase.from('todos').delete().eq('id', id);
		if (error) {
			console.error('Error deleting todo:', error);
			// DELETE IN-MEMORY MOCK DATA
			MOCK_TODOS = MOCK_TODOS.filter(t => t.id !== id);
		}
	}
};
