import { supabase } from '$lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

class AuthStore {
	user = $state<User | null>(null);
	username = $state<string | null>(null);
	isInitialized = $state(false);

	init() {
		// 초기 세션 확인
		supabase.auth.getSession().then(({ data: { session } }) => {
			this.setUser(session?.user ?? null);
			this.isInitialized = true;
		});

		// 유저 로그인/로그아웃 상태 변경 감지
		supabase.auth.onAuthStateChange((_event, session) => {
			this.setUser(session?.user ?? null);
			this.isInitialized = true;
		});
	}

	setUser(user: User | null) {
		this.user = user;
		
		if (user) {
			// 카카오 로그인 시 user_metadata에서 이름이나 닉네임을 가져옵니다.
			this.username = 
				user.user_metadata?.name || 
				user.user_metadata?.full_name || 
				user.user_metadata?.preferred_username || 
				user.email || 
				'사용자';
		} else {
			this.username = null;
		}
	}

	async loginWithKakao() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'kakao',
			options: {
				redirectTo: `${window.location.origin}/`
			}
		});

		if (error) {
			console.error('카카오 로그인 에러:', error.message);
		}
	}

	async logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('로그아웃 에러:', error.message);
		}
	}
}

export const authStore = new AuthStore();
