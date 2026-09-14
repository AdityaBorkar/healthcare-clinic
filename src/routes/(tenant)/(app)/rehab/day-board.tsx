import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
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

export const Route = createFileRoute("/(tenant)/(app)/rehab/day-board")({
	component: RouteComponent,
});

interface BoardSitting {
	date: string;
	episodeId: string;
	equipmentId: string | null;
	id: string;
	modality: string | null;
	patientId: string;
	slot: string | null;
	status: string;
	therapistId: string | null;
}

interface DayBoard {
	groups: { booked: number; completed: number; inProgress: number };
	load: Record<string, number>;
	sittings: BoardSitting[];
	total: number;
}

function RouteComponent() {
	const [board, setBoard] = useState<DayBoard | null>(null);
	const [patientId, setPatientId] = useState("");
	const [condition, setCondition] = useState("");
	const [discipline, setDiscipline] = useState("physio");
	const [status, setStatus] = useState<string | null>(null);

	async function openEpisode(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.rehab.openEpisode({
				branchId: "main",
				condition,
				discipline: discipline as "occupational" | "physio" | "speech",
				patientId,
				status: "Active",
			});
			setStatus(
				`Episode opened (${(res as { id?: string })?.id ?? "ok"}) — ${discipline}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Open episode failed.");
		}
	}

	useEffect(() => {
		orpc.rehab
			.dayBoard({ branchId: "main" })
			.then((b) => setBoard(b as DayBoard))
			.catch(() => setBoard(null));
	}, []);

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Booked, in-progress, and completed sittings with therapist load counts. Daycare only — no IPD stays."
					title="Rehab day board"
				/>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Open episode
						</CardTitle>
						<form className="grid gap-3 sm:grid-cols-4" onSubmit={openEpisode}>
							<div className="space-y-1">
								<Label>Patient ID</Label>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Condition</Label>
								<Input
									onChange={(e) => setCondition(e.target.value)}
									value={condition}
								/>
							</div>
							<div className="space-y-1">
								<Label>Discipline</Label>
								<Select
									onValueChange={(v) => setDiscipline(v ?? "physio")}
									value={discipline}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="physio">Physio</SelectItem>
										<SelectItem value="occupational">Occupational</SelectItem>
										<SelectItem value="speech">Speech</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-end gap-2">
								<Button type="submit">Open episode</Button>
							</div>
						</form>
						{status ? (
							<p className="mt-3 text-sm text-muted-foreground">{status}</p>
						) : null}
					</CardContent>
				</Card>
				<div className="grid gap-4 sm:grid-cols-4">
					{(
						[
							["Booked", board?.groups.booked ?? 0],
							["In progress", board?.groups.inProgress ?? 0],
							["Completed", board?.groups.completed ?? 0],
							["Total", board?.total ?? 0],
						] as const
					).map(([label, count]) => (
						<Card className="shadow-xs" key={label}>
							<CardContent className="py-6">
								<CardTitle className="mb-1 text-base font-semibold">
									{label}
								</CardTitle>
								<p className="text-2xl font-bold">{count}</p>
							</CardContent>
						</Card>
					))}
				</div>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Therapist load
						</CardTitle>
						<ul className="divide-y text-sm">
							{Object.entries(board?.load ?? {}).map(([therapist, count]) => (
								<li className="flex justify-between py-2" key={therapist}>
									<span>{therapist}</span>
									<span className="text-muted-foreground">
										{count} sittings
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Sittings
						</CardTitle>
						<ul className="divide-y text-sm">
							{(board?.sittings ?? []).map((s) => (
								<li className="flex justify-between py-2" key={s.id}>
									<span>
										{s.date} {s.slot ?? ""} · {s.patientId} ·{" "}
										{s.modality ?? "no modality"}
									</span>
									<span className="text-muted-foreground">{s.status}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
