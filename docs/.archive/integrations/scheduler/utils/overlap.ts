export interface Interval {
	date: string;
	end: string;
	start: string;
}

export function intervalsOverlap(a: Interval, b: Interval): boolean {
	if (a.date !== b.date) return false;
	return a.start < b.end && b.start < a.end;
}

export function findOverlapping<T extends Interval>(
	target: Interval,
	existing: T[],
): T[] {
	return existing.filter((e) => intervalsOverlap(target, e));
}

export function intervalDurationMinutes(start: string, end: string): number {
	const [sh, sm] = start.split(":").map(Number);
	const [eh, em] = end.split(":").map(Number);
	return eh * 60 + em - (sh * 60 + sm);
}
