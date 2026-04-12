import type { Priority, Todo } from '$lib/types/todo';

export type SortOrder = 'priority-desc' | 'priority-asc';

function getPriorityValue(priority: Priority): number {
	switch (priority) {
		case 'high': return 3;
		case 'medium': return 2;
		case 'low': return 1;
		default: return 0;
	}
}

export function sortTodos(todos: Todo[], order: SortOrder = 'priority-desc'): Todo[] {
	return [...todos].sort((a, b) => {
		const valA = getPriorityValue(a.priority);
		const valB = getPriorityValue(b.priority);
		
		if (order === 'priority-desc') {
			// High priority first
			return valB - valA;
		} else {
			// Low priority first
			return valA - valB;
		}
	});
}
