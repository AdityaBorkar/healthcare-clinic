import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";
import { INVOICE_MIN_CODES_NOTE } from "#/rpc/procedures/services";

export const Route = createFileRoute("/(tenant)/(app)/admin/services")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Service = {
	billingUomId?: string | null;
	code: string;
	department?: string | null;
	durationUomId?: string | null;
	durationValue?: number | null;
	id: string;
	name: string;
	pathy?: string | null;
	status: string;
};

type UomOption = {
	category: string;
	code: string;
	id: string;
	is_active: boolean;
	name: string;
	symbol: string | null;
};

type CptCode = {
	billingCode?: string;
	code: string;
	description?: string;
	price?: number;
};

/** Service catalogue: type-ahead search, dup-block, package/discount notes. */
function RouteComponent() {
	const [branchId] = useBranch();
	const [rows, setRows] = useState<Array<Service>>([]);
	const [query, setQuery] = useState("");
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [department, setDepartment] = useState("");
	const [pathy, setPathy] = useState("");
	const [durationMin, setDurationMin] = useState("");
	const [gstPct, setGstPct] = useState("");
	const [billingCode, setBillingCode] = useState("");
	const [uoms, setUoms] = useState<Array<UomOption>>([]);
	const [billingUomId, setBillingUomId] = useState("");
	const [durationUomId, setDurationUomId] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const [cptCodes, setCptCodes] = useState<Array<CptCode>>([]);
	const [cptQuery, setCptQuery] = useState("");
	const [cptCode, setCptCode] = useState("");
	const [cptDescription, setCptDescription] = useState("");

	const load = useCallback(async () => {
		try {
			const res = (await api.services.list({ branchId })) as {
				items: Array<Service>;
			};
			setRows(res.items);
			const cpt = (await api.admin.cptCodes.list({
				branchId,
			})) as Array<CptCode>;
			setCptCodes(cpt);
			const uomList = (await api.uom.list({
				filters: { isActive: true },
				limit: 200,
			})) as Array<UomOption>;
			setUoms(uomList);
		} catch (err) {
			setError(err instanceof Error ? err.message : "List failed");
		}
	}, [branchId]);

	useEffect(() => {
		void load();
	}, [load]);

	const q = query.trim().toLowerCase();
	const visible = q
		? rows.filter((r) =>
				`${r.code} ${r.name} ${r.department ?? ""} ${r.pathy ?? ""}`
					.toLowerCase()
					.includes(q),
			)
		: rows;

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		try {
			// Dup-block (P1): refuse when the code already exists in-branch.
			const existing = (await api.services.list({ branchId })) as {
				items: Array<Service>;
			};
			if (
				existing.items.some(
					(s) => s.code.trim().toLowerCase() === code.trim().toLowerCase(),
				)
			) {
				setError(`Service code "${code}" already exists in this branch.`);
				return;
			}
			const duration = durationMin ? Number(durationMin) : undefined;
			const billingUom = uoms.find((u) => u.id === billingUomId);
			const durationUom = uoms.find((u) => u.id === durationUomId);
			await api.services.create({
				branchId,
				...(billingUom
					? {
							billingUomCategory: billingUom.category as "count" | "session",
							billingUomId: billingUom.id,
						}
					: {}),
				code,
				department: department || undefined,
				...(duration && duration > 0
					? {
							durationUomCategory: "time" as const,
							durationValue: duration,
						}
					: {}),
				...(durationUom
					? {
							durationUomCategory: "time" as const,
							durationUomId: durationUom.id,
						}
					: {}),
				name,
				pathy: pathy || undefined,
			});
			setCode("");
			setName("");
			setDepartment("");
			setPathy("");
			setDurationMin("");
			setGstPct("");
			setBillingCode("");
			setBillingUomId("");
			setDurationUomId("");
			await load();
			setNotice("Service created.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Creation failed");
		}
	}

	async function publish(id: string) {
		setError(null);
		try {
			await api.services.publish({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Publish failed");
		}
	}

	async function retire(id: string) {
		setError(null);
		try {
			await api.services.retire({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Retire failed");
		}
	}

	async function saveCpt(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		try {
			await api.admin.cptCodes.upsert({
				billingCode: cptCode,
				branchId,
				code: cptCode,
				description: cptDescription,
			});
			setCptCode("");
			setCptDescription("");
			await load();
			setNotice("CPT code saved.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "CPT save failed");
		}
	}

	const cptQ = cptQuery.trim().toLowerCase();
	const visibleCpt = cptQ
		? cptCodes.filter((c) =>
				`${c.code} ${c.description ?? ""}`.toLowerCase().includes(cptQ),
			)
		: cptCodes;

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button
								onClick={() =>
									exportRowsCsv("services.csv", rows, [
										"code",
										"name",
										"status",
									])
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description="Service catalogue with immutable codes."
					title="Services"
				/>
				<BranchSelector />
				<Card>
					<CardContent className="space-y-3 pt-6">
						<Input
							aria-label="Type-ahead search"
							className="max-w-64"
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Type-ahead search…"
							value={query}
						/>
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-40"
								onChange={(e) => setCode(e.target.value)}
								placeholder="Code"
								required
								value={code}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setName(e.target.value)}
								placeholder="Service name"
								required
								value={name}
							/>
							<Input
								className="max-w-40"
								onChange={(e) => setDepartment(e.target.value)}
								placeholder="Department"
								value={department}
							/>
							<Input
								className="max-w-40"
								onChange={(e) => setPathy(e.target.value)}
								placeholder="Pathy"
								value={pathy}
							/>
							<Input
								className="max-w-32"
								min={1}
								onChange={(e) => setDurationMin(e.target.value)}
								placeholder="Min"
								type="number"
								value={durationMin}
							/>
							<Input
								className="max-w-32"
								min={0}
								onChange={(e) => setGstPct(e.target.value)}
								placeholder="GST %"
								type="number"
								value={gstPct}
							/>
							<Input
								className="max-w-40"
								onChange={(e) => setBillingCode(e.target.value)}
								placeholder="Billing code"
								value={billingCode}
							/>
							<select
								aria-label="Billing UOM"
								className="max-w-40 rounded-md border px-2 py-1 text-sm"
								onChange={(e) => setBillingUomId(e.target.value)}
								value={billingUomId}
							>
								<option value="">Billing UOM…</option>
								{uoms
									.filter(
										(u) => u.category === "count" || u.category === "session",
									)
									.map((u) => (
										<option key={u.id} value={u.id}>
											{u.code} ({u.category})
										</option>
									))}
							</select>
							<select
								aria-label="Duration UOM"
								className="max-w-40 rounded-md border px-2 py-1 text-sm"
								onChange={(e) => setDurationUomId(e.target.value)}
								value={durationUomId}
							>
								<option value="">Duration UOM…</option>
								{uoms
									.filter((u) => u.category === "time")
									.map((u) => (
										<option key={u.id} value={u.id}>
											{u.code}
										</option>
									))}
							</select>
							<Button type="submit">Add service</Button>
						</form>
						<p className="text-xs text-muted-foreground">
							Discounts carry a max-% + approver note; packages carry
							sessions/validity/scope. {INVOICE_MIN_CODES_NOTE}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						{notice ? <p className="text-sm">{notice}</p> : null}
						<ul className="divide-y text-sm">
							{visible.map((r) => (
								<li
									className="flex flex-wrap items-center justify-between gap-2 py-2"
									key={r.id}
								>
									<span>
										{r.code} · {r.name} · {r.status}
										{r.department ? ` · ${r.department}` : ""}
										{r.pathy ? ` · ${r.pathy}` : ""}
										{r.durationValue ? ` · ${r.durationValue}` : ""}
									</span>
									<span className="flex gap-2">
										<Button
											onClick={() => publish(r.id)}
											size="sm"
											variant="outline"
										>
											Publish
										</Button>
										<Button
											onClick={() => retire(r.id)}
											size="sm"
											variant="outline"
										>
											Retire
										</Button>
									</span>
								</li>
							))}
							{visible.length === 0 ? (
								<li className="py-4 text-muted-foreground">None yet.</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-3 pt-6">
						<p className="text-sm font-medium">
							CPT + billing-code master ({visibleCpt.length})
						</p>
						<Input
							aria-label="Search CPT codes"
							className="max-w-64"
							onChange={(e) => setCptQuery(e.target.value)}
							placeholder="Search CPT…"
							value={cptQuery}
						/>
						<form className="flex flex-wrap gap-2" onSubmit={saveCpt}>
							<Input
								className="max-w-40"
								onChange={(e) => setCptCode(e.target.value)}
								placeholder="CPT code"
								required
								value={cptCode}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setCptDescription(e.target.value)}
								placeholder="Description"
								required
								value={cptDescription}
							/>
							<Button type="submit" variant="outline">
								Save CPT code
							</Button>
						</form>
						<ul className="divide-y text-sm">
							{visibleCpt.map((c) => (
								<li className="py-2" key={c.code}>
									{c.code} · {c.description ?? "—"}
									{c.price !== undefined ? ` · ₹${c.price}` : ""}
								</li>
							))}
							{visibleCpt.length === 0 ? (
								<li className="py-4 text-muted-foreground">No CPT codes.</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
