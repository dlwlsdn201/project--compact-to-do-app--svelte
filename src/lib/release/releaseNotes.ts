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
  version: "1.6.0",
  title: "오늘과 내일 사이 할 일 이동",
  updatedAt: "2026.11.02",
  features: [
    {
      summary: "오늘·내일 카드에서 바로 날짜 변경",
      detail: [
        "오늘 할 일의 '내일 하기' 버튼으로 할 일을 내일로 옮길 수 있어요.",
        "내일 할 일의 '오늘 하기' 버튼으로 할 일을 오늘로 옮길 수 있어요.",
        "지난 이력과 같은 카드 버튼 배치를 사용하며, 완료된 항목에는 이동 버튼을 표시하지 않아요.",
      ],
    },
  ],
  fixes: [],
};
