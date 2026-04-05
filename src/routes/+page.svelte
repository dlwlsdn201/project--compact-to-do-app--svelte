<script lang="ts">
	import { useTodos } from '$lib/features/todo/todoQueries';
	import TodoItem from '$lib/components/ui/TodoItem.svelte';
	import TodoFormModal from '$lib/components/ui/TodoFormModal.svelte';
	import type { Todo } from '$lib/types/todo';

	const todosQuery = useTodos();
	
	let isModalOpen = $state(false);

	function getTodayDateString() {
		const d = new Date();
		// YYYY-MM-DD
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}

	const todayString = getTodayDateString();

	let filteredTodos = $derived(
		(todosQuery.data || []).filter((todo: Todo) => {
			const todoDate = new Date(todo.created_at);
			const today = new Date();
			return todoDate.getDate() === today.getDate() &&
				   todoDate.getMonth() === today.getMonth() &&
				   todoDate.getFullYear() === today.getFullYear();
		})
	);

	let uncompletedTodos = $derived(filteredTodos.filter((t: Todo) => !t.is_completed));
	let completedTodos = $derived(filteredTodos.filter((t: Todo) => t.is_completed));
</script>

<div class="w-full flex flex-col gap-4">
	<div class="flex items-center justify-between pb-2 border-b">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">오늘 할 일</h1>
			<p class="text-sm text-muted-foreground mt-1">오늘 끝내야 할 일들에 집중하세요.</p>
		</div>
		<div class="text-4xl">🚩</div>
	</div>

	{#if todosQuery.isLoading}
		<div class="h-32 flex items-center justify-center text-muted-foreground">
			데이터를 불러오는 중입니다...
		</div>
	{:else if todosQuery.isError}
		<div class="h-32 flex items-center justify-center text-destructive">
			에러가 발생했습니다. 잠시 후 다시 시도해주세요.
		</div>
	{:else}
		<div class="mt-4 flex flex-col w-full">
			{#if uncompletedTodos.length === 0}
				<div class="py-12 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-xl mb-6 border border-dashed">
					<p class="text-sm font-medium">오늘 계획된 할 일이 없습니다.</p>
					<p class="text-xs mt-1">새로운 할 일을 추가해보세요!</p>
				</div>
			{/if}

			{#each uncompletedTodos as todo (todo.id)}
				<TodoItem {todo} />
			{/each}

			{#if completedTodos.length > 0}
				<h2 class="text-sm font-semibold text-muted-foreground mt-6 mb-3 tracking-wide">완료된 항목</h2>
				<div class="flex flex-col">
					{#each completedTodos as todo (todo.id)}
						<TodoItem {todo} />
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Floating Action Button -->
<button
	class="fixed bottom-24 right-6 sm:right-[calc(50%-18rem)] md:right-[calc(50%-16rem)] 
	w-14 h-14 bg-yellow-500 text-black hover:bg-yellow-400 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
	aria-label="Add Todo"
	onclick={() => (isModalOpen = true)}
>
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
</button>

<TodoFormModal bind:isOpen={isModalOpen} />
