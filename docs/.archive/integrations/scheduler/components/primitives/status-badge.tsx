import type { ReactNode } from "react";

import { cn } from "#/lib/utils";
import type { StatusWorkflow } from "../../types";

interface StatusBadgeProps {
	children?: ReactNode;
	className?: string;
	showLabel?: boolean;
	size?: "sm" | "md";
	status: string;
	workflow: StatusWorkflow;
}

export function StatusBadge({
	className,
	showLabel = true,
	size = "md",
	status,
	workflow,
}: StatusBadgeProps) {
	const meta = workflow.statuses.find((s) => s.key === status);
	if (!meta) return null;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full font-medium",
				size === "sm" && "px-2 py-0.5 text-xs",
				size === "md" && "px-2.5 py-1 text-xs",
				meta.color,
				"text-white",
				className,
			)}
			data-slot="status-badge"
		>
			<span
				className={cn(
					"rounded-full bg-white/30",
					size === "sm" && "size-1.5",
					size === "md" && "size-2",
				)}
			/>
			{showLabel && meta.label}
		</span>
	);
}

interface StatusDotProps {
	className?: string;
	status: string;
	workflow: StatusWorkflow;
}

export function StatusDot({ className, status, workflow }: StatusDotProps) {
	const meta = workflow.statuses.find((s) => s.key === status);
	if (!meta) return null;

	return (
		<span
			className={cn("inline-block size-2 rounded-full", meta.color, className)}
			data-slot="status-dot"
		/>
	);
}
