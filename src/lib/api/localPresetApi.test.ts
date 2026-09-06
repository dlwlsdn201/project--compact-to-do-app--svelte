import { describe, it, expect, beforeEach } from 'vitest';
import { localPresetApi } from './localPresetApi';

// localPresetApi는 순수 localStorage 기반 CRUD이므로 외부 의존성이 없다.
// jsdom 환경의 localStorage를 직접 사용하고 beforeEach에서 초기화한다.

describe('localPresetApi', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe('getPresets()', () => {
		it('localStorage가 비어있으면 빈 배열을 반환한다', async () => {
			expect(await localPresetApi.getPresets()).toEqual([]);
		});

		it('저장된 프리셋 목록을 반환한다', async () => {
			await localPresetApi.createPreset({
				name: '주간 보고',
				title: '주간 업무 보고 작성',
				content: '지난주 성과 / 이번주 계획',
				priority: 'high'
			});

			const presets = await localPresetApi.getPresets();
			expect(presets).toHaveLength(1);
			expect(presets[0].name).toBe('주간 보고');
		});

		it('저장된 값이 손상되어 있으면 빈 배열을 반환한다', async () => {
			localStorage.setItem('guest_todo_presets', '{{ not json');
			expect(await localPresetApi.getPresets()).toEqual([]);
		});
	});

	describe('createPreset()', () => {
		it('자동 필드(id, user_id, created_at)를 채워 생성한다', async () => {
			const created = await localPresetApi.createPreset({
				name: '회의록',
				title: '회의록 정리',
				content: null,
				priority: 'medium'
			});

			expect(created.id).toBeTruthy();
			expect(created.user_id).toBe('guest');
			expect(created.created_at).toBeTruthy();
		});

		it('최근 생성한 프리셋이 앞에 온다', async () => {
			await localPresetApi.createPreset({
				name: '첫번째',
				title: 'A',
				content: null,
				priority: 'low'
			});
			await localPresetApi.createPreset({
				name: '두번째',
				title: 'B',
				content: null,
				priority: 'low'
			});

			const presets = await localPresetApi.getPresets();
			expect(presets.map((p) => p.name)).toEqual(['두번째', '첫번째']);
		});

		it('같은 이름으로 저장하면 덮어쓴다 (이름은 유일)', async () => {
			await localPresetApi.createPreset({
				name: '주간 보고',
				title: '이전 제목',
				content: null,
				priority: 'low'
			});
			await localPresetApi.createPreset({
				name: '주간 보고',
				title: '새 제목',
				content: null,
				priority: 'high'
			});

			const presets = await localPresetApi.getPresets();
			expect(presets).toHaveLength(1);
			expect(presets[0].title).toBe('새 제목');
		});
	});

	describe('deletePreset()', () => {
		it('id에 해당하는 프리셋만 삭제한다', async () => {
			const keep = await localPresetApi.createPreset({
				name: '유지',
				title: 'A',
				content: null,
				priority: 'low'
			});
			const remove = await localPresetApi.createPreset({
				name: '삭제',
				title: 'B',
				content: null,
				priority: 'low'
			});

			await localPresetApi.deletePreset(remove.id);

			const presets = await localPresetApi.getPresets();
			expect(presets).toHaveLength(1);
			expect(presets[0].id).toBe(keep.id);
		});

		it('존재하지 않는 id를 삭제해도 오류 없이 무시한다', async () => {
			await expect(localPresetApi.deletePreset('없는-id')).resolves.toBeUndefined();
		});
	});
});
