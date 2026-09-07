import { Controller, useFormContext as useRhfContext } from "react-hook-form";

import { useFormContext } from "../context";
import { unwrapOptional } from "../schema";
import type { FieldRendererProps } from "../types";

type FieldConfig = Record<string, unknown>;

type FieldProps = {
	name: string;
	disabled?: boolean;
	config?: FieldConfig;
	overrides?: (props: FieldRendererProps) => React.ReactNode;
};

function Field({ name, disabled, config, overrides }: FieldProps) {
	const { fieldMap, fieldMapRenderer } = useFormContext();
	const { control } = useRhfContext();

	const fieldDef = fieldMap[name];
	if (!fieldDef) return null;

	const resolved = unwrapOptional(fieldDef);

	return (
		<Controller
			name={name}
			render={({ field, fieldState }) => {
				const error = fieldState.error?.message;

				if (overrides) {
					return overrides({
						config,
						def: resolved,
						disabled,
						error,
						name,
					});
				}

				if (resolved.kind === "array") {
					const Renderer = fieldMapRenderer.array;
					if (!Renderer) return null;
					return (
						<Renderer
							config={config}
							def={resolved}
							disabled={disabled}
							error={error}
							name={name}
						/>
					);
				}

				const inputType = resolved.meta?.input_type;
				const key = inputType ?? resolved.kind;
				const Renderer = fieldMapRenderer[key as keyof typeof fieldMapRenderer];

				if (!Renderer) return null;

				return (
					<Renderer
						config={config}
						def={resolved}
						disabled={disabled}
						error={error}
						name={name}
					/>
				);
			}}
		/>
	);
}

export type { FieldConfig, FieldProps };
export { Field };
