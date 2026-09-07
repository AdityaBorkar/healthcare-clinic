import { createContext, type ReactNode, useContext, useState } from "react";

import { cn } from "#/lib/utils";
import { generateTimeSlots } from "../time-slots";
import type {
	CreateAppointmentInput,
	EngineConfig,
	Participant,
	Resource,
	TimeSlot,
} from "../types";
import { addMinutes } from "../utils/date";

// ─── Context ─────────────────────────────────────────────────────────────────

interface BookingFormContextValue {
	config: EngineConfig<any>;
	formData: BookingFormData;
	isValid: boolean;
	resources: Resource[];
	updateForm: (patch: Partial<BookingFormData>) => void;
}

interface BookingFormData {
	date: string;
	durationMinutes: number;
	endTime: string;
	metadata: Record<string, unknown>;
	notes: string;
	participants: Participant[];
	priority: string;
	resourceId: string;
	startTime: string;
}

const BookingFormContext = createContext<BookingFormContextValue | null>(null);

function useBookingFormContext() {
	const ctx = useContext(BookingFormContext);
	if (!ctx)
		throw new Error(
			"BookingForm compound components must be used within BookingForm",
		);
	return ctx;
}

// ─── Root ────────────────────────────────────────────────────────────────────

interface BookingFormProps<TMeta = Record<string, unknown>> {
	children: ReactNode;
	className?: string;
	config: EngineConfig<TMeta>;
	initialSlot?: TimeSlot;
	onSubmit: (input: CreateAppointmentInput<TMeta>) => Promise<void>;
	resources: Resource[];
}

export function BookingForm<TMeta = Record<string, unknown>>({
	children,
	className,
	config,
	initialSlot,
	onSubmit,
	resources,
}: BookingFormProps<TMeta>) {
	const [formData, setFormData] = useState<BookingFormData>({
		date: initialSlot?.date ?? "",
		durationMinutes: initialSlot?.durationMinutes ?? config.timeSlotDuration,
		endTime: initialSlot?.endTime ?? "",
		metadata: {},
		notes: "",
		participants: [],
		priority: config.priorityOptions?.[0]?.key ?? "",
		resourceId: initialSlot?.resourceId ?? "",
		startTime: initialSlot?.startTime ?? "",
	});

	const updateForm = (patch: Partial<BookingFormData>) => {
		setFormData((prev) => {
			const next = { ...prev, ...patch };
			if (patch.startTime || patch.durationMinutes) {
				next.endTime = addMinutes(next.startTime, next.durationMinutes);
			}
			return next;
		});
	};

	const isValid = Boolean(
		formData.resourceId &&
			formData.date &&
			formData.startTime &&
			formData.endTime,
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValid) return;

		await onSubmit({
			date: formData.date,
			durationMinutes: formData.durationMinutes,
			endTime: formData.endTime,
			metadata: formData.metadata as TMeta,
			participants: formData.participants,
			priority: formData.priority,
			resourceId: formData.resourceId,
			startTime: formData.startTime,
		});
	};

	return (
		<BookingFormContext.Provider
			value={{ config, formData, isValid, resources, updateForm }}
		>
			<form
				className={cn("flex flex-col gap-4", className)}
				data-slot="booking-form"
				onSubmit={handleSubmit}
			>
				{children}
			</form>
		</BookingFormContext.Provider>
	);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface FieldWrapperProps {
	children: ReactNode;
	className?: string;
	label: string;
	required?: boolean;
}

function FieldWrapper({
	children,
	className,
	label,
	required,
}: FieldWrapperProps) {
	return (
		<div
			className={cn("flex flex-col gap-1.5", className)}
			data-slot="field-wrapper"
		>
			<label className="font-medium text-xs">
				{label}
				{required && <span className="ml-0.5 text-destructive">*</span>}
			</label>
			{children}
		</div>
	);
}

interface ResourceSelectProps {
	className?: string;
	label?: string;
}

function ResourceSelect({
	className,
	label = "Resource",
}: ResourceSelectProps) {
	const { formData, resources, updateForm } = useBookingFormContext();
	return (
		<FieldWrapper className={className} label={label} required>
			<select
				className="h-8 rounded-md border bg-transparent px-2 text-sm"
				onChange={(e) => updateForm({ resourceId: e.target.value })}
				value={formData.resourceId}
			>
				<option value="">Select...</option>
				{resources.map((r) => (
					<option key={r.id} value={r.id}>
						{r.name}
					</option>
				))}
			</select>
		</FieldWrapper>
	);
}

interface DateTimePickerProps {
	className?: string;
	label?: string;
}

