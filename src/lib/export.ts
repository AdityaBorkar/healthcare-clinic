function escapeCell(value: unknown): string {
	const s = value === null || value === undefined ? "" : String(value);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Universal CSV helper (P1): rows -> download. */
export function toCsv<T extends Record<string, unknown>>(
	rows: Array<T>,
	columns: Array<keyof T>,
): string {
	const head = columns.map((c) => escapeCell(String(c))).join(",");
	const body = rows.map((r) => columns.map((c) => escapeCell(r[c])).join(","));
	return [head, ...body].join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export function exportRowsCsv<T extends Record<string, unknown>>(
	filename: string,
	rows: Array<T>,
	columns: Array<keyof T>,
): void {
	downloadCsv(filename, toCsv(rows, columns));
}

/** Universal print helper (P1): prints current view. */
export function printPage(): void {
	window.print();
}
