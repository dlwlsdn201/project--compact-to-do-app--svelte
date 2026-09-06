import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { presetApi } from '$lib/api/presetApi';
import { localPresetApi } from '$lib/api/localPresetApi';
import { authStore } from '$lib/features/auth/authStore.svelte';
import type { CreateTodoPresetDTO } from '$lib/types/preset';

function getApi() {
	return authStore.isGuest ? localPresetApi : presetApi;
}

export const PRESET_QUERY_KEYS = {
	presets: ['todo-presets'] as const
};

export function usePresets() {
	return createQuery(() => ({
		queryKey: PRESET_QUERY_KEYS.presets,
		queryFn: () => getApi().getPresets()
	}));
}

export function useCreatePreset() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (dto: CreateTodoPresetDTO) => getApi().createPreset(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PRESET_QUERY_KEYS.presets });
		}
	}));
}

export function useDeletePreset() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => getApi().deletePreset(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PRESET_QUERY_KEYS.presets });
		}
	}));
}
