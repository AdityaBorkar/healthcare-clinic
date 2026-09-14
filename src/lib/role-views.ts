import { useSyncExternalStore } from "react";

export type ClinicRole = "admin" | "doctor" | "nursing" | "reception" | "staff";

const STORAGE_KEY = "clinic.role";

const ROLE_LABELS: Record<ClinicRole, string> = {
	admin: "Admin (ERP)",
	doctor: "Doctor",
	nursing: "Nursing",
	reception: "Reception",
	staff: "Staff",
};

// Role -> allowed sidebar href prefixes (P0-2). Admin sees everything.
const ROLE_ALLOW: Record<ClinicRole, Array<string> | "*"> = {
	admin: "*",
	doctor: ["/opd", "/appointments", "/records", "/print", "/patients"],
	nursing: ["/nursing", "/appointments", "/reception/queue", "/patients"],
	reception: ["/reception", "/appointments", "/patients", "/billing/desk"],
	staff: ["/dashboard", "/reception/queue", "/appointments"],
};

function readRole(): ClinicRole {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (
			raw === "admin" ||
			raw === "doctor" ||
			raw === "nursing" ||
			raw === "reception" ||
			raw === "staff"
		)
			return raw;
	} catch {
		// ignore
	}
	return "reception";
}

let current: ClinicRole =
	typeof localStorage !== "undefined" ? readRole() : "reception";
const listeners = new Set<() => void>();

function subscribe(l: () => void): () => void {
	listeners.add(l);
	return () => {
		listeners.delete(l);
	};
}

export function getClinicRole(): ClinicRole {
	return current;
}

export function setClinicRole(role: ClinicRole): void {
	if (role === current) return;
	current = role;
	try {
		localStorage.setItem(STORAGE_KEY, role);
	} catch {
		// ignore
	}
	for (const l of listeners) l();
}

export function useClinicRole(): [ClinicRole, (r: ClinicRole) => void] {
	const role = useSyncExternalStore(subscribe, () => current, getServerRole);
	return [role, setClinicRole];
}

function getServerRole(): ClinicRole {
	return "reception";
}

export function isHrefAllowed(role: ClinicRole, href: string): boolean {
	const allow = ROLE_ALLOW[role];
	if (allow === "*") return true;
	return allow.some(
		(p) => href === p || href.startsWith(`${p}/`) || href.startsWith(p),
	);
}

export function roleLabel(role: ClinicRole): string {
	return ROLE_LABELS[role];
}

export const CLINIC_ROLES: Array<ClinicRole> = [
	"admin",
	"doctor",
	"nursing",
	"reception",
	"staff",
];

export const ROLE_STORAGE_KEY = STORAGE_KEY;
