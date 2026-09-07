import { cn } from "#/lib/utils";
import type { Appointment, StatusWorkflow } from "../types";
import { StatusBadge } from "./primitives/status-badge";

interface AppointmentCardProps<TMeta = Record<string, unknown>> {
	appointment: Appointment<TMeta>;
	className?: string;
	onClick?: (appointment: Appointment<TMeta>) => void;
	renderMetadata?: (appointment: Appointment<TMeta>) => React.ReactNode;
	workflow: StatusWorkflow;
}

export function AppointmentCard<TMeta = Record<string, unknown>>({
	appointment,
	className,
	onClick,
	renderMetadata,
	workflow,
}: AppointmentCardProps<TMeta>) {
	return (
		<div
			className={cn(
				"flex flex-col gap-1 rounded-md border bg-card p-2 text-card-foreground transition-colors",
				onClick && "cursor-pointer hover:bg-accent",
				className,
			)}
			data-slot="appointment-card"
			onClick={() => onClick?.(appointment)}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<div className="flex items-center justify-between gap-2">
				<span className="truncate text-xs font-medium">
					{appointment.startTime} - {appointment.endTime}
				</span>
				<StatusBadge
					size="sm"
					status={appointment.status}
					workflow={workflow}
				/>
			</div>

			{appointment.participants.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{appointment.participants.map((p) => (
						<span
							className="rounded bg-muted px-1.5 py-0.5 text-[10px]"
							key={p.id}
						>
							{p.name}
						</span>
					))}
				</div>
			)}

			{appointment.priority && (
				<span className="text-[10px] text-muted-foreground capitalize">
					{appointment.priority}
				</span>
			)}

			{renderMetadata?.(appointment)}
		</div>
	);
}
