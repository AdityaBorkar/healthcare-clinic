import {
	useFieldArray,
	useFormContext as useRhfContext,
} from "react-hook-form";

import { useFormContext } from "../context";
import { deriveDefault } from "../schema";
import type { FieldRendererProps } from "../types";

type FieldArrayRendererProps = FieldRendererProps & {
	config?: Record<string, unknown>;
};

function FieldArray({ name, def, disabled, config }: FieldArrayRendererProps) {
	const { fieldMap, fieldMapRenderer } = useFormContext();
	const { control } = useRhfContext();

	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});

	const elementFields = def.kind === "array" ? def.item : undefined;
	const maxItems = config?.maxItems as number | undefined;

	function handleAppend() {
		if (disabled) return;
		if (maxItems && fields.length >= maxItems) return;
		const defaults: Record<string, unknown> = {};
		if (elementFields) {
			for (const [key, fieldDef] of Object.entries(elementFields)) {
				defaults[key] = deriveDefault(fieldDef);
			}
		}
		append(defaults);
	}

	const Renderer = fieldMapRenderer["arrayRow"];
	if (!Renderer || !elementFields) return null;

	return (
		<Renderer
			addLabel={`Add ${def.meta?.label ?? "item"}`}
			disabled={disabled}
			elementFields={elementFields}
			fields={fields}
			handleAppend={handleAppend}
			maxItems={maxItems}
			name={name}
			remove={remove}
		/>
	);
}

export type { FieldArrayRendererProps };
export { FieldArray };
