import { useId, useState } from "react";

import { Input } from "#/components/ui/input";

export const PHOTO_MAX_BYTES = 2 * 1024 * 1024; // 2MB WebP photos
export const PDF_MAX_BYTES = 20 * 1024 * 1024; // 20MB PDF documents

export type FilePolicyError = "too-large" | "bad-type" | null;

function checkFile(file: File, kind: "photo" | "pdf"): FilePolicyError {
	if (kind === "photo") {
		if (file.type !== "image/webp") return "bad-type";
		if (file.size > PHOTO_MAX_BYTES) return "too-large";
	} else {
		if (file.type !== "application/pdf") return "bad-type";
		if (file.size > PDF_MAX_BYTES) return "too-large";
	}
	return null;
}

export function filePolicyMessage(
	kind: "photo" | "pdf",
	error: Exclude<FilePolicyError, null>,
): string {
	if (kind === "photo") {
		return error === "too-large"
			? "Photo must be WebP and at most 2MB."
			: "Photo must be a WebP image (.webp).";
	}
	return error === "too-large"
		? "PDF must be at most 20MB."
		: "Only PDF documents (.pdf) are accepted.";
}

/**
 * File policy enforcement (P0-4): 2MB WebP photos / 20MB PDFs.
 * Renders a labelled input + inline policy message; reports the valid file.
 */
export function FileUpload({
	accept,
	kind,
	label,
	onValidFile,
}: {
	accept?: string;
	kind: "photo" | "pdf";
	label: string;
	onValidFile?: (file: File) => void;
}) {
	const inputId = useId();
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState<string | null>(null);

	return (
		<div className="space-y-1">
			<label className="text-sm font-medium" htmlFor={inputId}>
				{label}
			</label>
			<Input
				accept={accept ?? (kind === "photo" ? "image/webp" : "application/pdf")}
				id={inputId}
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (!file) {
						setError(null);
						setName(null);
						return;
					}
					const problem = checkFile(file, kind);
					if (problem) {
						setError(filePolicyMessage(kind, problem));
						setName(null);
						e.target.value = "";
						return;
					}
					setError(null);
					setName(file.name);
					onValidFile?.(file);
				}}
				type="file"
			/>
			<p className="text-xs text-muted-foreground">
				{kind === "photo" ? "WebP only, max 2MB." : "PDF only, max 20MB."}
				{name ? ` Selected: ${name}` : ""}
			</p>
			{error ? (
				<p className="text-sm text-red-600" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

/** Headless validator for reuse in forms/tests. */
export function validateUploadFile(
	file: File,
	kind: "photo" | "pdf",
): { ok: true } | { message: string; ok: false } {
	const problem = checkFile(file, kind);
	if (!problem) return { ok: true };
	return { message: filePolicyMessage(kind, problem), ok: false };
}
