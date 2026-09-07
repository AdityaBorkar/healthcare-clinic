import type { ReactNode } from "react";

import { cn } from "#/lib/utils";
import { useDayNavigation } from "../hooks/use-day-navigation";
import type {
	Appointment,
	EngineConfig,
	Resource,
	ScheduleGridData,
	TimeSlot,
} from "../types";
import { DayTabs } from "./day-tabs";
import { ResourceColumn } from "./resource-column";
import { ScheduleLegend } from "./schedule-legend";
import { TimeAxis } from "./time-axis";

interface ScheduleGridProps<TMeta = Record<string, unknown>> {
	className?: string;
	config: EngineConfig<TMeta>;
	grid: ScheduleGridData<TMeta>;
	onAppointmentClick?: (appointment: Appointment<TMeta>) => void;
	onDateChange?: (date: string) => void;
	onSlotClick?: (
		slot: TimeSlot,
		appointment: Appointment<TMeta> | null,
	) => void;
	renderAppointment?: (appointment: Appointment<TMeta>) => ReactNode;
	renderEmptySlot?: (slot: TimeSlot) => ReactNode;
	resources: Resource[];
	selectedDate?: string;
	slotHeightPx?: number;
}

export function ScheduleGrid<TMeta = Record<string, unknown>>({
	className,
	config,
	grid,
	onAppointmentClick,
	onDateChange,
	onSlotClick,
	renderAppointment,
	renderEmptySlot,
	resources,
	selectedDate: controlledDate,
	slotHeightPx = 48,
}: ScheduleGridProps<TMeta>) {
	const navigation = useDayNavigation(config);
	const activeDate = controlledDate ?? navigation.selectedDate;

	const handleDateChange = (date: string) => {
		onDateChange?.(date);
		navigation.setSelectedDate(date);
	};

	const handleSlotClick = (
		slot: TimeSlot,
		appointment: Appointment<TMeta> | null,
	) => {
		if (appointment) {
			onAppointmentClick?.(appointment);
		} else {
			onSlotClick?.(slot, appointment);
		}
	};

	return (
		<div
			className={cn("flex flex-col gap-3", className)}
			data-slot="schedule-grid"
		>
			<div className="flex items-center justify-between gap-4">
				<DayTabs
					dayLabel={navigation.dayLabel}
					days={navigation.dayStrings}
					onSelect={handleDateChange}
					selectedDate={activeDate}
				/>
				<ScheduleLegend stats={grid.stats} workflow={config.statusWorkflow} />
			</div>

			<div className="overflow-x-auto rounded-lg border">
				<div className="flex">
					<TimeAxis
						className="sticky left-0 z-20 border-r bg-background"
						slotHeightPx={slotHeightPx}
						timeSlots={grid.timeSlots}
					/>
					{resources.map((resource) => (
						<ResourceColumn<TMeta>
							className="flex-1 border-r last:border-r-0"
							date={activeDate}
							getAppointments={(time) =>
								grid.getSlot(resource.id, activeDate, time)
							}
							key={resource.id}
							onSlotClick={handleSlotClick}
							renderAppointment={renderAppointment}
							renderEmpty={renderEmptySlot}
							resource={resource}
							slotDurationMinutes={config.timeSlotDuration}
							slotHeightPx={slotHeightPx}
							timeSlots={grid.timeSlots}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
