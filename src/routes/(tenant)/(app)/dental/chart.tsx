import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/dental/chart")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

const UPPER_PERM = [
	"18",
	"17",
	"16",
	"15",
	"14",
	"13",
	"12",
	"11",
	"21",
	"22",
	"23",
	"24",
	"25",
	"26",
	"27",
	"28",
];
const LOWER_PERM = [
	"48",
	"47",
	"46",
	"45",
	"44",
	"43",
	"42",
	"41",
	"31",
	"32",
	"33",
	"34",
	"35",
	"36",
	"37",
	"38",
];
const UPPER_DEC = ["55", "54", "53", "52", "51", "61", "62", "63", "64", "65"];
const LOWER_DEC = ["85", "84", "83", "82", "81", "71", "72", "73", "74", "75"];

type DentalCondition =
	| "healthy"
	| "caries"
	| "fracture"
	| "missing"
	| "filling"
	| "crown"
	| "implant"
	| "root-canal"
	| "perio"
	| "abscess"
	| "other";

const CONDITIONS: Array<DentalCondition> = [
	"healthy",
	"caries",
	"fracture",
	"missing",
	"filling",
	"crown",
	"implant",
	"root-canal",
	"perio",
	"abscess",
	"other",
];

function ToothRow({
	marks,
	onToggle,
	teeth,
}: {
	marks: Record<string, string>;
	onToggle: (tooth: string) => void;
	teeth: Array<string>;
}) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{teeth.map((t) => {
				const marked = marks[t];
				return (
					<button
						className={`flex h-10 w-10 flex-col items-center justify-center rounded-md border text-xs font-medium transition-colors ${
							marked
								? "border-primary bg-primary/15 text-primary"
								: "border-border bg-background text-muted-foreground hover:border-primary/50"
						}`}
						key={t}
						onClick={() => onToggle(t)}
						title={marked ?? t}
						type="button"
					>
						{t}
						{marked && marked !== "healthy" ? (
							<span className="text-[9px] leading-none">●</span>
						) : null}
					</button>
				);
			})}
		</div>
	);
}

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [marks, setMarks] = useState<Record<string, string>>({});
	const [activeCondition, setActiveCondition] = useState("caries");
	const [procedure, setProcedure] = useState("");
	const [price, setPrice] = useState("");
	const [consentProc, setConsentProc] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const encId = useId();
	const patId = useId();
	const procId = useId();
	const priceId = useId();
	const consentProcId = useId();

	function toggleTooth(tooth: string) {
		setMarks((prev) => {
			const next = { ...prev };
			if (next[tooth] === activeCondition) {
				delete next[tooth];
			} else {
				next[tooth] = activeCondition;
			}
			return next;
		});
	}

	async function saveChart(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const entries = Object.entries(marks).map(([tooth, condition]) => ({
				condition: condition as DentalCondition,
				tooth,
			}));
			const res = await api.dental.chart({
				branchId: "main",
				encounterId,
				entries,
				patientId,
			});
			setStatus(
				`Chart saved (${res?.id ?? "ok"}) with ${entries.length} teeth.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Chart save failed.");
		}
	}

	async function savePlan(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const stages = Object.entries(marks)
				.filter(([, c]) => c !== "healthy")
				.map(([tooth, c]) => ({
					price: Number(price) || 0,
					procedure: procedure || c,
					stage: "Planned" as const,
					tooth,
				}));
			const res = await api.dental.buildPlan({
				branchId: "main",
				encounterId,
				patientId,
				stages,
				status: "Draft",
			});
			setStatus(`Treatment plan saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Plan save failed.");
		}
	}

	async function signConsent() {
		setStatus(null);
		try {
			const res = await api.dental.consent({
				branchId: "main",
				encounterId,
				patientId,
				procedureName: consentProc,
				status: "Signed",
			});
			setStatus(`Consent signed (${res?.id ?? "ok"}). Chair booking unlocked.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Consent failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="FDI charting (permanent + deciduous), treatment plans, consent-gated chair booking, and lab jobs."
					title="Dental Chart"
				/>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">Context</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3 sm:grid-cols-2">
						<div className="grid gap-1.5">
							<Label htmlFor={encId}>Encounter ID</Label>
							<Input
								id={encId}
								onChange={(e) => setEncounterId(e.target.value)}
								value={encounterId}
							/>
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor={patId}>Patient ID</Label>
							<Input
								id={patId}
								onChange={(e) => setPatientId(e.target.value)}
								value={patientId}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							FDI touch chart
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-1.5">
							<Label>Marking condition</Label>
							<Select
								onValueChange={(v) => setActiveCondition(v ?? "caries")}
								value={activeCondition}
							>
								<SelectTrigger className="max-w-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CONDITIONS.map((c) => (
										<SelectItem key={c} value={c}>
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<p className="text-xs font-medium text-muted-foreground">
								Permanent upper
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={UPPER_PERM}
							/>
							<p className="text-xs font-medium text-muted-foreground">
								Deciduous upper
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={UPPER_DEC}
							/>
							<p className="text-xs font-medium text-muted-foreground">
								Deciduous lower
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={LOWER_DEC}
							/>
							<p className="text-xs font-medium text-muted-foreground">
								Permanent lower
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={LOWER_PERM}
							/>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="secondary">
								{Object.keys(marks).length} marked
							</Badge>
							<Button onClick={saveChart} type="button">
								Save chart
							</Button>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Treatment plan from chart
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={savePlan}>
								<div className="grid gap-1.5">
									<Label htmlFor={procId}>Procedure label</Label>
									<Input
										id={procId}
										onChange={(e) => setProcedure(e.target.value)}
										placeholder="e.g. Composite restoration"
										value={procedure}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={priceId}>Price per stage</Label>
									<Input
										id={priceId}
										onChange={(e) => setPrice(e.target.value)}
										value={price}
									/>
								</div>
								<Button type="submit">Build plan (Draft)</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Consent (required before first sitting)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="grid gap-1.5">
								<Label htmlFor={consentProcId}>Procedure</Label>
								<Input
									id={consentProcId}
									onChange={(e) => setConsentProc(e.target.value)}
									value={consentProc}
								/>
							</div>
							<Button onClick={signConsent} type="button">
								Sign consent
							</Button>
						</CardContent>
					</Card>
				</div>

				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
			</div>
		</main>
	);
}
