<script lang="ts" module>
	const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
	const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'medium',
		timeZone: 'UTC'
	});
	const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'medium',
		timeStyle: 'short',
		hourCycle: 'h23'
	});

	/**
	 * 저장된 마감값의 정밀도에 맞춰 날짜와 시각을 표시한다.
	 * @returns 날짜 또는 현지 날짜와 시각. 마감값이 없거나 유효하지 않으면 null.
	 */
	const formatDueDate = (dueDate: string | null): string | null => {
		if (!dueDate) return null;
		const date = new Date(dueDate);
		if (Number.isNaN(date.getTime())) return null;

		const formatter = DATE_ONLY_PATTERN.test(dueDate) ? DATE_FORMATTER : DATE_TIME_FORMATTER;
		return formatter.format(date);
	};
</script>

<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { X } from 'lucide-svelte';
	import { getTodoPriorityStyle } from '$lib/features/todo/todoPriority';
	import { useUpdateTodo } from '$lib/features/todo/todoQueries';
	import { renderMarkdownTaskList, updateMarkdownTaskItem } from '$lib/features/todo/markdownTaskList';
	import type { Todo } from '$lib/types/todo';

	const { todo }: { todo: Todo } = $props();
	const updateTodo = useUpdateTodo();
	let isSavingTask = $state(false);
	let hasTaskSaveError = $state(false);
	const dueDateLabel = $derived(formatDueDate(todo.due_date));
	const priority = $derived(getTodoPriorityStyle(todo.priority));
	const markdownHtml = $derived(
		todo.content?.trim()
			? renderMarkdownTaskList(todo.content, isSavingTask)
			: ''
	);

	async function handleTaskListChange(event: Event) {
		const target = event.target;
		if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox' || isSavingTask) return;

		const taskIndex = Number(target.dataset.taskIndex);
		if (!Number.isInteger(taskIndex)) return;

		const nextContent = updateMarkdownTaskItem(todo.content ?? '', taskIndex, target.checked);
		if (nextContent === null) return;

		isSavingTask = true;
		hasTaskSaveError = false;
		try {
			await updateTodo.mutateAsync({ id: todo.id, updates: { content: nextContent } });
		} catch {
			hasTaskSaveError = true;
		} finally {
			isSavingTask = false;
		}
	}
</script>

<Dialog.Portal>
	<Dialog.Overlay class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />
	<Dialog.Content
		class="fixed top-1/2 left-1/2 z-[101] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-1/2 flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg"
	>
		<div class="flex shrink-0 justify-between gap-3 border-b px-4 py-2 sm:px-5">
			<Dialog.Title level={2} class="self-center text-lg font-semibold tracking-tight wrap-anywhere">
				{todo.title}
			</Dialog.Title>
			<Dialog.Close
				type="button"
				class="shrink-0 self-start rounded-full p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
				aria-label="닫기"
			>
				<X class="size-5" aria-hidden="true" />
			</Dialog.Close>
		</div>

		<div class="min-h-0 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
			<dl class="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
				<div class="space-y-1">
					<dt class="text-muted-foreground">마감시각</dt>
					<dd class="font-medium tabular-nums">
						{#if dueDateLabel && todo.due_date}
							<time datetime={todo.due_date}>{dueDateLabel}</time>
						{:else}
							미설정
						{/if}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-muted-foreground">우선순위</dt>
					<dd class="font-medium {priority.textClass}">{priority.label}</dd>
				</div>
			</dl>

			<div class="space-y-2">
				<h3 class="text-sm font-semibold">상세 내용</h3>
				{#if markdownHtml}
					<div
						class="space-y-3 text-sm leading-relaxed wrap-anywhere
							[&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_h1]:text-lg [&_h2]:text-base
							[&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ol]:list-decimal [&_:is(ul,ol)]:pl-5
							[&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground
							[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3
							[&_p>code]:rounded-sm [&_p>code]:bg-muted [&_p>code]:px-1 [&_hr]:border-t [&_img]:max-w-full"
						onchange={handleTaskListChange}
					>
						<!-- micromark가 원문 HTML을 이스케이프하고 위험한 링크 프로토콜을 제거한다. -->
						{@html markdownHtml}
					</div>
					<p class="sr-only" aria-live="polite" aria-atomic="true">
						{#if isSavingTask}
							체크 항목을 저장하고 있습니다.
						{:else if hasTaskSaveError}
							체크 항목을 저장하지 못했습니다. 다시 시도해 주세요.
						{/if}
					</p>
				{:else}
					<p class="text-sm text-muted-foreground">상세 내용이 없습니다.</p>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Portal>
