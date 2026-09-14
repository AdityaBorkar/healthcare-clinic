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

export const Route = createFileRoute("/(tenant)/(app)/nursing/forms")({
	component: RouteComponent,
});

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [temp, setTemp] = useState("");
	const [pulse, setPulse] = useState("");
	const [spo2, setSpo2] = useState("");
	const [intake, setIntake] = useState("");
	const [output, setOutput] = useState("");
	const [pain, setPain] = useState("");
	const [painPhase, setPainPhase] = useState("pre");
	const [riskKind, setRiskKind] = useState("Morse");
	const [riskScore, setRiskScore] = useState("");
	const [drug, setDrug] = useState("");
	const [dose, setDose] = useState("");
	const [route, setRoute] = useState("");
	const [batch, setBatch] = useState("");
	const [allergies, setAllergies] = useState("");
	const [outcome, setOutcome] = useState("Given");
	const [witness, setWitness] = useState("");
	const [consentId, setConsentId] = useState("");
	const [sittingPhase, setSittingPhase] = useState("pre");
	const [checklistName, setChecklistName] = useState("");
	const [checklistKind, setChecklistKind] = useState("general");
	const [checklistItems, setChecklistItems] = useState("");
	const [triageTag, setTriageTag] = useState("green");
	const [triageReason, setTriageReason] = useState("");
	const [fromShift, setFromShift] = useState("morning");
	const [toShift, setToShift] = useState("evening");
	const [handoverNotes, setHandoverNotes] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const patId = useId();

	async function vitals(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.nursing.vitalsChart({
				branchId: "main",
				patientId,
				pulse: pulse ? Number(pulse) : undefined,
				spo2: spo2 ? Number(spo2) : undefined,
				temp: temp ? Number(temp) : undefined,
			});
			const detail = res as { ews?: number; repeatPrompt?: string | null };
			setStatus(
				`Vitals charted (EWS ${detail?.ews ?? "?"}). ${detail?.repeatPrompt ?? ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Vitals failed.");
		}
	}

	async function io(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.nursing.ioChart({
				branchId: "main",
				intakeMl: intake ? Number(intake) : undefined,
				outputMl: output ? Number(output) : undefined,
				patientId,
			});
			const detail = res as { balance?: number; dayBalance?: number };
			setStatus(
				`I/O charted. Entry balance ${detail?.balance ?? "?"}, day balance ${detail?.dayBalance ?? "?"} ml.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "I/O failed.");
		}
	}

	async function painScore(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.nursing.painScore({
				branchId: "main",
				patientId,
				phase: painPhase as "pre" | "post",
				score: Number(pain),
			});
			const detail = res as { reassessmentPrompt?: string | null };
			setStatus(`Pain recorded. ${detail?.reassessmentPrompt ?? ""}`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Pain failed.");
		}
	}

	async function risk(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.nursing.riskScreen({
				branchId: "main",
				kind: riskKind as "Morse",
				patientId,
				score: Number(riskScore),
				screenedBy: "nurse",
			});
			setStatus(`${riskKind} screen recorded with precaution orders.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Risk screen failed.");
		}
	}

	async function administer(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.nursing.drugAdminister({
				allergies: allergies
					? allergies
							.split(",")
							.map((a) => a.trim())
							.filter(Boolean)
					: undefined,
				batchId: batch || undefined,
				branchId: "main",
				dose,
				drug,
				outcome: outcome as "Given",
				patientId,
				route: route || undefined,
				witness: witness || undefined,
			});
			setStatus(
				`Drug administration recorded (${(res as { outcome?: string })?.outcome ?? "ok"}).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Administration failed.");
		}
	}

	async function sitting(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.nursing.sittingsSupport({
				branchId: "main",
				consentId,
				patientId,
				phase: sittingPhase as "pre" | "post",
			});
			setStatus("Daycare sitting support recorded.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Sitting failed.");
		}
	}

	async function checklist(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const items = checklistItems
				.split(",")
				.map((label) => label.trim())
				.filter(Boolean)
				.map((label) => ({ done: "yes" as const, label }));
			const res = await orpc.nursing.checklistRecord({
				branchId: "main",
				items,
				kind: checklistKind as "general",
				name: checklistName,
				patientId: patientId || undefined,
			});
			const detail = res as { printBlocked?: boolean };
			setStatus(
				`Checklist filed. Print ${detail?.printBlocked === false ? "released" : "blocked"}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Checklist failed.");
		}
	}

	async function triage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.nursing.triageTag({
				branchId: "main",
				patientId,
				reason: triageReason,
				tag: triageTag as "green",
			});
			setStatus(
				triageTag === "red"
					? "Red triage: escalated to doctor immediately."
					: "Triage tag recorded.",
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Triage failed.");
		}
	}

	async function handover(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.nursing.handoverCompile({
				branchId: "main",
				fromShift: fromShift as "morning",
				notes: handoverNotes,
				status: "draft",
				toShift: toShift as "morning",
			});
			const detail = res as { unsignedFlag?: boolean; openTasks?: number };
			setStatus(
				`Handover compiled (${detail?.openTasks ?? 0} open tasks).${detail?.unsignedFlag ? " Unsigned handovers pending sign-off." : ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Handover failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Bedside documentation: vitals, I/O, pain, scales, drug chart, sittings, checklists, triage, handover."
					title="Nursing forms"
				/>
				<Card className="shadow-xs">
					<CardContent className="grid gap-1.5 py-6">
						<Label htmlFor={patId}>Patient ID</Label>
						<Input
							id={patId}
							onChange={(e) => setPatientId(e.target.value)}
							value={patientId}
						/>
					</CardContent>
				</Card>
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">Vitals</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={vitals}>
								<div className="grid gap-1.5">
									<Label>Temp °C</Label>
									<Input
										onChange={(e) => setTemp(e.target.value)}
										value={temp}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Pulse</Label>
									<Input
										onChange={(e) => setPulse(e.target.value)}
										value={pulse}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>SpO2</Label>
									<Input
										onChange={(e) => setSpo2(e.target.value)}
										value={spo2}
									/>
								</div>
								<Button type="submit">Chart vitals</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								I/O chart
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={io}>
								<div className="grid gap-1.5">
									<Label>Intake (ml)</Label>
									<Input
										onChange={(e) => setIntake(e.target.value)}
										value={intake}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Output (ml)</Label>
									<Input
										onChange={(e) => setOutput(e.target.value)}
										value={output}
									/>
								</div>
								<Button type="submit">Chart I/O</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Pain score
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={painScore}>
								<div className="grid gap-1.5">
									<Label>Score (0–10)</Label>
									<Input
										onChange={(e) => setPain(e.target.value)}
										value={pain}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Phase</Label>
									<Select
										onValueChange={(v) => setPainPhase(v ?? "pre")}
										value={painPhase}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pre">Pre</SelectItem>
											<SelectItem value="post">Post</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit">Record pain</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Risk screen (Morse / Braden / MNA)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={risk}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Kind</Label>
										<Select
											onValueChange={(v) => setRiskKind(v ?? "Morse")}
											value={riskKind}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["Morse", "Braden", "MNA"].map((k) => (
													<SelectItem key={k} value={k}>
														{k}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-1.5">
										<Label>Score</Label>
										<Input
											onChange={(e) => setRiskScore(e.target.value)}
											value={riskScore}
										/>
									</div>
								</div>
								<Button type="submit">Record screen</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Drug administration (allergy + batch scoped)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={administer}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Drug</Label>
										<Input
											onChange={(e) => setDrug(e.target.value)}
											value={drug}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Dose</Label>
										<Input
											onChange={(e) => setDose(e.target.value)}
											value={dose}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Route</Label>
										<Input
											onChange={(e) => setRoute(e.target.value)}
											placeholder="PO / IV / IM"
											value={route}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Batch (Given injectables)</Label>
										<Input
											onChange={(e) => setBatch(e.target.value)}
											value={batch}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Allergies (comma separated)</Label>
										<Input
											onChange={(e) => setAllergies(e.target.value)}
											value={allergies}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Outcome</Label>
										<Select
											onValueChange={(v) => setOutcome(v ?? "Given")}
											value={outcome}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["Given", "Held", "Refused", "Missed"].map((o) => (
													<SelectItem key={o} value={o}>
														{o}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Witness (Given/Missed)</Label>
									<Input
										onChange={(e) => setWitness(e.target.value)}
										value={witness}
									/>
								</div>
								<Button type="submit">Record administration</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Daycare sitting support
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={sitting}>
								<div className="grid gap-1.5">
									<Label>Consent ID</Label>
									<Input
										onChange={(e) => setConsentId(e.target.value)}
										value={consentId}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Phase</Label>
									<Select
										onValueChange={(v) => setSittingPhase(v ?? "pre")}
										value={sittingPhase}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pre">Pre</SelectItem>
											<SelectItem value="post">Post</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit">Record sitting</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Transfer / discharge checklist
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={checklist}>
								<div className="grid gap-1.5">
									<Label>Name</Label>
									<Input
										onChange={(e) => setChecklistName(e.target.value)}
										value={checklistName}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Kind</Label>
									<Select
										onValueChange={(v) => setChecklistKind(v ?? "general")}
										value={checklistKind}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["general", "transfer", "discharge"].map((k) => (
												<SelectItem key={k} value={k}>
													{k}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Items (comma separated, all ticked)</Label>
									<Input
										onChange={(e) => setChecklistItems(e.target.value)}
										value={checklistItems}
									/>
								</div>
								<Button type="submit">File checklist</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">Triage</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={triage}>
								<div className="grid gap-1.5">
									<Label>Tag</Label>
									<Select
										onValueChange={(v) => setTriageTag(v ?? "green")}
										value={triageTag}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["green", "yellow", "red"].map((t) => (
												<SelectItem key={t} value={t}>
													{t}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Reason</Label>
									<Input
										onChange={(e) => setTriageReason(e.target.value)}
										value={triageReason}
									/>
								</div>
								<Button type="submit">Tag triage</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Shift handover (auto-compiled, requires sign)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3" onSubmit={handover}>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="grid gap-1.5">
									<Label>From shift</Label>
									<Select
										onValueChange={(v) => setFromShift(v ?? "morning")}
										value={fromShift}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["morning", "evening", "night"].map((s) => (
												<SelectItem key={s} value={s}>
													{s}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>To shift</Label>
									<Select
										onValueChange={(v) => setToShift(v ?? "evening")}
										value={toShift}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["morning", "evening", "night"].map((s) => (
												<SelectItem key={s} value={s}>
													{s}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Notes</Label>
									<Input
										onChange={(e) => setHandoverNotes(e.target.value)}
										value={handoverNotes}
									/>
								</div>
							</div>
							<Button type="submit">Compile handover</Button>
						</form>
					</CardContent>
				</Card>
				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
			</div>
		</main>
	);
}
