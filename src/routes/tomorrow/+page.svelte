<script lang="ts">
	import { Calendar } from 'lucide-svelte';
</script>

<div class="w-full flex flex-col gap-4">
	<div class="flex items-center justify-between pb-2 border-b">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">내일 할 일</h1>
			<p class="text-sm text-muted-foreground mt-1">내일을 위해 미리 준비하세요.</p>
		</div>
		<div class="text-4xl text-blue-500">
			<Calendar class="w-8 h-8" />
		</div>
	</div>

	<div class="py-12 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-xl mt-4 border border-dashed">
		<p class="text-sm font-medium">아직 내일 계획이 없습니다.</p>
		<p class="text-xs mt-1">미리 계획을 세우면 내일이 더 쉬워져요!</p>
	</div>
</div>
