import type { ReactNode } from "react";

import { cn } from "#/lib/utils";
import type { Appointment, Resource, TimeSlot } from "../types";
import { addMinutes } from "../utils/date";
import { SlotBlock } from "./primitives/slot-block";

interface ResourceColumnProps<TMeta = Record<string, unknown>> {
	className?: string;
	date: string;
	getAppointments: (time: string) => Appointment<TMeta> | null;
	onSlotClick?: (
		slot: TimeSlot,
		appointment: Appointment<TMeta> | null,
	) => void;
	renderAppointment?: (appointment: Appointment<TMeta>) => ReactNode;
	renderEmpty?: (slot: TimeSlot) => ReactNode;
	resource: Resource;
	showHeader?: boolean;
	slotDurationMinutes: number;
	slotHeightPx?: number;
	timeSlots: string[];
}

export function ResourceColumn<TMeta = Record<string, unknown>>({
	className,
	date,
	getAppointments,
	onSlotClick,
	renderAppointment,
	renderEmpty,
	resource,
	showHeader = true,
	slotDurationMinutes,
	slotHeightPx = 48,
	timeSlots,
}: ResourceColumnProps<TMeta>) {
	return (
		<div
			className={cn("flex min-w-36 flex-col", className)}
			data-slot="resource-column"
		>
			{showHeader && (
				<div className="sticky top-0 z-10 border-b bg-background/80 px-2 py-1.5 backdrop-blur-sm">
					<span className="truncate text-xs font-medium">{resource.name}</span>
					<span className="ml-1 text-[10px] text-muted-foreground">
						({resource.type})
					</span>
				</div>
			)}
			<div className="flex flex-col">
				{timeSlots.map((time) => {
					const appointment = getAppointments(time);
					const slot: TimeSlot = {
						date,
						durationMinutes: slotDurationMinutes,
						endTime: addMinutes(time, slotDurationMinutes),
						resourceId: resource.id,
						startTime: time,
					};
					return (
						<SlotBlock<TMeta>
							appointment={appointment}
							className="group"
							heightPx={slotHeightPx}
							key={time}
							onClick={onSlotClick}
							renderAppointment={renderAppointment}
							renderEmpty={renderEmpty}
							slot={slot}
						/>
					);
				})}
			</div>
		</div>
	);
}
