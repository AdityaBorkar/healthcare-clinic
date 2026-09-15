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

export const Route = createFileRoute("/(tenant)/(app)/psych/safety")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [level, setLevel] = useState("Low");
	const [factors, setFactors] = useState("");
	const [warningSigns, setWarningSigns] = useState("");
	const [coping, setCoping] = useState("");
	const [means, setMeans] = useState("");
	const [contacts, setContacts] = useState("");
	const [alertReason, setAlertReason] = useState("");
	const [readiness, setReadiness] = useState<{
		blockers: string[];
		ok: boolean;
	} | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const encId = useId();
	const patId = useId();

	async function screen(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.risks.screen({
				branchId: "main",
				encounterId,
				factors: factors
					.split(",")
					.map((f) => f.trim())
					.filter(Boolean),
				level: level as "Low" | "Moderate" | "High",
				patientId,
			});
			setStatus(
				`Risk recorded (${(res as { id?: string }).id ?? "ok"}). ${(res as { nextStep?: string | null }).nextStep ?? ""}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Risk screen failed.");
		}
	}

	async function savePlan(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.psych.safetyPlans.save({
				branchId: "main",
				contacts: contacts
					.split(",")
					.map((c) => c.trim())
					.filter(Boolean),
				copingStrategies: coping,
				encounterId,
				meansRestriction: means,
				patientId,
				warningSigns,
			});
			setStatus("Safety plan saved.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Safety plan failed.");
		}
	}

	async function alert(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.psych.seniors.alert({
				branchId: "main",
				encounterId: encounterId || undefined,
				patientId,
				reason: alertReason,
			});
			setStatus("Senior clinician alerted.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Alert failed.");
		}
	}

	async function check() {
		setStatus(null);
		try {
			const res = await api.psych.readiness.close({
				branchId: "main",
				encounterId,
				patientId,
			});
			setReadiness(res as typeof readiness);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Check failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Risk screen every encounter. Moderate/High blocks close until a safety plan is saved and a senior is alerted."
					title="Psych safety"
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
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Risk screen
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={screen}>
								<div className="grid gap-1.5">
									<Label>Level</Label>
									<Select
										onValueChange={(v) => setLevel(v ?? "Low")}
										value={level}
									>
										<SelectTrigger>
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
									<Label>Factors (comma separated)</Label>
									<Input
										onChange={(e) => setFactors(e.target.value)}
										value={factors}
									/>
								</div>
								<Button type="submit">Save risk screen</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Safety plan
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={savePlan}>
								<div className="grid gap-1.5">
									<Label>Warning signs</Label>
									<Input
										onChange={(e) => setWarningSigns(e.target.value)}
										value={warningSigns}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Coping strategies</Label>
									<Input
										onChange={(e) => setCoping(e.target.value)}
										value={coping}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Means restriction</Label>
									<Input
										onChange={(e) => setMeans(e.target.value)}
										value={means}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Contacts (comma separated)</Label>
									<Input
										onChange={(e) => setContacts(e.target.value)}
										value={contacts}
									/>
								</div>
								<Button type="submit">Save safety plan</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Senior alert
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={alert}>
								<div className="grid gap-1.5">
									<Label>Reason</Label>
									<Input
										onChange={(e) => setAlertReason(e.target.value)}
										value={alertReason}
									/>
								</div>
								<Button type="submit">Alert senior</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Encounter-close guard
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<Button onClick={() => void check()} type="button">
								Check close readiness
							</Button>
							{readiness ? (
								<p className="text-sm text-muted-foreground">
									{readiness.ok
										? "Ready to close."
										: `Blocked: ${readiness.blockers.join("; ")}`}
								</p>
							) : null}
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
