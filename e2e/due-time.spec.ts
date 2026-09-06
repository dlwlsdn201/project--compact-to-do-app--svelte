import { test, expect } from '@playwright/test';
import { enterGuestMode, openCreateModal } from './helpers';

/** #11 — 할 일 마감 시각 입력 기능 */
test.describe('할 일 마감 시각', () => {
	test('마감 시각을 입력해 등록하면 목록에 시각 배지가 표시된다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('보고서 초안 마무리');
		await page.locator('#due-time').fill('18:30');
		await page.getByRole('button', { name: '저장하기' }).click();

		const badge = page.getByTestId('due-time-badge');
		await expect(badge).toBeVisible();
		await expect(badge).toContainText('오후 6:30');
	});

	test('마감 시각을 입력하지 않으면 배지가 표시되지 않는다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('시각 없는 할 일');
		await page.getByRole('button', { name: '저장하기' }).click();

		await expect(page.getByText('시각 없는 할 일')).toBeVisible();
		await expect(page.getByTestId('due-time-badge')).toHaveCount(0);
	});

	test('저장한 마감 시각이 수정 모달에 다시 채워지고 수정된다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('마감 수정 대상');
		await page.locator('#due-time').fill('18:30');
		await page.getByRole('button', { name: '저장하기' }).click();

		await page.getByRole('button', { name: 'Edit todo' }).click();
		await expect(page.locator('#due-time')).toHaveValue('18:30');

		await page.locator('#due-time').fill('09:15');
		await page.getByRole('button', { name: '저장하기' }).click();

		await expect(page.getByTestId('due-time-badge')).toContainText('오전 9:15');
	});

	test('"지우기"로 마감 시각을 제거하면 배지가 사라진다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('마감 제거 대상');
		await page.locator('#due-time').fill('18:30');
		await page.getByRole('button', { name: '저장하기' }).click();
		await expect(page.getByTestId('due-time-badge')).toBeVisible();

		await page.getByRole('button', { name: 'Edit todo' }).click();
		await page.getByRole('button', { name: '지우기' }).click();
		await page.getByRole('button', { name: '저장하기' }).click();

		await expect(page.getByTestId('due-time-badge')).toHaveCount(0);
	});

	test('마감 시각이 지난 미완료 항목은 "마감"으로 강조된다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('이미 지난 마감');
		// 하루 중 가장 이른 시각이라 실행 시점과 무관하게 항상 과거다(자정 정각 제외).
		await page.locator('#due-time').fill('00:01');
		await page.getByRole('button', { name: '저장하기' }).click();

		await expect(page.getByTestId('due-time-badge')).toContainText('마감');
	});
});
