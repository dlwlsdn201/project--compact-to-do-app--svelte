<script lang="ts">
	import type { Todo, Priority } from '$lib/types/todo';
	import { useUpdateTodo, useDeleteTodo } from '$lib/features/todo/todoQueries';
	import { Trash2, Pencil } from 'lucide-svelte';

	let { todo, showDate = false, isHistoryArea = false, onEdit } = $props<{ todo: Todo; showDate?: boolean; isHistoryArea?: boolean; onEdit?: (todo: Todo) => void }>();

	const updateTodo = useUpdateTodo();
	const deleteTodo = useDeleteTodo();

	function toggleCompletion() {
		updateTodo.mutate({
			id: todo.id,
			updates: { is_completed: !todo.is_completed }
		} as any);
	}

	function handleDelete() {
		if (confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
			deleteTodo.mutate(todo.id as any);
		}
	}

	function restoreToToday() {
		updateTodo.mutate({
			id: todo.id,
			updates: { due_date: new Date().toISOString() }
		} as any);
	}

	function restoreToTomorrow() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		updateTodo.mutate({
			id: todo.id,
			updates: { due_date: tomorrow.toISOString() }
		} as any);
	}

	const priorityColors: Record<Priority, string> = {
		low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
		medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
		high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
	};
</script>

<div
	class="group relative flex items-start gap-3 p-4 mb-3 rounded-xl border bg-card transition-all hover:shadow-md 
	{todo.is_completed ? 'bg-muted/50 border-transparent shadow-none' : 'border-border shadow-sm'}"
>
	<div class="mt-0.5">
		<button
			class="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors
			{todo.is_completed ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-muted-foreground'}"
			onclick={toggleCompletion}
			aria-label="Toggle completion state"
		>
			{#if todo.is_completed}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-check w-3.5 h-3.5"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
			{/if}
		</button>
	</div>

	<div class="flex-1 min-w-0 flex flex-col gap-1">
		<div class="flex flex-col w-full">
			<h3
				class="text-base font-semibold leading-snug tracking-tight transition-all break-words
				{todo.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}"
			>
				{todo.title}
			</h3>
		</div>
		
		{#if todo.content}
			<p class="text-xs text-muted-foreground line-clamp-2 break-words mt-0.5 {todo.is_completed ? 'opacity-60' : ''}">
				{todo.content}
			</p>
		{/if}
		
		<div class="flex items-center gap-2 mt-1.5">
			{#if showDate}
				<div class="text-[10px] text-muted-foreground font-medium">
					{new Date(todo.created_at).toLocaleDateString('ko-KR')}
				</div>
			{/if}
			<span class="text-[10px] font-bold px-2 py-0.5 rounded-[4px] {priorityColors[todo.priority as Priority]}">
				{todo.priority === 'high' ? '우선순위 높음' : todo.priority === 'medium' ? '우선순위 보통' : '우선순위 낮음'}
			</span>
		</div>
	</div>

	<div class="flex flex-col items-end sm:items-center gap-2 flex-shrink-0 ml-1">
		{#if isHistoryArea && !todo.is_completed}
			<div class="flex flex-col sm:flex-row gap-1">
				<button
					class="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] rounded hover:bg-yellow-200 transition-colors dark:bg-yellow-900/40 dark:text-yellow-400 font-medium border border-yellow-200 dark:border-yellow-800 whitespace-nowrap"
					onclick={restoreToToday}
				>
					오늘 하기
				</button>
				<button
					class="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] rounded hover:bg-blue-200 transition-colors dark:bg-blue-900/40 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800 whitespace-nowrap"
					onclick={restoreToTomorrow}
				>
					내일 하기
				</button>
			</div>
		{/if}

		<div class="flex flex-row w-full justify-end gap-x-1">
		{#if onEdit}
			<button
				class="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
				onclick={() => onEdit(todo)}
				aria-label="Edit todo"
			>
				<Pencil class="w-4 h-4" />
			</button>
		{/if}

		<button
			class="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
			onclick={handleDelete}
			aria-label="Delete todo"
		>
			<Trash2 class="w-4 h-4" />
		</button>
		</div>
	</div>
</div>