function DateTimePicker({
	className,
	label = "Date & Time",
}: DateTimePickerProps) {
	const { config, formData, updateForm } = useBookingFormContext();

	const timeSlots = generateTimeSlots(
		config.dayStartTime,
		config.dayEndTime,
		config.timeSlotDuration,
	);

	return (
		<FieldWrapper className={className} label={label} required>
			<div className="flex gap-2">
				<input
					className="h-8 flex-1 rounded-md border bg-transparent px-2 text-sm"
					onChange={(e) => updateForm({ date: e.target.value })}
					type="date"
					value={formData.date}
				/>
				<select
					className="h-8 flex-1 rounded-md border bg-transparent px-2 text-sm"
					onChange={(e) => updateForm({ startTime: e.target.value })}
					value={formData.startTime}
				>
					<option value="">Start...</option>
					{timeSlots.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</div>
		</FieldWrapper>
	);
}

interface DurationSelectProps {
	className?: string;
	label?: string;
	options?: number[];
}

function DurationSelect({
	className,
	label = "Duration",
	options = [15, 30, 45, 60, 90, 120],
}: DurationSelectProps) {
	const { formData, updateForm } = useBookingFormContext();
	return (
		<FieldWrapper className={className} label={label}>
			<select
				className="h-8 rounded-md border bg-transparent px-2 text-sm"
				onChange={(e) =>
					updateForm({ durationMinutes: Number(e.target.value) })
				}
				value={formData.durationMinutes}
			>
				{options.map((d) => (
					<option key={d} value={d}>
						{d} min
					</option>
				))}
			</select>
		</FieldWrapper>
	);
}

interface PrioritySelectProps {
	className?: string;
}

function PrioritySelect({ className }: PrioritySelectProps) {
	const { config, formData, updateForm } = useBookingFormContext();
	if (!config.priorityOptions?.length) return null;

	return (
		<FieldWrapper className={className} label="Priority">
			<div className="flex gap-2">
				{config.priorityOptions.map((p) => (
					<button
						className={cn(
							"rounded-md px-3 py-1 text-xs font-medium transition-colors",
							p.color,
							formData.priority === p.key
								? "ring-2 ring-primary ring-offset-1"
								: "opacity-60 hover:opacity-100",
						)}
						key={p.key}
						onClick={() => updateForm({ priority: p.key })}
						type="button"
					>
						{p.label}
					</button>
				))}
			</div>
		</FieldWrapper>
	);
}

interface NotesFieldProps {
	className?: string;
	label?: string;
}

function NotesField({ className, label = "Notes" }: NotesFieldProps) {
	const { formData, updateForm } = useBookingFormContext();
	return (
		<FieldWrapper className={className} label={label}>
			<textarea
				className="min-h-20 rounded-md border bg-transparent px-2 py-1.5 text-sm"
				onChange={(e) => updateForm({ notes: e.target.value })}
				placeholder="Additional notes..."
				value={formData.notes}
			/>
		</FieldWrapper>
	);
}

interface ParticipantAssignerProps {
	className?: string;
}

function ParticipantAssigner({ className }: ParticipantAssignerProps) {
	const { config, formData, updateForm } = useBookingFormContext();
	const roles = config.participantRoles ?? [];
	if (roles.length === 0) return null;

	const addParticipant = (role: string, name: string) => {
		if (!name.trim()) return;
		const p: Participant = {
			id: crypto.randomUUID(),
			name: name.trim(),
			role,
			status: "assigned",
		};
		updateForm({ participants: [...formData.participants, p] });
	};

	const removeParticipant = (id: string) => {
		updateForm({
			participants: formData.participants.filter((p) => p.id !== id),
		});
	};

	return (
		<div
			className={cn("flex flex-col gap-2", className)}
			data-slot="participant-assigner"
		>
			<span className="font-medium text-xs">Participants</span>
			{roles.map((role) => {
				const assigned = formData.participants.filter(
					(p) => p.role === role.key,
				);
				const atMax = role.maxCount ? assigned.length >= role.maxCount : false;
				return (
					<div className="flex flex-col gap-1" key={role.key}>
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">
								{role.label}
							</span>
							{role.maxCount && (
								<span className="text-[10px] text-muted-foreground">
									{assigned.length}/{role.maxCount}
								</span>
							)}
						</div>
						<div className="flex flex-wrap gap-1">
							{assigned.map((p) => (
								<span
									className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-0.5 text-xs"
									key={p.id}
								>
									{p.name}
									<button
										className="text-muted-foreground hover:text-foreground"
										onClick={() => removeParticipant(p.id)}
										type="button"
									>
										x
									</button>
								</span>
							))}
							{!atMax && (
								<InlineAddInput
									label={role.label}
									onAdd={(name) => addParticipant(role.key, name)}
								/>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

function InlineAddInput({
	label,
	onAdd,
}: {
	label: string;
	onAdd: (name: string) => void;
}) {
	const [value, setValue] = useState("");
	const [editing, setEditing] = useState(false);

	if (!editing) {
		return (
			<button
				className="rounded-md border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:border-solid hover:text-foreground"
				onClick={() => setEditing(true)}
				type="button"
			>
				+ Add
			</button>
		);
	}

	return (
		<form
			className="inline-flex items-center gap-1"
			onSubmit={(e) => {
				e.preventDefault();
				onAdd(value);
				setValue("");
				setEditing(false);
			}}
		>
			<input
				autoFocus
				className="h-6 w-24 rounded border bg-transparent px-1.5 text-xs"
				onBlur={() => setEditing(false)}
				onChange={(e) => setValue(e.target.value)}
				placeholder={label}
				value={value}
			/>
			<button
				className="h-6 rounded bg-primary px-1.5 text-[10px] text-primary-foreground"
				type="submit"
			>
				+
			</button>
		</form>
	);
}

interface SubmitButtonProps {
	children?: ReactNode;
	className?: string;
}

function SubmitButton({ children = "Book", className }: SubmitButtonProps) {
	const { isValid } = useBookingFormContext();
	return (
		<button
			className={cn(
				"h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			disabled={!isValid}
			type="submit"
		>
			{children}
		</button>
	);
}

// ─── Compound exports ────────────────────────────────────────────────────────

BookingForm.ResourceSelect = ResourceSelect;
BookingForm.DateTimePicker = DateTimePicker;
BookingForm.DurationSelect = DurationSelect;
BookingForm.PrioritySelect = PrioritySelect;
BookingForm.NotesField = NotesField;
BookingForm.ParticipantAssigner = ParticipantAssigner;
BookingForm.SubmitButton = SubmitButton;
