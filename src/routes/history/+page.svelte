<script lang="ts">
	import { History } from 'lucide-svelte';
	import { useTodos } from '$lib/features/todo/todoQueries';
	import TodoItem from '$lib/components/ui/TodoItem.svelte';
	import type { Todo } from '$lib/types/todo';

	const todosQuery = useTodos();
	let searchQuery = $state('');

	let filteredTodos = $derived(
		(todosQuery.data || []).filter((todo: Todo) => {
			const todoDate = new Date(todo.created_at);
			const today = new Date();
			
			// Only show past dates (before today)
			const isPastDate = todoDate.getFullYear() < today.getFullYear() ||
							   (todoDate.getFullYear() === today.getFullYear() && todoDate.getMonth() < today.getMonth()) ||
							   (todoDate.getFullYear() === today.getFullYear() && todoDate.getMonth() === today.getMonth() && todoDate.getDate() < today.getDate());

			if (!isPastDate) return false;

			if (!searchQuery) return true;
			return todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
				   (todo.content && todo.content.toLowerCase().includes(searchQuery.toLowerCase()));
		})
	);
</script>

<div class="w-full flex flex-col gap-4">
	<div class="flex items-center justify-between pb-2 border-b">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">지난 이력</h1>
			<p class="text-sm text-muted-foreground mt-1">과거의 기록들을 확인하고 검색하세요.</p>
		</div>
		<div class="text-4xl text-gray-500">
			<History class="w-8 h-8" />
		</div>
	</div>

	<div class="mt-2 relative">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="할 일 검색..."
			class="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		/>
	</div>

	{#if todosQuery.isLoading}
		<div class="h-32 flex items-center justify-center text-muted-foreground">불러오는 중...</div>
	{:else}
		<div class="mt-4 flex flex-col w-full">
			{#each filteredTodos as todo (todo.id)}
				<TodoItem {todo} showDate={true} />
			{:else}
				<div class="py-12 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-xl mt-2 border border-dashed">
					<p class="text-sm font-medium">검색 결과가 없습니다.</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
