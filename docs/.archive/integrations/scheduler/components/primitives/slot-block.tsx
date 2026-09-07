import type { ReactNode } from "react";

import { cn } from "#/lib/utils";
import type { Appointment, TimeSlot } from "../../types";

interface SlotBlockProps<TMeta = Record<string, unknown>> {
	appointment: Appointment<TMeta> | null;
	className?: string;
	heightPx?: number;
	onClick?: (slot: TimeSlot, appointment: Appointment<TMeta> | null) => void;
	renderAppointment?: (appointment: Appointment<TMeta>) => ReactNode;
	renderEmpty?: (slot: TimeSlot) => ReactNode;
	slot: TimeSlot;
}

export function SlotBlock<TMeta = Record<string, unknown>>({
	appointment,
	className,
	heightPx = 48,
	onClick,
	renderAppointment,
	renderEmpty,
	slot,
}: SlotBlockProps<TMeta>) {
	const handleClick = () => {
		onClick?.(slot, appointment);
	};

	if (appointment) {
		return (
			<button
				className={cn(
					"w-full overflow-hidden rounded-md border border-blue-200 bg-blue-50 text-left transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950",
					className,
				)}
				data-slot="slot-block-occupied"
				onClick={handleClick}
				style={{ minHeight: heightPx }}
				type="button"
			>
				{renderAppointment ? (
					renderAppointment(appointment)
				) : (
					<DefaultAppointmentContent appointment={appointment} />
				)}
			</button>
		);
	}

	return (
		<button
			className={cn(
				"w-full rounded-md border border-dashed border-transparent text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-700 dark:hover:bg-blue-950/30",
				className,
			)}
			data-slot="slot-block-empty"
			onClick={handleClick}
			style={{ minHeight: heightPx }}
			type="button"
		>
			{renderEmpty ? (
				renderEmpty(slot)
			) : (
				<span className="flex h-full items-center justify-center text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
					+
				</span>
			)}
		</button>
	);
}

function DefaultAppointmentContent<TMeta>({
	appointment,
}: {
	appointment: Appointment<TMeta>;
}) {
	return (
		<div className="flex h-full flex-col gap-0.5 p-1.5">
			<span className="truncate font-medium text-xs">
				{appointment.startTime} - {appointment.endTime}
			</span>
			{appointment.participants.length > 0 && (
				<span className="truncate text-[10px] text-muted-foreground">
					{appointment.participants
						.map((p: { name: string }) => p.name)
						.join(", ")}
				</span>
			)}
		</div>
	);
}
