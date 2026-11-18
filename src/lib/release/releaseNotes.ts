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
  version: "1.7.0",
  title: "실시간 시계와 할 일 미리보기",
  updatedAt: "2026.11.18",
  features: [
    {
      summary: "헤더에 실시간 디지털 시계 표시",
      detail: [
        "24시간 형식의 시계를 LAB 디지털체로 표시하며, 초마다 콜론이 깜빡여요.",
        "화면 너비 480px 이하에서는 시계를 숨겨 모바일 헤더 공간을 확보해요."
      ]
    },
    {
      summary: "할 일 상세 미리보기와 체크리스트",
      detail: [
        "할 일 카드를 누르면 제목, 마크다운 상세 내용, 마감 시각과 우선순위를 확인할 수 있어요.",
        "미리보기 안의 마크다운 체크박스 상태는 클릭 즉시 저장돼요."
      ]
    }
  ],
  fixes: []
};
