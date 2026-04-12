<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { themeStore } from '$lib/features/theme/themeStore.svelte';
	import { authStore } from '$lib/features/auth/authStore.svelte';
	import { onMount } from 'svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import TodoSkeleton from '$lib/components/ui/TodoSkeleton.svelte';
	import BottomNav from '$lib/components/ui/BottomNav.svelte';
	import Intro from '$lib/components/ui/Intro.svelte';

	let { children } = $props();

	const queryClient = new QueryClient();

	onMount(() => {
		inject({ mode: dev ? 'development' : 'production' });
		themeStore.init();
		authStore.init();
	});
</script>

<QueryClientProvider client={queryClient}>
	{#if !authStore.isInitialized}
		<div class="min-h-[100dvh] bg-background text-foreground pb-16 flex flex-col items-center">
			<!-- Header placeholder -->
			<div class="sticky top-0 z-50 w-full border-b bg-background/95 h-14 flex items-center justify-between px-4 max-w-2xl mx-auto">
				<div class="flex items-center gap-2 animate-pulse">
					<div class="w-24 h-6 bg-muted/40 rounded"></div>
					<div class="w-10 h-4 bg-muted/20 rounded"></div>
				</div>
				<div class="w-9 h-9 bg-muted/20 rounded-md animate-pulse"></div>
			</div>
			
			<main class="flex-1 w-full max-w-2xl px-4 py-4 md:py-8">
				<div class="mb-8 animate-pulse">
					<div class="h-8 bg-muted/40 rounded w-1/3 mb-2"></div>
					<div class="h-4 bg-muted/20 rounded w-1/2"></div>
				</div>
				<TodoSkeleton />
			</main>

			<!-- BottomNav placeholder -->
			<div class="fixed bottom-0 left-0 right-0 h-20 border-t-[0.5px] border-border/50 bg-background/95 flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)]">
				{#each Array(3) as _, i}
					<div class="flex flex-col items-center gap-1 animate-pulse">
						<div class="w-6 h-6 bg-muted/30 rounded-full"></div>
						<div class="w-8 h-2 bg-muted/20 rounded"></div>
					</div>
					{#if i < 2}
						<div class="w-[1.5px] h-5 bg-border/40 animate-pulse"></div>
					{/if}
				{/each}
			</div>
		</div>
	{:else if !authStore.user}
		<!-- 오직 카카오 로그인 화면만 있는 페이지 노출 -->
		<Intro />
	{:else}
		<!-- 로그인이 완료된 경우의 실 기능들 (Header, Main, BottomNav 렌더링) -->
		<div class="min-h-[100dvh] bg-background text-foreground pb-24 flex flex-col items-center">
			<Header />
			<main class="flex-1 w-full max-w-2xl px-4 py-4 md:py-8">
				{@render children()}
			</main>
			<BottomNav />
		</div>
	{/if}
</QueryClientProvider>
