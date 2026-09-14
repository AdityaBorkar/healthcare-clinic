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
	const [bookingId, setBookingId] = useState("");
	const [newSlot, setNewSlot] = useState("");
	const [reason, setReason] = useState("");
	const [reportPath, setReportPath] = useState("");
	const [impression, setImpression] = useState("");
	const [authorizer, setAuthorizer] = useState("");
	const [result, setResult] = useState<string | null>(null);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function book() {
		try {
			const booking = (await orpc.diagnostics.radiology.bookings.create({
				branchId: "main",
				patientId,
				service,
				slot,
			})) as { id: string };
			setBookingId(booking.id);
			setResult(`Booked ${booking.id} for ${slot}.`);
		} catch (error) {
			fail(error);
		}
	}

	async function checkin() {
		try {
			await orpc.diagnostics.radiology.bookings.checkin({
				bookingId,
				branchId: "main",
			});
			setResult("Patient checked in.");
		} catch (error) {
			fail(error);
		}
	}

	async function reschedule() {
		try {
			await orpc.diagnostics.radiology.bookings.reschedule({
				bookingId,
				branchId: "main",
				newSlot,
				reason: reason || undefined,
			});
			setResult(`Rescheduled to ${newSlot} (reason logged).`);
		} catch (error) {
			fail(error);
		}
	}

	async function attach() {
		try {
			await orpc.diagnostics.radiology.bookings.reportAttach({
				bookingId,
				branchId: "main",
				impression: impression || undefined,
				reportPath,
			});
			setResult("Image/report file attached.");
		} catch (error) {
			fail(error);
		}
	}

	async function authorizeRadio() {
		try {
			await orpc.diagnostics.radiology.bookings.authorize({
				authorizedBy: authorizer,
				bookingId,
				branchId: "main",
			});
			setResult("Radio report authorized.");
		} catch (error) {
			fail(error);
		}
	}

	async function cancelBooking() {
		try {
			await orpc.diagnostics.orders.cancel({
				bookingId,
				branchId: "main",
				cancelledBy: authorizer || "desk",
				reason: reason || "cancelled at desk with reason",
			});
			setResult("Booking cancelled with reason.");
		} catch (error) {
			fail(error);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Machine-day grid: one booking per service × slot; clashes need supervisor override."
					title="Radiology booking"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Book slot
							</CardTitle>
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
									<Input
										onChange={(e) => setSlot(e.target.value)}
										value={slot}
									/>
								</div>
							</div>
							<Button onClick={() => void book()}>Book</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Check-in / reschedule / cancel
							</CardTitle>
							<div className="space-y-1">
								<Label>Booking ID</Label>
								<Input
									onChange={(e) => setBookingId(e.target.value)}
									value={bookingId}
								/>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>New slot</Label>
									<Input
										onChange={(e) => setNewSlot(e.target.value)}
										value={newSlot}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reason</Label>
									<Input
										onChange={(e) => setReason(e.target.value)}
										value={reason}
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void checkin()} variant="outline">
									Check in
								</Button>
								<Button onClick={() => void reschedule()} variant="outline">
									Reschedule
								</Button>
								<Button onClick={() => void cancelBooking()} variant="outline">
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-xs lg:col-span-2">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Report attach + authorize
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="space-y-1">
									<Label>Report path (JPG/PDF)</Label>
									<Input
										onChange={(e) => setReportPath(e.target.value)}
										value={reportPath}
									/>
								</div>
								<div className="space-y-1">
									<Label>Impression</Label>
									<Input
										onChange={(e) => setImpression(e.target.value)}
										value={impression}
									/>
								</div>
								<div className="space-y-1">
									<Label>Authorized by</Label>
									<Input
										onChange={(e) => setAuthorizer(e.target.value)}
										value={authorizer}
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void attach()} variant="outline">
									Attach report
								</Button>
								<Button onClick={() => void authorizeRadio()}>Authorize</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
