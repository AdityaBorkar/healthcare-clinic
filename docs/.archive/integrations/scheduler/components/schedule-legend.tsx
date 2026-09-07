import { cn } from "#/lib/utils";
import type { ScheduleStats, StatusWorkflow } from "../types";

interface ScheduleLegendProps {
	className?: string;
	stats?: ScheduleStats;
	workflow: StatusWorkflow;
}

export function ScheduleLegend({
	className,
	stats,
	workflow,
}: ScheduleLegendProps) {
	return (
		<div
			className={cn("flex flex-wrap items-center gap-3", className)}
			data-slot="schedule-legend"
		>
			{workflow.statuses.map((s) => (
				<div className="flex items-center gap-1.5 text-xs" key={s.key}>
					<span className={cn("inline-block size-2.5 rounded-full", s.color)} />
					<span className="text-muted-foreground">{s.label}</span>
					{stats && <span className="font-medium">{stats[s.key] ?? 0}</span>}
				</div>
			))}
		</div>
	);
}
