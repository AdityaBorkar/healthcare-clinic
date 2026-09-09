import { nullable, object, optional, string } from "valibot";

import { NameSchema, SlugSchema } from "./common";

export const UpdateOrganizationInputSchema = object({
	logo: optional(nullable(string())),
	name: optional(NameSchema),
	slug: optional(SlugSchema),
});

export type UpdateOrganizationInput = {
	logo?: string | null;
	name?: string;
	slug?: string;
};
