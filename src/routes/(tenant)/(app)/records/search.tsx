import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/records/search")({
	component: RouteComponent,
});

function RouteComponent() {
	const [q, setQ] = useState("");
	const [results, setResults] = useState<
		{ id: string; kind: string; text: string }[]
	>([]);
	const [encounterId, setEncounterId] = useState("");
	const [encounter, setEncounter] = useState<{
		diagnoses: { code: string; label: string }[];
		orders: { item: string; kind: string; status: string }[];
		prescriptions: { id: string; itemCount: number }[];
		soap: { assessment: string; plan: string }[];
		vitals: { bp: string | null }[];
	} | null>(null);
	const [patientId, setPatientId] = useState("");
	const [rx, setRx] = useState<{ item: unknown; lastUsedAt: string }[]>([]);
	const [consentKind, setConsentKind] = useState("");
	const [mergePrimary, setMergePrimary] = useState("");
	const [mergeDuplicate, setMergeDuplicate] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const qId = useId();

	async function search(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.records.search({ branchId: "main", q });
			setResults(res);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Search failed.");
		}
	}

	async function loadEncounter() {
		setStatus(null);
		try {
			const res = await orpc.records.encounters.get({
				branchId: "main",
				encounterId,
			});
			setEncounter(res as typeof encounter);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Encounter load failed.");
		}
	}

	async function loadRx() {
		setStatus(null);
		try {
			const res = await orpc.records.prescriptions.recentlyUsed({
				branchId: "main",
				patientId,
			});
			setRx((res as { items?: typeof rx }).items ?? []);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Rx load failed.");
		}
	}

	async function recordConsent(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.records.consents.record({
				branchId: "main",
				kind: consentKind,
				patientId,
			});
			setStatus("Consent archived against the record.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Consent failed.");
		}
	}

	async function merge(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.records.merge({
				branchId: "main",
				duplicateId: mergeDuplicate,
				mergedBy: "mro",
				primaryId: mergePrimary,
			});
			setStatus(
				`Merged ${(res as { duplicateId?: string }).duplicateId ?? ""} into ${(res as { primaryId?: string }).primaryId ?? ""}; both histories preserved.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Merge failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Global search, encounter detail with vitals/SOAP/dx/Rx/orders, recently-used Rx, consent archive, and duplicate merge."
					title="Records search"
				/>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Global search
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={search}>
								<div className="grid gap-1.5">
									<Label htmlFor={qId}>
										Patient / phone / ABHA / diagnosis
									</Label>
									<Input
										id={qId}
										onChange={(e) => setQ(e.target.value)}
										value={q}
									/>
								</div>
								<Button type="submit">Search</Button>
							</form>
							<ul className="mt-3 divide-y text-sm">
								{results.map((r) => (
									<li className="py-2" key={r.id}>
										{r.id} · {r.kind} · {r.text}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Encounter detail
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="flex gap-3">
								<div className="grid flex-1 gap-1.5">
									<Label>Encounter ID</Label>
									<Input
										onChange={(e) => setEncounterId(e.target.value)}
										value={encounterId}
									/>
								</div>
								<Button
									className="self-end"
									onClick={() => void loadEncounter()}
									type="button"
								>
									Load
								</Button>
							</div>
							{encounter ? (
								<div className="grid gap-2 text-sm">
									<p>Vitals entries: {encounter.vitals.length}</p>
									<p>SOAP notes: {encounter.soap.length}</p>
									<p>
										Diagnoses:{" "}
										{encounter.diagnoses.map((d) => d.label).join(", ") || "—"}
									</p>
									<p>Prescriptions: {encounter.prescriptions.length}</p>
									<p>
										Orders:{" "}
										{encounter.orders
											.map((o) => `${o.kind}:${o.item}`)
											.join(", ") || "—"}
									</p>
								</div>
							) : null}
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Recently-used Rx
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="grid gap-1.5">
								<Label>Patient ID</Label>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<Button onClick={() => void loadRx()} type="button">
								Load Rx history
							</Button>
							<ul className="divide-y text-sm">
								{rx.map((item) => (
									<li
										className="py-2"
										key={`${item.lastUsedAt}-${JSON.stringify(item.item)}`}
									>
										{JSON.stringify(item.item)} · {item.lastUsedAt}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Archive consent
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={recordConsent}>
								<div className="grid gap-1.5">
									<Label>Consent kind</Label>
									<Input
										onChange={(e) => setConsentKind(e.target.value)}
										placeholder="procedure / tele / data-share"
										value={consentKind}
									/>
								</div>
								<Button type="submit">Record consent</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Merge duplicates
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={merge}>
								<div className="grid gap-1.5">
									<Label>Primary ID</Label>
									<Input
										onChange={(e) => setMergePrimary(e.target.value)}
										value={mergePrimary}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Duplicate ID</Label>
									<Input
										onChange={(e) => setMergeDuplicate(e.target.value)}
										value={mergeDuplicate}
									/>
								</div>
								<Button type="submit">Merge (history preserved)</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="text-base font-semibold">Privacy</CardTitle>
						<p className="text-sm text-muted-foreground">
							Every timeline and encounter view on this page is audit-logged
							(who and when) — see Settings → Audit log.
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
