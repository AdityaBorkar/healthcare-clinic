import * as v from "valibot";

import { createStorageModule } from "#/lib/storage";
import { AuthProcedure } from "#/rpc/procedure";

const storage = createStorageModule();

export const getPresignedFileUploadUrl = AuthProcedure.meta({
	permissions: ["files:write"],
})
	.input(
		v.object({
			category: v.picklist(["document", "photo"]),
			contentType: v.string(),
			fileName: v.string(),
			fileSizeBytes: v.optional(v.number()),
			ownerId: v.string(),
			ownerType: v.picklist([
				"branch",
				"company",
				"patient",
				"practitioner",
				"staff",
				"vendor",
			]),
		}),
	)
	.handler(async ({ input }) => {
		return storage.upload(input);
	});

export const deleteFile = AuthProcedure.meta({ permissions: ["files:write"] })
	.input(v.object({ key: v.string() }))
	.handler(async ({ input }) => {
		return storage.remove(input.key);
	});
