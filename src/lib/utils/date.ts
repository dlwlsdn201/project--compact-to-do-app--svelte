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
