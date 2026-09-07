import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useFormContext as useRhfContext } from "react-hook-form";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import type {
	ArrayRowRendererProps,
	FieldMapRenderer,
	FieldRendererProps,
} from "#/forms";
import { unwrapOptional } from "#/forms";
import {
	BooleanFieldRenderer,
	EnumFieldRenderer,
	NumberFieldRenderer,
	StringFieldRenderer,
} from "./renderers";

function ComboboxFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function DateFieldRenderer({ def, disabled, error, name }: FieldRendererProps) {
	const label = def.meta?.label ?? name;
	return (
		<div className="space-y-2">
			{label ? <Label>{label}</Label> : null}
			<Input disabled={disabled} name={name} type="date" />
			{error ? <p className="text-destructive text-xs">{error}</p> : null}
		</div>
	);
}

function EmailFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function MultiSelectFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function TelFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function SwitchFieldRenderer(props: FieldRendererProps) {
	return <BooleanFieldRenderer {...props} />;
}

function CheckboxFieldRenderer(props: FieldRendererProps) {
	return <BooleanFieldRenderer {...props} />;
}

function PasswordFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function UrlFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function TextFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function TextareaFieldRenderer(props: FieldRendererProps) {
	return <StringFieldRenderer {...props} />;
}

function UnknownFieldRenderer({ def, error, name }: FieldRendererProps) {
	const label = def.meta?.label ?? name;
	return (
		<div className="space-y-2">
			{label ? <Label>{label}</Label> : null}
			<Input name={name} />
			{error ? <p className="text-destructive text-xs">{error}</p> : null}
		</div>
	);
}

function ArrayRowRenderer({
	addLabel,
	disabled,
	elementFields,
	fields,
	handleAppend,
	maxItems,
	name,
	remove,
}: ArrayRowRendererProps) {
	const { register } = useRhfContext();
	const fieldEntries = Object.entries(elementFields);

	return (
		<div className="space-y-3">
			{fields.length === 0 && (
				<p className="text-muted-foreground text-sm">No items added yet</p>
			)}
			{fields.map((item, index) => (
				<div className="flex items-start gap-2" key={(item as any).id ?? index}>
					{fieldEntries.map(([key, def]) => {
						const resolved = unwrapOptional(def);
						return (
							<div className="flex-1" key={key}>
								<Input
									disabled={disabled}
									placeholder={resolved.meta?.placeholder ?? key}
									type={resolved.kind === "number" ? "number" : "text"}
									{...register(`${name}.${index}.${key}`)}
								/>
							</div>
						);
					})}
					<Button
						className="mt-0"
						disabled={disabled}
						onClick={() => remove(index)}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						<IconTrash className="h-3.5 w-3.5 text-destructive" />
					</Button>
				</div>
			))}
			<Button
				disabled={
					disabled || (maxItems !== undefined && fields.length >= maxItems)
				}
				onClick={handleAppend}
				size="xs"
				type="button"
				variant="outline"
			>
				<IconPlus className="h-3 w-3" />
				{addLabel}
			</Button>
		</div>
	);
}

const fieldMapRenderer: FieldMapRenderer = {
	array: StringFieldRenderer,
	arrayRow: ArrayRowRenderer,
	boolean: BooleanFieldRenderer,
	checkbox: CheckboxFieldRenderer,
	combobox: ComboboxFieldRenderer,
	date: DateFieldRenderer,
	email: EmailFieldRenderer,
	enum: EnumFieldRenderer,
	multiSelect: MultiSelectFieldRenderer,
	number: NumberFieldRenderer,
	password: PasswordFieldRenderer,
	string: StringFieldRenderer,
	switch: SwitchFieldRenderer,
	tel: TelFieldRenderer,
	text: TextFieldRenderer,
	textarea: TextareaFieldRenderer,
	unknown: UnknownFieldRenderer,
	url: UrlFieldRenderer,
};

export { fieldMapRenderer };
