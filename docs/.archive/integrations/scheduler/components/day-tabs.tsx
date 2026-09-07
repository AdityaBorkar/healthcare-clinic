import { cn } from "#/lib/utils";

interface DayTabsProps {
	className?: string;
	dayLabel: (d: string) => string;
	days: string[];
	onSelect: (date: string) => void;
	selectedDate: string;
}

export function DayTabs({
	className,
	dayLabel,
	days,
	onSelect,
	selectedDate,
}: DayTabsProps) {
	return (
		<div
			className={cn("flex gap-1 overflow-x-auto", className)}
			data-slot="day-tabs"
		>
			{days.map((d) => {
				const isSelected = d === selectedDate;
				const isToday = dayLabel(d) === "Today";
				return (
					<button
						className={cn(
							"flex flex-col items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
							isSelected
								? "bg-primary text-primary-foreground"
								: "hover:bg-muted text-muted-foreground",
							isToday && !isSelected && "ring-1 ring-primary/30",
						)}
						data-selected={isSelected || undefined}
						data-today={isToday || undefined}
						key={d}
						onClick={() => onSelect(d)}
						type="button"
					>
						<span className="text-[10px] uppercase">
							{dayLabel(d).split(" ")[0]}
						</span>
						<span className="text-sm">{dayLabel(d).split(" ")[1] ?? ""}</span>
					</button>
				);
			})}
		</div>
	);
}
