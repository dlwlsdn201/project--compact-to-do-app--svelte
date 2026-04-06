<script lang="ts">
	import { themeStore } from '$lib/features/theme/themeStore.svelte';
	import { authStore } from '$lib/features/auth/authStore.svelte';
	import { Sun, Moon } from 'lucide-svelte';
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-14 items-center max-w-2xl mx-auto px-4 justify-between">
		<div class="flex items-center gap-2">
			<span class="font-bold text-xl tracking-tight text-yellow-500">Flash</span>
			<span class="font-semibold text-xl tracking-tight">Do</span>
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
