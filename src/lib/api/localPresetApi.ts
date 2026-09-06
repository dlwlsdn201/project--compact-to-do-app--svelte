import type { CreateTodoPresetDTO, TodoPreset } from '../types/preset';

const GUEST_PRESETS_KEY = 'guest_todo_presets';

function loadPresets(): TodoPreset[] {
	try {
		const raw = localStorage.getItem(GUEST_PRESETS_KEY);
		return raw ? (JSON.parse(raw) as TodoPreset[]) : [];
	} catch {
		return [];
	}
}

function savePresets(presets: TodoPreset[]): void {
	localStorage.setItem(GUEST_PRESETS_KEY, JSON.stringify(presets));
}

/** 게스트(비로그인) 모드의 프리셋을 localStorage 에서 관리한다. */
export const localPresetApi = {
	async getPresets(): Promise<TodoPreset[]> {
		return loadPresets();
	},

	async createPreset(preset: CreateTodoPresetDTO): Promise<TodoPreset> {
		const presets = loadPresets();

		const newPreset: TodoPreset = {
			...preset,
			id: crypto.randomUUID(),
			user_id: 'guest',
			content: preset.content ?? null,
			created_at: new Date().toISOString()
		};

		// 이름은 사용자 안에서 유일하다. 같은 이름이면 덮어쓴다.
		const deduped = presets.filter((p) => p.name !== newPreset.name);
		savePresets([newPreset, ...deduped]);

		return newPreset;
	},

	async deletePreset(id: string): Promise<void> {
		savePresets(loadPresets().filter((p) => p.id !== id));
	}
};
