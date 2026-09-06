export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
	id: string;
	user_id: string;
	title: string;
	content: string | null;
	priority: Priority;
	is_completed: boolean;
	due_date: string | null;
	/** 마감 시각 'HH:mm' (선택). null이면 시각 미지정. */
	due_time: string | null;
	created_at: string;
}

export type CreateTodoDTO = Omit<Todo, 'id' | 'user_id' | 'created_at'>;
export type UpdateTodoDTO = Partial<CreateTodoDTO>;
