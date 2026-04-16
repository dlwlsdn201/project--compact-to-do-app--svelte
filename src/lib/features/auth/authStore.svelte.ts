import { supabase } from '$lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const GUEST_MODE_KEY = 'guest_mode';

class AuthStore {
	user = $state<User | null>(null);
	username = $state<string | null>(null);
	isInitialized = $state(false);
	isGuest = $state(false);

	init() {
		// 게스트 모드 복원 (브라우저 재방문 시)
		if (localStorage.getItem(GUEST_MODE_KEY) === 'true') {
			this.isGuest = true;
			this.isInitialized = true;
		}

		// 초기 세션 확인
		supabase.auth.getSession().then(({ data: { session } }) => {
			this.setUser(session?.user ?? null);
			if (session?.user) this.isGuest = false; // 실제 로그인이 있으면 게스트 해제
			this.isInitialized = true;
		});

		// 유저 로그인/로그아웃 상태 변경 감지
		supabase.auth.onAuthStateChange((_event, session) => {
			this.setUser(session?.user ?? null);
			if (session?.user) this.isGuest = false;
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

	loginAsGuest() {
		localStorage.setItem(GUEST_MODE_KEY, 'true');
		this.isGuest = true;
	}

	exitGuestMode() {
		localStorage.removeItem(GUEST_MODE_KEY);
		this.isGuest = false;
	}

	async logout() {
		this.exitGuestMode();
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('로그아웃 에러:', error.message);
		}
	}
}

export const authStore = new AuthStore();
