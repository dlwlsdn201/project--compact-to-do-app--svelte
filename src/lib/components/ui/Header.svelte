<script lang="ts">
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/features/theme/themeStore.svelte';
	import { authStore } from '$lib/features/auth/authStore.svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { version } from '$app/environment';
	import { currentReleaseNotes } from '../../release/releaseNotes';
	import {
		getLastAcknowledgedVersion,
		setLastAcknowledgedVersion
	} from '$lib/utils/releaseAcknowledgement';
	import ReleaseNotesDialog from '$lib/components/ui/ReleaseNotesDialog.svelte';

	/**
	 * 상단 헤더: 테마·로그아웃·버전 뱃지(릴리즈 노트 다이얼로그 진입).
	 */
	let releaseDialogOpen = $state(false);
	/** undefined: 아직 localStorage 미로드, null: 저장값 없음 */
	let lastAcknowledged = $state<string | null | undefined>(undefined);

	const hasUnreadRelease = $derived.by(() => {
		if (lastAcknowledged === undefined) return false;
		return lastAcknowledged !== version;
	});

	onMount(() => {
		lastAcknowledged = getLastAcknowledgedVersion();
	});

	function openReleaseDialog() {
		releaseDialogOpen = true;
	}

	function acknowledgeRelease() {
		setLastAcknowledgedVersion(version);
		lastAcknowledged = version;
	}
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-14 items-center max-w-2xl mx-auto px-4 justify-between">
		<div class="flex items-center gap-2">
			<div class="flex items-center">
				<span class="font-bold text-xl tracking-tight text-yellow-500">Todo</span>
				<span class="font-semibold text-xl tracking-tight">morrow</span>
			</div>
			<button
				type="button"
				class="relative text-[10px] font-bold px-1.5 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				onclick={openReleaseDialog}
				aria-label={hasUnreadRelease
					? `앱 버전 ${version}, 새(New) 릴리즈 안내 미확인`
					: `앱 버전 ${version}, 릴리즈 노트 보기`}
			>
				v{version}
				{#if hasUnreadRelease}
					<!-- 미읽음: N = New. 우측으로 더 밀어 patch 자릿수와 겹침 완화 -->
					<span
						class="absolute -top-1 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-extrabold leading-none text-destructive-foreground ring-2 ring-background"
						aria-hidden="true"
					>
						N
					</span>
				{/if}
			</button>
		</div>
		<div class="flex items-center gap-3 md:gap-4">
			{#if authStore.user}
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium">{authStore.username}님</span>
					<button
						class="text-xs text-muted-foreground hover:text-foreground transition-colors"
						onclick={() => authStore.logout()}
					>
						로그아웃
					</button>
				</div>
			{/if}

			<button
				class="inline-flex items-center justify-center rounded-md w-9 h-9 transition-colors hover:bg-accent hover:text-accent-foreground"
				onclick={() => themeStore.toggle()}
			>
				{#if themeStore.isDark}
					<Sun class="h-5 w-5" />
				{:else}
					<Moon class="h-5 w-5" />
				{/if}
				<span class="sr-only">Toggle theme</span>
			</button>
		</div>
	</div>
</header>

<ReleaseNotesDialog bind:isOpen={releaseDialogOpen} note={currentReleaseNotes} onAcknowledge={acknowledgeRelease} />
