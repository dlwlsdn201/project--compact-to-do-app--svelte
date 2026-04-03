<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { themeStore } from '$lib/features/theme/themeStore.svelte';
	import { onMount } from 'svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import BottomNav from '$lib/components/ui/BottomNav.svelte';

	let { children } = $props();

	const queryClient = new QueryClient();

	onMount(() => {
		themeStore.init();
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="min-h-[100dvh] bg-background text-foreground pb-16 flex flex-col items-center">
		<Header />
		<main class="flex-1 w-full max-w-2xl px-4 py-4 md:py-8">
			{@render children()}
		</main>
		<BottomNav />
	</div>
</QueryClientProvider>
