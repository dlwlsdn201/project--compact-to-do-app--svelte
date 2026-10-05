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

	test('상세 내용 Markdown을 미리보고 다시 편집한 뒤 저장한다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);
		const textarea = page.locator('#content');
		await expect(textarea).toHaveCSS('resize', 'vertical');
		await expect.poll(async () => (await textarea.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(160);
		await page.getByPlaceholder('무엇을 해야 하나요?').fill('Markdown 확인');
		await textarea.fill('## 확인\n\n- 항목');
		await page.getByRole('button', { name: '미리보기' }).click();
		await expect(page.getByTestId('markdown-preview').locator('h2')).toHaveText('확인');
		await expect(page.getByTestId('markdown-preview').locator('li')).toHaveText('항목');
		await page.getByRole('button', { name: '작성' }).click();
		await expect(page.locator('#content')).toHaveValue('## 확인\n\n- 항목');
		await page.getByRole('button', { name: '저장하기' }).click();
		await page.getByRole('button', { name: 'Edit todo' }).click();
		await expect(page.locator('#content')).toHaveValue('## 확인\n\n- 항목');
	});

	test('긴 상세 내용은 미리보기에서 줄바꿈과 내부 스크롤을 유지하고 입력창 크기를 드래그로 조절할 수 있다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);
		const textarea = page.locator('#content');
		await textarea.scrollIntoViewIfNeeded();
		const originalBox = await textarea.boundingBox();
		expect(originalBox).not.toBeNull();
		await page.mouse.move(originalBox!.x + originalBox!.width - 3, originalBox!.y + originalBox!.height - 3);
		await page.mouse.down();
		await page.mouse.move(originalBox!.x + originalBox!.width - 3, originalBox!.y + originalBox!.height + 100, { steps: 10 });
		await page.mouse.up();
		await expect.poll(async () => (await textarea.boundingBox())?.height ?? 0).toBeGreaterThan(originalBox!.height + 50);

		await textarea.fill(Array.from({ length: 30 }, (_, index) => `줄 ${index + 1}`).join('\n'));
		await page.getByRole('button', { name: '미리보기' }).click();
		const preview = page.getByTestId('markdown-preview');
		await expect(preview.locator('br')).toHaveCount(29);
		const dimensions = await preview.evaluate((element) => ({ clientHeight: element.clientHeight, scrollHeight: element.scrollHeight }));
		expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
	});
});
