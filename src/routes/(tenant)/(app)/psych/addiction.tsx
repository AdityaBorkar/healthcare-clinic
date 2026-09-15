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

export const Route = createFileRoute("/(tenant)/(app)/psych/addiction")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [encounterId, setEncounterId] = useState("");
	const [tool, setTool] = useState("CIWA");
	const [score, setScore] = useState("");
	const [substance, setSubstance] = useState("");
	const [history, setHistory] = useState("");
	const [lastUse, setLastUse] = useState("");
	const [triggers, setTriggers] = useState("");
	const [responses, setResponses] = useState("");
	const [support, setSupport] = useState("");
	const [followUps, setFollowUps] = useState("");
	const [medicine, setMedicine] = useState("");
	const [days, setDays] = useState("");
	const [qty, setQty] = useState("");
	const [rxId, setRxId] = useState("");
	const [effects, setEffects] = useState("");
	const [severity, setSeverity] = useState("none");
	const [weight, setWeight] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const patId = useId();

	async function chart(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.withdrawal.chart({
				branchId: "main",
				encounterId: encounterId || undefined,
				lastUseAt: lastUse || undefined,
				patientId,
				score: Number(score),
				substance: substance || undefined,
				substanceHistory: history || undefined,
				tool: tool as "CIWA" | "CoWS",
			});
			const detail = res as { prompt?: string; nextDueAt?: string };
			setStatus(
				`${detail.prompt ?? "Charted."} Next due: ${detail.nextDueAt ?? "—"}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Chart failed.");
		}
	}

	async function relapse(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.psych.relapsePlans({
				branchId: "main",
				followUpDates: followUps
					? followUps
							.split(",")
							.map((d) => d.trim())
							.filter(Boolean)
					: undefined,
				patientId,
				responses,
				supportContacts: support
					.split(",")
					.map((c) => c.trim())
					.filter(Boolean),
				triggers: triggers
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
			});
			setStatus("Relapse plan saved with follow-up dates.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Relapse plan failed.");
		}
	}

	async function prescribe(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.prescriptions.controlled({
				branchId: "main",
				daysSupply: Number(days),
				encounterId,
				medicine,
				patientId,
				qty: Number(qty),
			});
			setRxId((res as { id?: string }).id ?? "");
			setStatus(
				`Controlled prescription saved (${(res as { id?: string }).id ?? "ok"}). Capped at 30 days without override.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Prescription failed.");
		}
	}

	async function sideEffects(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.psych.sideEffects.check({
				branchId: "main",
				effects: effects
					.split(",")
					.map((f) => f.trim())
					.filter(Boolean),
				patientId,
				prescriptionId: rxId,
				severity: severity as "none" | "mild" | "moderate" | "severe",
				weightKg: weight ? Number(weight) : undefined,
			});
			setStatus("Side-effect check saved (EPS/sedation/weight/metabolic).");
		} catch (err) {
			setStatus(
				err instanceof Error ? err.message : "Side-effect check failed.",
			);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="De-addiction admission charting, relapse planning, controlled-drug discipline, and side-effect review."
					title="De-addiction & medication"
				/>
				<Card className="shadow-xs">
					<CardContent className="grid gap-3 py-6 sm:grid-cols-3">
						<div className="grid gap-1.5">
							<Label htmlFor={patId}>Patient ID</Label>
							<Input
								id={patId}
								onChange={(e) => setPatientId(e.target.value)}
								value={patientId}
							/>
						</div>
						<div className="grid gap-1.5">
							<Label>Encounter ID</Label>
							<Input
								onChange={(e) => setEncounterId(e.target.value)}
								value={encounterId}
							/>
						</div>
						<div className="grid gap-1.5">
							<Label>Prescription ID (for side effects)</Label>
							<Input onChange={(e) => setRxId(e.target.value)} value={rxId} />
						</div>
					</CardContent>
				</Card>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Withdrawal chart (CIWA / COWS)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={chart}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Tool</Label>
										<Select
											onValueChange={(v) => setTool(v ?? "CIWA")}
											value={tool}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="CIWA">CIWA</SelectItem>
												<SelectItem value="CoWS">COWS</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-1.5">
										<Label>Score</Label>
										<Input
											onChange={(e) => setScore(e.target.value)}
											value={score}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Substance</Label>
										<Input
											onChange={(e) => setSubstance(e.target.value)}
											value={substance}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Last use</Label>
										<Input
											onChange={(e) => setLastUse(e.target.value)}
											placeholder="2026-09-13"
											value={lastUse}
										/>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Substance history</Label>
									<Input
										onChange={(e) => setHistory(e.target.value)}
										value={history}
									/>
								</div>
								<Button type="submit">Chart withdrawal</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Relapse prevention plan
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={relapse}>
								<div className="grid gap-1.5">
									<Label>Triggers (comma separated)</Label>
									<Input
										onChange={(e) => setTriggers(e.target.value)}
										value={triggers}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Planned responses</Label>
									<Input
										onChange={(e) => setResponses(e.target.value)}
										value={responses}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Support contacts (comma separated)</Label>
									<Input
										onChange={(e) => setSupport(e.target.value)}
										value={support}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Follow-up dates (comma separated)</Label>
									<Input
										onChange={(e) => setFollowUps(e.target.value)}
										value={followUps}
									/>
								</div>
								<Button type="submit">Save relapse plan</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Controlled prescription
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={prescribe}>
								<div className="grid gap-1.5">
									<Label>Medicine</Label>
									<Input
										onChange={(e) => setMedicine(e.target.value)}
										value={medicine}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Days supply</Label>
										<Input
											onChange={(e) => setDays(e.target.value)}
											value={days}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Quantity</Label>
										<Input
											onChange={(e) => setQty(e.target.value)}
											value={qty}
										/>
									</div>
								</div>
								<Button type="submit">Prescribe</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Side-effect check
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={sideEffects}>
								<div className="grid gap-1.5">
									<Label>Effects (comma separated)</Label>
									<Input
										onChange={(e) => setEffects(e.target.value)}
										value={effects}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Severity</Label>
										<Select
											onValueChange={(v) => setSeverity(v ?? "none")}
											value={severity}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["none", "mild", "moderate", "severe"].map((s) => (
													<SelectItem key={s} value={s}>
														{s}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-1.5">
										<Label>Weight (kg)</Label>
										<Input
											onChange={(e) => setWeight(e.target.value)}
											value={weight}
										/>
									</div>
								</div>
								<Button type="submit">Save side-effect check</Button>
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
