import { useId } from "react";

import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";

interface SelectOption {
	label: string;
	value: string;
}

interface FormSelectProps {
	className?: string;
	disabled?: boolean;
	error?: string;
	id?: string;
	label?: string;
	onValueChange: (value: string | null) => void;
	options: SelectOption[];
	placeholder?: string;
	value: string | undefined;
}

function FormSelect({
	className,
	disabled,
	error,
	id: explicitId,
	label,
	onValueChange,
	options,
	placeholder,
	value,
}: FormSelectProps) {
	const generatedId = useId();
	const id = explicitId ?? generatedId;

	return (
		<div className={cn("space-y-2", className)}>
			{label ? <Label htmlFor={id}>{label}</Label> : null}
			<Select
				disabled={disabled}
				onValueChange={onValueChange}
				value={value ?? ""}
			>
				<SelectTrigger className="w-full" id={id}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error ? <p className="text-destructive text-xs">{error}</p> : null}
		</div>
	);
}

export type { FormSelectProps, SelectOption };
export { FormSelect };
