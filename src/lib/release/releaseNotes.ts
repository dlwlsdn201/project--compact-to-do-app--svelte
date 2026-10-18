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
  version: "1.5.2",
  title: "할 일 삭제 확인 및 오류 안내 개선",
  updatedAt: "2026.10.18",
  features: [
    {
      summary: "화면 안에서 할 일 삭제 확인",
      detail: [
        "휴지통을 누르면 삭제 확인과 취소 버튼이 할 일 항목 안에 나타나요.",
        "삭제 중에는 진행 상태를 표시하고, 실패하면 확인 영역에서 다시 시도할 수 있어요.",
      ],
    },
  ],
  fixes: [
    "게스트 모드에서 삭제 저장이 실패하면 항목을 그대로 두고 오류를 안내해요.",
  ],
};
