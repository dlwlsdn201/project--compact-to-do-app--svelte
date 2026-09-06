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
  version: "1.4.0",
  title: "더 빠른 등록과 시간 단위 관리",
  updatedAt: "2026.09.06",
  features: [
    {
      summary: "할 일 프리셋(템플릿) 신규 기능",
      detail: [
        "자주 쓰는 제목·내용·우선순위 형식을 프리셋으로 저장해둘 수 있어요.",
        "새 할 일을 등록할 때 프리셋을 한 번만 누르면 입력 폼이 바로 채워져요. 이후 세부 내용만 고쳐서 등록하면 돼요.",
        "프리셋은 더 이상 쓰지 않으면 칩 옆의 X를 눌러 삭제할 수 있어요.",
        "로그인 없이 이용 중이라면 프리셋도 사용 기기에만 저장돼요.",
      ],
    },
    {
      summary: "마감 시각 입력 신규 기능",
      detail: [
        "할 일에 날짜뿐 아니라 하루 중 마감 시각까지 기록할 수 있어요.",
        "마감 시각이 있는 할 일은 목록에 시각이 함께 표시돼요.",
        "마감 시각이 지났는데 아직 끝내지 못한 할 일은 빨간색으로 강조해서 알려줘요.",
        "마감 시각은 선택 항목이라, 입력하지 않으면 지금까지와 똑같이 날짜 단위로만 관리돼요.",
      ],
    },
  ],
  fixes: [
    "할 일 입력 창이 기존보다 조금 더 넉넉해져서, 상세 내용을 적을 때 답답함이 줄었어요.",
  ],
};
