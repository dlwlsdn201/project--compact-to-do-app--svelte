import { browser } from '$app/environment';

/** localStorage 키 — 다른 앱과 충돌을 피하기 위한 prefix */
export const RELEASE_ACK_STORAGE_KEY = 'todomorrow:lastAcknowledgedVersion';

/**
 * 사용자가 마지막으로 릴리즈 노트를 확인한 앱 버전 문자열을 반환한다.
 * SSR 또는 저장 없음이면 null.
 */
export function getLastAcknowledgedVersion(): string | null {
	if (!browser) return null;
	try {
		return localStorage.getItem(RELEASE_ACK_STORAGE_KEY);
	} catch {
		return null;
	}
}

/**
 * 현재 버전의 릴리즈 노트를 확인했음을 저장한다.
 */
export function setLastAcknowledgedVersion(appVersion: string): void {
	if (!browser) return;
	try {
		localStorage.setItem(RELEASE_ACK_STORAGE_KEY, appVersion);
	} catch {
		// 저장 실패 시 무시 (프라이빗 모드 쿼터 등)
	}
}
