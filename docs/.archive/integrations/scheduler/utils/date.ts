export function formatDate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
	const [y, m, d] = dateStr.split("-").map(Number);
	return new Date(y, m - 1, d);
}

export function formatTime(hours: number, minutes: number): string {
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function parseTime(timeStr: string): { hours: number; minutes: number } {
	const [h, m] = timeStr.split(":").map(Number);
	return { hours: h, minutes: m };
}

export function timeToMinutes(timeStr: string): number {
	const { hours, minutes } = parseTime(timeStr);
	return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return formatTime(hours, minutes);
}

export function addMinutes(timeStr: string, minutesToAdd: number): string {
	const total = timeToMinutes(timeStr) + minutesToAdd;
	return minutesToTime(total);
}

export function getDayLabel(dateStr: string, today: string): string {
	if (dateStr === today) return "Today";
	const date = parseDate(dateStr);
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const dayName = days[date.getDay()];
	const dayNum = date.getDate();
	return `${dayName} ${dayNum}`;
}

export function getDaysRange(startDate: string, count: number): string[] {
	const start = parseDate(startDate);
	const days: string[] = [];
	for (let i = 0; i < count; i++) {
		const d = new Date(start);
		d.setDate(d.getDate() + i);
		days.push(formatDate(d));
	}
	return days;
}

export function getToday(): string {
	return formatDate(new Date());
}

export function isSameDay(a: string, b: string): boolean {
	return a === b;
}
