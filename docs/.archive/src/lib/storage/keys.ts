import type { FileCategory, OwnerType } from "./types";

const OWNER_PATHS: Record<OwnerType, string> = {
	branch: "branches",
	company: "companies",
	patient: "patients",
	practitioner: "practitioners",
	staff: "staff",
	vendor: "vendors",
};

export function generateKey(
	ownerType: OwnerType,
	ownerId: string,
	category: FileCategory,
	fileName: string,
): string {
	const basePath = OWNER_PATHS[ownerType];
	const sanitizedId = sanitize(ownerId);
	const timestamp = Date.now();

	if (category === "photo") {
		const extension = getExtension(fileName, "jpg");
		return `${basePath}/${sanitizedId}/photo-${timestamp}.${extension}`;
	}

	const sanitizedFileName = sanitize(fileName);
	return `${basePath}/${sanitizedId}/documents/${timestamp}-${sanitizedFileName}`;
}

function sanitize(input: string): string {
	return input.replace(/[^a-zA-Z0-9-_.]/g, "_");
}

function getExtension(fileName: string, fallback: string): string {
	const parts = fileName.split(".");
	return parts.length > 1 ? parts.pop()! : fallback;
}
