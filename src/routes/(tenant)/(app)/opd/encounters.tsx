import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
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

export const Route = createFileRoute("/(tenant)/(app)/opd/encounters")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

const inputCls = "grid gap-1.5";
const rowCls = "grid gap-3 sm:grid-cols-2";

function Result({ text }: { text: string | null }) {
	if (!text) return null;
	return <p className="text-sm text-muted-foreground">{text}</p>;
}

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [visitType, setVisitType] = useState("new");
	const [triage, setTriage] = useState({
		priority: "routine",
		pulse: "",
		spo2: "",
	});
	const [soap, setSoap] = useState({
		assessment: "",
		code: "",
		objective: "",
		plan: "",
		subjective: "",
	});
	const [status, setStatus] = useState<string | null>(null);
	const encId = useId();
	const patId = useId();
	const spo2Id = useId();
	const pulseId = useId();
	const codeId = useId();

	async function submitTriage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.triageEntry({
				branchId: "main",
				encounterId: encounterId || undefined,
				patientId,
				priority: triage.priority as "routine" | "urgent" | "emergency",
				pulse: triage.pulse ? Number(triage.pulse) : undefined,
				spo2: triage.spo2 ? Number(triage.spo2) : undefined,
			});
			setStatus(`Triage recorded (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Triage failed.");
		}
	}

	async function submitSoap(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.saveSoap({
				assessment: soap.assessment,
				branchId: "main",
				diagnoses: [{ code: soap.code, label: soap.code, system: "ICD11" }],
				encounterId,
				objective: soap.objective,
				patientId,
				plan: soap.plan,
				subjective: soap.subjective,
			});
			setStatus(`SOAP note saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "SOAP save failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="OPD / daycare / tele encounters: triage, SOAP notes, and OPD register. IPD workflows are out of scope."
					title="OPD Encounters"
				/>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">Context</CardTitle>
					</CardHeader>
					<CardContent className={rowCls}>
						<div className={inputCls}>
							<Label htmlFor={encId}>Encounter ID</Label>
							<Input
								id={encId}
								onChange={(e) => setEncounterId(e.target.value)}
								placeholder="enc_…"
								value={encounterId}
							/>
						</div>
						<div className={inputCls}>
							<Label htmlFor={patId}>Patient ID</Label>
							<Input
								id={patId}
								onChange={(e) => setPatientId(e.target.value)}
								placeholder="pat_…"
								value={patientId}
							/>
						</div>
						<div className={inputCls}>
							<Label>Visit type</Label>
							<Select
								onValueChange={(v) => setVisitType(v ?? "new")}
								value={visitType}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="new">New</SelectItem>
									<SelectItem value="followup">Follow-up</SelectItem>
									<SelectItem value="casualty">Casualty</SelectItem>
									<SelectItem value="tele">Tele</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">Triage</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitTriage}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label htmlFor={spo2Id}>SpO₂ %</Label>
										<Input
											id={spo2Id}
											onChange={(e) =>
												setTriage({ ...triage, spo2: e.target.value })
											}
											value={triage.spo2}
										/>
									</div>
									<div className={inputCls}>
										<Label htmlFor={pulseId}>Pulse</Label>
										<Input
											id={pulseId}
											onChange={(e) =>
												setTriage({ ...triage, pulse: e.target.value })
											}
											value={triage.pulse}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Priority</Label>
									<Select
										onValueChange={(v) =>
											setTriage({ ...triage, priority: v ?? "routine" })
										}
										value={triage.priority}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="routine">Routine</SelectItem>
											<SelectItem value="urgent">Urgent</SelectItem>
											<SelectItem value="emergency">Emergency</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit">Record triage</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								SOAP note (all four required)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitSoap}>
								{(
									["subjective", "objective", "assessment", "plan"] as const
								).map((field) => (
									<div className={inputCls} key={field}>
										<Label className="capitalize" htmlFor={field}>
											{field}
										</Label>
										<Input
											id={field}
											onChange={(e) =>
												setSoap({ ...soap, [field]: e.target.value })
											}
											value={soap[field]}
										/>
									</div>
								))}
								<div className={inputCls}>
									<Label htmlFor={codeId}>Diagnosis code (ICD-11)</Label>
									<Input
										id={codeId}
										onChange={(e) => setSoap({ ...soap, code: e.target.value })}
										placeholder="e.g. CA07"
										value={soap.code}
									/>
								</div>
								<Button type="submit">Save SOAP note</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				<Result text={status} />
			</div>
		</main>
	);
}
