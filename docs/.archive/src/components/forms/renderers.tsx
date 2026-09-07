import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { FieldRendererProps } from "#/forms";

function FieldShell({
	label,
	error,
	description,
	children,
	required,
}: {
	label?: string;
	error?: string;
	description?: string;
	children: React.ReactNode;
	required?: boolean;
}) {
	return (
		<div className="space-y-2">
			{label ? (
				<Label>
					{label}
					{required ? " *" : null}
				</Label>
			) : null}
			{children}
			{error ? (
				<p className="text-destructive text-xs">{error}</p>
			) : description && !error ? (
				<p className="text-muted-foreground text-xs">{description}</p>
			) : null}
		</div>
	);
}

function StringFieldRenderer({
	def,
	disabled,
	error,
	name,
}: FieldRendererProps) {
	if (def.kind !== "string") return null;
	const inputType = def.meta?.input_type;
	const label = def.meta?.label ?? name;

	if (inputType === "textarea") {
		return (
			<FieldShell
				description={def.meta?.description}
				error={error}
				label={label}
			>
				<Textarea
					disabled={disabled}
					name={name}
					placeholder={def.meta?.placeholder}
				/>
			</FieldShell>
		);
	}

	const htmlType =
		inputType === "password"
			? "password"
			: inputType === "email"
				? "email"
				: inputType === "tel"
					? "tel"
					: inputType === "url"
						? "url"
						: def.checks.includes("email")
							? "email"
							: "text";

	return (
		<FieldShell description={def.meta?.description} error={error} label={label}>
			<Input
				disabled={disabled}
				name={name}
				placeholder={def.meta?.placeholder}
				type={htmlType}
			/>
		</FieldShell>
	);
}

function NumberFieldRenderer({
	def,
	disabled,
	error,
	name,
}: FieldRendererProps) {
	if (def.kind !== "number") return null;
	const label = def.meta?.label ?? name;

	return (
		<FieldShell description={def.meta?.description} error={error} label={label}>
			<Input
				disabled={disabled}
				name={name}
				placeholder={def.meta?.placeholder}
				type="number"
			/>
		</FieldShell>
	);
}

function BooleanFieldRenderer({
	def,
	disabled,
	error,
	name,
}: FieldRendererProps) {
	if (def.kind !== "boolean") return null;
	const label = def.meta?.label ?? name;

	if (def.meta?.input_type === "checkbox") {
		return (
			<FieldShell error={error}>
				<div className="flex items-center gap-2">
					<input disabled={disabled} name={name} type="checkbox" />
					<Label className="font-normal">{label}</Label>
				</div>
			</FieldShell>
		);
	}

	return (
		<FieldShell error={error}>
			<div className="flex items-center gap-2">
				<Switch disabled={disabled} name={name} />
				<Label className="font-normal">{label}</Label>
			</div>
		</FieldShell>
	);
}

function EnumFieldRenderer({ def, disabled, error, name }: FieldRendererProps) {
	if (def.kind !== "enum") return null;
	const label = def.meta?.label ?? name;
	const options = def.options ?? [];

	return (
		<FieldShell description={def.meta?.description} error={error} label={label}>
			<select
				className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={disabled}
				name={name}
			>
				<option value="">{def.meta?.placeholder ?? "Select..."}</option>
				{options.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
		</FieldShell>
	);
}

export {
	BooleanFieldRenderer,
	EnumFieldRenderer,
	FieldShell,
	NumberFieldRenderer,
	StringFieldRenderer,
};
