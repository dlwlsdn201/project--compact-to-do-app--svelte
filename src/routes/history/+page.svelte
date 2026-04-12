<script lang="ts">
	import { useTodos } from '$lib/features/todo/todoQueries';
	import TodoItem from '$lib/components/ui/TodoItem.svelte';
	import type { Todo } from '$lib/types/todo';
	import { isPast } from '$lib/utils/date';
	import { History } from 'lucide-svelte';

	const todosQuery = useTodos();
	let searchQuery = $state('');

	let filteredTodos = $derived(
		(todosQuery.data || []).filter((todo: Todo) => {
			if (!isPast(todo.due_date)) return false;
			if (!searchQuery) return true;
			
			const query = searchQuery.toLowerCase();
			return todo.title.toLowerCase().includes(query) || 
				   (todo.content && todo.content.toLowerCase().includes(query));
		})
	);

	let uncompletedTodos = $derived(filteredTodos.filter((t: Todo) => !t.is_completed));
	let completedTodos = $derived(filteredTodos.filter((t: Todo) => t.is_completed));
</script>

<div class="w-full flex flex-col gap-4 pb-20">
	<div class="flex items-center justify-between pb-2 border-b">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">지난 이력</h1>
			<p class="text-sm text-muted-foreground mt-1">과거의 기록과 놓친 일들을 관리하세요.</p>
		</div>
		<div class="text-4xl text-gray-400">
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
		<div class="h-32 flex items-center justify-center text-muted-foreground">
			데이터를 불러오는 중입니다...
		</div>
	{:else if todosQuery.isError}
		<div class="h-32 flex items-center justify-center text-destructive">
			에러가 발생했습니다. 잠시 후 다시 시도해주세요.
		</div>
	{:else}
		<div class="mt-4 flex flex-col w-full">
			{#if uncompletedTodos.length === 0 && completedTodos.length === 0}
				<div class="py-12 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-xl mb-6 border border-dashed">
					<p class="text-sm font-medium">{searchQuery ? '검색 결과가 없습니다.' : '지난 이력이 없습니다.'}</p>
				</div>
			{:else}
				{#if uncompletedTodos.length > 0}
					<h2 class="text-sm font-semibold text-destructive mt-2 mb-3 tracking-wide flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
						기한을 놓친 미완료 항목
					</h2>
					<div class="flex flex-col mb-6">
						{#each uncompletedTodos as todo (todo.id)}
							<TodoItem {todo} showDate={true} isHistoryArea={true} />
						{/each}
					</div>
				{/if}

				{#if completedTodos.length > 0}
					<h2 class="text-sm font-semibold text-muted-foreground mb-3 tracking-wide border-t pt-6">과거 완료된 항목</h2>
					<div class="flex flex-col opacity-80">
						{#each completedTodos as todo (todo.id)}
							<TodoItem {todo} showDate={true} isHistoryArea={true} />
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
