import type { User } from '@supabase/supabase-js';

// Svelte 5 Rune-based State for Authentication
class AuthStore {
	user = $state<User | null>(null);
	isLoading = $state(true);

	setUser(newUser: User | null) {
		this.user = newUser;
	}

	setLoading(state: boolean) {
		this.isLoading = state;
	}
}

export const authStore = new AuthStore();
