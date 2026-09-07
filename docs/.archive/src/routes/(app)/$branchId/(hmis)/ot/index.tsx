import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useId, useMemo, useState } from "react";

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
import { Label } from "#/components/ui/label";
import { createRpcAdapter } from "#/lib/appointment-engine/rpc-adapter";
import {
	type Appointment,
	AppointmentDialog,
	BookingForm,
	type CreateAppointmentInput,
	createEngineConfig,
	type Resource,
	ScheduleGrid,
	useAppointments,
	useScheduleGrid,
} from "#/scheduler";

interface OTMeta {
	consentReceived: boolean;
	patientId: string;
	surgeryType: string;
}

const OT_RESOURCES: Resource[] = [
	{
		id: "ot-1",
		isActive: true,
		metadata: {},
		name: "OT 1 — Major",
		type: "operation_theatre",
	},
	{
		id: "ot-2",
		isActive: true,
		metadata: {},
		name: "OT 2 — Minor",
		type: "operation_theatre",
	},
	{
		id: "ot-3",
		isActive: true,
		metadata: {},
		name: "OT 3 — Day Care",
		type: "operation_theatre",
	},
];

const SURGERY_TYPES = [
	"General Surgery",
	"Orthopedic",
	"ENT",
	"Ophthalmology",
	"OBGYN",
	"Urology",
	"Neurosurgery",
	"Cardiothoracic",
];

const otConfig = createEngineConfig<OTMeta>({
	appointmentLabel: "Surgery",
	conflictStrategy: "strict",
	dayEndTime: "20:00",
	dayStartTime: "08:00",
	daysAhead: 4,
	participantRoles: [
		{ key: "head_doctor", label: "Head Doctor", maxCount: 1 },
		{ key: "anesthesiologist", label: "Anesthesiologist", maxCount: 1 },
		{ key: "scrub_nurse", label: "Scrub Nurse", maxCount: 2 },
		{ key: "assistant", label: "Assistant Surgeon", maxCount: 2 },
	],
	priorityOptions: [
		{ color: "bg-blue-100 text-blue-800", key: "routine", label: "Routine" },
		{ color: "bg-amber-100 text-amber-800", key: "urgent", label: "Urgent" },
		{ color: "bg-red-100 text-red-800", key: "emergency", label: "Emergency" },
	],
	resourceType: "operation_theatre",
	timeSlotDuration: 30,
});

export const Route = createFileRoute("/(app)/$branchId/(hmis)/ot/")({
	component: OTSchedulePage,
	head: () => ({
		meta: [{ title: "OT Schedule (Shaun)" }],
	}),
});

function OTSchedulePage() {
	const [bookingOpen, setBookingOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment<OTMeta> | null>(null);

	const adapter = useMemo(() => createRpcAdapter<OTMeta>(), []);

	const { appointments, create, update } = useAppointments(otConfig, {
		adapter,
		filters: { resourceId: undefined },
	});

	const grid = useScheduleGrid(otConfig, appointments, OT_RESOURCES);

	const handleCreate = useCallback(
		async (input: CreateAppointmentInput<OTMeta>) => {
			await create({
				...input,
				resourceType: "operation_theatre",
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
								Schedule Surgery
							</Button>
						}
					/>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>New Surgery Booking</DialogTitle>
						</DialogHeader>
						<BookingForm
							config={otConfig}
							onSubmit={handleCreate}
							resources={OT_RESOURCES}
						>
							<div className="grid gap-4 sm:grid-cols-2">
								<BookingForm.ResourceSelect label="Operation Theatre" />
								<BookingForm.PrioritySelect />
							</div>
							<BookingForm.DateTimePicker />
							<div className="grid gap-4 sm:grid-cols-2">
								<BookingForm.DurationSelect
									label="Duration"
									options={[30, 45, 60, 90, 120, 180]}
								/>
								<SurgeryTypeSelect />
							</div>
							<BookingForm.ParticipantAssigner />
							<BookingForm.NotesField />
							<DialogFooter>
								<DialogClose
									render={<Button variant="outline">Cancel</Button>}
								/>
								<BookingForm.SubmitButton>
									Schedule Surgery
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
								No surgeries scheduled today
							</p>
						)}
						{todayQueue.map((apt) => {
							const resource = OT_RESOURCES.find(
								(r) => r.id === apt.resourceId,
							);
							const statusMeta = otConfig.statusWorkflow.statuses.find(
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
											{apt.metadata.surgeryType}
										</span>
										<span
											className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium text-[10px] text-white ${statusMeta?.color ?? "bg-gray-500"}`}
										>
											{statusMeta?.label ?? apt.status}
										</span>
									</div>
									<div className="mt-0.5 text-[10px] text-muted-foreground">
										{apt.startTime}–{apt.endTime} · {resource?.name}
									</div>
									{apt.participants.length > 0 && (
										<div className="mt-1 truncate text-[10px] text-muted-foreground">
											{apt.participants.map((p) => p.name).join(", ")}
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
					config={otConfig}
					grid={grid}
					onAppointmentClick={setSelectedAppointment}
					onSlotClick={() => setBookingOpen(true)}
					resources={OT_RESOURCES}
				/>
			</div>

			<AppointmentDialog
				appointment={selectedAppointment!}
				config={otConfig}
				onClose={() => setSelectedAppointment(null)}
				onStatusChange={handleStatusChange}
				open={selectedAppointment !== null}
			/>
		</div>
	);
}

function SurgeryTypeSelect() {
	const id = useId();
	return (
		<div className="flex flex-col gap-1.5">
			<Label className="font-medium text-xs" htmlFor={id}>
				Surgery Type <span className="ml-0.5 text-destructive">*</span>
			</Label>
			<select
				className="h-8 rounded-md border bg-transparent px-2 text-sm"
				id={id}
			>
				<option value="">Select type...</option>
				{SURGERY_TYPES.map((t) => (
					<option key={t} value={t}>
						{t}
					</option>
				))}
			</select>
		</div>
	);
}
