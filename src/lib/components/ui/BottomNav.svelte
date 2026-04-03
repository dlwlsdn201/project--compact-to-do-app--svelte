<script lang="ts">
	import { page } from '$app/stores';
	import { Calendar, CheckSquare, History } from 'lucide-svelte';
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 border-t bg-background mx-auto max-w-2xl">
	<div class="flex items-center justify-around h-16 px-4">
		<a
			href="/"
			class="flex flex-col items-center gap-1 min-w-16 
			{$page.url.pathname === '/' ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'}"
		>
			<CheckSquare class="h-6 w-6" />
			<span class="text-xs font-medium">오늘</span>
		</a>
		<a
			href="/tomorrow"
			class="flex flex-col items-center gap-1 min-w-16 
			{$page.url.pathname === '/tomorrow' ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'}"
		>
			<Calendar class="h-6 w-6" />
			<span class="text-xs font-medium">내일</span>
		</a>
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
