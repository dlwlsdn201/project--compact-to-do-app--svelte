<script lang="ts">
	import { usePresets, useCreatePreset, useDeletePreset } from '$lib/features/todo/presetQueries';
	import type { TodoPreset } from '$lib/types/preset';
	import type { Priority } from '$lib/types/todo';
	import { BookmarkPlus, X } from 'lucide-svelte';

	/**
	 * 할 일 프리셋(템플릿) 선택·저장 영역.
	 * 현재 폼 값을 prop으로 받아 프리셋으로 저장하고,
	 * 프리셋 선택은 `onApply` 콜백으로 상위 폼에 위임한다.
	 */
	let {
		title = '',
		content = '',
		priority = 'low',
		onApply
	} = $props<{
		title?: string;
		content?: string;
		priority?: Priority;
		onApply: (preset: TodoPreset) => void;
	}>();

	const presetsQuery = usePresets();
	const createPreset = useCreatePreset();
	const deletePreset = useDeletePreset();

	let isNaming = $state(false);
	let presetName = $state('');
	let saveError = $state<string | null>(null);

	let presets = $derived((presetsQuery.data ?? []) as TodoPreset[]);

	const MAX_PRESET_NAME_LENGTH = 20;

	function startNaming() {
		saveError = null;

		if (!title.trim()) {
			saveError = '프리셋으로 저장하려면 제목을 먼저 입력해주세요.';
			return;
		}

		presetName = title.trim().slice(0, MAX_PRESET_NAME_LENGTH);
		isNaming = true;
	}

	function cancelNaming() {
		isNaming = false;
		presetName = '';
		saveError = null;
	}

	function save() {
		const name = presetName.trim();

		if (!name) {
			saveError = '프리셋 이름을 입력해주세요.';
			return;
		}

		createPreset.mutate(
			{
				name,
				title: title.trim(),
				content: content.trim() || null,
				priority
			},
			{
				onSuccess: () => {
					isNaming = false;
					presetName = '';
					saveError = null;
				}
			}
		);
	}
</script>

<div class="flex flex-col gap-1.5" data-testid="preset-selector">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">프리셋</span>
		<button
			type="button"
			class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			onclick={startNaming}
			data-testid="preset-save-start"
		>
			<BookmarkPlus class="h-3.5 w-3.5" />
			현재 입력값 저장
		</button>
	</div>

	{#if isNaming}
		<div class="flex items-center gap-2" data-testid="preset-name-form">
			<input
				type="text"
				bind:value={presetName}
				maxlength={MAX_PRESET_NAME_LENGTH}
				placeholder="프리셋 이름"
				aria-label="프리셋 이름"
				class="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			/>
			<button
				type="button"
				class="h-9 shrink-0 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
				onclick={save}
				disabled={createPreset.isPending}
			>
				저장
			</button>
			<button
				type="button"
				class="h-9 shrink-0 rounded-md border border-input px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
				onclick={cancelNaming}
			>
				취소
			</button>
		</div>
	{/if}

	{#if saveError}
		<p class="text-xs font-medium text-destructive">{saveError}</p>
	{/if}

	{#if presets.length === 0}
		<p class="text-xs text-muted-foreground">
			저장된 프리셋이 없어요. 자주 쓰는 형식을 저장해두면 다음부터 한 번에 채울 수 있어요.
		</p>
	{:else}
		<div class="flex flex-wrap gap-2">
			{#each presets as preset (preset.id)}
				<span
					class="inline-flex items-center overflow-hidden rounded-full border border-input bg-background text-xs"
				>
					<button
						type="button"
						class="max-w-[10rem] truncate py-1 pl-3 pr-2 font-medium transition-colors hover:bg-muted"
						onclick={() => onApply(preset)}
						data-testid="preset-chip"
					>
						{preset.name}
					</button>
					<button
						type="button"
						class="py-1 pl-1 pr-2 text-muted-foreground transition-colors hover:text-destructive"
						aria-label="{preset.name} 프리셋 삭제"
						onclick={() => deletePreset.mutate(preset.id)}
					>
						<X class="h-3 w-3" />
					</button>
				</span>
			{/each}
		</div>
	{/if}
</div>
