import { test, expect } from '@playwright/test';
import { enterGuestMode, openCreateModal } from './helpers';

test('게스트 할 일 삭제는 화면 안에서 확인하고 취소 또는 완료할 수 있다', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await enterGuestMode(page);
	await openCreateModal(page);
	await page.getByPlaceholder('무엇을 해야 하나요?').fill('삭제 흐름 확인');
	await page.getByRole('button', { name: '저장하기' }).click();
	await expect(page.getByText('삭제 흐름 확인')).toBeVisible();

	await page.getByRole('button', { name: 'Delete todo' }).click();
	await expect(page.getByRole('alertdialog', { name: '할 일 삭제 확인' })).toBeVisible();
	await expect.poll(async () => (await page.getByRole('alertdialog').boundingBox())?.width ?? 0).toBeGreaterThan(300);
	await page.getByRole('button', { name: '취소' }).click();
	await expect(page.getByText('삭제 흐름 확인')).toBeVisible();

	await page.getByRole('button', { name: 'Delete todo' }).click();
	await page.getByRole('button', { name: '삭제 확정' }).click();
	await expect(page.getByText('삭제 흐름 확인')).toHaveCount(0);
	await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('guest_todos') ?? '[]').length)).toBe(0);
});

test('삭제 저장이 실패하면 항목과 확인 영역을 유지하고 오류를 표시한다', async ({ page }) => {
	await enterGuestMode(page);
	await openCreateModal(page);
	await page.getByPlaceholder('무엇을 해야 하나요?').fill('삭제 실패 확인');
	await page.getByRole('button', { name: '저장하기' }).click();
	await expect(page.getByText('삭제 실패 확인')).toBeVisible();

	await page.evaluate(() => {
		const originalSetItem = Storage.prototype.setItem;
		Storage.prototype.setItem = function (key, value) {
			if (key === 'guest_todos') throw new Error('저장소 쓰기 실패');
			return originalSetItem.call(this, key, value);
		};
	});
	await page.getByRole('button', { name: 'Delete todo' }).click();
	await page.getByRole('button', { name: '삭제 확정' }).click();
	await expect(page.getByRole('alert')).toContainText('삭제하지 못했습니다');
	await expect(page.getByRole('alertdialog')).toBeVisible();
	await expect(page.getByText('삭제 실패 확인')).toBeVisible();
});
