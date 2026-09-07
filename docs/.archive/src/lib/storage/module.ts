import { createS3Adapter } from "./adapter";
import { generateKey } from "./keys";
import type { StorageAdapter, UploadInput, UploadResult } from "./types";
import { validateUpload } from "./validation";

export function createStorageModule(adapter?: StorageAdapter) {
	const storage = adapter ?? createS3Adapter();

	return {
		getPublicUrl(key: string): string {
			return storage.getPublicUrl(key);
		},

		async remove(key: string): Promise<void> {
			try {
				await storage.deleteObject(key);
			} catch {
				console.error(`Failed to delete S3 object: ${key}`);
			}
		},
		async upload(input: UploadInput): Promise<UploadResult> {
			validateUpload(input);

			const key = generateKey(
				input.ownerType,
				input.ownerId,
				input.category,
				input.fileName,
			);
			const { url, publicUrl } = await storage.getPresignedUploadUrl(
				key,
				input.contentType,
			);

			return { expiresIn: 300, key, presignedUrl: url, publicUrl };
		},
	};
}
