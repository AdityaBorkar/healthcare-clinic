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
	const [summary, setSummary] = useState("");
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
			const res = await api.rehab.assess({
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
			const res = await api.rehab.bookSitting({
				branchId: "main",
				date: sittingDate,
				episodeId,
				patientId,
			});
			setStatus(`Sitting booked (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Booking failed.");
		}
	}

	async function submitDischarge(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.rehab.discharge({
				branchId: "main",
				episodeId,
				outcome: outcome as
					| "recovered"
					| "improved"
					| "same"
					| "referred"
					| "dropped",
				patientId,
				summary,
			});
			setStatus(`Episode discharged (${res?.id ?? "ok"}).`);
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
								<Button type="submit">Book sitting</Button>
							</form>
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
