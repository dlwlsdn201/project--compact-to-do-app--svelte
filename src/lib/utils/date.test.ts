import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStartOfDay, isToday, isTomorrow, isPast, getTomorrowDateString } from './date';

// ─────────────────────────────────────────────
// getStartOfDay
// ─────────────────────────────────────────────
describe('getStartOfDay', () => {
	it('Date 객체를 받아 시·분·초를 제거한 자정 기준 날짜를 반환한다', () => {
		const input = new Date('2026-04-14T15:30:45');
		const result = getStartOfDay(input);
		expect(result.getHours()).toBe(0);
		expect(result.getMinutes()).toBe(0);
		expect(result.getSeconds()).toBe(0);
		expect(result.getMilliseconds()).toBe(0);
	});

	it('문자열을 받아도 연·월·일을 올바르게 유지한다', () => {
		const result = getStartOfDay('2026-04-14T15:30:00');
		expect(result.getFullYear()).toBe(2026);
		expect(result.getMonth()).toBe(3); // 0-indexed: April = 3
		expect(result.getDate()).toBe(14);
	});

	it('자정(00:00:00) 입력도 동일하게 처리한다', () => {
		const result = getStartOfDay('2026-04-14T00:00:00');
		expect(result.getHours()).toBe(0);
		expect(result.getDate()).toBe(14);
	});
});

// ─────────────────────────────────────────────
// isToday
// ─────────────────────────────────────────────
describe('isToday', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date('2026-04-14T12:00:00'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('오늘 날짜 문자열이면 true를 반환한다', () => {
		expect(isToday('2026-04-14')).toBe(true);
	});

	it('오늘 날짜의 ISO 타임스탬프도 true를 반환한다', () => {
		expect(isToday('2026-04-14T23:59:59')).toBe(true);
	});

	it('어제 날짜면 false를 반환한다', () => {
		expect(isToday('2026-04-13')).toBe(false);
	});

	it('내일 날짜면 false를 반환한다', () => {
		expect(isToday('2026-04-15')).toBe(false);
	});

	it('null이면 false를 반환한다', () => {
		expect(isToday(null)).toBe(false);
	});

	it('undefined이면 false를 반환한다', () => {
		expect(isToday(undefined)).toBe(false);
	});
});

// ─────────────────────────────────────────────
// isTomorrow
// ─────────────────────────────────────────────
describe('isTomorrow', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date('2026-04-14T12:00:00'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('내일 날짜면 true를 반환한다', () => {
		expect(isTomorrow('2026-04-15')).toBe(true);
	});

	it('오늘 날짜면 false를 반환한다', () => {
		expect(isTomorrow('2026-04-14')).toBe(false);
	});

	it('모레면 false를 반환한다', () => {
		expect(isTomorrow('2026-04-16')).toBe(false);
	});

	it('null이면 false를 반환한다', () => {
		expect(isTomorrow(null)).toBe(false);
	});

	it('undefined이면 false를 반환한다', () => {
		expect(isTomorrow(undefined)).toBe(false);
	});

	it('[월말 경계] 12월 31일 다음 날은 1월 1일로 인식한다', () => {
		vi.setSystemTime(new Date('2026-12-31T12:00:00'));
		expect(isTomorrow('2027-01-01')).toBe(true);
	});

	it('[월말 경계] 1월 31일 다음 날은 2월 1일로 인식한다', () => {
		vi.setSystemTime(new Date('2026-01-31T12:00:00'));
		expect(isTomorrow('2026-02-01')).toBe(true);
	});
});

// ─────────────────────────────────────────────
// isPast
// ─────────────────────────────────────────────
describe('isPast', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date('2026-04-14T12:00:00'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('어제 날짜면 true를 반환한다', () => {
		expect(isPast('2026-04-13')).toBe(true);
	});

	it('먼 과거 날짜도 true를 반환한다', () => {
		expect(isPast('2020-01-01')).toBe(true);
	});

	it('오늘 날짜는 false를 반환한다 (과거가 아님)', () => {
		expect(isPast('2026-04-14')).toBe(false);
	});

	it('내일 날짜면 false를 반환한다', () => {
		expect(isPast('2026-04-15')).toBe(false);
	});

	it('null이면 false를 반환한다', () => {
		expect(isPast(null)).toBe(false);
	});

	it('undefined이면 false를 반환한다', () => {
		expect(isPast(undefined)).toBe(false);
	});
});

// ─────────────────────────────────────────────
// getTomorrowDateString
// ─────────────────────────────────────────────
describe('getTomorrowDateString', () => {
	beforeEach(() => {
		vi.setSystemTime(new Date('2026-04-14T12:00:00'));
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('반환값이 isTomorrow로 인식된다', () => {
		const result = getTomorrowDateString();
		expect(isTomorrow(result)).toBe(true);
	});

	it('반환값은 유효한 ISO 문자열이다', () => {
		const result = getTomorrowDateString();
		const parsed = new Date(result);
		expect(parsed.toISOString()).toBe(result);
	});

	it('[월말 경계] 12월 31일의 내일은 1월 1일이다', () => {
		vi.setSystemTime(new Date('2026-12-31T12:00:00'));
		const result = getTomorrowDateString();
		const parsed = new Date(result);
		expect(parsed.getFullYear()).toBe(2027);
		expect(parsed.getMonth()).toBe(0); // January = 0
		expect(parsed.getDate()).toBe(1);
	});
});
