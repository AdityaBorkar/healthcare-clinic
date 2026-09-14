import {
	array,
	minLength,
	number,
	object,
	optional,
	pipe,
	string,
} from "valibot";

import { NameSchema, SlugSchema } from "#/schemas/common";

const BranchId = optional(string(), "main");

export const CompanySchema = object({
	logo: optional(string()),
	name: NameSchema,
	slug: optional(SlugSchema),
});

export const BranchCreateSchema = object({
	address: optional(string()),
	name: NameSchema,
	subdomain: SlugSchema,
});

export const BranchIdSchema = object({
	id: pipe(string(), minLength(1, "Branch ID is required")),
});

export const BranchPatchSchema = object({
	id: pipe(string(), minLength(1, "Branch ID is required")),
	patch: object({
		address: optional(string()),
		name: optional(NameSchema),
	}),
});

export const UserDisableSchema = object({
	branchId: BranchId,
	id: pipe(string(), minLength(1, "User ID is required")),
	reason: optional(string()),
});

export const RoleSchema = object({
	branchId: BranchId,
	name: NameSchema,
	permissions: array(pipe(string(), minLength(1))),
});

export const RoleIdSchema = object({
	id: pipe(string(), minLength(1, "Role ID is required")),
});

export const MasterVersionSchema = object({
	branchId: BranchId,
	domain: pipe(string(), minLength(1, "Domain is required")),
	payload: optional(string()),
	version: pipe(string(), minLength(1, "Version is required")),
});

export const TemplateSchema = object({
	body: pipe(string(), minLength(1, "Template body is required")),
	branchId: BranchId,
	kind: pipe(string(), minLength(1, "Template kind is required")),
	name: NameSchema,
});

export const RecallRuleSchema = object({
	branchId: BranchId,
	daysAfter: number(),
	message: pipe(string(), minLength(1, "Recall message is required")),
	name: NameSchema,
});

export const LogsQuerySchema = object({
	branchId: optional(string()),
	limit: optional(number(), 100),
});

export const NamedIdSchema = object({
	id: pipe(string(), minLength(1, "ID is required")),
});
