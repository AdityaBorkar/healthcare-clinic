import type { FieldDef, FieldMap, FieldMeta } from "./types";

type ValibotSchema = {
	async?: boolean;
	entries?: Record<string, ValibotSchema>;
	expects?: string;
	item?: ValibotSchema;
	kind: string;
	message?: unknown;
	options?: string[];
	pipe?: ValibotSchema[];
	type: string;
	wrapped?: ValibotSchema;
};

function getMeta(schema: ValibotSchema): FieldMeta | undefined {
	if (!schema.pipe) return undefined;
	const metadataAction = schema.pipe.find((s) => s.type === "metadata");
	if (!metadataAction) return undefined;
	const md = (metadataAction as any).metadata;
	if (md && typeof md === "object") return md as FieldMeta;
	return undefined;
}

function getChecks(schema: ValibotSchema): string[] {
	if (!schema.pipe) return [];
	return schema.pipe
		.filter((s) => s.kind === "validation")
		.map((s) => s.type)
		.filter(Boolean) as string[];
}

function unwrapPipe(schema: ValibotSchema): ValibotSchema {
	if (schema.pipe && schema.pipe.length > 0) {
		return schema.pipe[0];
	}
	return schema;
}

function buildFieldDef(schema: ValibotSchema): FieldDef {
	const meta = getMeta(schema);
	const checks = getChecks(schema);
	const inner = unwrapPipe(schema);
	const type = inner.type;

	if (type === "optional") {
		const innerSchema = inner.wrapped;
		const innerDef = innerSchema
			? buildFieldDef(innerSchema)
			: { kind: "unknown" as const };
		return { inner: innerDef, kind: "optional", meta: meta ?? innerDef.meta };
	}

	if (type === "nullable") {
		const innerSchema = inner.wrapped;
		const innerDef = innerSchema
			? buildFieldDef(innerSchema)
			: { kind: "unknown" as const };
		return { inner: innerDef, kind: "nullable", meta: meta ?? innerDef.meta };
	}

	if (type === "array") {
		const itemSchema = inner.item;
		return {
			item: itemSchema ? buildFieldMap(itemSchema) : undefined,
			kind: "array",
			meta,
		};
	}

	if (type === "string") return { checks, kind: "string", meta };
	if (type === "number") return { kind: "number", meta };
	if (type === "boolean") return { kind: "boolean", meta };
	if (type === "picklist") {
		return {
			kind: "enum",
			meta,
			options: inner.options ?? [],
		};
	}

	return { kind: "unknown", meta };
}

function buildFieldMap(schema: ValibotSchema): FieldMap {
	if (!schema.entries) return {};
	const map: FieldMap = {};
	for (const [key, fieldSchema] of Object.entries(schema.entries)) {
		map[key] = buildFieldDef(fieldSchema);
	}
	return map;
}

function deriveDefault(def: FieldDef): unknown {
	if (def.kind === "optional") return undefined;
	if (def.kind === "nullable") return null;
	if (def.kind === "string") return "";
	if (def.kind === "number") return 0;
	if (def.kind === "boolean") return false;
	if (def.kind === "enum" && def.options && def.options.length > 0) {
		return def.options[0];
	}
	if (def.kind === "array") return [];
	return undefined;
}

function buildDefaults(
	schema: ValibotSchema,
	overrides?: Record<string, unknown>,
): Record<string, unknown> {
	const fieldMap = buildFieldMap(schema);
	const defaults: Record<string, unknown> = {};
	for (const [key, def] of Object.entries(fieldMap)) {
		defaults[key] = deriveDefault(def);
	}
	if (overrides) {
		for (const [key, value] of Object.entries(overrides)) {
			defaults[key] = value;
		}
	}
	return defaults;
}

function unwrapOptional(def: FieldDef): FieldDef {
	if (def.kind === "optional" || def.kind === "nullable") return def.inner;
	return def;
}

export type { ValibotSchema };
export {
	buildDefaults,
	buildFieldDef,
	buildFieldMap,
	deriveDefault,
	unwrapOptional,
};
