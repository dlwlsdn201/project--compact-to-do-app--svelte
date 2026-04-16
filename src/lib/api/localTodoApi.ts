import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

const GUEST_TODOS_KEY = 'guest_todos';

function loadTodos(): Todo[] {
	try {
		const raw = localStorage.getItem(GUEST_TODOS_KEY);
		return raw ? (JSON.parse(raw) as Todo[]) : [];
	} catch {
		return [];
	}
}

function saveTodos(todos: Todo[]): void {
	localStorage.setItem(GUEST_TODOS_KEY, JSON.stringify(todos));
}

export const localTodoApi = {
	async getTodos(): Promise<Todo[]> {
		return loadTodos();
	},

	async createTodo(todo: CreateTodoDTO): Promise<Todo> {
		const todos = loadTodos();
		const newTodo: Todo = {
			...todo,
			id: crypto.randomUUID(),
			user_id: 'guest',
			content: todo.content ?? null,
			created_at: new Date().toISOString()
		};
		saveTodos([newTodo, ...todos]);
		return newTodo;
	},

	async updateTodo(id: string, updates: UpdateTodoDTO): Promise<Todo> {
		const todos = loadTodos();
		const updated = todos.map((t) => (t.id === id ? { ...t, ...updates } : t));
		saveTodos(updated);
		return updated.find((t) => t.id === id) as Todo;
	},

	async deleteTodo(id: string): Promise<void> {
		const todos = loadTodos();
		saveTodos(todos.filter((t) => t.id !== id));
	}
};
