// ─── Types ───────────────────────────────────────────────────────────────────

// ─── Adapter ─────────────────────────────────────────────────────────────────
export { createMockAdapter } from "./adapter";
// ─── Components ──────────────────────────────────────────────────────────────
export { AppointmentCard } from "./components/appointment-card";
export { AppointmentDialog } from "./components/appointment-dialog";
export { BookingForm } from "./components/booking-form";
export { DayTabs } from "./components/day-tabs";
// ─── Primitives ──────────────────────────────────────────────────────────────
export {
	ParticipantList,
	ParticipantTag,
} from "./components/primitives/participant-tag";
export { SlotBlock } from "./components/primitives/slot-block";
export { StatusBadge, StatusDot } from "./components/primitives/status-badge";
export { ResourceColumn } from "./components/resource-column";
export { ScheduleGrid } from "./components/schedule-grid";
export { ScheduleLegend } from "./components/schedule-legend";
export { StatusTimeline } from "./components/status-timeline";
export { TimeAxis } from "./components/time-axis";
// ─── Config ──────────────────────────────────────────────────────────────────
export {
	createEngineConfig,
	DEFAULT_PRIORITY_OPTIONS,
	GENERIC_WORKFLOW,
	OT_SURGERY_WORKFLOW,
	RADIOLOGY_WORKFLOW,
} from "./config";
export type { MultiResourceSlot } from "./conflict";
// ─── Conflict Detection ─────────────────────────────────────────────────────
export { checkConflict, checkMultiResourceConflict } from "./conflict";
// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useAppointments } from "./hooks/use-appointments";
export { useConflictCheck } from "./hooks/use-conflict-check";
export { useDayNavigation } from "./hooks/use-day-navigation";
export { useParticipants } from "./hooks/use-participants";
export { useScheduleGrid } from "./hooks/use-schedule-grid";
export { useStatusTransitions } from "./hooks/use-status-transitions";
// ─── State Machine ───────────────────────────────────────────────────────────
export {
	canTransition,
	getAvailableTransitions,
	getStatusMeta,
} from "./state-machine";
export type {
	AvailabilitySchedule,
	SlotGenerationConfig,
	UnavailabilityBlock,
} from "./time-slots";
// ─── Time Slots ──────────────────────────────────────────────────────────────
export {
	appointmentToSlot,
	buildScheduleGrid,
	buildSlotKey,
	computeStats,
	computeUtilization,
	generateAvailableSlots,
	generateDays,
	generateTimeSlots,
	slotFromTime,
} from "./time-slots";
export type {
	Appointment,
	AppointmentAdapter,
	AppointmentFilters,
	AppointmentPlugin,
	ConflictResult,
	CreateAppointmentInput,
	EngineConfig,
	Participant,
	ParticipantRole,
	PriorityOption,
	Resource,
	ScheduleGridData,
	ScheduleStats,
	StatusMeta,
	StatusTransition,
	StatusWorkflow,
	TimeSlot,
} from "./types";
// ─── Utils ───────────────────────────────────────────────────────────────────
export {
	addMinutes,
	formatDate,
	formatTime,
	getDayLabel,
	getDaysRange,
	getToday,
	minutesToTime,
	parseDate,
	parseTime,
	timeToMinutes,
} from "./utils/date";
export { countBy, groupBy, indexBy } from "./utils/group";
export { findOverlapping, intervalsOverlap } from "./utils/overlap";
