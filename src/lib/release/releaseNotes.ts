/**
 * 배포 시 `package.json`의 version과 동일하게 맞출 것 (svelte.config.js kit.version.name과 일치).
 * 릴리즈마다 이 파일과 package.json 버전을 같은 PR/커밋에서 갱신한다.
 */

/** 릴리즈 노트 한 세트의 형태 */
export interface ReleaseNote {
	version: string;
	title: string;
	updatedAt: string;
	/** 신규 기능 (Modal에서 「신규 기능」 섹션). detail이 있으면 summary 아래 하위 bullets로 표시 */
	features: { summary: string; detail?: string[] }[];
	/** 수정·버그픽스 등 bullet (Modal에서 「수정 사항」 섹션) */
	fixes: string[];
}

/** 현재 빌드에 포함된 릴리즈 요약 (정적 데이터) */
export const currentReleaseNotes: ReleaseNote = {
	version: '1.2.0',
	title: '로그인 없이 사용 가능한 기능 신규 추가',
	updatedAt: '2026.04.16',
	features: [
		{
			summary: '로그인 없이 이용하기 신규 기능',
			detail: [
				'카카오 로그인이 불가능한 환경에서도 앱을 바로 사용할 수 있도록 "로그인 없이 이용하기" 모드를 추가했어요.',
				'비로그인 모드에서도 할 일 등록·수정·삭제가 모두 가능해요.',
				'하지만 데이터는 사용 기기에만 저장되며, 브라우저 캐시 및 데이터 비우기를 할 경우, 이전 이력 데이터들도 모두 초기화가 돼요.',
			]
		}
	],
	fixes: [
	]
};
