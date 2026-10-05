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
  version: "1.5.1",
  title: "상세 내용 편집과 미리보기 개선",
  updatedAt: "2026.10.05",
  features: [
    {
      summary: "상세 내용 Markdown 미리보기",
      detail: [
        "제목, 목록, 강조, 링크, 코드 등 Markdown 문법으로 상세 내용을 작성할 수 있어요.",
        "작성과 미리보기를 전환해 저장 전에 결과를 확인할 수 있어요.",
        "저장 내용은 Markdown 원문으로 유지됩니다.",
      ],
    },
  ],
  fixes: [
    "상세 내용 입력창의 기본 높이를 두 배로 늘리고, 드래그로 세로 크기를 조절할 수 있게 고쳤어요.",
    "긴 상세 내용도 미리보기에서 줄바꿈을 유지하고 내부에서 스크롤할 수 있게 고쳤어요.",
  ],
};
