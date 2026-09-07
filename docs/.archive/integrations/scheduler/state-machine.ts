import type {
	Appointment,
	StatusMeta,
	StatusTransition,
	StatusWorkflow,
} from "./types";

function matchesFrom(from: string | string[], current: string): boolean {
	if (from === "*") return true;
	if (Array.isArray(from)) return from.includes(current);
	return from === current;
}

export function canTransition(
	workflow: StatusWorkflow,
	from: string,
	to: string,
	appointment?: Appointment<any>,
): boolean {
	return workflow.transitions.some((t) => {
		const fromMatch = matchesFrom(t.from, from);
		const toMatch = t.to === to;
		const guardPass = !t.guard || (appointment ? t.guard(appointment) : true);
		return fromMatch && toMatch && guardPass;
	});
}

export function getAvailableTransitions(
	workflow: StatusWorkflow,
	from: string,
	appointment?: Appointment<any>,
): StatusTransition[] {
	return workflow.transitions.filter((t) => {
		const fromMatch = matchesFrom(t.from, from);
		const guardPass = !t.guard || (appointment ? t.guard(appointment) : true);
		return fromMatch && guardPass;
	});
}

export function getStatusMeta(
	workflow: StatusWorkflow,
	key: string,
): StatusMeta | undefined {
	return workflow.statuses.find((s) => s.key === key);
}
