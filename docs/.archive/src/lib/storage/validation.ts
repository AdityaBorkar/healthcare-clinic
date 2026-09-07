import type { FileCategory, OwnerType } from "./types";

const ALLOWED_CONTENT_TYPES: Record<FileCategory, string[]> = {
	document: [
		"application/msword",
		"application/pdf",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"image/jpeg",
		"image/png",
	],
	photo: ["image/jpeg", "image/png", "image/webp"],
};

const MAX_FILE_SIZE: Record<FileCategory, number> = {
	document: 25 * 1024 * 1024,
	photo: 5 * 1024 * 1024,
};

const VALID_OWNER_TYPES: OwnerType[] = [
	"branch",
	"company",
	"vendor",
	"patient",
	"practitioner",
	"staff",
];

export class StorageValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "StorageValidationError";
	}
}

export function validateUpload(input: {
	category: string;
	contentType: string;
	fileSizeBytes?: number;
	ownerType: string;
}): void {
	if (!VALID_OWNER_TYPES.includes(input.ownerType as OwnerType)) {
		throw new StorageValidationError(`Invalid owner type: ${input.ownerType}`);
	}

	const categoryConfig = ALLOWED_CONTENT_TYPES[input.category as FileCategory];
	if (!categoryConfig) {
		throw new StorageValidationError(
			`Invalid file category: ${input.category}`,
		);
	}

	if (!categoryConfig.includes(input.contentType)) {
		throw new StorageValidationError(
			`Content type '${input.contentType}' not allowed for category '${input.category}'. Allowed: ${categoryConfig.join(", ")}`,
		);
	}

	const maxSize = MAX_FILE_SIZE[input.category as FileCategory];
	if (input.fileSizeBytes && input.fileSizeBytes > maxSize) {
		throw new StorageValidationError(
			`File size ${(input.fileSizeBytes / (1024 * 1024)).toFixed(1)}MB exceeds ${maxSize / (1024 * 1024)}MB limit for ${input.category}`,
		);
	}
}
