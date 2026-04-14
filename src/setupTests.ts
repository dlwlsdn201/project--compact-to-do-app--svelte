// vitest 전용 진입점을 사용한다.
// '@testing-library/jest-dom' (Jest용)은 vitest의 Assertion<T> 인터페이스를
// 확장하지 않아 IDE에서 toBeInTheDocument 등 매처를 인식하지 못한다.
// '/vitest' 진입점은 @vitest/expect의 Assertion을 올바르게 확장한다.
import '@testing-library/jest-dom/vitest';

// jsdom은 Web Animations API(element.animate)를 지원하지 않는다.
// Svelte의 in:/out: 트랜지션(slide, fade 등)이 이 API를 사용하므로
// 테스트 환경에서 "즉시 완료" 방식으로 폴리필한다.
// onfinish setter에서 콜백을 즉시 호출해 Svelte가 DOM을 바로 정리하도록 한다.
Object.defineProperty(Element.prototype, 'animate', {
	writable: true,
	value: () => {
		let _onfinish: (() => void) | null = null;
		return {
			get onfinish() {
				return _onfinish;
			},
			set onfinish(fn: (() => void) | null) {
				_onfinish = fn;
				if (fn) fn(); // 애니메이션이 즉시 완료된 것으로 처리
			},
			finished: Promise.resolve(),
			cancel: () => {},
			play: () => {},
			pause: () => {}
		};
	}
});
