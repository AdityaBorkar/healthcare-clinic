import type { EngineConfig, PriorityOption, StatusWorkflow } from "./types";

export const OT_SURGERY_WORKFLOW: StatusWorkflow = {
	initial: "scheduled",
	statuses: [
		{
			color: "bg-amber-500",
			icon: "IconClock",
			key: "scheduled",
			label: "Scheduled",
		},
		{
			color: "bg-green-500",
			icon: "IconPlayerPlay",
			key: "ongoing",
			label: "Ongoing",
		},
		{
			color: "bg-gray-500",
			icon: "IconCheck",
			key: "completed",
			label: "Completed",
		},
		{
			color: "bg-red-500",
			icon: "IconX",
			key: "cancelled",
			label: "Cancelled",
		},
		{
			color: "bg-orange-500",
			icon: "IconClockPause",
			key: "delayed",
			label: "Delayed",
		},
	],
	transitions: [
		{ from: "scheduled", label: "Start Surgery", to: "ongoing" },
		{ from: "scheduled", label: "Cancel", to: "cancelled" },
		{ from: "scheduled", label: "Mark Delayed", to: "delayed" },
		{ from: "ongoing", label: "Complete", to: "completed" },
		{ from: "ongoing", label: "Abort", to: "cancelled" },
		{ from: "delayed", label: "Start Surgery", to: "ongoing" },
		{ from: "delayed", label: "Cancel", to: "cancelled" },
	],
};

export const RADIOLOGY_WORKFLOW: StatusWorkflow = {
	initial: "scheduled",
	statuses: [
		{ color: "bg-amber-500", key: "scheduled", label: "Scheduled" },
		{ color: "bg-blue-500", key: "checked-in", label: "Checked In" },
		{ color: "bg-green-500", key: "in-progress", label: "In Progress" },
		{ color: "bg-gray-500", key: "completed", label: "Completed" },
		{ color: "bg-red-500", key: "cancelled", label: "Cancelled" },
	],
	transitions: [
		{ from: "scheduled", label: "Check In", to: "checked-in" },
		{ from: "scheduled", label: "Cancel", to: "cancelled" },
		{ from: "checked-in", label: "Start", to: "in-progress" },
		{ from: "in-progress", label: "Complete", to: "completed" },
	],
};

export const GENERIC_WORKFLOW: StatusWorkflow = {
	initial: "pending",
	statuses: [
		{ color: "bg-amber-500", key: "pending", label: "Pending" },
		{ color: "bg-blue-500", key: "confirmed", label: "Confirmed" },
		{ color: "bg-green-500", key: "done", label: "Done" },
		{ color: "bg-red-500", key: "cancelled", label: "Cancelled" },
	],
	transitions: [
		{ from: "pending", label: "Confirm", to: "confirmed" },
		{ from: "pending", label: "Cancel", to: "cancelled" },
		{ from: "confirmed", label: "Complete", to: "done" },
		{ from: "confirmed", label: "Cancel", to: "cancelled" },
	],
};

export const DEFAULT_PRIORITY_OPTIONS: PriorityOption[] = [
	{ color: "bg-blue-100 text-blue-800", key: "routine", label: "Routine" },
	{ color: "bg-amber-100 text-amber-800", key: "urgent", label: "Urgent" },
	{ color: "bg-red-100 text-red-800", key: "emergency", label: "Emergency" },
];

export function createEngineConfig<TMeta = Record<string, unknown>>(
	overrides: Partial<EngineConfig<TMeta>> &
		Pick<EngineConfig<TMeta>, "resourceType">,
): EngineConfig<TMeta> {
	return {
		appointmentLabel: "Appointment",
		conflictStrategy: "strict",
		dayEndTime: "20:00",
		dayStartTime: "08:00",
		daysAhead: 4,
		priorityOptions: DEFAULT_PRIORITY_OPTIONS,
		statusWorkflow: GENERIC_WORKFLOW,
		timeSlotDuration: 30,
		...overrides,
	};
}
