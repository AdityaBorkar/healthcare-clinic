import { createContext, useContext } from "react";

import type { FieldMap, FieldMapRenderer } from "./types";

type FormContextValue = {
	fieldMap: FieldMap;
	fieldMapRenderer: FieldMapRenderer;
	formId: string;
};

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext(): FormContextValue {
	const ctx = useContext(FormContext);
	if (!ctx) {
		throw new Error("useFormContext: must be used within a Form");
	}
	return ctx;
}

export type { FormContextValue };
export { FormContext, useFormContext };
