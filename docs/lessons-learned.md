# 개발 교훈 기록

작업하다 실제로 부딪힌 문제와 그 원인·대응을 남긴다. 같은 실수를 반복하지 않는 것이 목적이므로,
"무엇을 했다"가 아니라 **무엇이 잘못됐고 다음엔 어떻게 할 것인지**를 적는다.

---

## 1. 스택 PR을 머지할 때 `--delete-branch`를 쓰지 말 것

**상황** — v1.4.0 작업에서 PR을 서로 쌓아 올렸다.

```
#13 (base: main)      ← 모달 높이
#14 (base: #13 브랜치) ← 마감 시각
#15 (base: #14 브랜치) ← 프리셋
```

`gh pr merge 13 --merge --delete-branch`로 #13을 머지하자, **#14가 자동으로 CLOSED** 되었다.
#14의 base 브랜치가 방금 삭제됐기 때문이다. 더 나쁜 점은 닫힌 PR은 base를 바꿀 수도, 되살릴 수도 없다는 것이다.

```
GraphQL: Could not open the pull request. (reopenPullRequest)
GraphQL: Cannot change the base branch of a closed pull request. (updatePullRequest)
```

**복구 방법** — 삭제된 브랜치를 원래 커밋 SHA로 되살리면 재오픈이 풀린다.
로컬 브랜치도 함께 지워지므로 SHA를 직접 지정해야 한다.

```bash
git push origin <삭제된-브랜치의-SHA>:refs/heads/<브랜치명>
gh pr reopen <PR번호>
gh pr edit <PR번호> --base main
```

**다음부터** — 스택 PR은 이렇게 처리한다.

1. 머지는 아래에서 위로, **`--delete-branch` 없이** 진행한다.
2. 하나 머지할 때마다 다음 PR의 base를 `main`으로 옮긴다 (`gh pr edit <n> --base main`).
3. 브랜치 삭제는 **전부 머지된 뒤 한 번에** 정리한다.

base를 옮긴 직후 `mergeStateStatus`가 잠시 `UNKNOWN`으로 나오는 것은 정상이다. 다만
`CONFLICTING`이 유지되면 진짜 충돌이므로 `git merge-tree --write-tree`로 로컬에서 원인을 먼저 확인한다.

---

## 2. 버전을 정하기 전에 `main`의 현재 버전을 확인할 것

**상황** — 세션 시작 시 `main`은 v1.2.0이었다. 그래서 릴리즈 노트를 v1.3.0으로 작성했다.
그런데 작업 도중 favicon 작업이 `main`에 병합되면서 **v1.3.0을 먼저 가져갔다**.
결과적으로 릴리즈 PR 전체를 v1.4.0으로 다시 만들어야 했고, `package.json`과 `releaseNotes.ts`에서 충돌이 났다.

**원인** — 장시간 작업에서 "브랜치를 딴 시점의 `main`"을 계속 최신이라고 가정했다.

**다음부터** — 릴리즈 브랜치를 만들거나 버전 번호를 적기 **직전에** 실제 값을 다시 읽는다.

```bash
git fetch origin
git show origin/main:package.json | grep '"version"'
```

릴리즈 브랜치 이름에 버전을 넣었다면(`release--v1.3.0`) 버전이 바뀔 때 **브랜치도 새로 만든다.**
머지 커밋 메시지에 브랜치명이 남아, 이름과 내용이 어긋나면 이력이 거짓말을 하게 된다.

---

## 3. 문서가 "손으로 맞추라"고 하는 값은 테스트로 고정할 것

[`release-versioning-guide.md`](./release-versioning-guide.md)는 `package.json`의 `version`과
`releaseNotes.ts`의 `currentReleaseNotes.version`을 반드시 손으로 맞추라고 안내한다.
헤더 버전 뱃지는 `package.json`을 따르므로, 둘이 어긋나면 사용자에게 **실제와 다른 버전의 릴리즈 노트**가 노출된다.

이 조합을 [`releaseNotes.test.ts`](../src/lib/release/releaseNotes.test.ts)로 고정해뒀는데,
바로 그 릴리즈에서 v1.3.0 → v1.4.0 변경이 생겼고 테스트가 양쪽을 다 고쳤는지 확인해줬다.

