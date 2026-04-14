# 신규 릴리즈 시 버전·문서 업데이트 가이드

배포 전에 앱 버전 문자열과 인앱 릴리즈 노트가 서로 어긋나지 않도록, 아래 순서와 파일을 기준으로 갱신한다.

## 버전이 쓰이는 위치

| 위치 | 역할 | 갱신 방법 |
|------|------|-----------|
| [`package.json`](../package.json)의 `version` | npm 패키지 버전, **앱에 표시되는 버전의 기준** | 수동으로 semver에 맞게 수정 |
| [`svelte.config.js`](../svelte.config.js)의 `kit.version.name` | 빌드 시 `package.json`을 읽어 동일 값 사용 | **별도 수정 불필요** (이미 연동됨) |
| SvelteKit `$app/environment`의 `version` | 헤더 `v…` 뱃지 등 런타임 버전 | `package.json`과 자동 일치 |
| [`src/lib/release/releaseNotes.ts`](../src/lib/release/releaseNotes.ts)의 `currentReleaseNotes` | 릴리즈 노트 모달 본문 | **반드시** `version`·`updatedAt`·내용을 같은 릴리즈에 맞게 수정 |
| [`README.md`](../README.md) 상단 배지의 `version-x.x.x` | 저장소 문서상 버전 표시 | 선택: 배포와 맞출 때만 수정 |

정리하면, **반드시 손으로 맞출 것은 `package.json`의 `version`과 `releaseNotes.ts` 한 세트**다. `svelte.config.js`는 `package.json`을 읽으므로 중복 입력하지 않는다.

## 시맨틱 버전(간단 규칙)

- **MAJOR**: 호환을 깨는 큰 변경
- **MINOR**: 새 기능·하위 호환 유지
- **PATCH**: 버그 수정·작은 개선

팀 규칙이 있으면 그에 따른다.

## 릴리즈 전 체크리스트

1. **`package.json`의 `version`을 새 버전으로 올린다.**  
   예: `1.1.0` → `1.2.0`

2. **`src/lib/release/releaseNotes.ts`의 `currentReleaseNotes`를 같은 커밋/PR에서 수정한다.**
   - `version`: `package.json`과 **동일 문자열**
   - `title`: 릴리즈를 한 줄로 요약 (모달 제목에 사용)
   - `updatedAt`: 배포일 기준 날짜 (표시용, `YYYY-MM-DD` 권장)
   - `features`: 「신규 기능」 섹션 bullet
   - `fixes`: 「수정 사항」 섹션 bullet (없으면 빈 배열 `[]`)

3. **품질 확인**
   - `pnpm check`
   - `pnpm test:run` (선택이 아니라 CI와 동일하게 맞추는 것이 좋음)
   - `pnpm build`로 프로덕션 빌드가 통과하는지 확인

4. **문서(선택)**
   - [`README.md`](../README.md)의 버전 배지 URL을 새 버전에 맞출지 결정한다.  
     공개 저장소·배지 노출을 중요하게 보면 릴리즈마다 갱신하는 편이 좋다.

5. **사용자에게 “새 릴리즈” 알림이 뜨는 조건 (인앱)**  
   - 헤더의 미읽음 점(N)은 **로컬에 저장된 마지막 확인 버전**과 **현재 `version`**을 비교한다.  
   - 구현: [`src/lib/utils/releaseAcknowledgement.ts`](../src/lib/utils/releaseAcknowledgement.ts)  
   - 버전을 올리고 배포하면, 이전에 확인한 사용자에게는 새 버전이 **미확인**으로 다시 표시될 수 있다. (의도된 동작에 가깝다.)

## 자주 하는 실수

- `package.json`만 올리고 `releaseNotes.ts`의 `version`을 그대로 둔다 → 모달 제목과 버전 뱃지가 불일치한다.
- `features` / `fixes` 필드명을 바꾼다 → [`ReleaseNotesDialog`](../src/lib/components/ui/ReleaseNotesDialog.svelte)와 타입이 깨진다. 스키마 변경 시 컴포넌트와 타입을 함께 수정한다.

## 배포 후(선택)

- Git 태그: `git tag v1.2.0` 후 원격 푸시 — 릴리즈 노트를 GitHub Releases 등에 붙일 때 유용하다.
- 변경 이력을 별도 `CHANGELOG.md`로 관리하는 팀이면, 같은 릴리즈 내용을 거기에도 한 번 반영한다.

---

이 문서는 릴리즈 절차의 **단일 참고**로 두고, 규칙이 바뀌면 이 파일과 `releaseNotes.ts` 주석을 함께 업데이트하는 것을 권장한다.
