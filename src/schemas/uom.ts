import {
	boolean,
	integer,
	minLength,
	minValue,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

import { NameSchema } from "#/schemas/common";

const UomId = pipe(string(), minLength(1, "UOM ID is required"));

export const UomCategorySchema = picklist([
	"area",
	"count",
	"data",
	"length",
	"mass",
	"other",
	"session",
	"temperature",
	"time",
	"volume",
]);

export const UomCreateSchema = object({
	baseUnitId: optional(string()),
	category: UomCategorySchema,
	code: pipe(string(), minLength(1, "Code is required")),
	conversionFactor: optional(pipe(number(), minValue(0))),
	decimalPlaces: optional(pipe(number(), integer(), minValue(0))),
	isBaseUnit: optional(boolean(), false),
	isDefault: optional(boolean(), false),
	isIndivisible: optional(boolean(), false),
	name: NameSchema,
	symbol: optional(string()),
});

export const UomIdSchema = object({ id: UomId });

export const UomPatchSchema = object({
	id: UomId,
	patch: object({
		baseUnitId: optional(string()),
		category: optional(UomCategorySchema),
		code: optional(string()),
		conversionFactor: optional(pipe(number(), minValue(0))),
		decimalPlaces: optional(pipe(number(), integer(), minValue(0))),
		factorChangeReason: optional(string()),
		isActive: optional(boolean()),
		isBaseUnit: optional(boolean()),
		isDefault: optional(boolean()),
		isIndivisible: optional(boolean()),
		name: optional(NameSchema),
		symbol: optional(string()),
	}),
});

export const UomListSchema = object({
	category: optional(UomCategorySchema),
	isActive: optional(boolean()),
	limit: optional(pipe(number(), integer(), minValue(1))),
	offset: optional(pipe(number(), integer(), minValue(0))),
	search: optional(string()),
	status: optional(string()),
});

export const UomConvertSchema = object({
	fromUomId: UomId,
	quantity: pipe(number(), minValue(0)),
	toUomId: optional(string()),
});

export const UomRetireSchema = object({
	id: UomId,
	reason: optional(string()),
});
