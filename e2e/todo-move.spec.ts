import { test, expect } from '@playwright/test';
import { enterGuestMode, openCreateModal } from './helpers';

test('게스트 할 일을 오늘과 내일 사이에서 카드 버튼으로 이동한다', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await enterGuestMode(page);
	await openCreateModal(page);
	await page.getByPlaceholder('무엇을 해야 하나요?').fill('날짜 이동 확인');
	await page.getByRole('button', { name: '저장하기' }).click();

	await expect(page.getByText('날짜 이동 확인')).toBeVisible();
	await expect(page.getByRole('button', { name: '오늘 하기' })).toHaveCount(0);
	await page.getByRole('button', { name: '내일 하기' }).click();
	await expect(page.getByText('날짜 이동 확인')).toHaveCount(0);

	await page.getByRole('link', { name: '내일' }).click();
	await expect(page.getByText('날짜 이동 확인')).toBeVisible();
	await expect(page.getByRole('button', { name: '내일 하기' })).toHaveCount(0);
	await page.getByRole('button', { name: '오늘 하기' }).click();
	await expect(page.getByText('날짜 이동 확인')).toHaveCount(0);

	await page.getByRole('link', { name: '오늘' }).click();
	await expect(page.getByText('날짜 이동 확인')).toBeVisible();
});
