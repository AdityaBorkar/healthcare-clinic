import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import * as v from "valibot";

import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { createRpcAdapter } from "#/lib/appointment-engine/rpc-adapter";
import {
	type Appointment,
	AppointmentDialog,
	BookingForm,
	type CreateAppointmentInput,
	createEngineConfig,
	GENERIC_WORKFLOW,
	type Resource,
	ScheduleGrid,
	useAppointments,
	useScheduleGrid,
} from "#/scheduler";

interface OPDMeta {
	chiefComplaint: string;
	patientId: number;
}

const OPD_RESOURCES: Resource[] = [
	{
		id: "doc-1",
		isActive: true,
		metadata: {},
		name: "Dr. Sharma",
		type: "practitioner",
	},
	{
		id: "doc-2",
		isActive: true,
		metadata: {},
		name: "Dr. Patel",
		type: "practitioner",
	},
	{
		id: "doc-3",
		isActive: true,
		metadata: {},
		name: "Dr. Gupta",
		type: "practitioner",
	},
];

const opdConfig = createEngineConfig<OPDMeta>({
	appointmentLabel: "Appointment",
	conflictStrategy: "strict",
	dayEndTime: "17:00",
	dayStartTime: "09:00",
	daysAhead: 7,
	metadataSchema: v.object({
		chiefComplaint: v.string(),
		patientId: v.number(),
	}),
	participantRoles: [{ key: "patient", label: "Patient", maxCount: 1 }],
	resourceType: "practitioner",
	statusWorkflow: GENERIC_WORKFLOW,
	timeSlotDuration: 15,
});

export const Route = createFileRoute("/(app)/$branchId/(pm)/appointments")({
	component: OPDAppointmentsPage,
	head: () => ({
		meta: [{ title: "Appointments (Shaun)" }],
	}),
});

function OPDAppointmentsPage() {
	const [bookingOpen, setBookingOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment<OPDMeta> | null>(null);

	const adapter = useMemo(() => createRpcAdapter<OPDMeta>(), []);

	const { appointments, create, update } = useAppointments(opdConfig, {
		adapter,
		filters: {},
	});

	const grid = useScheduleGrid(opdConfig, appointments, OPD_RESOURCES);

	const handleCreate = useCallback(
		async (input: CreateAppointmentInput<OPDMeta>) => {
			await create({
				...input,
				resourceType: "practitioner",
			} as Parameters<typeof create>[0]);
			setBookingOpen(false);
		},
		[create],
	);

	const handleStatusChange = useCallback(
		async (_from: string, to: string) => {
			if (!selectedAppointment) return;
			await update({ id: selectedAppointment.id, input: { status: to } });
			setSelectedAppointment(null);
		},
		[selectedAppointment, update],
	);

	const todayQueue = useMemo(
		() =>
			appointments
				.filter((a) => {
					const today = new Date().toISOString().split("T")[0];
					return a.date === today;
				})
				.sort((a, b) => a.startTime.localeCompare(b.startTime)),
		[appointments],
	);

	return (
		<div className="flex h-full">
			<div className="w-64 shrink-0 space-y-4 border-r bg-muted/30 p-4">
				<Dialog onOpenChange={setBookingOpen} open={bookingOpen}>
					<DialogTrigger
						render={
							<Button className="w-full gap-2">
								<IconPlus className="size-4" />
								New Appointment
							</Button>
						}
					/>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>New OPD Appointment</DialogTitle>
						</DialogHeader>
						<BookingForm
							config={opdConfig}
							onSubmit={handleCreate}
							resources={OPD_RESOURCES}
						>
							<div className="grid gap-4 sm:grid-cols-2">
								<BookingForm.ResourceSelect label="Practitioner" />
								<BookingForm.PrioritySelect />
							</div>
							<BookingForm.DateTimePicker />
							<BookingForm.DurationSelect
								label="Duration"
								options={[15, 30, 45, 60]}
							/>
							<BookingForm.ParticipantAssigner />
							<BookingForm.NotesField />
							<DialogFooter>
								<DialogClose
									render={<Button variant="outline">Cancel</Button>}
								/>
								<BookingForm.SubmitButton>
									Book Appointment
								</BookingForm.SubmitButton>
							</DialogFooter>
						</BookingForm>
					</DialogContent>
				</Dialog>

				<div className="border-t pt-4">
					<h3 className="mb-3 font-medium text-sm">Today's Queue</h3>
					<div className="max-h-[calc(100vh-250px)] space-y-1.5 overflow-y-auto">
						{todayQueue.length === 0 && (
							<p className="text-muted-foreground text-xs">
								No appointments scheduled today
							</p>
						)}
						{todayQueue.map((apt) => {
							const resource = OPD_RESOURCES.find(
								(r) => r.id === apt.resourceId,
							);
							const statusMeta = opdConfig.statusWorkflow.statuses.find(
								(s) => s.key === apt.status,
							);
							return (
								<button
									className="w-full rounded-lg border p-2 text-left transition-colors hover:bg-accent"
									key={apt.id}
									onClick={() => setSelectedAppointment(apt)}
									type="button"
								>
									<div className="flex items-center justify-between">
										<span className="truncate font-medium text-xs">
											{resource?.name ?? apt.resourceId}
										</span>
										<span
											className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium text-[10px] text-white ${statusMeta?.color ?? "bg-gray-500"}`}
										>
											{statusMeta?.label ?? apt.status}
										</span>
									</div>
									<div className="mt-0.5 text-[10px] text-muted-foreground">
										{apt.startTime}–{apt.endTime}
									</div>
									{apt.notes && (
										<div className="mt-1 truncate text-[10px] text-muted-foreground">
											{apt.notes}
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="flex flex-1 flex-col overflow-hidden">
				<ScheduleGrid
					config={opdConfig}
					grid={grid}
					onAppointmentClick={setSelectedAppointment}
					onSlotClick={() => setBookingOpen(true)}
					resources={OPD_RESOURCES}
				/>
			</div>

			<AppointmentDialog
				appointment={selectedAppointment!}
				config={opdConfig}
				onClose={() => setSelectedAppointment(null)}
				onStatusChange={handleStatusChange}
				open={selectedAppointment !== null}
			/>
		</div>
	);
}