**교훈** — 규약이 사람의 주의력에 의존하고 있으면, 그 규약을 검증하는 테스트를 함께 만든다.
"가이드에 적어뒀다"는 것은 지켜진다는 보장이 아니다.

---

## 4. 기존 컬럼을 새 의미로 재활용하기 전에 실제 데이터를 볼 것

**상황** — 마감 시각을 넣을 때 `todos.due_date`가 `timestamptz`라 스키마 변경 없이 시각 파트를 쓰려 했다.

**문제** — 기존 213개 레코드의 시각 파트에는 **"생성 시각"이 이미 들어 있었다**.
`new Date().toISOString()`으로 저장해왔기 때문이다. 그대로 해석했다면 모든 기존 할 일에
엉뚱한 마감 시각이 표시됐을 것이다. 백필로 자정에 맞추는 방법도 있었지만 운영 데이터 213행을 건드려야 했다.

**대응** — nullable `due_time` 컬럼을 새로 추가했다(`NULL` = 시각 미지정). 기존 데이터를 전혀 바꾸지 않는다.

**교훈** — 타입이 맞는다고 재활용 가능한 게 아니다. 그 컬럼에 **지금 무엇이 들어 있는지** 먼저 조회한다.
스키마 변경을 피하려다 운영 데이터를 마이그레이션하게 되면 손해다. 가산적(additive) 컬럼 추가가 보통 더 싸고 안전하다.

---

## 5. `adapter-auto`는 로컬에서 실행 가능한 프로덕션 산출물을 만들지 못한다

```
> Using @sveltejs/adapter-auto
  Could not detect a supported production environment.
```

`pnpm build`는 통과하지만 `pnpm preview`로 띄울 수 있는 결과물이 나오지 않는다.
그래서 E2E는 [`playwright.config.ts`](../playwright.config.ts)의 `webServer`에서 **dev 서버**를 쓴다.
검증 대상이 모두 클라이언트 동작이라 dev/prod 차이가 결과에 영향을 주지 않는다.

프로덕션 번들 자체를 검증해야 한다면 `adapter-node`나 `adapter-static`으로 별도 설정이 필요하다.

---

## 6. E2E에서 `addInitScript`로 스토리지를 비우지 말 것

게스트 모드 진입 헬퍼에서 이렇게 썼다가 `page.reload()`가 들어간 시나리오 3개가 전부 깨졌다.

```ts
// ❌ 모든 네비게이션마다 실행된다 — reload 시 게스트 세션과 저장한 데이터까지 날아간다
await page.addInitScript(() => window.localStorage.clear());
```

Playwright는 **테스트마다 새 브라우저 컨텍스트**를 주므로 `localStorage`는 이미 비어 있다.
초기화 코드 자체가 불필요했다. 굳이 중간에 비워야 한다면 `addInitScript`가 아니라 그 시점에 1회만 실행한다.

**교훈** — `addInitScript`는 "테스트 시작 전 1회"가 아니라 **"모든 문서 로드 전 매번"** 이다.

---

## 7. 백그라운드 브라우저 패널에서는 트랜지션이 진행되지 않는다

`document.hidden === true`인 탭에서는 rAF가 스로틀링되어 Svelte의 `slide` 트랜지션이 멈춘다.
모달 높이를 재려 했더니 `getBoundingClientRect().height`가 계속 `0`으로 나왔고,
스크린샷을 찍을 때마다 한 프레임씩만 진행됐다.

또 좌표 기반 클릭은 이전 스크린샷의 좌표 프레임을 쓰기 때문에, 화면이 바뀐 뒤 재사용하면
엉뚱한 곳(오버레이 등)을 눌러 모달이 닫히는 일이 생긴다.

**교훈** — 애니메이션이 얽힌 UI를 실제로 측정·조작해야 한다면 백그라운드 패널을 붙들고 씨름하지 말고
**Playwright(실제 브라우저)로 검증한다.** 어차피 E2E로 남길 거라면 그게 더 빠르다.
