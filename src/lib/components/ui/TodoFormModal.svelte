<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Priority, Todo } from '$lib/types/todo';
	import { useCreateTodo, useUpdateTodo } from '$lib/features/todo/todoQueries';
	import { X } from 'lucide-svelte';
	// Simple Zod integration
	import { z } from 'zod';

	let { isOpen = $bindable(false), editingTodo = null, defaultDate = new Date().toISOString() } = $props<{
		isOpen: boolean;
		editingTodo?: Todo | null;
		defaultDate?: string;
	}>();

	const createTodo = useCreateTodo();
	const updateTodo = useUpdateTodo();

	let title = $state('');
	let content = $state('');
	let priority = $state<Priority>('low');
	let error = $state<string | null>(null);

	$effect(() => {
		if (isOpen) {
			if (editingTodo) {
				title = editingTodo.title;
				content = editingTodo.content || '';
				priority = editingTodo.priority as Priority;
			} else {
				title = '';
				content = '';
				priority = 'low';
			}
			error = null;
		}
	});

	const schema = z.object({
		title: z.string().min(1, '제목을 입력해주세요.').max(50, '제목은 50자를 넘을 수 없습니다.'),
		content: z.string().optional(),
		priority: z.enum(['low', 'medium', 'high'])
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const result = schema.safeParse({ title, content, priority });
		if (!result.success) {
			error = result.error.issues?.[0]?.message || '오류가 발생했습니다.';
			return;
		}

		// Success
		error = null;
		
		if (editingTodo) {
			updateTodo.mutate(
				{
					id: editingTodo.id,
					updates: {
						title: result.data.title,
						content: result.data.content || null,
						priority: result.data.priority
					}
				},
				{
					onSuccess: () => {
						isOpen = false;
					}
				}
			);
		} else {
			createTodo.mutate(
				{
					title: result.data.title,
					content: result.data.content || null,
					priority: result.data.priority,
					is_completed: false,
					due_date: defaultDate
				},
				{
					onSuccess: () => {
						isOpen = false;
					}
				}
			);
		}
	}

	function close() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 transition-all"
		onclick={close}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-card text-card-foreground border rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-lg flex flex-col pt-2"
			onclick={(e) => e.stopPropagation()}
			in:slide={{ duration: 250, axis: 'y' }}
			out:slide={{ duration: 200, axis: 'y' }}
		>
			<div class="flex items-center justify-between px-4 pb-2 border-b">
				<h2 class="text-lg font-semibold tracking-tight">{editingTodo ? '할 일 수정' : '새 할 일 추가'}</h2>
				<button class="p-2 hover:bg-muted rounded-full" onclick={close}>
					<X class="w-5 h-5" />
				</button>
			</div>

			<form class="p-4 flex flex-col gap-4" onsubmit={handleSubmit}>
				<div class="flex flex-col gap-1.5">
					<label for="title" class="text-sm font-medium">제목</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						placeholder="무엇을 해야 하나요?"
						required
						autofocus
					/>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="content" class="text-sm font-medium">상세 내용 (선택)</label>
					<textarea
						id="content"
						bind:value={content}
						class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						placeholder="자세한 내용을 기록하세요"
					></textarea>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="priority" class="text-sm font-medium">우선순위</label>
					<div class="flex gap-2">
						<button
							type="button"
							class="flex-1 py-2 rounded-md border text-sm font-medium transition-colors
							{priority === 'low' ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400' : 'bg-transparent border-input text-foreground hover:bg-muted'}"
							onclick={() => (priority = 'low')}
						>
							낮음
						</button>
						<button
							type="button"
							class="flex-1 py-2 rounded-md border text-sm font-medium transition-colors
							{priority === 'medium' ? 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-800 dark:text-yellow-400' : 'bg-transparent border-input text-foreground hover:bg-muted'}"
							onclick={() => (priority = 'medium')}
						>
							중간
						</button>
						<button
							type="button"
							class="flex-1 py-2 rounded-md border text-sm font-medium transition-colors
							{priority === 'high' ? 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400' : 'bg-transparent border-input text-foreground hover:bg-muted'}"
							onclick={() => (priority = 'high')}
						>
							높음
						</button>
					</div>
				</div>

				{#if error}
					<p class="text-sm text-destructive font-medium mt-1">{error}</p>
				{/if}

				<button
					type="submit"
					disabled={createTodo.isPending || updateTodo.isPending}
					class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full"
				>
					{createTodo.isPending || updateTodo.isPending ? '저장 중...' : '저장하기'}
				</button>
			</form>
		</div>
	</div>
{/if}
