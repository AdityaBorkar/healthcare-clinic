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

export const Route = createFileRoute("/(tenant)/(app)/admin/pricelists")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Pricelist = {
	code: string;
	currency: string;
	id: string;
	isDefault: boolean;
	name: string;
	payer: string | null;
	scope: string;
	status: string;
	taxInclusive: boolean;
	version: number;
};

type PreviewLine = {
	amount: number;
	currentAmount: number | null;
	serviceCode: string;
	serviceId: string;
	serviceName: string;
};

/** Pricelist master: several rate cards plus one seeded Default fallback. */
function RouteComponent() {
	const [branchId] = useBranch();
	const [rows, setRows] = useState<Array<Pricelist>>([]);
	const [query, setQuery] = useState("");
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [payer, setPayer] = useState("");
	const [resolveService, setResolveService] = useState("");
	const [resolvePayer, setResolvePayer] = useState("");
	const [resolveOut, setResolveOut] = useState<string | null>(null);
	const [uplift, setUplift] = useState("5");
	const [upliftTarget, setUpliftTarget] = useState("");
	const [preview, setPreview] = useState<Array<PreviewLine>>([]);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const res = (await api.pricelists.list({
				branchId,
				...(query.trim() ? { search: query.trim() } : {}),
			})) as { items: Array<Pricelist> };
			setRows(res.items);
		} catch (err) {
			setError(err instanceof Error ? err.message : "List failed");
		}
	}, [branchId, query]);

	useEffect(() => {
		void load();
	}, [load]);

	async function onEnsureDefault() {
		setError(null);
		setNotice(null);
		try {
			const res = (await api.pricelists.ensureDefault({ branchId })) as {
				created: boolean;
			};
			setNotice(
				res.created ? "Default pricelist seeded." : "Default already live.",
			);
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ensure-default failed");
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		try {
			await api.pricelists.create({
				branchId,
				code,
				name,
				...(payer ? { payer } : {}),
			});
			setCode("");
			setName("");
			setPayer("");
			await load();
			setNotice("Pricelist created as draft — publish it to price with it.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Creation failed");
		}
	}

	async function publish(id: string) {
		setError(null);
		try {
			await api.pricelists.publish({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Publish failed");
		}
	}

	async function retire(id: string) {
		setError(null);
		try {
			await api.pricelists.retire({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Retire failed");
		}
	}

	async function onResolve(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setResolveOut(null);
		try {
			const res = (await api.services.prices.resolve({
				branchId,
				...(resolvePayer ? { payer: resolvePayer } : {}),
				serviceId: resolveService,
			})) as { amount: number; fallback: boolean; pricelistCode: string };
			setResolveOut(
				`₹${res.amount} via ${res.pricelistCode}${res.fallback ? " (Default fallback)" : ""}`,
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Resolution failed");
		}
	}

	async function onPreview(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			const res = (await api.pricelists.previewBulkRevision({
				branchId,
				pricelistId: upliftTarget,
				upliftPct: Number(uplift),
			})) as { lines: Array<PreviewLine> };
			setPreview(res.lines);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Preview failed");
		}
	}

	async function onApply() {
		setError(null);
		setNotice(null);
		try {
			const res = (await api.pricelists.applyBulkRevision({
				approvedBy: "approver",
				branchId,
				effectiveFrom: new Date(Date.now() + 86_400_000)
					.toISOString()
					.slice(0, 10),
				pricelistId: upliftTarget,
				requestedBy: "desk",
				upliftPct: Number(uplift),
			})) as { lines: number };
			setNotice(
				`Applied ${res.lines} revised prices (maker-checker recorded).`,
			);
			setPreview([]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Apply failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={onEnsureDefault} variant="outline">
								Ensure Default
							</Button>
							<Button
								onClick={() =>
									exportRowsCsv("pricelists.csv", rows, [
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
					description="Several rate cards per branch; Default always resolves as fallback. Versions never rewrite history."
					title="Pricelists"
				/>
				<BranchSelector />
				<Card>
					<CardContent className="space-y-3 pt-6">
						<Input
							aria-label="Type-ahead search"
							className="max-w-64"
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search code or name…"
							value={query}
						/>
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-40"
								onChange={(e) => setCode(e.target.value)}
								placeholder="Code (e.g. CGHS)"
								required
								value={code}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setName(e.target.value)}
								placeholder="Pricelist name"
								required
								value={name}
							/>
							<Input
								className="max-w-40"
								onChange={(e) => setPayer(e.target.value)}
								placeholder="Payer (optional)"
								value={payer}
							/>
							<Button type="submit">Add pricelist</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						{notice ? <p className="text-sm">{notice}</p> : null}
						<ul className="divide-y text-sm">
							{rows.map((r) => (
								<li
									className="flex flex-wrap items-center justify-between gap-2 py-2"
									key={r.id}
								>
									<span>
										{r.code} · {r.name} · v{r.version} · {r.status}
										{r.payer ? ` · payer ${r.payer}` : ""} · {r.currency}
										{r.taxInclusive ? " · tax-incl" : " · tax-excl"}
										{r.isDefault ? " · DEFAULT" : ""}
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
							{rows.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									None yet — ensure the Default first.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-3 pt-6">
						<p className="text-sm font-medium">Price resolution tester</p>
						<form className="flex flex-wrap gap-2" onSubmit={onResolve}>
							<Input
								className="max-w-64"
								onChange={(e) => setResolveService(e.target.value)}
								placeholder="Service id"
								required
								value={resolveService}
							/>
							<Input
								className="max-w-40"
								onChange={(e) => setResolvePayer(e.target.value)}
								placeholder="Payer (optional)"
								value={resolvePayer}
							/>
							<Button type="submit" variant="outline">
								Resolve
							</Button>
						</form>
						{resolveOut ? <p className="text-sm">{resolveOut}</p> : null}
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-3 pt-6">
						<p className="text-sm font-medium">
							Bulk revision (uplift %, maker-checker)
						</p>
						<form className="flex flex-wrap gap-2" onSubmit={onPreview}>
							<Input
								className="max-w-64"
								onChange={(e) => setUpliftTarget(e.target.value)}
								placeholder="Pricelist id"
								required
								value={upliftTarget}
							/>
							<Input
								className="max-w-28"
								onChange={(e) => setUplift(e.target.value)}
								placeholder="Uplift %"
								required
								type="number"
								value={uplift}
							/>
							<Button type="submit" variant="outline">
								Preview
							</Button>
							{preview.length > 0 ? (
								<Button onClick={onApply} type="button">
									Apply {preview.length} lines
								</Button>
							) : null}
						</form>
						<ul className="divide-y text-sm">
							{preview.map((l) => (
								<li className="py-2" key={l.serviceId}>
									{l.serviceCode} · {l.serviceName}: {l.currentAmount ?? "—"} →
									₹{l.amount}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
