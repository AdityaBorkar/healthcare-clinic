import { cn } from "#/lib/utils";
import type { StatusWorkflow } from "../types";

interface StatusTimelineProps {
	className?: string;
	currentStatus: string;
	workflow: StatusWorkflow;
}

export function StatusTimeline({
	className,
	currentStatus,
	workflow,
}: StatusTimelineProps) {
	const mainPath = getMainPath(workflow);
	const currentIdx = mainPath.findIndex((s) => s === currentStatus);
	const isOffPath = currentIdx === -1;

	return (
		<div
			className={cn("flex items-center gap-1", className)}
			data-slot="status-timeline"
		>
			{mainPath.map((statusKey, idx) => {
				const meta = workflow.statuses.find((s) => s.key === statusKey);
				if (!meta) return null;

				const isCurrent = statusKey === currentStatus;
				const isPast = idx < currentIdx;
				const isFuture = idx > currentIdx;

				return (
					<div className="flex items-center gap-1" key={statusKey}>
						<div
							className={cn(
								"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
								isCurrent && `${meta.color} text-white`,
								isPast && "bg-muted text-muted-foreground line-through",
								isFuture && "border border-dashed text-muted-foreground",
							)}
						>
							<span
								className={cn(
									"size-2 rounded-full",
									isCurrent
										? "bg-white/50"
										: isPast
											? "bg-muted-foreground/50"
											: "border border-current",
								)}
							/>
							{meta.label}
						</div>
						{idx < mainPath.length - 1 && (
							<div
								className={cn(
									"h-px w-4",
									isPast ? "bg-muted-foreground/30" : "border-t border-dashed",
								)}
							/>
						)}
					</div>
				);
			})}

			{isOffPath && (
				<div className="flex items-center gap-1">
					<div className="h-px w-4 border-t border-dashed" />
					<div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
						<span className="size-2 rounded-full border border-current" />
						{workflow.statuses.find((s) => s.key === currentStatus)?.label ??
							currentStatus}
					</div>
				</div>
			)}
		</div>
	);
}

function getMainPath(workflow: StatusWorkflow): string[] {
	// Walk transitions to find the primary linear path from initial
	const path: string[] = [workflow.initial];
	let current = workflow.initial;
	const visited = new Set<string>([current]);

	for (let i = 0; i < 10; i++) {
		const next = workflow.transitions.find(
			(t) =>
				(typeof t.from === "string"
					? t.from === current
					: t.from.includes(current)) && !visited.has(t.to),
		);
		if (!next) break;
		path.push(next.to);
		visited.add(next.to);
		current = next.to;
	}

	return path;
}
