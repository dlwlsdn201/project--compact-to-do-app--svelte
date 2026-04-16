<script lang="ts">
	import { slide } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import type { ReleaseNote } from '$lib/release/releaseNotes';

	/**
	 * 릴리즈 요약을 모달로 표시한다(신규 기능 / 수정 사항은 스크롤 본문, 확인은 하단 고정 푸터).
	 * 배경 클릭은 닫기만 하고, 「확인」에서만 onAcknowledge를 호출한다.
	 */
	let {
		isOpen = $bindable(false),
		note,
		onAcknowledge
	} = $props<{
		isOpen: boolean;
		note: ReleaseNote;
		onAcknowledge?: () => void;
	}>();

	const titleId = 'release-notes-dialog-title';

	/** slide 인입이 끝나기 전에는 overflow로 스크롤바가 생기지 않게 해 깜빡임을 막는다 */
	let bodyScrollUnlocked = $state(false);

	function closeWithoutAck() {
		isOpen = false;
	}

	function confirmAndClose() {
		onAcknowledge?.();
		isOpen = false;
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 transition-all"
		onclick={closeWithoutAck}
		role="presentation"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-card text-card-foreground border rounded-2xl w-full max-w-lg shadow-lg flex flex-col min-h-0 max-h-[min(85vh,32rem)] overflow-hidden pt-2"
			onclick={(e) => e.stopPropagation()}
			in:slide={{ duration: 250, axis: 'y' }}
			out:slide={{ duration: 200, axis: 'y' }}
			onintrostart={() => {
				bodyScrollUnlocked = false;
			}}
			onintroend={() => {
				bodyScrollUnlocked = true;
			}}
			onoutrostart={() => {
				bodyScrollUnlocked = false;
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			tabindex="-1"
		>
			<div class="flex shrink-0 items-center justify-between px-4 pr-1 pb-2 border-b">
			<div class="flex items-center gap-0.5 break-keep">
				<span id={titleId} class="text-lg mobile:text-xs font-semibold tracking-tight pr-2">
					{note.updatedAt}
				</span>
				<span class="text-muted-foreground mobile:text-sm">
					v{note.version} {note.title} 
				</span>

			</div>
				<button
					type="button"
					class="p-2 hover:bg-muted rounded-full shrink-0"
					onclick={closeWithoutAck}
					aria-label="닫기"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<div
				class="release-notes-dialog-scroll flex min-h-0 flex-1 flex-col gap-5 overscroll-contain px-4 py-3 scrollbar-gutter-stable {bodyScrollUnlocked
					? 'overflow-y-auto'
					: 'overflow-hidden'}"
			>
				<!-- 신규 기능 / 수정 사항: 릴리즈 데이터 구조와 1:1 (이 영역만 스크롤) -->
				<section class="space-y-2" aria-labelledby="release-notes-new-heading">
					<h3 id="release-notes-new-heading" class="text-sm font-semibold text-foreground">
						신규 기능
					</h3>
					{#if note.features.length > 0}
						<ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
							{#each note.features as item}
								<li>
									<span>{item.summary}</span>
									{#if item.detail && item.detail.length > 0}
										<ul class="ml-4 mt-1 space-y-0.5">
											{#each item.detail as sub}
												<li class="flex items-start gap-1.5 text-muted-foreground/80">
													<span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40"></span>
													<span>{sub}</span>
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						</ol>
					{:else}
						<p class="text-sm text-muted-foreground">이번 릴리즈에 신규 기능 내역은 없어요.</p>
					{/if}
				</section>

				<section class="space-y-2" aria-labelledby="release-notes-fix-heading">
					<h3 id="release-notes-fix-heading" class="text-sm font-semibold text-foreground">
						수정 사항
					</h3>
					{#if note.fixes.length > 0}
						<ul
							class="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed"
						>
							{#each note.fixes as item}
								<li>{item}</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-muted-foreground">이번 릴리즈에 수정 사항 내역은 없어요.</p>
					{/if}
				</section>
			</div>

			<div class="shrink-0 border-t bg-card px-4 py-3">
				<button
					type="button"
					class="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					onclick={confirmAndClose}
				>
					확인
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* 다크 모드에서 기본 스크롤 트랙이 밝게 보이는 문제: 트랙은 투명, thumb만 얇게 */
	.release-notes-dialog-scroll::-webkit-scrollbar {
		width: 8px;
	}
	.release-notes-dialog-scroll::-webkit-scrollbar-track {
		background-color: transparent;
	}
	.release-notes-dialog-scroll::-webkit-scrollbar-thumb {
		border-radius: 9999px;
		background-color: hsl(0 0% 45% / 0.45);
	}
	:global(.dark) .release-notes-dialog-scroll::-webkit-scrollbar-thumb {
		background-color: hsl(0 0% 63.9% / 0.45);
	}
	.release-notes-dialog-scroll {
		scrollbar-width: thin;
		scrollbar-color: hsl(0 0% 45% / 0.45) transparent;
	}
	:global(.dark) .release-notes-dialog-scroll {
		scrollbar-color: hsl(0 0% 63.9% / 0.45) transparent;
	}
</style>
