import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/appointments/calendar")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Slot = { slotStart: string; taken: boolean };

function RouteComponent() {
	const [practitionerId, setPractitionerId] = useState("");
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [slots, setSlots] = useState<Array<Slot>>([]);
	const [error, setError] = useState<string | null>(null);

	async function load(e?: React.FormEvent) {
		e?.preventDefault();
		setError(null);
		try {
			setSlots(
				await api.appointments.computeSlots({
					branchId: "main",
					date,
					practitionerId,
				}),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Slot load failed");
		}
	}

	function exportCsv() {
		const blob = new Blob(
			[
				[
					"slotStart,taken",
					...slots.map((s) => `${s.slotStart},${s.taken}`),
				].join("\n"),
			],
			{ type: "text/csv" },
		);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `slots-${date}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={exportCsv} variant="outline">
								Export CSV
							</Button>
							<Button onClick={() => window.print()} variant="outline">
								Print
							</Button>
						</>
					}
					description="Day view of practitioner availability."
					title="Appointment calendar"
				/>
				<Card>
					<CardContent className="pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={load}>
							<Input
								className="max-w-56"
								onChange={(e) => setPractitionerId(e.target.value)}
								placeholder="Practitioner ID"
								required
								value={practitionerId}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setDate(e.target.value)}
								required
								type="date"
								value={date}
							/>
							<Button type="submit">Load slots</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="grid gap-2 text-sm sm:grid-cols-2">
							{slots.map((s) => (
								<li
									className="flex justify-between rounded border px-3 py-2"
									key={s.slotStart}
								>
									<span>{s.slotStart}</span>
									<span className="text-muted-foreground">
										{s.taken ? "Taken" : "Free"}
									</span>
								</li>
							))}
							{slots.length === 0 && !error ? (
								<li className="text-muted-foreground">
									Enter a practitioner and date to view slots.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
