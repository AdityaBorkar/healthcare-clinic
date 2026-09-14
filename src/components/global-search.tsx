import { useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";

import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { orpc } from "#/lib/rpc";

let globalSearchEl: HTMLInputElement | null = null;

export function focusGlobalSearch(): void {
	globalSearchEl?.focus();
}

type PatientHit = { id: string; name?: string; phone?: string };
type ServiceHit = { code: string; id: string; name: string };
type PractitionerHit = { id: string; name?: string; specialty?: string };
type BillHit = { due?: number; id: string; no?: string; patientId?: string };

/**
 * Global search (P0-6): Ctrl+F focuses the input; searches patients,
 * practitioners, services, and bills in the active branch. Ctrl+K opens
 * the command palette.
 */
export function GlobalSearch({ autoFocus = false }: { autoFocus?: boolean }) {
	const [branchId] = useBranch();
	const [query, setQuery] = useState("");
	const [patients, setPatients] = useState<Array<PatientHit>>([]);
	const [services, setServices] = useState<Array<ServiceHit>>([]);
	const [practitioners, setPractitioners] = useState<Array<PractitionerHit>>(
		[],
	);
	const [bills, setBills] = useState<Array<BillHit>>([]);
	const [error, setError] = useState<string | null>(null);
	const [searching, setSearching] = useState(false);
	const navigate = useNavigate();
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		globalSearchEl = inputRef.current;
		return () => {
			if (globalSearchEl === inputRef.current) globalSearchEl = null;
		};
	}, []);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
				if (globalSearchEl) {
					e.preventDefault();
					globalSearchEl.focus();
				}
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	async function onSearch(e?: React.FormEvent) {
		e?.preventDefault();
		const q = query.trim();
		if (!q) return;
		setSearching(true);
		setError(null);
		try {
			const [p, s, pr, dues] = await Promise.all([
				orpc.patients.list({ branchId }),
				orpc.services.list({ branchId }),
				orpc.practitioners.list({ branchId }),
				orpc.billing.reports.duesAging({ branchId }),
			]);
			const items = ((p as { items?: Array<PatientHit> }).items ?? []) as Array<
				PatientHit & { fullName?: string }
			>;
			const sItems = ((s as { items?: Array<ServiceHit> }).items ??
				[]) as Array<ServiceHit>;
			const prItems = ((pr as { items?: Array<PractitionerHit> }).items ??
				[]) as Array<PractitionerHit>;
			const billRows = ((dues as { rows?: Array<BillHit> }).rows ??
				[]) as Array<BillHit>;
			const ql = q.toLowerCase();
			setPatients(
				items
					.filter((r) =>
						`${r.name ?? r.fullName ?? ""} ${r.phone ?? ""} ${r.id}`
							.toLowerCase()
							.includes(ql),
					)
					.slice(0, 8),
			);
			setServices(
				sItems
					.filter((r) => `${r.code} ${r.name}`.toLowerCase().includes(ql))
					.slice(0, 8),
			);
			setPractitioners(
				prItems
					.filter((r) =>
						`${r.name ?? ""} ${r.specialty ?? ""} ${r.id}`
							.toLowerCase()
							.includes(ql),
					)
					.slice(0, 8),
			);
			setBills(
				billRows
					.filter((r) =>
						`${r.no ?? ""} ${r.patientId ?? ""} ${r.id}`
							.toLowerCase()
							.includes(ql),
					)
					.slice(0, 8),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Search failed");
		} finally {
			setSearching(false);
		}
	}

	return (
		<div className="space-y-3">
			<form className="flex gap-2" onSubmit={onSearch}>
				<Input
					autoFocus={autoFocus}
					id={inputId}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search patients, practitioners, services, bills… (Ctrl+F)"
					ref={inputRef}
					value={query}
				/>
				<button
					className="shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
					disabled={searching}
					type="submit"
				>
					{searching ? "…" : "Search"}
				</button>
			</form>
			{error ? <p className="text-sm text-red-600">{error}</p> : null}
			{patients.length + services.length + practitioners.length + bills.length >
			0 ? (
				<>
					<div className="grid gap-3 text-sm sm:grid-cols-2">
						<div>
							<p className="mb-1 font-medium">Patients</p>
							<ul className="space-y-1">
								{patients.map((p) => (
									<li key={p.id}>
										<button
											className="text-left underline-offset-2 hover:underline"
											onClick={() =>
												void navigate({
													params: { uhid: p.id },
													to: "/patients/$uhid",
												})
											}
											type="button"
										>
											{p.name ?? p.id} · {p.phone ?? "no phone"}
										</button>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className="mb-1 font-medium">Services</p>
							<ul className="space-y-1">
								{services.map((s) => (
									<li key={s.id}>
										<button
											className="text-left underline-offset-2 hover:underline"
											onClick={() => void navigate({ to: "/reception/book" })}
											type="button"
										>
											{s.code} · {s.name}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="grid gap-3 text-sm sm:grid-cols-2">
						<div>
							<p className="mb-1 font-medium">Practitioners</p>
							<ul className="space-y-1">
								{practitioners.map((d) => (
									<li key={d.id}>
										<button
											className="text-left underline-offset-2 hover:underline"
											onClick={() =>
												void navigate({ to: "/admin/practitioners" })
											}
											type="button"
										>
											{d.name ?? d.id} · {d.specialty ?? "no specialty"}
										</button>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className="mb-1 font-medium">Bills</p>
							<ul className="space-y-1">
								{bills.map((b) => (
									<li key={b.id}>
										<button
											className="text-left underline-offset-2 hover:underline"
											onClick={() => void navigate({ to: "/billing/desk" })}
											type="button"
										>
											{b.no ?? b.id} · {b.patientId ?? "no patient"}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}
