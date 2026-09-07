import type { ReactNode } from "react";

import { cn } from "#/lib/utils";
import { useStatusTransitions } from "../hooks/use-status-transitions";
import type { Appointment, EngineConfig } from "../types";
import { ParticipantList } from "./primitives/participant-tag";
import { StatusBadge } from "./primitives/status-badge";
import { StatusTimeline } from "./status-timeline";

// ─── Root ────────────────────────────────────────────────────────────────────

interface AppointmentDialogProps<TMeta = Record<string, unknown>> {
	appointment: Appointment<TMeta>;
	children?: ReactNode;
	className?: string;
	config: EngineConfig<TMeta>;
	onClose: () => void;
	onStatusChange?: (from: string, to: string) => Promise<void>;
	open: boolean;
}

export function AppointmentDialog<TMeta = Record<string, unknown>>({
	appointment,
	children,
	className,
	config,
	onClose,
	onStatusChange,
	open,
}: AppointmentDialogProps<TMeta>) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 bg-black/20 backdrop-blur-xs"
				onClick={onClose}
			/>
			<div
				className={cn(
					"relative z-10 flex max-h-[80vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl bg-popover p-4 shadow-lg ring-1 ring-foreground/10",
					className,
				)}
				data-slot="appointment-dialog"
			>
				{children ?? (
					<>
						<AppointmentDialogHeader
							appointment={appointment}
							config={config}
							onClose={onClose}
						/>
						<AppointmentDialogStatusTimeline
							appointment={appointment}
							config={config}
						/>
						<AppointmentDialogDetails appointment={appointment} />
						<AppointmentDialogParticipants
							appointment={appointment}
							config={config}
						/>
						<AppointmentDialogActions
							appointment={appointment}
							config={config}
							onStatusChange={onStatusChange}
						/>
					</>
				)}
			</div>
		</div>
	);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface DialogSubComponentProps<TMeta = Record<string, unknown>> {
	appointment: Appointment<TMeta>;
	config: EngineConfig<TMeta>;
}

function AppointmentDialogHeader<TMeta>({
	appointment,
	config,
	onClose,
}: DialogSubComponentProps<TMeta> & { onClose: () => void }) {
	return (
		<div className="flex items-start justify-between" data-slot="dialog-header">
			<div className="flex flex-col gap-1">
				<h2 className="font-semibold text-base">
					{config.appointmentLabel} Details
				</h2>
				<div className="flex items-center gap-2">
					<StatusBadge
						status={appointment.status}
						workflow={config.statusWorkflow}
					/>
					<span className="text-muted-foreground text-xs">
						{appointment.date} {appointment.startTime} - {appointment.endTime}
					</span>
				</div>
			</div>
			<button
				className="rounded-md p-1 text-muted-foreground hover:text-foreground"
				onClick={onClose}
				type="button"
			>
				x
			</button>
		</div>
	);
}

function AppointmentDialogStatusTimeline<TMeta>({
	appointment,
	config,
}: DialogSubComponentProps<TMeta>) {
	return (
		<div data-slot="dialog-status-timeline">
			<StatusTimeline
				currentStatus={appointment.status}
				workflow={config.statusWorkflow}
			/>
		</div>
	);
}

function AppointmentDialogDetails<TMeta>({
	appointment,
}: {
	appointment: Appointment<TMeta>;
}) {
	return (
		<div className="grid grid-cols-2 gap-3 text-sm" data-slot="dialog-details">
			<DetailRow label="Resource" value={appointment.resourceId} />
			<DetailRow label="Date" value={appointment.date} />
			<DetailRow
				label="Time"
				value={`${appointment.startTime} - ${appointment.endTime}`}
			/>
			<DetailRow
				label="Duration"
				value={`${appointment.durationMinutes} min`}
			/>
			{appointment.priority && (
				<DetailRow label="Priority" value={appointment.priority} />
			)}
			<DetailRow label="ID" value={appointment.id.slice(0, 8)} />
		</div>
	);
}

function AppointmentDialogParticipants<TMeta>({
	appointment,
	config,
}: DialogSubComponentProps<TMeta>) {
	const roleLabels: Record<string, string> = {};
	for (const r of config.participantRoles ?? []) {
		roleLabels[r.key] = r.label;
	}

	return (
		<div data-slot="dialog-participants">
			<span className="mb-1.5 block font-medium text-xs">Participants</span>
			<ParticipantList
				participants={appointment.participants}
				roleLabels={roleLabels}
			/>
		</div>
	);
}

function AppointmentDialogActions<TMeta>({
	appointment,
	config,
	onStatusChange,
}: DialogSubComponentProps<TMeta> & {
	onStatusChange?: (from: string, to: string) => Promise<void>;
}) {
	const transitions = useStatusTransitions(config, appointment, onStatusChange);

	if (transitions.availableTransitions.length === 0) return null;

	return (
		<div
			className="flex flex-wrap gap-2 border-t pt-3"
			data-slot="dialog-actions"
		>
			{transitions.availableTransitions.map((t) => (
				<button
					className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
					disabled={transitions.isTransitioning}
					key={t.to}
					onClick={() => transitions.transitionTo(t.to)}
					type="button"
				>
					{t.label}
				</button>
			))}
		</div>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-[10px] text-muted-foreground">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}

// ─── Compound exports ────────────────────────────────────────────────────────

AppointmentDialog.Header = AppointmentDialogHeader;
AppointmentDialog.StatusTimeline = AppointmentDialogStatusTimeline;
AppointmentDialog.Details = AppointmentDialogDetails;
AppointmentDialog.Participants = AppointmentDialogParticipants;
AppointmentDialog.Actions = AppointmentDialogActions;
