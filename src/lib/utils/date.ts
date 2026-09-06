export function getStartOfDay(date: Date | string): Date {
	const d = new Date(date);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isToday(dateString: string | null | undefined): boolean {
	if (!dateString) return false;
	const checkDate = getStartOfDay(dateString);
	const today = getStartOfDay(new Date());
	return checkDate.getTime() === today.getTime();
}

export function isTomorrow(dateString: string | null | undefined): boolean {
	if (!dateString) return false;
	const checkDate = getStartOfDay(dateString);
	const tomorrow = getStartOfDay(new Date());
	tomorrow.setDate(tomorrow.getDate() + 1);
	return checkDate.getTime() === tomorrow.getTime();
}

export function isPast(dateString: string | null | undefined): boolean {
	if (!dateString) return false;
	const checkDate = getStartOfDay(dateString);
	const today = getStartOfDay(new Date());
	return checkDate.getTime() < today.getTime();
}

export function getTomorrowDateString(): string {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return d.toISOString();
}

/**
 * 마감 시각 입력값을 'HH:mm' 형태로 정규화한다.
 * Supabase `time` 컬럼은 'HH:MM:SS'로 내려오므로 초 단위는 잘라낸다.
 * 값이 없거나 형식이 어긋나면 null(시각 미지정)을 반환한다.
 */
export function normalizeDueTime(value: string | null | undefined): string | null {
	if (!value) return null;

	const matched = /^(\d{1,2}):(\d{2})/.exec(value.trim());
	if (!matched) return null;

	const hours = Number(matched[1]);
	const minutes = Number(matched[2]);
	if (hours > 23 || minutes > 59) return null;

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** 마감 시각을 한국어 표기로 변환한다. ('18:30' → '오후 6:30') */
export function formatDueTime(value: string | null | undefined): string {
	const normalized = normalizeDueTime(value);
	if (!normalized) return '';

	const [hours, minutes] = normalized.split(':').map(Number);
	const meridiem = hours < 12 ? '오전' : '오후';
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;

	return `${meridiem} ${hour12}:${String(minutes).padStart(2, '0')}`;
}

/**
 * 마감 날짜와 마감 시각을 합쳐 하나의 Date로 만든다.
 * 시각이 미지정이면 null을 반환한다.
 */
export function getDueDateTime(
	dueDate: string | null | undefined,
	dueTime: string | null | undefined
): Date | null {
	const normalized = normalizeDueTime(dueTime);
	if (!dueDate || !normalized) return null;

	const [hours, minutes] = normalized.split(':').map(Number);
	const combined = getStartOfDay(dueDate);
	combined.setHours(hours, minutes, 0, 0);

	return combined;
}

/** 마감 시각이 지정돼 있고, 그 시각이 이미 지났는지 여부 */
export function isOverdue(
	dueDate: string | null | undefined,
	dueTime: string | null | undefined,
	now: Date = new Date()
): boolean {
	const dueDateTime = getDueDateTime(dueDate, dueTime);
	if (!dueDateTime) return false;

	return dueDateTime.getTime() < now.getTime();
}
