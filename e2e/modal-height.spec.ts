import { test, expect } from '@playwright/test';
import { enterGuestMode, openCreateModal } from './helpers';

/** #10 — 할 일 입력 Modal 기본 높이 40px 확대 */
test.describe('할 일 입력 Modal 기본 높이', () => {
	// 변경 전 실측 기본 높이 427px + 40px
	const EXPECTED_MIN_HEIGHT = 467;

	test('생성 모드 모달의 높이가 기존 대비 40px 이상 크다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		const panel = page.locator('form').locator('..');
		// 슬라이드 트랜지션이 끝난 뒤 측정한다.
		await expect
			.poll(async () => (await panel.boundingBox())?.height ?? 0, { timeout: 5_000 })
			.toBeGreaterThanOrEqual(EXPECTED_MIN_HEIGHT);
	});

	test('수정 모드 모달에도 동일한 최소 높이가 적용된다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('높이 확인용 할 일');
		await page.getByRole('button', { name: '저장하기' }).click();

		await page.getByRole('button', { name: 'Edit todo' }).click();
		await page.getByRole('heading', { name: '할 일 수정' }).waitFor();

		const panel = page.locator('form').locator('..');
		await expect
			.poll(async () => (await panel.boundingBox())?.height ?? 0, { timeout: 5_000 })
			.toBeGreaterThanOrEqual(EXPECTED_MIN_HEIGHT);
	});

	test('모바일 뷰포트에서도 모달이 화면 밖으로 넘치지 않는다', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await enterGuestMode(page);
		await openCreateModal(page);

		const panel = page.locator('form').locator('..');
		await expect(panel).toBeVisible();

		const box = await panel.boundingBox();
		expect(box).not.toBeNull();
		expect(box!.x).toBeGreaterThanOrEqual(0);
		expect(box!.x + box!.width).toBeLessThanOrEqual(390);
	});
});
