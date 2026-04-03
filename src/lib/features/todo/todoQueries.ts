import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { todoApi } from '$lib/api/todoApi';
import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '$lib/types/todo';

export const QUERY_KEYS = {
	todos: ['todos'] as const
};

export function useTodos() {
	return createQuery(() => ({
		queryKey: QUERY_KEYS.todos,
		queryFn: todoApi.getTodos
	}));
}

export function useCreateTodo() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: todoApi.createTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todos });
		}
	}));
}

export function useUpdateTodo() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ id, updates }: { id: string; updates: UpdateTodoDTO }) =>
			todoApi.updateTodo(id, updates),
		// Optimistic Update
		onMutate: async ({ id, updates }: { id: string; updates: UpdateTodoDTO }) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEYS.todos });
			const previousTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todos);

			queryClient.setQueryData<Todo[]>(QUERY_KEYS.todos, (old) => {
				if (!old) return old;
				return old.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo));
			});

			return { previousTodos };
		},
		onError: (err: any, newTodo: any, context: any) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(QUERY_KEYS.todos, context.previousTodos);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todos });
		}
	}));
}

export function useDeleteTodo() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => todoApi.deleteTodo(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todos });
		}
	}));
}
