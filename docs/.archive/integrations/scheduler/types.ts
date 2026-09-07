import type * as v from "valibot";

// ─── Resource ────────────────────────────────────────────────────────────────

export interface Resource {
	id: string;
	isActive: boolean;
	metadata: Record<string, unknown>;
	name: string;
	type: string;
}

// ─── TimeSlot ────────────────────────────────────────────────────────────────

export interface TimeSlot {
	date: string;
	durationMinutes: number;
	endTime: string;
	resourceId: string;
	startTime: string;
}

// ─── Participant ─────────────────────────────────────────────────────────────

export interface Participant {
	id: string;
	name: string;
	role: string;
	status: "assigned" | "confirmed" | "declined" | "absent";
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export interface Appointment<TMeta = Record<string, unknown>> {
	createdAt: string;
	date: string;
	durationMinutes: number;
	endTime: string;
	id: string;
	metadata: TMeta;
	notes?: string;
	participants: Participant[];
	priority?: string;
	resourceId: string;
	resourceName?: string;
	startTime: string;
	status: string;
	updatedAt: string;
}

// ─── Status Workflow ─────────────────────────────────────────────────────────

export interface StatusMeta {
	color: string;
	icon?: string;
	key: string;
	label: string;
}

export interface StatusTransition {
	from: string | string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	guard?: (appointment: Appointment<any>) => boolean;
	label: string;
	to: string;
}

export interface StatusWorkflow {
	initial: string;
	statuses: StatusMeta[];
	transitions: StatusTransition[];
}

// ─── Engine Config ───────────────────────────────────────────────────────────

export interface ParticipantRole {
	key: string;
	label: string;
	maxCount?: number;
}

export interface PriorityOption {
	color: string;
	key: string;
	label: string;
}

export interface EngineConfig<TMeta = Record<string, unknown>> {
	appointmentLabel: string;
	conflictStrategy: "strict" | "allow_overlap" | "warn";
	dayEndTime: string;
	dayStartTime: string;
	daysAhead: number;
	metadataSchema?: v.BaseSchema<TMeta, TMeta, v.BaseIssue<unknown>>;
	participantRoles?: ParticipantRole[];
	plugins?: AppointmentPlugin<TMeta>[];
	priorityOptions?: PriorityOption[];
	resourceType: string;
	statusWorkflow: StatusWorkflow;
	timeSlotDuration: number;
}

// ─── Conflict ────────────────────────────────────────────────────────────────

export interface ConflictResult {
	conflictingAppointments: Appointment[];
	hasConflict: boolean;
	severity: "block" | "warn";
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

export interface AppointmentFilters {
	date?: string;
	endDate?: string;
	resourceId?: string;
	startDate?: string;
	status?: string;
}

export interface CreateAppointmentInput<TMeta = Record<string, unknown>> {
	date: string;
	durationMinutes: number;
	endTime: string;
	metadata: TMeta;
	notes?: string;
	participants?: Participant[];
	priority?: string;
	resourceId: string;
	startTime: string;
	status?: string;
}

export interface AppointmentAdapter<TMeta = Record<string, unknown>> {
	create(input: CreateAppointmentInput<TMeta>): Promise<Appointment<TMeta>>;
	get(id: string): Promise<Appointment<TMeta>>;
	list(filters: AppointmentFilters): Promise<Appointment<TMeta>[]>;
	remove(id: string): Promise<void>;
	update(
		id: string,
		input: Partial<Appointment<TMeta>>,
	): Promise<Appointment<TMeta>>;
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

export interface AppointmentPlugin<TMeta = Record<string, unknown>> {
	detailSections?: React.ComponentType<{ appointment: Appointment<TMeta> }>;
	formFields?: React.ComponentType<{ appointment: Appointment<TMeta> }>;
	name: string;
	onAfterCreate?: (appointment: Appointment<TMeta>) => Promise<void>;
	onBeforeCreate?: (input: CreateAppointmentInput<TMeta>) => Promise<void>;
	onStatusChange?: (
		appointment: Appointment<TMeta>,
		from: string,
		to: string,
	) => Promise<void>;
}

// ─── Grid Types ──────────────────────────────────────────────────────────────

export interface ScheduleGridData<TMeta = Record<string, unknown>> {
	days: string[];
	getResourceDay: (resourceId: string, date: string) => Appointment<TMeta>[];
	getSlot: (
		resourceId: string,
		date: string,
		time: string,
	) => Appointment<TMeta> | null;
	grid: Map<string, Map<string, Appointment<TMeta> | null>>;
	stats: ScheduleStats;
	timeSlots: string[];
	utilization: Map<string, number>;
}

export type ScheduleStats = Record<string, number> & { total: number };
