import { supabase } from './supabase';
import type { CreateTodoPresetDTO, TodoPreset } from '../types/preset';

/** 로그인 사용자의 프리셋을 Supabase `todo_presets` 테이블에서 관리한다. */
export const presetApi = {
	async getPresets(): Promise<TodoPreset[]> {
		const { data, error } = await supabase
			.from('todo_presets')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching presets:', error);
			return [];
		}
		return data as TodoPreset[];
	},

	async createPreset(preset: CreateTodoPresetDTO): Promise<TodoPreset> {
		const { data, error } = await supabase
			.from('todo_presets')
			.insert([preset])
			.select()
			.single();

		if (error) {
			console.error('Error creating preset:', error);
			throw error;
		}
		return data as TodoPreset;
	},

	async deletePreset(id: string): Promise<void> {
		const { error } = await supabase.from('todo_presets').delete().eq('id', id);
		if (error) {
			console.error('Error deleting preset:', error);
			throw error;
		}
	}
};
