import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/radiology/book")({
	component: RouteComponent,
});

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [service, setService] = useState("");
	const [slot, setSlot] = useState("");
	const [result, setResult] = useState<string | null>(null);

	async function book() {
		try {
			const booking = await orpc.diagnostics.radioBook({
				branchId: "main",
				patientId,
				service,
				slot,
			});
			setResult(`Booked ${(booking as { id: string }).id} for ${slot}.`);
		} catch (error) {
			setResult(error instanceof Error ? error.message : "Booking failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Machine-day grid: one booking per service × slot; clashes need supervisor override."
					title="Radiology booking"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">Book slot</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Patient ID</Label>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Service (machine)</Label>
								<Input
									onChange={(e) => setService(e.target.value)}
									value={service}
								/>
							</div>
							<div className="space-y-1">
								<Label>Slot (YYYY-MM-DD HH:mm)</Label>
								<Input onChange={(e) => setSlot(e.target.value)} value={slot} />
							</div>
						</div>
						<Button onClick={() => void book()}>Book</Button>
						{result ? (
							<p className="text-sm text-muted-foreground">{result}</p>
						) : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
