<script lang="ts">
	import { page } from '$app/stores';
	import { Calendar, CheckSquare, History } from 'lucide-svelte';
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 border-t-[0.5px] border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 mx-auto max-w-2xl pb-[env(safe-area-inset-bottom)]">
	<div class="flex items-center justify-around px-4 py-3">
		<a
			href="/"
			class="flex flex-col items-center gap-1 min-w-16 
			{$page.url.pathname === '/' ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'}"
		>
			<CheckSquare class="h-6 w-6" />
			<span class="text-xs font-medium">오늘</span>
		</a>
		<div class="w-[1.5px] h-5 bg-border"></div>
		<a
			href="/tomorrow"
			class="flex flex-col items-center gap-1 min-w-16 
			{$page.url.pathname === '/tomorrow' ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'}"
		>
			<Calendar class="h-6 w-6" />
			<span class="text-xs font-medium">내일</span>
		</a>
		<div class="w-[1.5px] h-5 bg-border"></div>
		<a
			href="/history"
			class="flex flex-col items-center gap-1 min-w-16 
			{$page.url.pathname === '/history' ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'}"
		>
			<History class="h-6 w-6" />
			<span class="text-xs font-medium">지난 이력</span>
		</a>
	</div>
</nav>
