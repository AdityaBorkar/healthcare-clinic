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
	RADIOLOGY_WORKFLOW,
	type Resource,
	ScheduleGrid,
	useAppointments,
	useScheduleGrid,
} from "#/scheduler";

interface RadiologyMeta {
	clinicalIndication: string;
	modality: string;
	patientMrn: string;
	patientType: "opd" | "ipd";
	referringPhysician: string;
	serviceId: string;
}

const RADIOLOGY_RESOURCES: Resource[] = [
	{
		id: "xray-1",
		isActive: true,
		metadata: {},
		name: "X-Ray Room 1",
		type: "radiology_room",
	},
	{
		id: "ct-1",
		isActive: true,
		metadata: {},
		name: "CT Scanner",
		type: "radiology_room",
	},
	{
		id: "mri-1",
		isActive: true,
		metadata: {},
		name: "MRI Scanner",
		type: "radiology_room",
	},
	{
		id: "us-1",
		isActive: true,
		metadata: {},
		name: "Ultrasound Room 1",
		type: "radiology_room",
	},
];

const radiologyConfig = createEngineConfig<RadiologyMeta>({
	appointmentLabel: "Study",
	conflictStrategy: "warn",
	dayEndTime: "20:00",
	dayStartTime: "08:00",
	daysAhead: 4,
	metadataSchema: v.object({
		clinicalIndication: v.string(),
		modality: v.string(),
		patientMrn: v.string(),
		patientType: v.picklist(["opd", "ipd"]),
		referringPhysician: v.string(),
		serviceId: v.string(),
	}),
	participantRoles: [
		{ key: "radiologist", label: "Radiologist", maxCount: 1 },
		{ key: "technician", label: "Technician", maxCount: 2 },
	],
	priorityOptions: [
		{ color: "bg-blue-100 text-blue-800", key: "routine", label: "Routine" },
		{ color: "bg-amber-100 text-amber-800", key: "urgent", label: "Urgent" },
		{ color: "bg-red-100 text-red-800", key: "stat", label: "STAT" },
	],
	resourceType: "radiology_room",
	statusWorkflow: RADIOLOGY_WORKFLOW,
	timeSlotDuration: 15,
});

export const Route = createFileRoute(
	"/(app)/$branchId/(hmis)/radiology/scheduling",
)({
	component: RadiologyScheduling,
	head: () => ({
		meta: [{ title: "Radiology Scheduling (Shaun)" }],
	}),
});

function RadiologyScheduling() {
	const [bookingOpen, setBookingOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment<RadiologyMeta> | null>(null);

	const adapter = useMemo(() => createRpcAdapter<RadiologyMeta>(), []);

	const { appointments, create, update } = useAppointments(radiologyConfig, {
		adapter,
		filters: {},
	});

	const grid = useScheduleGrid(
		radiologyConfig,
		appointments,
		RADIOLOGY_RESOURCES,
	);

	const handleCreate = useCallback(
		async (input: CreateAppointmentInput<RadiologyMeta>) => {
			await create({
				...input,
				resourceType: "radiology_room",
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
								New Study
							</Button>
						}
					/>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>New Radiology Study</DialogTitle>
						</DialogHeader>
						<BookingForm
							config={radiologyConfig}
							onSubmit={handleCreate}
							resources={RADIOLOGY_RESOURCES}
						>
							<div className="grid gap-4 sm:grid-cols-2">
								<BookingForm.ResourceSelect label="Room" />
								<BookingForm.PrioritySelect />
							</div>
							<BookingForm.DateTimePicker />
							<BookingForm.DurationSelect
								label="Duration"
								options={[15, 30, 45, 60, 90]}
							/>
							<BookingForm.ParticipantAssigner />
							<BookingForm.NotesField />
							<DialogFooter>
								<DialogClose
									render={<Button variant="outline">Cancel</Button>}
								/>
								<BookingForm.SubmitButton>
									Schedule Study
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
								No studies scheduled today
							</p>
						)}
						{todayQueue.map((apt) => {
							const resource = RADIOLOGY_RESOURCES.find(
								(r) => r.id === apt.resourceId,
							);
							const statusMeta = radiologyConfig.statusWorkflow.statuses.find(
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
											{apt.resourceName ?? resource?.name ?? apt.resourceId}
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
					config={radiologyConfig}
					grid={grid}
					onAppointmentClick={setSelectedAppointment}
					onSlotClick={() => setBookingOpen(true)}
					resources={RADIOLOGY_RESOURCES}
				/>
			</div>

			<AppointmentDialog
				appointment={selectedAppointment!}
				config={radiologyConfig}
				onClose={() => setSelectedAppointment(null)}
				onStatusChange={handleStatusChange}
				open={selectedAppointment !== null}
			/>
		</div>
	);
}
