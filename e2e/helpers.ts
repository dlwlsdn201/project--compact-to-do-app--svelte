import type { Page } from '@playwright/test';

/**
 * 게스트(비로그인) 모드로 앱에 진입한다.
 *
 * 게스트 모드는 모든 데이터를 localStorage에만 저장하므로
 * E2E가 실제 Supabase 데이터를 건드리지 않는다.
 */
export async function enterGuestMode(page: Page) {
	// Playwright는 테스트마다 새 브라우저 컨텍스트를 주므로 localStorage는 이미 비어 있다.
	// (여기서 addInitScript로 비우면 이후 page.reload()마다 게스트 세션과
	//  저장한 데이터까지 함께 지워져 시나리오가 깨진다.)
	await page.goto('/');
	await page.getByRole('button', { name: '로그인 없이 이용하기' }).click();
	await page.getByRole('button', { name: '확인' }).click();

	// 메인 화면 진입 확인
	await page.getByRole('heading', { name: /오늘 할 일/ }).waitFor();
}

/** 신규 할 일 등록 모달을 연다. */
export async function openCreateModal(page: Page) {
	await page.getByRole('button', { name: 'Add Todo' }).click();
	await page.getByRole('heading', { name: '새 할 일 추가' }).waitFor();
}
