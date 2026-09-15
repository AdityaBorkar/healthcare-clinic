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

export const Route = createFileRoute("/(tenant)/(app)/rehab/episodes/$id")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

const TOOLS = [
	"MMT",
	"ROM",
	"Berg",
	"Barthel",
	"FIM",
	"VAS",
	"gait",
	"GUSS",
	"FOIS",
];

function RouteComponent() {
	const { id: episodeId } = Route.useParams();
	const [patientId, setPatientId] = useState("");
	const [tool, setTool] = useState("Berg");
	const [score, setScore] = useState("");
	const [details, setDetails] = useState("");
	const [sittingDate, setSittingDate] = useState("");
	const [slot, setSlot] = useState("");
	const [therapistId, setTherapistId] = useState("");
	const [equipmentId, setEquipmentId] = useState("");
	const [goalText, setGoalText] = useState("");
	const [goalMeasure, setGoalMeasure] = useState("");
	const [goalScale, setGoalScale] = useState("Berg");
	const [goalTerm, setGoalTerm] = useState("ST");
	const [pkgFrequency, setPkgFrequency] = useState("");
	const [pkgSessions, setPkgSessions] = useState("");
	const [pkgPrice, setPkgPrice] = useState("");
	const [pkgValidity, setPkgValidity] = useState("");
	const [pkgModalities, setPkgModalities] = useState("");
	const [recordSittingId, setRecordSittingId] = useState("");
	const [recordModality, setRecordModality] = useState("");
	const [recordDosage, setRecordDosage] = useState("");
	const [recordDuration, setRecordDuration] = useState("");
	const [chart, setChart] = useState<
		{
			gain: number | null;
			post: number | null;
			pre: number | null;
			tool: string;
		}[]
	>([]);
	const [summary, setSummary] = useState("");
	const [homePlan, setHomePlan] = useState("");
	const [outcome, setOutcome] = useState("improved");
	const [status, setStatus] = useState<string | null>(null);
	const patId = useId();
	const scoreId = useId();
	const detailsId = useId();
	const dateId = useId();
	const summaryId = useId();

	async function submitAssessment(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.rehab.assessments({
				branchId: "main",
				details: details || undefined,
				episodeId,
				patientId,
				score: Number(score),
				status: "Final",
				tool: tool as
					| "MMT"
					| "ROM"
					| "Berg"
					| "Barthel"
					| "FIM"
					| "VAS"
					| "gait"
					| "GUSS"
					| "FOIS",
			});
			setStatus(
				`Assessment saved (${res?.id ?? "ok"}).${res?.npoMessage ? ` ${res.npoMessage}` : ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Assessment failed.");
		}
	}

	async function bookSitting(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.rehab.sittings.book({
				branchId: "main",
				date: sittingDate,
				episodeId,
				equipmentId: equipmentId || undefined,
				patientId,
				slot: slot || undefined,
				therapistId: therapistId || undefined,
			});
			const extra = res as {
				id?: string;
				remaining?: number | null;
				expiryWarning?: string | null;
			};
			setStatus(
				`Sitting booked (${extra.id ?? "ok"}).${extra.remaining !== null && extra.remaining !== undefined ? ` Package balance: ${extra.remaining}.` : ""}${extra.expiryWarning ? ` ${extra.expiryWarning}` : ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Booking failed.");
		}
	}

	async function submitGoals(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.rehab.goals.set({
				branchId: "main",
				episodeId,
				goals: [
					{
						goal: goalText,
						linkedScale: goalScale as "Berg",
						measure: goalMeasure || undefined,
						status: "open",
						term: goalTerm as "ST",
					},
				],
				patientId,
			});
			setStatus(
				`Goal saved (${(res as { goals?: unknown[] }).goals?.length ?? 1} goal(s) on plan).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Goal save failed.");
		}
	}

	async function submitPackage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.rehab.packages.build({
				branchId: "main",
				episodeId,
				frequency: pkgFrequency,
				modalities: pkgModalities
					? pkgModalities
							.split(",")
							.map((m) => m.trim())
							.filter(Boolean)
					: undefined,
				patientId,
				price: pkgPrice ? Number(pkgPrice) : undefined,
				totalSessions: Number(pkgSessions),
				validityDays: pkgValidity ? Number(pkgValidity) : undefined,
			});
			setStatus(
				`Package built (${(res as { id?: string }).id ?? "ok"}). Price/validity/balance tracked on booking.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Package failed.");
		}
	}

	async function submitRecordSitting(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const vitals = { bpDys: 80, bpSys: 120, pulse: 72 };
			const res = await api.rehab.sittings.record({
				dosage: recordDosage || undefined,
				durationMins: recordDuration ? Number(recordDuration) : undefined,
				modality: recordModality || undefined,
				postVitals: vitals,
				preVitals: vitals,
				sittingId: recordSittingId,
				status: "Completed",
			});
			const lines =
				(res as { billingLines?: unknown[] }).billingLines?.length ?? 0;
			setStatus(
				`Sitting recorded. ${lines} consumable line(s) pushed to billing.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Record failed.");
		}
	}

	async function loadChart() {
		setStatus(null);
		try {
			const res = await api.rehab.progress.chart({
				branchId: "main",
				episodeId,
			});
			setChart((res as { series?: typeof chart }).series ?? []);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Chart failed.");
		}
	}

	async function submitDischarge(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.rehab.discharge({
				branchId: "main",
				episodeId,
				homePlan: homePlan || undefined,
				outcome: outcome as
					| "recovered"
					| "improved"
					| "same"
					| "referred"
					| "dropped",
				patientId,
				summary,
			});
			const counts = res as { attended?: number; missed?: number; id?: string };
			setStatus(
				`Episode discharged (${counts.id ?? "ok"}). Attended ${counts.attended ?? "?"}, missed ${counts.missed ?? "?"}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Discharge failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description={`Physio / speech episode ${episodeId}: assessments, sittings, and discharge. Daycare only — no IPD stays.`}
					title="Rehab Episode"
				/>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">Context</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-1.5">
						<Label htmlFor={patId}>Patient ID</Label>
						<Input
							id={patId}
							onChange={(e) => setPatientId(e.target.value)}
							placeholder="pat_…"
							value={patientId}
						/>
					</CardContent>
				</Card>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Assessment (MMT / ROM / Berg / Barthel / FIM / VAS / gait / GUSS
								/ FOIS)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitAssessment}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Tool</Label>
										<Select
											onValueChange={(v) => setTool(v ?? "Berg")}
											value={tool}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TOOLS.map((t) => (
													<SelectItem key={t} value={t}>
														{t}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor={scoreId}>Score</Label>
										<Input
											id={scoreId}
											onChange={(e) => setScore(e.target.value)}
											value={score}
										/>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={detailsId}>Details</Label>
									<Input
										id={detailsId}
										onChange={(e) => setDetails(e.target.value)}
										value={details}
									/>
								</div>
								<Button type="submit">Save assessment (Final)</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Book sitting
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={bookSitting}>
								<div className="grid gap-1.5">
									<Label htmlFor={dateId}>Date</Label>
									<Input
										id={dateId}
										onChange={(e) => setSittingDate(e.target.value)}
										placeholder="2026-09-14"
										value={sittingDate}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Slot</Label>
										<Input
											onChange={(e) => setSlot(e.target.value)}
											placeholder="morning"
											value={slot}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Therapist ID</Label>
										<Input
											onChange={(e) => setTherapistId(e.target.value)}
											value={therapistId}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Equipment ID (conflict-checked)</Label>
										<Input
											onChange={(e) => setEquipmentId(e.target.value)}
											placeholder="treadmill-1"
											value={equipmentId}
										/>
									</div>
								</div>
								<Button type="submit">Book sitting</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Goal plan (measure + linked scale + ST/LT)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitGoals}>
								<div className="grid gap-1.5">
									<Label>Goal</Label>
									<Input
										onChange={(e) => setGoalText(e.target.value)}
										placeholder="Walk 100 m unaided"
										value={goalText}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Measure</Label>
									<Input
										onChange={(e) => setGoalMeasure(e.target.value)}
										placeholder="Distance in metres, 6 weeks"
										value={goalMeasure}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Linked scale</Label>
										<Select
											onValueChange={(v) => setGoalScale(v ?? "Berg")}
											value={goalScale}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TOOLS.map((t) => (
													<SelectItem key={t} value={t}>
														{t}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-1.5">
										<Label>Term</Label>
										<Select
											onValueChange={(v) => setGoalTerm(v ?? "ST")}
											value={goalTerm}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ST">Short-term (2–4 wk)</SelectItem>
												<SelectItem value="LT">Long-term (8–12 wk)</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<Button type="submit">Save goal</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Therapy package (price + validity + modalities)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitPackage}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Frequency</Label>
										<Input
											onChange={(e) => setPkgFrequency(e.target.value)}
											placeholder="3x per week"
											value={pkgFrequency}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Total sessions</Label>
										<Input
											onChange={(e) => setPkgSessions(e.target.value)}
											value={pkgSessions}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Price</Label>
										<Input
											onChange={(e) => setPkgPrice(e.target.value)}
											value={pkgPrice}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Validity (days)</Label>
										<Input
											onChange={(e) => setPkgValidity(e.target.value)}
											value={pkgValidity}
										/>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Included modalities (comma separated)</Label>
									<Input
										onChange={(e) => setPkgModalities(e.target.value)}
										placeholder="IFT, ultrasound"
										value={pkgModalities}
									/>
								</div>
								<Button type="submit">Build package</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Record sitting (modality + dosage + duration)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={submitRecordSitting}>
								<div className="grid gap-1.5">
									<Label>Sitting ID</Label>
									<Input
										onChange={(e) => setRecordSittingId(e.target.value)}
										value={recordSittingId}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Modality</Label>
										<Input
											onChange={(e) => setRecordModality(e.target.value)}
											placeholder="IFT"
											value={recordModality}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Duration (mins)</Label>
										<Input
											onChange={(e) => setRecordDuration(e.target.value)}
											value={recordDuration}
										/>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Dosage</Label>
									<Input
										onChange={(e) => setRecordDosage(e.target.value)}
										placeholder="15 mA, 10 min"
										value={recordDosage}
									/>
								</div>
								<Button type="submit">Complete sitting</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Progress chart (pre/post, printable)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<Button onClick={() => void loadChart()} type="button">
								Load progress chart
							</Button>
							<ul className="divide-y text-sm">
								{chart.map((row) => (
									<li className="flex justify-between py-2" key={row.tool}>
										<span>{row.tool}</span>
										<span className="text-muted-foreground">
											{row.pre ?? "?"} → {row.post ?? "?"} (gain{" "}
											{row.gain ?? "?"})
										</span>
									</li>
								))}
							</ul>
							<Button onClick={() => window.print()} type="button">
								Print chart
							</Button>
						</CardContent>
					</Card>
				</div>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Discharge summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3" onSubmit={submitDischarge}>
							<div className="grid gap-1.5">
								<Label htmlFor={summaryId}>Summary</Label>
								<Input
									id={summaryId}
									onChange={(e) => setSummary(e.target.value)}
									value={summary}
								/>
							</div>
							<div className="grid gap-1.5">
								<Label>Home-program continuation plan</Label>
								<Input
									onChange={(e) => setHomePlan(e.target.value)}
									placeholder="Continue home program 4 weeks"
									value={homePlan}
								/>
							</div>
							<div className="grid gap-1.5">
								<Label>Outcome</Label>
								<Select
									onValueChange={(v) => setOutcome(v ?? "improved")}
									value={outcome}
								>
									<SelectTrigger className="max-w-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{[
											"recovered",
											"improved",
											"same",
											"referred",
											"dropped",
										].map((o) => (
											<SelectItem key={o} value={o}>
												{o}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button type="submit">Discharge episode</Button>
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
