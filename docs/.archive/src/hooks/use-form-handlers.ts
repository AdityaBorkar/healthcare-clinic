import { useMemo } from "react";

function useFormHandlers<T extends string>(
	fields: readonly T[],
	setter: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
	errorSetter: React.Dispatch<React.SetStateAction<Record<string, string>>>,
): Record<T, (value: string | boolean | null) => void> {
	return useMemo(() => {
		const handlers = {} as Record<T, (value: string | boolean | null) => void>;
		for (const field of fields) {
			handlers[field] = (value: string | boolean | null) => {
				if (value === null) return;
				setter((prev) => ({ ...prev, [field]: value }));
				errorSetter((prev) => {
					if (!prev[field]) return prev;
					const newErrors = { ...prev };
					delete newErrors[field];
					return newErrors;
				});
			};
		}
		return handlers;
	}, [fields, setter, errorSetter]);
}

export { useFormHandlers };
