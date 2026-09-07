import { cn } from "#/lib/utils";

interface TimeAxisProps {
	className?: string;
	slotHeightPx?: number;
	timeSlots: string[];
}

export function TimeAxis({
	className,
	slotHeightPx = 48,
	timeSlots,
}: TimeAxisProps) {
	return (
		<div className={cn("flex flex-col", className)} data-slot="time-axis">
			{timeSlots.map((time) => (
				<div
					className="flex items-start justify-end pr-2 text-[10px] text-muted-foreground"
					key={time}
					style={{ height: slotHeightPx }}
				>
					{time}
				</div>
			))}
		</div>
	);
}
