import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "clinic.branchId";
const DEFAULT_BRANCH = "main";

let current =
	typeof localStorage !== "undefined"
		? (localStorage.getItem(STORAGE_KEY) ?? DEFAULT_BRANCH)
		: DEFAULT_BRANCH;

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function getSnapshot(): string {
	return current;
}

/** Active branch id shared across lists/queues/pricelists (P0-1). */
export function getBranchId(): string {
	return current;
}

export function setBranchId(id: string): void {
	const next = id.trim() || DEFAULT_BRANCH;
	if (next === current) return;
	current = next;
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// storage unavailable (SSR/private mode) — keep in-memory value.
	}
	for (const l of listeners) l();
}

/** React hook for the active branch context. Replaces hardcoded "main". */
export function useBranch(): [string, (id: string) => void] {
	const branchId = useSyncExternalStore(
		subscribe,
		getSnapshot,
		() => DEFAULT_BRANCH,
	);
	const set = useCallback((id: string) => setBranchId(id), []);
	return [branchId, set];
}

export const DEFAULT_BRANCH_ID = DEFAULT_BRANCH;
export const BRANCH_STORAGE_KEY = STORAGE_KEY;
