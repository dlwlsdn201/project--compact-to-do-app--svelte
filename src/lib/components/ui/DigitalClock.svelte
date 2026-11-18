<script lang="ts">
	import { onMount } from 'svelte';

	const MILLISECONDS_PER_SECOND = 1_000;
	const TIME_DIGITS = 2;
	let now = $state<Date | null>(null);
	const hours = $derived(String(now?.getHours() ?? 0).padStart(TIME_DIGITS, '0'));
	const minutes = $derived(String(now?.getMinutes() ?? 0).padStart(TIME_DIGITS, '0'));
	const isColonVisible = $derived((now?.getSeconds() ?? 0) % 2 === 0);

	onMount(() => {
		let timer: ReturnType<typeof setTimeout>;

		/**
		 * 다음 초 경계에 맞춰 갱신해 타이머 지연이 시계에 누적되지 않게 한다.
		 * @returns void
		 */
		const updateClock = (): void => {
			now = new Date();
			timer = setTimeout(updateClock, MILLISECONDS_PER_SECOND - now.getMilliseconds());
		};

		updateClock();
		return () => clearTimeout(timer);
	});
</script>

{#if now}
	<time
		datetime={`${hours}:${minutes}`}
		class="block text-3xl leading-none whitespace-nowrap text-muted-foreground tabular-nums"
	>
		<span class="sr-only">현재 시각 {hours}:{minutes}</span>
		<span aria-hidden="true">{hours}<span class="motion-reduce:opacity-100" class:opacity-0={!isColonVisible}>:</span>{minutes}</span>
	</time>
{/if}

<style>
	@font-face {
		font-family: 'DSEG7 Classic';
		src: url('/fonts/DSEG7Classic-Regular.woff2') format('woff2');
		font-display: swap;
	}

	time {
		font-family: 'DSEG7 Classic', ui-monospace, monospace;
	}
</style>
