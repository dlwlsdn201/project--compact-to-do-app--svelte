<script lang="ts">
	import { authStore } from '$lib/features/auth/authStore.svelte';
	import { themeStore } from '$lib/features/theme/themeStore.svelte';
	import { Moon, Sun } from 'lucide-svelte';
</script>

<div class="flex flex-col min-h-[100dvh] w-full bg-background text-foreground relative z-0">
	<!-- 간소화된 테마 토글 버튼 (우측 상단) -->
	<div class="absolute top-4 right-4">
		<button
			class="inline-flex items-center justify-center rounded-md w-10 h-10 transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
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

	<div class="flex-1 flex flex-col items-center justify-center p-6 gap-10">
		<div class="flex flex-col items-center justify-center text-center space-y-4">
			<div class="rounded-2xl flex items-center justify-center shadow-lg text-black text-4xl shadow-yellow-500/20">
				<img src="/icon-192.png" alt="Logo" />
			</div>
			<h1 class="text-5xl font-extrabold tracking-tight flex items-center justify-center gap-1">
				<span class="text-yellow-500">Todo</span>
				<span>morrow</span>
			</h1>
			<p class="text-muted-foreground font-medium mt-2">당신의 빠르고 심플한 하루의 끝!</p>
		</div>

		<button 
			class="flex items-center justify-center w-full max-w-sm rounded-[12px] bg-[#FEE500] px-6 py-4 font-bold text-[#000000]/90 transition-transform hover:bg-[#FEE500]/80 hover:scale-[1.02] active:scale-95 shadow-md"
			onclick={() => authStore.loginWithKakao()}
		>
			<!-- 카카오 심볼 -->
			<svg class="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 3c-5.52 0-10 3.58-10 8 0 2.87 1.84 5.42 4.67 6.9l-1.12 4.14c-.13.48.45.86.85.58l4.82-3.17c.25.02.51.05.78.05 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
			</svg>
			카카오 로그인으로 시작
		</button>
	</div>
</div>
