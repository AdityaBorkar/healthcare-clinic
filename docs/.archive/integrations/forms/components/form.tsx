import { valibotResolver } from "@hookform/resolvers/valibot";
import { useId, useMemo } from "react";
import type { FieldErrors } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import type * as v from "valibot";

import { FormContext } from "../context";
import { buildDefaults, buildFieldMap } from "../schema";
import type { FieldMapRenderer } from "../types";

export type ValidationMode = "onBlur" | "onChange" | "onSubmit" | "all";

export type FormProps<T extends v.BaseSchema> = {
	schema: T;
	onSubmit: (values: v.InferInput<T>) => void | Promise<void>;
	onInvalid?: (errors: FieldErrors) => void;
	defaultValues?: Partial<v.InferInput<T>>;
	validationMode?: ValidationMode;
	fieldMapRenderer: FieldMapRenderer;
	className?: string;
	children:
		| React.ReactNode
		| ((
				methods: ReturnType<typeof useForm<v.InferInput<T>>>,
		  ) => React.ReactNode);
	ref?: React.Ref<ReturnType<typeof useForm<v.InferInput<T>>>>;
};

export function Form<T extends v.BaseSchema>({
	schema,
	onSubmit,
	onInvalid,
	defaultValues: defaultValuesProp,
	validationMode = "onBlur",
	fieldMapRenderer,
	className,
	children,
	ref,
}: FormProps<T>) {
	const uid = useId();
	const fieldMap = useMemo(() => buildFieldMap(schema as any), [schema]);
	const schemaDefaults = useMemo(
		() =>
			buildDefaults(
				schema as any,
				defaultValuesProp as Record<string, unknown>,
			),
		[schema, defaultValuesProp],
	);

	const methods = useForm<v.InferInput<T>>({
		defaultValues: schemaDefaults as any,
		mode: validationMode,
		resolver: valibotResolver(schema) as any,
		reValidateMode: "onChange",
	});

	if (ref) {
		(ref as React.MutableRefObject<typeof methods>).current = methods;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		methods.handleSubmit((values) => onSubmit(values), onInvalid)();
	}

	return (
		<FormContext value={{ fieldMap, fieldMapRenderer, formId: uid }}>
			<FormProvider {...methods}>
				<form className={className} onSubmit={handleSubmit}>
					{typeof children === "function" ? children(methods) : children}
				</form>
			</FormProvider>
		</FormContext>
	);
}
