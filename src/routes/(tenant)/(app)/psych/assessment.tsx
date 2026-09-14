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

export const Route = createFileRoute("/(tenant)/(app)/psych/assessment")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

const SCALES = [
	"PHQ9",
	"GAD7",
	"YMRS",
	"HAMD",
	"HAMA",
	"MMSE",
	"MoCA",
	"AUDIT",
	"DAST",
];

function maskPatient(id: string) {
	if (!id) return "PX-••••";
	if (id.length <= 2) return "PX-••••";
	return `PX-••••${id.slice(-2)}`;
}

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [complaint, setComplaint] = useState("");
	const [impression, setImpression] = useState("");
	const [scale, setScale] = useState("PHQ9");
	const [score, setScore] = useState("");
	const [maxScore, setMaxScore] = useState("27");
	const [riskLevel, setRiskLevel] = useState("Low");
	const [riskFactors, setRiskFactors] = useState("");
	const [breakReason, setBreakReason] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const encId = useId();
	const patId = useId();
	const complaintId = useId();
	const impressionId = useId();
	const scoreId = useId();
	const maxScoreId = useId();
	const factorsId = useId();
	const breakReasonId = useId();

	async function saveAssessment(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.assessments({
				branchId: "main",
				chiefComplaint: complaint,
				encounterId,
				history: "As narrated (masked).",
				impression,
				mentalStatusExam: "Recorded (masked).",
				patientId,
			});
			setStatus(`Masked assessment saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Assessment failed.");
		}
	}

	async function saveScale(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.scales.score({
				branchId: "main",
				encounterId,
				maxScore: Number(maxScore),
				patientId,
				scale: scale as
					| "PHQ9"
					| "GAD7"
					| "YMRS"
					| "HAMD"
					| "HAMA"
					| "MMSE"
					| "MoCA"
					| "AUDIT"
					| "DAST",
				score: Number(score),
			});
			setStatus(`Scale ${scale} scored (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Scale scoring failed.");
		}
	}

	async function saveRisk(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.risks.screen({
				branchId: "main",
				encounterId,
				factors: riskFactors
					.split(",")
					.map((f) => f.trim())
					.filter(Boolean),
				level: riskLevel as "Low" | "Moderate" | "High",
				patientId,
			});
			setStatus(
				`Risk screened: ${riskLevel} (${res?.id ?? "ok"}).${res?.nextStep ? ` ${res.nextStep}` : ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Risk screening failed.");
		}
	}

	async function breakGlass(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.breakGlass({
				branchId: "main",
				patientId,
				reason: breakReason,
			});
			setStatus(`Break-glass logged (${res?.id ?? "ok"}). Access audited.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Break-glass failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					actions={<Badge variant="secondary">{maskPatient(patientId)}</Badge>}
					description="Masked headers throughout. Moderate / High risk blocks further sessions until a safety plan and senior alert exist."
					title="Psych Assessment"
				/>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Context (identifiers stay masked)
						</CardTitle>
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
							<Label htmlFor={patId}>Patient ID (masked on screen)</Label>
							<Input
								id={patId}
								onChange={(e) => setPatientId(e.target.value)}
								type="password"
								value={patientId}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Masked assessment
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={saveAssessment}>
								<div className="grid gap-1.5">
									<Label htmlFor={complaintId}>Chief complaint</Label>
									<Input
										id={complaintId}
										onChange={(e) => setComplaint(e.target.value)}
										value={complaint}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={impressionId}>Impression</Label>
									<Input
										id={impressionId}
										onChange={(e) => setImpression(e.target.value)}
										value={impression}
									/>
								</div>
								<Button type="submit">Save assessment</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Scale (24h re-admin guard)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={saveScale}>
								<div className="grid gap-3 sm:grid-cols-3">
									<div className="grid gap-1.5">
										<Label>Scale</Label>
										<Select
											onValueChange={(v) => setScale(v ?? "PHQ9")}
											value={scale}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{SCALES.map((s) => (
													<SelectItem key={s} value={s}>
														{s}
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
									<div className="grid gap-1.5">
										<Label htmlFor={maxScoreId}>Max</Label>
										<Input
											id={maxScoreId}
											onChange={(e) => setMaxScore(e.target.value)}
											value={maxScore}
										/>
									</div>
								</div>
								<Button type="submit">Score scale</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Risk screening
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={saveRisk}>
								<div className="grid gap-1.5">
									<Label>Level</Label>
									<Select
										onValueChange={(v) => setRiskLevel(v ?? "Low")}
										value={riskLevel}
									>
										<SelectTrigger className="max-w-xs">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["Low", "Moderate", "High"].map((l) => (
												<SelectItem key={l} value={l}>
													{l}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={factorsId}>Factors (comma separated)</Label>
									<Input
										id={factorsId}
										onChange={(e) => setRiskFactors(e.target.value)}
										value={riskFactors}
									/>
								</div>
								<Button type="submit">Screen risk</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Break-glass (audited)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={breakGlass}>
								<div className="grid gap-1.5">
									<Label htmlFor={breakReasonId}>
										Detailed reason (min 10 chars)
									</Label>
									<Input
										id={breakReasonId}
										onChange={(e) => setBreakReason(e.target.value)}
										value={breakReason}
									/>
								</div>
								<Button type="submit" variant="destructive">
									Log break-glass access
								</Button>
							</form>
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
