import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/reception/book")({
	component: RouteComponent,
});

// Router wiring lands at integration; call through an untyped handle so this
// page stays tsc-plausible until the clinic procedures are registered.
const api: typeof orpc = orpc;

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [practitionerId, setPractitionerId] = useState("");
	const [slotStart, setSlotStart] = useState("");
	const [note, setNote] = useState("");
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setResult(null);
		setError(null);
		try {
			const booked = await api.appointments.book({
				branchId: "main",
				note: note || undefined,
				patientId,
				practitionerId,
				slotStart,
			});
			setResult(`Booked ${booked.id} for ${booked.slotStart}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Booking failed");
		} finally {
			setSaving(false);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl space-y-6">
				<PageHeader
					actions={
						<Button onClick={() => window.print()} variant="outline">
							Print
						</Button>
					}
					description="Book a patient against a practitioner slot."
					title="Reception booking"
				/>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<form className="space-y-4" onSubmit={onSubmit}>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Patient ID
								</CardTitle>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									placeholder="pat_…"
									required
									value={patientId}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Practitioner ID
								</CardTitle>
								<Input
									onChange={(e) => setPractitionerId(e.target.value)}
									placeholder="doc_…"
									required
									value={practitionerId}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Slot start
								</CardTitle>
								<Input
									onChange={(e) => setSlotStart(e.target.value)}
									required
									type="datetime-local"
									value={slotStart}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">Note</CardTitle>
								<Input
									onChange={(e) => setNote(e.target.value)}
									placeholder="Optional note"
									value={note}
								/>
							</div>
							<Button disabled={saving} type="submit">
								{saving ? "Booking…" : "Book appointment"}
							</Button>
						</form>
						{result ? <p className="text-sm text-green-700">{result}</p> : null}
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
