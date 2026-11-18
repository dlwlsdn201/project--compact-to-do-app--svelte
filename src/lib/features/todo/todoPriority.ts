import type { Priority } from '$lib/types/todo';

interface TodoPriorityStyle {
	label: string;
	textClass: string;
	badgeClass: string;
}

const TODO_PRIORITY_STYLES = {
	low: {
		label: '낮음',
		textClass: 'text-green-800 [.dark_&]:text-green-400',
		badgeClass: 'bg-green-100 [.dark_&]:bg-green-900/30'
	},
	medium: {
		label: '보통',
		textClass: 'text-yellow-800 [.dark_&]:text-yellow-400',
		badgeClass: 'bg-yellow-100 [.dark_&]:bg-yellow-900/30'
	},
	high: {
		label: '높음',
		textClass: 'text-red-800 [.dark_&]:text-red-400',
		badgeClass: 'bg-red-100 [.dark_&]:bg-red-900/30'
	}
} satisfies Record<Priority, TodoPriorityStyle>;

/** @returns 목록과 미리보기에 공통으로 사용하는 우선순위 이름과 색상 */
export const getTodoPriorityStyle = (priority: Priority): TodoPriorityStyle =>
	TODO_PRIORITY_STYLES[priority] ?? TODO_PRIORITY_STYLES.low;
