import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/appointments/calendar")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Slot = { slotStart: string; taken: boolean };

/** Calendar day view with reason-required reschedule surfacing (P1). */
function RouteComponent() {
	const [branchId] = useBranch();
	const [practitionerId, setPractitionerId] = useState("");
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [facilityId, setFacilityId] = useState("");
	const [serviceId, setServiceId] = useState("");
	const [durationMin, setDurationMin] = useState("");
	const [slots, setSlots] = useState<Array<Slot>>([]);
	const [error, setError] = useState<string | null>(null);
	const [rescheduleId, setRescheduleId] = useState("");
	const [rescheduleSlot, setRescheduleSlot] = useState("");
	const [rescheduleReason, setRescheduleReason] = useState("");
	const [notice, setNotice] = useState<string | null>(null);

	async function load(e?: React.FormEvent) {
		e?.preventDefault();
		setError(null);
		try {
			const duration = durationMin ? Number(durationMin) : undefined;
			setSlots(
				(await api.appointments.slots.list({
					branchId,
					date,
					...(facilityId ? { facilityId } : {}),
					practitionerId,
					...(serviceId ? { serviceId } : {}),
					...(duration && duration > 0 ? { durationMin: duration } : {}),
				})) as Array<Slot>,
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Slot load failed");
		}
	}

	async function reschedule(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		if (!rescheduleReason.trim()) {
			setError("A reschedule reason is required.");
			return;
		}
		try {
			await api.appointments.reschedule({
				id: rescheduleId,
				reason: rescheduleReason.trim(),
				slotStart: rescheduleSlot,
			});
			setNotice(`Rescheduled ${rescheduleId}.`);
			setRescheduleId("");
			setRescheduleSlot("");
			setRescheduleReason("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Reschedule failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button
								onClick={() =>
									exportRowsCsv(`slots-${date}.csv`, slots, [
										"slotStart",
										"taken",
									])
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description="Day view of practitioner availability."
					title="Appointment calendar"
				/>
				<BranchSelector />
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
							<Input
								className="max-w-40"
								onChange={(e) => setFacilityId(e.target.value)}
								placeholder="Facility (optional)"
								value={facilityId}
							/>
							<Input
								className="max-w-40"
								onChange={(e) => setServiceId(e.target.value)}
								placeholder="Service (optional)"
								value={serviceId}
							/>
							<Input
								className="max-w-32"
								min={1}
								onChange={(e) => setDurationMin(e.target.value)}
								placeholder="Min (opt)"
								type="number"
								value={durationMin}
							/>
							<Button type="submit">Load slots</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						{notice ? <p className="text-sm">{notice}</p> : null}
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
				<Card>
					<CardContent className="pt-6">
						<p className="mb-2 text-sm font-medium">
							Reschedule (reason required)
						</p>
						<form className="flex flex-wrap gap-2" onSubmit={reschedule}>
							<Input
								className="max-w-48"
								onChange={(e) => setRescheduleId(e.target.value)}
								placeholder="Appointment ID"
								required
								value={rescheduleId}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setRescheduleSlot(e.target.value)}
								placeholder="New slot (ISO)"
								required
								value={rescheduleSlot}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setRescheduleReason(e.target.value)}
								placeholder="Reason (required)"
								required
								value={rescheduleReason}
							/>
							<Button type="submit" variant="outline">
								Reschedule
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
