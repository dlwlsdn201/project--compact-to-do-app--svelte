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
  version: "1.3.0",
  title: "서비스 페이지 아이콘 신규 추가",
  updatedAt: "2026.05.17",
  features: [
    {
      summary: "서비스 페이지 아이콘 신규 추가",
      detail: [
        "서비스 페이지의 대표 아이콘을 추가했어요.",
        "아이콘은 서비스 페이지의 헤더에 표시되며, 서비스 페이지의 제목과 함께 표시됩니다.",
      ],
    },
  ],
  fixes: [],
};
