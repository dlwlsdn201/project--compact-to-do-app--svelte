import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getStartOfDay,
	isToday,
	isTomorrow,
	isPast,
	getTomorrowDateString,
	normalizeDueTime,
	formatDueTime,
	getDueDateTime,
	isOverdue
} from './date';

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

describe('normalizeDueTime', () => {
	it('빈 값·null·undefined는 null을 반환한다', () => {
		expect(normalizeDueTime('')).toBeNull();
		expect(normalizeDueTime(null)).toBeNull();
		expect(normalizeDueTime(undefined)).toBeNull();
	});

	it("'HH:mm' 입력을 그대로 정규화한다", () => {
		expect(normalizeDueTime('18:30')).toBe('18:30');
	});

	it('한 자리 시간은 0으로 채운다', () => {
		expect(normalizeDueTime('9:05')).toBe('09:05');
	});

	it("Supabase time 컬럼의 'HH:MM:SS' 형식에서 초를 잘라낸다", () => {
		expect(normalizeDueTime('18:30:00')).toBe('18:30');
	});

	it('형식이 어긋나거나 범위를 넘으면 null을 반환한다', () => {
		expect(normalizeDueTime('오후 6시')).toBeNull();
		expect(normalizeDueTime('24:00')).toBeNull();
		expect(normalizeDueTime('12:60')).toBeNull();
	});
});

describe('formatDueTime', () => {
	it('오전 시각을 한국어로 표기한다', () => {
		expect(formatDueTime('09:05')).toBe('오전 9:05');
	});

	it('오후 시각을 12시간제로 표기한다', () => {
		expect(formatDueTime('18:30')).toBe('오후 6:30');
	});

	it('자정과 정오를 12시로 표기한다', () => {
		expect(formatDueTime('00:00')).toBe('오전 12:00');
		expect(formatDueTime('12:00')).toBe('오후 12:00');
	});

	it('시각 미지정이면 빈 문자열을 반환한다', () => {
		expect(formatDueTime(null)).toBe('');
	});
});

describe('getDueDateTime', () => {
	it('날짜와 시각을 합쳐 Date를 만든다', () => {
		const result = getDueDateTime('2026-04-14T00:00:00.000Z', '18:30');
		expect(result?.getHours()).toBe(18);
		expect(result?.getMinutes()).toBe(30);
	});

	it('시각이 미지정이면 null을 반환한다', () => {
		expect(getDueDateTime('2026-04-14T00:00:00.000Z', null)).toBeNull();
	});

	it('날짜가 미지정이면 null을 반환한다', () => {
		expect(getDueDateTime(null, '18:30')).toBeNull();
	});
});

describe('isOverdue', () => {
	const baseDate = new Date(2026, 3, 14, 12, 0, 0);

	it('마감 시각이 지났으면 true', () => {
		expect(isOverdue(baseDate.toISOString(), '09:00', baseDate)).toBe(true);
	});

	it('마감 시각이 아직 남았으면 false', () => {
		expect(isOverdue(baseDate.toISOString(), '18:00', baseDate)).toBe(false);
	});

	it('시각이 미지정이면 항상 false (날짜 단위 관리 항목)', () => {
		expect(isOverdue(baseDate.toISOString(), null, baseDate)).toBe(false);
	});
});
