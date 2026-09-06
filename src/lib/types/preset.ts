import type { Priority } from './todo';

/**
 * 할 일 프리셋(템플릿).
 * 자주 쓰는 제목·내용·우선순위 형식을 저장해두고 신규 등록 시 폼을 한 번에 채우는 데 쓴다.
 */
export interface TodoPreset {
	id: string;
	user_id: string;
	/** 프리셋을 고르는 기준이 되는 이름 (예: '주간 보고') */
	name: string;
	title: string;
	content: string | null;
	priority: Priority;
	created_at: string;
}

export type CreateTodoPresetDTO = Omit<TodoPreset, 'id' | 'user_id' | 'created_at'>;
