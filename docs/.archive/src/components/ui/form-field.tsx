import { useId } from "react";

import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { cn } from "#/lib/utils";

interface FormFieldProps {
	className?: string;
	disabled?: boolean;
	error?: string;
	fieldClassName?: string;
	id?: string;
	label?: string;
	maxLength?: number;
	onValueChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	transform?: "uppercase" | "lowercase";
	type?: string;
	value: string | undefined;
}

function FormField({
	className,
	disabled,
	error,
	fieldClassName,
	id: explicitId,
	label,
	maxLength,
	onValueChange,
	placeholder,
	required,
	transform,
	type,
	value,
}: FormFieldProps) {
	const generatedId = useId();
	const id = explicitId ?? generatedId;

	return (
		<div className={cn("space-y-2", className)}>
			{label ? (
				<Label htmlFor={id}>
					{label}
					{required ? " *" : null}
				</Label>
			) : null}
			<Input
				aria-invalid={!!error}
				className={fieldClassName}
				disabled={disabled}
				id={id}
				maxLength={maxLength}
				onChange={(e) => {
					const v =
						transform === "uppercase"
							? e.target.value.toUpperCase()
							: transform === "lowercase"
								? e.target.value.toLowerCase()
								: e.target.value;
					onValueChange(v);
				}}
				placeholder={placeholder}
				type={type}
				value={value ?? ""}
			/>
			{error ? <p className="text-destructive text-xs">{error}</p> : null}
		</div>
	);
}

export type { FormFieldProps };
export { FormField };
