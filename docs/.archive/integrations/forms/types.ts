import type { FieldMap } from "./types";

export type InputFieldType =
	| "checkbox"
	| "combobox"
	| "date"
	| "email"
	| "multi-select"
	| "number"
	| "password"
	| "switch"
	| "tel"
	| "text"
	| "textarea"
	| "url";

export type FieldMeta = {
	label?: string;
	placeholder?: string;
	description?: string;
	input_type?: InputFieldType;
};

export type FieldDef =
	| { kind: "string"; meta?: FieldMeta; checks: string[] }
	| { kind: "number"; meta?: FieldMeta }
	| { kind: "boolean"; meta?: FieldMeta }
	| { kind: "enum"; meta?: FieldMeta; options: string[] }
	| { kind: "array"; meta?: FieldMeta; item?: FieldMap }
	| { kind: "optional"; meta?: FieldMeta; inner: FieldDef }
	| { kind: "nullable"; meta?: FieldMeta; inner: FieldDef }
	| { kind: "unknown"; meta?: FieldMeta };

export type FieldMap = Record<string, FieldDef>;

export type FieldRendererProps = {
	config?: Record<string, unknown>;
	def: FieldDef;
	disabled?: boolean;
	error?: string;
	name: string;
};

export type ArrayRowRendererProps = {
	addLabel: string;
	disabled?: boolean;
	elementFields: FieldMap;
	fields: Record<string, unknown>[];
	handleAppend: () => void;
	maxItems?: number;
	name: string;
	remove: (index: number) => void;
};

export type FieldMapRenderer = {
	array?: React.ComponentType<FieldRendererProps>;
	arrayRow?: React.ComponentType<ArrayRowRendererProps>;
	boolean?: React.ComponentType<FieldRendererProps>;
	checkbox?: React.ComponentType<FieldRendererProps>;
	combobox?: React.ComponentType<FieldRendererProps>;
	date?: React.ComponentType<FieldRendererProps>;
	email?: React.ComponentType<FieldRendererProps>;
	enum?: React.ComponentType<FieldRendererProps>;
	multiSelect?: React.ComponentType<FieldRendererProps>;
	number?: React.ComponentType<FieldRendererProps>;
	password?: React.ComponentType<FieldRendererProps>;
	string?: React.ComponentType<FieldRendererProps>;
	switch?: React.ComponentType<FieldRendererProps>;
	tel?: React.ComponentType<FieldRendererProps>;
	text?: React.ComponentType<FieldRendererProps>;
	textarea?: React.ComponentType<FieldRendererProps>;
	unknown?: React.ComponentType<FieldRendererProps>;
	url?: React.ComponentType<FieldRendererProps>;
};
