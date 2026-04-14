import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

// vitest 전용 설정 파일.
// vite.config.ts와 분리하여 resolve.conditions: ['browser']를 적용함으로써
// Svelte 5 컴포넌트를 클라이언트 모드로 올바르게 로드한다.
export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ['browser']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.ts'],
		globals: true
	}
});
