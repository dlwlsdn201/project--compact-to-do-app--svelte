<script lang="ts">
	import type { Todo, Priority } from '$lib/types/todo';
	import { useUpdateTodo, useDeleteTodo } from '$lib/features/todo/todoQueries';
	import { slide, fade } from 'svelte/transition';
	import { Trash2 } from 'lucide-svelte';

	let { todo } = $props<{ todo: Todo }>();

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

	const priorityColors: Record<Priority, string> = {
		low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
		medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
		high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
	};
</script>

<div
	out:slide={{ duration: 200 }}
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
					in:fade={{ duration: 100 }}
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

	<div class="flex-1 w-full flex flex-col gap-1 items-start justify-center">
		<div class="flex items-center gap-2 w-full justify-between">
			<h3
				class="text-base font-semibold leading-none tracking-tight transition-all
				{todo.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}"
			>
				{todo.title}
			</h3>
			<span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase {priorityColors[todo.priority as Priority]}">
				{todo.priority}
			</span>
		</div>
		
		{#if todo.content}
			<p class="text-xs text-muted-foreground line-clamp-2 {todo.is_completed ? 'opacity-60' : ''}">
				{todo.content}
			</p>
		{/if}
		
		<div class="text-[10px] text-muted-foreground mt-1 font-medium">
			{new Date(todo.created_at).toLocaleDateString('ko-KR')}
		</div>
	</div>

	<button
		class="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground focus:opacity-100"
		onclick={handleDelete}
		aria-label="Delete todo"
	>
		<Trash2 class="w-4 h-4" />
	</button>
</div>
