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

const QUEUE_NOTE: Record<string, string> = {
	emergency: "Red lane — casualty bed first, queue jumps routine tokens.",
	routine: "Routine lane — token order preserved.",
	urgent: "Urgent lane — ahead of routine tokens, behind emergency.",
};

type AllergyEntry = {
	name: string;
	reaction?: string | null;
	severity: string;
};
type ProblemRow = {
	code: string;
	id: string;
	label: string | null;
	status: string | null;
	system: string | null;
};
type WarningRow = { drug: string; kind: string; message: string };
type RxItem = { days: string; dose: string; drug: string; frequency: string };

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
	const [allergy, setAllergy] = useState({
		name: "",
		reaction: "",
		severity: "moderate",
	});
	const [banner, setBanner] = useState<Array<AllergyEntry>>([]);
	const [checkDrugs, setCheckDrugs] = useState("");
	const [warnings, setWarnings] = useState<Array<WarningRow>>([]);
	const [acked, setAcked] = useState<Array<string>>([]);
	const [blocked, setBlocked] = useState(false);
	const [problem, setProblem] = useState({
		code: "",
		label: "",
		status: "active",
		system: "ICD11",
	});
	const [problems, setProblems] = useState<Array<ProblemRow>>([]);
	const [diagnosis, setDiagnosis] = useState({
		code: "",
		kind: "provisional",
		label: "",
	});
	const [rxItems, setRxItems] = useState<Array<RxItem>>([
		{ days: "", dose: "", drug: "", frequency: "" },
	]);
	const [prescriptionId, setPrescriptionId] = useState("");
	const [vitals, setVitals] = useState({
		bp: "",
		pulse: "",
		spo2: "",
		tempC: "",
		weightKg: "",
	});
	const [exam, setExam] = useState({
		finding: "",
		severity: "moderate",
		system: "general",
	});
	const [immun, setImmun] = useState({
		doseNo: "1",
		status: "Given",
		vaccine: "",
	});
	const [chronic, setChronic] = useState({
		bpDys: "",
		bpSys: "",
		condition: "diabetes",
		fundalHeightCm: "",
		hba1c: "",
		parameter: "",
		unit: "",
		value: "",
	});
	const [order, setOrder] = useState({
		item: "",
		kind: "lab",
		note: "",
		receivingUnit: "",
	});
	const [register, setRegister] = useState({
		certifierId: "",
		details: "",
		occurredAt: "",
		register: "mlc",
	});
	const [followUp, setFollowUp] = useState({ at: "", note: "" });
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
			const res = await api.allopathy.triage.create({
				branchId: "main",
				encounterId: encounterId || undefined,
				patientId,
				priority: triage.priority as "routine" | "urgent" | "emergency",
				pulse: triage.pulse ? Number(triage.pulse) : undefined,
				spo2: triage.spo2 ? Number(triage.spo2) : undefined,
			});
			setStatus(
				`Triage recorded (${res?.id ?? "ok"}). ${QUEUE_NOTE[triage.priority] ?? ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Triage failed.");
		}
	}

	async function submitSoap(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.soap.save({
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

	async function submitAllergy(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.patients.allergies.add({
				branchId: "main",
				name: allergy.name,
				patientId,
				reaction: allergy.reaction || undefined,
				severity: allergy.severity as "mild" | "moderate" | "severe",
			});
			const entry: AllergyEntry = {
				name: res?.name ?? allergy.name,
				reaction: res?.reaction ?? allergy.reaction ?? null,
				severity: res?.severity ?? allergy.severity,
			};
			setBanner((prev) => [...prev, entry]);
			setStatus(`Allergy recorded (${res?.id ?? "ok"}) — banner updated.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Allergy save failed.");
		}
	}

	async function runInteractionCheck() {
		setStatus(null);
		try {
			const drugs = checkDrugs
				.split(",")
				.map((d) => d.trim())
				.filter(Boolean);
			const res = await api.allopathy.interactions.check({
				acknowledged: acked,
				allergies: banner.map((a) => a.name),
				branchId: "main",
				drugs,
				encounterId: encounterId || undefined,
				patientId,
			});
			setWarnings(res.warnings as Array<WarningRow>);
			setBlocked(res.blocked ?? false);
			setStatus(
				res?.blocked
					? `Blocked: ${(res.unacknowledged as Array<WarningRow>).length} warning(s) need acknowledgement.`
					: "No unacknowledged interactions.",
			);
		} catch (err) {
			setStatus(
				err instanceof Error ? err.message : "Interaction check failed.",
			);
		}
	}

	function ackWarning(w: WarningRow) {
		setAcked((prev) => [...prev, `${w.drug}:${w.message}`, w.message]);
	}

	async function submitProblem(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.problems.upsert({
				branchId: "main",
				code: problem.code,
				encounterId: encounterId || undefined,
				label: problem.label || undefined,
				patientId,
				status: problem.status as "active" | "resolved",
				system: problem.system as "ICD11" | "TM2" | "NAMASTE",
			});
			setStatus(`Problem list updated (${res?.id ?? "ok"}).`);
			await refreshProblems();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Problem save failed.");
		}
	}

	async function refreshProblems() {
		try {
			const rows = (await api.allopathy.problems.list({
				branchId: "main",
				patientId,
			})) as Array<ProblemRow>;
			setProblems(rows);
		} catch {
			setProblems([]);
		}
	}

	async function resolveProblem(id: string) {
		setStatus(null);
		try {
			await api.allopathy.problems.upsert({
				branchId: "main",
				code: "resolved",
				patientId,
				problemId: id,
				status: "resolved",
				system: "ICD11",
			});
			setStatus("Problem marked resolved.");
			await refreshProblems();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Resolve failed.");
		}
	}

	async function submitDiagnosis(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.encounters.diagnoses.add({
				code: diagnosis.code,
				encounterId,
				kind: diagnosis.kind as "provisional" | "confirmed",
				label: diagnosis.label || diagnosis.code,
				patientId,
			});
			setStatus(
				`Diagnosis recorded (${res?.id ?? "ok"}). Prescribing unlocked.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Diagnosis save failed.");
		}
	}

	async function submitPrescription(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.encounters.prescriptions.create({
				acknowledgedWarnings: acked.length > 0 ? acked : undefined,
				encounterId,
				items: rxItems
					.filter((i) => i.drug.trim().length > 0)
					.map((i) => ({
						days: Number(i.days) || 0,
						dose: i.dose,
						drug: i.drug,
						frequency: i.frequency || undefined,
						warnings: warnings
							.filter((w) => w.drug === i.drug)
							.map((w) => w.message),
					})),
				patientId,
			});
			if (res?.id) setPrescriptionId(res.id);
			setStatus(
				`Prescription saved (${res?.id ?? "ok"}). Diagnosis guard passed.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Prescription failed.");
		}
	}

	async function submitRefill(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.encounters.prescriptions.refill({
				encounterId,
				patientId,
				prescriptionId,
			});
			setStatus(
				`Refill created (${res?.id ?? "ok"}) — sub-minute follow-up path.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Refill failed.");
		}
	}

	async function submitVitals(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.encounters.vitals.record({
				bp: vitals.bp || undefined,
				encounterId,
				patientId,
				pulse: vitals.pulse ? Number(vitals.pulse) : undefined,
				spo2: vitals.spo2 ? Number(vitals.spo2) : undefined,
				tempC: vitals.tempC ? Number(vitals.tempC) : undefined,
				weightKg: vitals.weightKg ? Number(vitals.weightKg) : undefined,
			});
			setStatus(`Vitals recorded (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Vitals failed.");
		}
	}

	async function submitExam(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.exams.save({
				branchId: "main",
				encounterId,
				finding: exam.finding,
				patientId,
				severity: exam.severity as "mild" | "moderate" | "severe",
				system: exam.system as
					| "general"
					| "cvs"
					| "rs"
					| "cns"
					| "abdomen"
					| "ent"
					| "eye"
					| "skin"
					| "mskus"
					| "other",
			});
			setStatus(`Exam finding saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Exam save failed.");
		}
	}

	async function submitImmunization(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.immunizations.record({
				branchId: "main",
				doseNo: Number(immun.doseNo) || 1,
				patientId,
				status: immun.status as "Due" | "Given" | "Overdue",
				vaccine: immun.vaccine,
			});
			setStatus(`Immunization recorded (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Immunization failed.");
		}
	}

	async function submitChronic(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.allopathy.chronic.log({
				bpDys: chronic.bpDys ? Number(chronic.bpDys) : undefined,
				bpSys: chronic.bpSys ? Number(chronic.bpSys) : undefined,
				branchId: "main",
				condition: chronic.condition as
					| "diabetes"
					| "hypertension"
					| "tb"
					| "antenatal"
					| "asthma"
					| "copd"
					| "epilepsy"
					| "ckd"
					| "thyroid"
					| "other",
				encounterId: encounterId || undefined,
				fundalHeightCm: chronic.fundalHeightCm
					? Number(chronic.fundalHeightCm)
					: undefined,
				hba1c: chronic.hba1c ? Number(chronic.hba1c) : undefined,
				parameter: chronic.parameter,
				patientId,
				unit: chronic.unit,
				value: Number(chronic.value) || 0,
			});
			setStatus(`Chronic log saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Chronic log failed.");
		}
	}

	async function submitOrder(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.encounters.orders.place({
				encounterId,
				item: order.item,
				kind: order.kind as
					| "lab"
					| "radiology"
					| "pharmacy"
					| "procedure"
					| "referral"
					| "nursing",
				note: order.note || undefined,
				patientId,
				receivingUnit: order.receivingUnit || undefined,
			});
			const r = res as unknown as {
				id?: string;
				status?: string;
				receivingUnit?: string | null;
			};
			setStatus(
				`Order placed (${r.id ?? "ok"}) — status ${r.status ?? "ordered"}${r.receivingUnit ? ` → ${r.receivingUnit}` : ""}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Order failed.");
		}
	}

	async function submitRegister(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.records.registers.append({
				branchId: "main",
				certifierId: register.certifierId || undefined,
				details: register.details,
				encounterId: encounterId || undefined,
				enteredBy: patientId,
				occurredAt: register.occurredAt || undefined,
				register: register.register as "birth" | "death" | "mlc",
			});
			const r = res as unknown as { serial?: number; id?: string };
			setStatus(
				`Register entry appended (serial ${r.serial ?? r.id ?? "ok"}).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Register append failed.");
		}
	}

	async function submitFollowUp(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.encounters.followUps.set({
				at: followUp.at,
				encounterId,
				note: followUp.note || undefined,
				patientId,
			});
			setStatus(`Follow-up set (${res?.id ?? "ok"}) — appears on recall list.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Follow-up failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="OPD / daycare / tele encounters: triage, SOAP notes, and OPD register. IPD workflows are out of scope."
					title="OPD Encounters"
				/>

				{banner.length > 0 ? (
					<div
						className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm"
						role="alert"
					>
						<p className="font-semibold text-destructive">
							Allergy alert ({banner.length})
						</p>
						<ul className="list-disc pl-5">
							{banner.map((a) => (
								<li key={a.name}>
									{a.name} — {a.severity}
									{a.reaction ? ` (reaction: ${a.reaction})` : ""}
								</li>
							))}
						</ul>
					</div>
				) : null}

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
									<Label>Priority (drives queue position)</Label>
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
									<p className="text-xs text-muted-foreground">
										{QUEUE_NOTE[triage.priority] ?? ""}
									</p>
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

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Allergy (reaction + severity) + interaction check
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={submitAllergy}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Allergen</Label>
										<Input
											onChange={(e) =>
												setAllergy({ ...allergy, name: e.target.value })
											}
											value={allergy.name}
										/>
									</div>
									<div className={inputCls}>
										<Label>Reaction</Label>
										<Input
											onChange={(e) =>
												setAllergy({ ...allergy, reaction: e.target.value })
											}
											placeholder="e.g. rash, wheeze"
											value={allergy.reaction}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Severity</Label>
									<Select
										onValueChange={(v) =>
											setAllergy({ ...allergy, severity: v ?? "moderate" })
										}
										value={allergy.severity}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="mild">Mild</SelectItem>
											<SelectItem value="moderate">Moderate</SelectItem>
											<SelectItem value="severe">Severe</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit">Record allergy</Button>
							</form>
							<div className="grid gap-3 border-t pt-3">
								<div className={inputCls}>
									<Label>Drugs to check (comma separated)</Label>
									<Input
										onChange={(e) => setCheckDrugs(e.target.value)}
										placeholder="e.g. amoxicillin, warfarin, aspirin"
										value={checkDrugs}
									/>
								</div>
								<Button onClick={runInteractionCheck} type="button">
									Run interaction check
								</Button>
								{warnings.length > 0 ? (
									<ul className="grid gap-2 text-sm">
										{warnings.map((w) => {
											const key = `${w.drug}:${w.message}`;
											const isAcked =
												acked.includes(key) || acked.includes(w.message);
											return (
												<li
													className="flex items-center justify-between gap-2 rounded-md border p-2"
													key={key}
												>
													<span>
														[{w.kind}] {w.message}
													</span>
													{isAcked ? (
														<span className="text-xs text-muted-foreground">
															acked
														</span>
													) : (
														<Button
															onClick={() => ackWarning(w)}
															size="sm"
															type="button"
															variant="outline"
														>
															Acknowledge
														</Button>
													)}
												</li>
											);
										})}
									</ul>
								) : null}
								{blocked ? (
									<p className="text-sm text-destructive">
										Prescribing stays blocked until every warning is
										acknowledged.
									</p>
								) : null}
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Problem list (ICD-11 + active/resolved)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={submitProblem}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Code</Label>
										<Input
											onChange={(e) =>
												setProblem({ ...problem, code: e.target.value })
											}
											value={problem.code}
										/>
									</div>
									<div className={inputCls}>
										<Label>Label</Label>
										<Input
											onChange={(e) =>
												setProblem({ ...problem, label: e.target.value })
											}
											value={problem.label}
										/>
									</div>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>System</Label>
										<Select
											onValueChange={(v) =>
												setProblem({ ...problem, system: v ?? "ICD11" })
											}
											value={problem.system}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ICD11">ICD-11</SelectItem>
												<SelectItem value="TM2">TM2</SelectItem>
												<SelectItem value="NAMASTE">NAMASTE</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Status</Label>
										<Select
											onValueChange={(v) =>
												setProblem({ ...problem, status: v ?? "active" })
											}
											value={problem.status}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="resolved">Resolved</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex gap-2">
									<Button type="submit">Upsert problem</Button>
									<Button
										onClick={refreshProblems}
										type="button"
										variant="outline"
									>
										Refresh list
									</Button>
								</div>
							</form>
							{problems.length > 0 ? (
								<ul className="grid gap-2 text-sm">
									{problems.map((p) => (
										<li
											className="flex items-center justify-between gap-2 rounded-md border p-2"
											key={p.id}
										>
											<span>
												{p.code} ({p.system}) — {p.status}
												{p.label ? ` · ${p.label}` : ""}
											</span>
											{p.status === "active" ? (
												<Button
													onClick={() => resolveProblem(p.id)}
													size="sm"
													type="button"
													variant="outline"
												>
													Resolve
												</Button>
											) : null}
										</li>
									))}
								</ul>
							) : null}
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Diagnosis (required) + e-prescription with frequency
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={submitDiagnosis}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Diagnosis code</Label>
										<Input
											onChange={(e) =>
												setDiagnosis({ ...diagnosis, code: e.target.value })
											}
											value={diagnosis.code}
										/>
									</div>
									<div className={inputCls}>
										<Label>Kind</Label>
										<Select
											onValueChange={(v) =>
												setDiagnosis({ ...diagnosis, kind: v ?? "provisional" })
											}
											value={diagnosis.kind}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="provisional">Provisional</SelectItem>
												<SelectItem value="confirmed">Confirmed</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<Button type="submit">Record diagnosis</Button>
							</form>
							<form
								className="grid gap-3 border-t pt-3"
								onSubmit={submitPrescription}
							>
								{rxItems.map((item, idx) => (
									<div
										className="grid gap-2 rounded-md border p-2"
										// biome-ignore lint/suspicious/noArrayIndexKey: Rx rows are append-only drafts without ids
										key={`${item.drug}-${idx}`}
									>
										<div className={rowCls}>
											<div className={inputCls}>
												<Label>Drug</Label>
												<Input
													onChange={(e) => {
														const next = [...rxItems];
														next[idx] = { ...item, drug: e.target.value };
														setRxItems(next);
													}}
													value={item.drug}
												/>
											</div>
											<div className={inputCls}>
												<Label>Dose</Label>
												<Input
													onChange={(e) => {
														const next = [...rxItems];
														next[idx] = { ...item, dose: e.target.value };
														setRxItems(next);
													}}
													value={item.dose}
												/>
											</div>
										</div>
										<div className={rowCls}>
											<div className={inputCls}>
												<Label>Frequency</Label>
												<Input
													onChange={(e) => {
														const next = [...rxItems];
														next[idx] = {
															...item,
															frequency: e.target.value,
														};
														setRxItems(next);
													}}
													placeholder="e.g. TDS × 5d"
													value={item.frequency}
												/>
											</div>
											<div className={inputCls}>
												<Label>Days</Label>
												<Input
													onChange={(e) => {
														const next = [...rxItems];
														next[idx] = { ...item, days: e.target.value };
														setRxItems(next);
													}}
													value={item.days}
												/>
											</div>
										</div>
									</div>
								))}
								<div className="flex gap-2">
									<Button
										onClick={() =>
											setRxItems([
												...rxItems,
												{ days: "", dose: "", drug: "", frequency: "" },
											])
										}
										type="button"
										variant="outline"
									>
										Add line
									</Button>
									<Button type="submit">Prescribe</Button>
								</div>
							</form>
							<form
								className="grid gap-3 border-t pt-3"
								onSubmit={submitRefill}
							>
								<div className={inputCls}>
									<Label>Prescription ID (refill for follow-up)</Label>
									<Input
										onChange={(e) => setPrescriptionId(e.target.value)}
										value={prescriptionId}
									/>
								</div>
								<Button type="submit" variant="outline">
									Refill from recently-used
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Vitals + exam + immunization
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={submitVitals}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>BP</Label>
										<Input
											onChange={(e) =>
												setVitals({ ...vitals, bp: e.target.value })
											}
											placeholder="120/80"
											value={vitals.bp}
										/>
									</div>
									<div className={inputCls}>
										<Label>Weight kg</Label>
										<Input
											onChange={(e) =>
												setVitals({ ...vitals, weightKg: e.target.value })
											}
											value={vitals.weightKg}
										/>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-3">
									<div className={inputCls}>
										<Label>Pulse</Label>
										<Input
											onChange={(e) =>
												setVitals({ ...vitals, pulse: e.target.value })
											}
											value={vitals.pulse}
										/>
									</div>
									<div className={inputCls}>
										<Label>SpO₂</Label>
										<Input
											onChange={(e) =>
												setVitals({ ...vitals, spo2: e.target.value })
											}
											value={vitals.spo2}
										/>
									</div>
									<div className={inputCls}>
										<Label>Temp °C</Label>
										<Input
											onChange={(e) =>
												setVitals({ ...vitals, tempC: e.target.value })
											}
											value={vitals.tempC}
										/>
									</div>
								</div>
								<Button type="submit">Record vitals</Button>
							</form>
							<form className="grid gap-3 border-t pt-3" onSubmit={submitExam}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>System</Label>
										<Input
											onChange={(e) =>
												setExam({ ...exam, system: e.target.value })
											}
											value={exam.system}
										/>
									</div>
									<div className={inputCls}>
										<Label>Finding</Label>
										<Input
											onChange={(e) =>
												setExam({ ...exam, finding: e.target.value })
											}
											value={exam.finding}
										/>
									</div>
								</div>
								<Button type="submit" variant="outline">
									Save exam finding
								</Button>
							</form>
							<form
								className="grid gap-3 border-t pt-3"
								onSubmit={submitImmunization}
							>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Vaccine</Label>
										<Input
											onChange={(e) =>
												setImmun({ ...immun, vaccine: e.target.value })
											}
											value={immun.vaccine}
										/>
									</div>
									<div className={inputCls}>
										<Label>Dose no</Label>
										<Input
											onChange={(e) =>
												setImmun({ ...immun, doseNo: e.target.value })
											}
											value={immun.doseNo}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Status</Label>
									<Select
										onValueChange={(v) =>
											setImmun({ ...immun, status: v ?? "Given" })
										}
										value={immun.status}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Due">Due</SelectItem>
											<SelectItem value="Given">Given</SelectItem>
											<SelectItem value="Overdue">Overdue</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit" variant="outline">
									Record immunization
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Chronic protocol (diabetes / HTN / TB / antenatal)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitChronic}>
								<div className={inputCls}>
									<Label>Condition</Label>
									<Select
										onValueChange={(v) =>
											setChronic({ ...chronic, condition: v ?? "diabetes" })
										}
										value={chronic.condition}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[
												"diabetes",
												"hypertension",
												"tb",
												"antenatal",
												"asthma",
												"copd",
												"epilepsy",
												"ckd",
												"thyroid",
												"other",
											].map((c) => (
												<SelectItem key={c} value={c}>
													{c}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Parameter</Label>
										<Input
											onChange={(e) =>
												setChronic({ ...chronic, parameter: e.target.value })
											}
											placeholder="e.g. fasting glucose"
											value={chronic.parameter}
										/>
									</div>
									<div className={inputCls}>
										<Label>Value + unit</Label>
										<div className="flex gap-2">
											<Input
												onChange={(e) =>
													setChronic({ ...chronic, value: e.target.value })
												}
												value={chronic.value}
											/>
											<Input
												onChange={(e) =>
													setChronic({ ...chronic, unit: e.target.value })
												}
												placeholder="unit"
												value={chronic.unit}
											/>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
									<div className={inputCls}>
										<Label>HbA1c</Label>
										<Input
											onChange={(e) =>
												setChronic({ ...chronic, hba1c: e.target.value })
											}
											value={chronic.hba1c}
										/>
									</div>
									<div className={inputCls}>
										<Label>BP sys</Label>
										<Input
											onChange={(e) =>
												setChronic({ ...chronic, bpSys: e.target.value })
											}
											value={chronic.bpSys}
										/>
									</div>
									<div className={inputCls}>
										<Label>BP dys</Label>
										<Input
											onChange={(e) =>
												setChronic({ ...chronic, bpDys: e.target.value })
											}
											value={chronic.bpDys}
										/>
									</div>
									<div className={inputCls}>
										<Label>Fundal ht cm</Label>
										<Input
											onChange={(e) =>
												setChronic({
													...chronic,
													fundalHeightCm: e.target.value,
												})
											}
											value={chronic.fundalHeightCm}
										/>
									</div>
								</div>
								<Button type="submit">Log chronic parameter</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Orders (lab / radio / pharmacy + receiving unit)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitOrder}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Kind</Label>
										<Select
											onValueChange={(v) =>
												setOrder({ ...order, kind: v ?? "lab" })
											}
											value={order.kind}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[
													"lab",
													"radiology",
													"pharmacy",
													"procedure",
													"referral",
													"nursing",
												].map((k) => (
													<SelectItem key={k} value={k}>
														{k}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Receiving unit</Label>
										<Input
											onChange={(e) =>
												setOrder({ ...order, receivingUnit: e.target.value })
											}
											placeholder="e.g. lab-1, pharmacy-main"
											value={order.receivingUnit}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Item</Label>
									<Input
										onChange={(e) =>
											setOrder({ ...order, item: e.target.value })
										}
										value={order.item}
									/>
								</div>
								<div className={inputCls}>
									<Label>Note</Label>
									<Input
										onChange={(e) =>
											setOrder({ ...order, note: e.target.value })
										}
										value={order.note}
									/>
								</div>
								<Button type="submit">Place order</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Registers (MLC / birth / death via records)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitRegister}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Register</Label>
										<Select
											onValueChange={(v) =>
												setRegister({ ...register, register: v ?? "mlc" })
											}
											value={register.register}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="mlc">MLC (flag only)</SelectItem>
												<SelectItem value="birth">Birth</SelectItem>
												<SelectItem value="death">Death</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Date</Label>
										<Input
											onChange={(e) =>
												setRegister({ ...register, occurredAt: e.target.value })
											}
											placeholder="YYYY-MM-DD"
											value={register.occurredAt}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Certifier ID (doctor)</Label>
									<Input
										onChange={(e) =>
											setRegister({ ...register, certifierId: e.target.value })
										}
										value={register.certifierId}
									/>
								</div>
								<div className={inputCls}>
									<Label>Details (linked encounter auto-attached)</Label>
									<Input
										onChange={(e) =>
											setRegister({ ...register, details: e.target.value })
										}
										value={register.details}
									/>
								</div>
								<Button type="submit">Append register entry</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Follow-up / recall
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitFollowUp}>
								<div className={inputCls}>
									<Label>Follow-up date</Label>
									<Input
										onChange={(e) =>
											setFollowUp({ ...followUp, at: e.target.value })
										}
										placeholder="YYYY-MM-DD"
										value={followUp.at}
									/>
								</div>
								<div className={inputCls}>
									<Label>Note</Label>
									<Input
										onChange={(e) =>
											setFollowUp({ ...followUp, note: e.target.value })
										}
										value={followUp.note}
									/>
								</div>
								<Button type="submit">Set follow-up</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				<Result text={status} />
			</div>
		</main>
	);
}
