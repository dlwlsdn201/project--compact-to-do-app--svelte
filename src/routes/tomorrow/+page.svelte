<script lang="ts">
	import { useTodos } from '$lib/features/todo/todoQueries';
	import TodoItem from '$lib/components/ui/TodoItem.svelte';
	import TodoSkeleton from '$lib/components/ui/TodoSkeleton.svelte';
	import TodoFormModal from '$lib/components/ui/TodoFormModal.svelte';
	import type { Todo } from '$lib/types/todo';
	import { isTomorrow, getTomorrowDateString } from '$lib/utils/date';
	import { sortTodos, type SortOrder } from '$lib/utils/sort';
	import { Calendar, Plus } from 'lucide-svelte';

	const todosQuery = useTodos();
	
	let isModalOpen = $state(false);
	let editingTodo = $state<Todo | null>(null);
	let sortOrder = $state<SortOrder>('priority-desc');

	function openCreateModal() {
		editingTodo = null;
		isModalOpen = true;
	}

	function handleEdit(t: Todo) {
		editingTodo = t;
		isModalOpen = true;
	}

	const tomorrowString = getTomorrowDateString();

	let filteredTodos = $derived(
		(todosQuery.data || []).filter((todo: Todo) => isTomorrow(todo.due_date))
	);

	let sortedFilteredTodos = $derived(sortTodos(filteredTodos, sortOrder));

	let uncompletedTodos = $derived(sortedFilteredTodos.filter((t: Todo) => !t.is_completed));
	let completedTodos = $derived(sortedFilteredTodos.filter((t: Todo) => t.is_completed));
</script>

<div class="w-full flex flex-col gap-4">
	<div class="flex items-center justify-between pb-2 border-b">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">내일 할 일 📝</h1>
			<p class="text-sm text-muted-foreground mt-1">내일을 위해 미리 준비하세요.</p>
		</div>
		<div class="flex items-center gap-2">
			<select
				bind:value={sortOrder}
				class="text-xs bg-muted border-none rounded-md px-2 py-1 text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
			>
				<option value="priority-desc">우선순위 역순 (높은순)</option>
				<option value="priority-asc">우선순위 (낮은순)</option>
			</select>
		</div>
	</div>

	{#if todosQuery.isLoading}
		<div class="mt-4">
			<TodoSkeleton />
		</div>
	{:else if todosQuery.isError}
		<div class="h-32 flex items-center justify-center text-destructive">
			에러가 발생했습니다. 잠시 후 다시 시도해주세요.
		</div>
	{:else}
		<div class="mt-4 flex flex-col w-full">
			{#if uncompletedTodos.length === 0}
				<div class="py-12 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-xl mb-6 border border-dashed">
					<p class="text-sm font-medium">아직 내일 계획이 없습니다.</p>
					<p class="text-xs mt-1">미리 계획을 세우면 내일이 더 쉬워져요!</p>
				</div>
			{/if}

			{#each uncompletedTodos as todo (todo.id)}
				<TodoItem {todo} onEdit={handleEdit} />
			{/each}

			{#if completedTodos.length > 0}
				<h2 class="text-sm font-semibold text-muted-foreground mt-6 mb-3 tracking-wide">완료된 항목</h2>
				<div class="flex flex-col">
					{#each completedTodos as todo (todo.id)}
						<TodoItem {todo} onEdit={handleEdit} />
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Floating Action Button -->
<button
	class="fixed bottom-24 right-6 sm:right-[calc(50%-18rem)] md:right-[calc(50%-16rem)] 
	w-14 h-14 bg-blue-500 text-white hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
	aria-label="Add Tomorrow Todo"
	onclick={openCreateModal}
>
	<Plus class="w-6 h-6" />
</button>

<TodoFormModal bind:isOpen={isModalOpen} {editingTodo} defaultDate={tomorrowString} />
