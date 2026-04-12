<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics';
	import { dev } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { themeStore } from '$lib/features/theme/themeStore.svelte';
	import { authStore } from '$lib/features/auth/authStore.svelte';
	import { onMount } from 'svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import BottomNav from '$lib/components/ui/BottomNav.svelte';
	import Intro from '$lib/components/ui/Intro.svelte';

	let { children } = $props();

	const queryClient = new QueryClient();

	onMount(() => {
		injectAnalytics({ mode: dev ? 'development' : 'production' });
		themeStore.init();
		authStore.init();
	});
</script>

<QueryClientProvider client={queryClient}>
	{#if !authStore.isInitialized}
		<div class="min-h-[100dvh] flex items-center justify-center bg-background text-foreground">
			<!-- 동적 로딩 애니메이션 (라이브러리 스타일) -->
			<div class="flex flex-col items-center gap-4">
				<div class="relative flex items-center justify-center w-16 h-16">
					<!-- 배경 링 -->
					<div class="absolute inset-0 border-4 border-muted/30 rounded-full"></div>
					<!-- 회전하는 스피너 -->
					<div class="absolute inset-0 border-4 border-yellow-500/80 rounded-full border-t-transparent animate-spin"></div>
					<!-- 안쪽 아이콘 -->
					<div class="animate-pulse flex items-center justify-center h-full">
						<span class="text-yellow-500 text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">⚡</span>
					</div>
				</div>
				<span class="font-medium tracking-widest text-sm text-foreground/70 animate-pulse">
					LOADING...
				</span>
			</div>
		</div>
	{:else if !authStore.user}
		<!-- 오직 카카오 로그인 화면만 있는 페이지 노출 -->
		<Intro />
	{:else}
		<!-- 로그인이 완료된 경우의 실 기능들 (Header, Main, BottomNav 렌더링) -->
		<div class="min-h-[100dvh] bg-background text-foreground pb-16 flex flex-col items-center">
			<Header />
			<main class="flex-1 w-full max-w-2xl px-4 py-4 md:py-8">
				{@render children()}
			</main>
			<BottomNav />
		</div>
	{/if}
</QueryClientProvider>
