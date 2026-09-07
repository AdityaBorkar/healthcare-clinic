import { cn } from "#/lib/utils";
import type { Participant } from "../../types";

const STATUS_STYLES: Record<Participant["status"], string> = {
	absent: "bg-gray-100 text-gray-500 line-through",
	assigned: "bg-blue-50 text-blue-700 border-blue-200",
	confirmed: "bg-green-50 text-green-700 border-green-200",
	declined: "bg-red-50 text-red-600 border-red-200",
};

interface ParticipantTagProps {
	className?: string;
	onRemove?: (id: string) => void;
	onStatusChange?: (id: string, status: Participant["status"]) => void;
	participant: Participant;
	roleLabel?: string;
}

export function ParticipantTag({
	className,
	onRemove,
	onStatusChange: _onStatusChange,
	participant,
	roleLabel,
}: ParticipantTagProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
				STATUS_STYLES[participant.status],
				className,
			)}
			data-slot="participant-tag"
		>
			<span className="max-w-24 truncate">{participant.name}</span>
			{roleLabel && (
				<span className="text-[10px] opacity-70">({roleLabel})</span>
			)}
			{onRemove && (
				<button
					className="ml-1 opacity-50 hover:opacity-100"
					onClick={() => onRemove(participant.id)}
					type="button"
				>
					x
				</button>
			)}
		</span>
	);
}

interface ParticipantListProps {
	className?: string;
	onRemove?: (id: string) => void;
	onStatusChange?: (id: string, status: Participant["status"]) => void;
	participants: Participant[];
	roleLabels?: Record<string, string>;
}

export function ParticipantList({
	className,
	onRemove,
	onStatusChange,
	participants,
	roleLabels,
}: ParticipantListProps) {
	if (participants.length === 0) {
		return (
			<p
				className="text-muted-foreground text-xs"
				data-slot="participant-list-empty"
			>
				No participants assigned
			</p>
		);
	}

	return (
		<div
			className={cn("flex flex-wrap gap-1.5", className)}
			data-slot="participant-list"
		>
			{participants.map((p) => (
				<ParticipantTag
					key={p.id}
					onRemove={onRemove}
					onStatusChange={onStatusChange}
					participant={p}
					roleLabel={roleLabels?.[p.role]}
				/>
			))}
		</div>
	);
}
