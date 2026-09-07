export type OwnerType =
	| "branch"
	| "company"
	| "vendor"
	| "patient"
	| "practitioner"
	| "staff";

export type FileCategory = "document" | "photo";

export interface UploadInput {
	category: FileCategory;
	contentType: string;
	fileName: string;
	fileSizeBytes?: number;
	ownerId: string;
	ownerType: OwnerType;
}

export interface UploadResult {
	expiresIn: number;
	key: string;
	presignedUrl: string;
	publicUrl: string;
}

export interface StorageAdapter {
	deleteObject(key: string): Promise<void>;
	getPresignedUploadUrl(
		key: string,
		contentType: string,
		expiresIn?: number,
	): Promise<{ publicUrl: string; url: string }>;
	getPublicUrl(key: string): string;
}
