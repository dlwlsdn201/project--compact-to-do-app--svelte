<script lang="ts">
	import '../app.css';
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
		themeStore.init();
		authStore.init();
	});
</script>

<QueryClientProvider client={queryClient}>
	{#if !authStore.isInitialized}
		<div class="min-h-[100dvh] flex items-center justify-center bg-background text-foreground">
			<!-- 간소화된 스플래시 로딩 애니메이션 -->
			<div class="flex flex-col items-center animate-pulse opacity-70">
				<span class="text-yellow-500 text-3xl mb-2">⚡</span>
				<span class="font-bold tracking-tight">Loading...</span>
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
