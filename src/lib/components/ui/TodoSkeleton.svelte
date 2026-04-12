<script lang="ts">
</script>

<div class="flex flex-col gap-3 w-full animate-pulse">
	{#each Array(3) as _}
		<div class="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-muted/10">
			<!-- Checkbox placeholder -->
			<div class="mt-0.5 w-5 h-5 rounded border-2 border-muted bg-muted/20 flex-shrink-0"></div>
			
			<div class="flex-1 space-y-2">
				<!-- Title placeholder -->
				<div class="h-4 bg-muted/30 rounded w-3/4"></div>
				<!-- Content placeholder -->
				<div class="h-3 bg-muted/20 rounded w-1/2"></div>
				
				<div class="flex items-center gap-2 pt-1">
					<!-- Date placeholder -->
					<div class="h-2.5 bg-muted/20 rounded w-16"></div>
					<!-- Priority badge placeholder -->
					<div class="h-4 bg-muted/30 rounded w-20"></div>
				</div>
			</div>
			
			<!-- Actions placeholder -->
			<div class="flex gap-2 ml-1">
				<div class="w-8 h-8 rounded-md bg-muted/20"></div>
				<div class="w-8 h-8 rounded-md bg-muted/20"></div>
			</div>
		</div>
	{/each}
</div>
