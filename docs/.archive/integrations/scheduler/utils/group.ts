export function groupBy<T>(
	items: T[],
	keyFn: (item: T) => string,
): Map<string, T[]> {
	const map = new Map<string, T[]>();
	for (const item of items) {
		const key = keyFn(item);
		const group = map.get(key);
		if (group) {
			group.push(item);
		} else {
			map.set(key, [item]);
		}
	}
	return map;
}

export function indexBy<T>(
	items: T[],
	keyFn: (item: T) => string,
): Map<string, T> {
	const map = new Map<string, T>();
	for (const item of items) {
		map.set(keyFn(item), item);
	}
	return map;
}

export function countBy<T>(
	items: T[],
	keyFn: (item: T) => string,
): Map<string, number> {
	const map = new Map<string, number>();
	for (const item of items) {
		const key = keyFn(item);
		map.set(key, (map.get(key) ?? 0) + 1);
	}
	return map;
}
