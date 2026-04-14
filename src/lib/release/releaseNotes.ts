/**
 * 배포 시 `package.json`의 version과 동일하게 맞출 것 (svelte.config.js kit.version.name과 일치).
 * 릴리즈마다 이 파일과 package.json 버전을 같은 PR/커밋에서 갱신한다.
 */

/** 릴리즈 노트 한 세트의 형태 */
export interface ReleaseNote {
	version: string;
	title: string;
	updatedAt: string;
	/** 신규 기능 bullet (Modal에서 「신규 기능」 섹션) */
	features: string[];
	/** 수정·버그픽스 등 bullet (Modal에서 「수정 사항」 섹션) */
	fixes: string[];
}

/** 현재 빌드에 포함된 릴리즈 요약 (정적 데이터) */
export const currentReleaseNotes: ReleaseNote = {
	version: '1.1.0',
	title: '업데이트 내용',
	updatedAt: '2026-04-14',
	features: [
		'할 일 제목의 입력 글자 제한을 50자 -> 70자로 늘렸어요.',
		'할 일 제목의 글자 길이를 눈으로 확인할 수 있어요.',
	],
	fixes: [
	]
};
