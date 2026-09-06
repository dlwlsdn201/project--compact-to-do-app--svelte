import { test, expect } from '@playwright/test';
import { enterGuestMode, openCreateModal } from './helpers';

/** #12 — 할 일 프리셋(템플릿) 기능 */
test.describe('할 일 프리셋', () => {
	const PRESET_TITLE = '주간 업무 보고 작성';
	const PRESET_CONTENT = '지난주 성과 / 이번주 계획';
	const PRESET_NAME = '주간 보고';

	/** 현재 열려 있는 모달에서 입력값을 프리셋으로 저장한다. */
	async function savePreset(page: import('@playwright/test').Page) {
		await page.getByPlaceholder('무엇을 해야 하나요?').fill(PRESET_TITLE);
		await page.getByPlaceholder('자세한 내용을 기록하세요').fill(PRESET_CONTENT);
		await page.getByRole('button', { name: '높음' }).click();

		await page.getByTestId('preset-save-start').click();
		await page.getByLabel('프리셋 이름').fill(PRESET_NAME);
		await page.getByRole('button', { name: '저장', exact: true }).click();

		await expect(page.getByTestId('preset-chip')).toHaveText(PRESET_NAME);
	}

	test('프리셋이 없으면 안내 문구가 표시된다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await expect(page.getByTestId('preset-selector')).toContainText('저장된 프리셋이 없어요');
	});

	test('제목이 비어 있으면 프리셋으로 저장할 수 없다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByTestId('preset-save-start').click();

		await expect(
			page.getByText('프리셋으로 저장하려면 제목을 먼저 입력해주세요.')
		).toBeVisible();
	});

	test('현재 입력값을 프리셋으로 저장하고 칩으로 노출된다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await savePreset(page);
	});

	test('프리셋을 선택하면 제목·내용·우선순위가 채워진다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);
		await savePreset(page);

		// 새로고침으로 폼을 빈 상태로 되돌린 뒤 다시 연다.
		await page.reload();
		await openCreateModal(page);

		await expect(page.getByPlaceholder('무엇을 해야 하나요?')).toHaveValue('');

		await page.getByTestId('preset-chip').click();

		await expect(page.getByPlaceholder('무엇을 해야 하나요?')).toHaveValue(PRESET_TITLE);
		await expect(page.getByPlaceholder('자세한 내용을 기록하세요')).toHaveValue(PRESET_CONTENT);
	});

	test('프리셋으로 채운 뒤 세부 내용을 고쳐 등록할 수 있다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);
		await savePreset(page);

		await page.reload();
		await openCreateModal(page);
		await page.getByTestId('preset-chip').click();

		await page.getByPlaceholder('무엇을 해야 하나요?').fill(`${PRESET_TITLE} (9월 1주차)`);
		await page.locator('#due-time').fill('17:00');
		await page.getByRole('button', { name: '저장하기' }).click();

		await expect(page.getByText(`${PRESET_TITLE} (9월 1주차)`)).toBeVisible();
		await expect(page.getByText(PRESET_CONTENT)).toBeVisible();
		await expect(page.getByTestId('due-time-badge')).toContainText('오후 5:00');
	});

	test('프리셋은 새로고침 후에도 유지되고, 삭제하면 사라진다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);
		await savePreset(page);

		await page.reload();
		await openCreateModal(page);
		await expect(page.getByTestId('preset-chip')).toHaveText(PRESET_NAME);

		await page.getByRole('button', { name: `${PRESET_NAME} 프리셋 삭제` }).click();

		await expect(page.getByTestId('preset-chip')).toHaveCount(0);
		await expect(page.getByTestId('preset-selector')).toContainText('저장된 프리셋이 없어요');
	});

	test('수정 모드에서는 프리셋 영역이 노출되지 않는다', async ({ page }) => {
		await enterGuestMode(page);
		await openCreateModal(page);

		await page.getByPlaceholder('무엇을 해야 하나요?').fill('수정 모드 확인용');
		await page.getByRole('button', { name: '저장하기' }).click();

		await page.getByRole('button', { name: 'Edit todo' }).click();
		await page.getByRole('heading', { name: '할 일 수정' }).waitFor();

		await expect(page.getByTestId('preset-selector')).toHaveCount(0);
	});
});
