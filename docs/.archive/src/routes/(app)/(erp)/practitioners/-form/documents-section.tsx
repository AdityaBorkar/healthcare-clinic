import { IconFile, IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";
import { createDefaultDocumentEntry } from "./constants";

interface DocumentsSectionProps {
	baseId: string;
	form: UseFormReturn<PractitionerFormValues>;
	sectionRef: (el: HTMLElement | null) => void;
}

export default function DocumentsSection({
	baseId,
	form,
	sectionRef,
}: DocumentsSectionProps) {
	const {
		clearErrors,
		control,
		formState: { errors },
		register,
		setValue,
		watch,
	} = form;

	const { append, fields, remove } = useFieldArray({
		control,
		name: "documents",
	});

	const handleDocumentUpload = async (
		docIdx: number,
		_docId: string,
		file: File,
	) => {
		const allowedTypes = [
			"application/pdf",
			"image/jpeg",
			"image/jpg",
			"image/png",
		];
		if (!allowedTypes.includes(file.type)) {
			alert("Only PDF, JPG, and PNG files are allowed");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			alert("File size must be less than 10MB");
			return;
		}

		setValue(`documents.${docIdx}.isUploading`, true, {
			shouldDirty: true,
		});
		try {
			const tempId = `temp-${Date.now()}`;
			const { presignedUrl, key, publicUrl } =
				await client.doctors.documents.getPresignedUrl({
					contentType: file.type,
					doctorId: tempId,
					fileName: file.name,
				});

			const response = await fetch(presignedUrl, {
				body: file,
				headers: { "Content-Type": file.type },
				method: "PUT",
			});

			if (!response.ok) throw new Error("Failed to upload document");

			setValue(`documents.${docIdx}.fileKey`, key, { shouldDirty: true });
			setValue(`documents.${docIdx}.fileName`, file.name, {
				shouldDirty: true,
			});
			setValue(`documents.${docIdx}.fileSize`, file.size, {
				shouldDirty: true,
			});
			setValue(`documents.${docIdx}.fileType`, file.type, {
				shouldDirty: true,
			});
			setValue(`documents.${docIdx}.previewUrl`, publicUrl, {
				shouldDirty: true,
			});
			clearErrors(`documents.${docIdx}.fileKey`);
		} catch (error) {
			console.error("Document upload error:", error);
			alert("Failed to upload document. Please try again.");
		} finally {
			setValue(`documents.${docIdx}.isUploading`, false, {
				shouldDirty: true,
			});
		}
	};

	return (
		<Card id={`${baseId}-documents`} ref={sectionRef}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<IconFile className="h-5 w-5" />
							Documents
						</CardTitle>
						<CardDescription>
							Upload registration certificates, ID proofs, and other documents
						</CardDescription>
					</div>
					<Button
						className="gap-2"
						onClick={() => append(createDefaultDocumentEntry())}
						type="button"
						variant="outline"
					>
						<IconPlus className="h-4 w-4" />
						Add Document
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{fields.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground">
						No documents added yet
					</p>
				) : (
					fields.map((field, docIdx) => {
						const doc = watch(`documents.${docIdx}`);
						const titleError = errors.documents?.[docIdx]?.title;
						const fileError = errors.documents?.[docIdx]?.fileKey;
						return (
							<Card key={field.id}>
								<CardContent className="space-y-3 pt-4">
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm">
											{doc?.title || "New Document"}
										</span>
										<Button
											onClick={() => remove(docIdx)}
											size="sm"
											type="button"
											variant="ghost"
										>
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1">
											<Label className="text-xs">
												Title <span className="text-destructive">*</span>
											</Label>
											<Input
												aria-invalid={!!titleError}
												placeholder="Registration Certificate"
												{...register(`documents.${docIdx}.title`)}
											/>
											{titleError ? (
												<p className="text-destructive text-xs">
													{titleError.message}
												</p>
											) : null}
										</div>
										<div className="space-y-1">
											<Label className="text-xs">Description</Label>
											<Input
												placeholder="Brief description of the document"
												{...register(`documents.${docIdx}.description`)}
											/>
										</div>
									</div>

									<div className="space-y-1">
										<Label className="text-xs">
											File <span className="text-destructive">*</span>
										</Label>
										{doc?.fileKey ? (
											<div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
												<IconFile className="h-4 w-4 text-muted-foreground" />
												<span className="flex-1 text-sm">{doc.fileName}</span>
												<Badge variant="secondary">
													{(doc.fileSize / 1024).toFixed(1)} KB
												</Badge>
											</div>
										) : (
											<button
												className={cn(
													"w-full cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
													"hover:border-primary hover:bg-primary/5",
													doc?.isUploading && "cursor-not-allowed opacity-50",
												)}
												disabled={doc?.isUploading ?? false}
												onClick={() => {
													const input = document.createElement("input");
													input.accept = ".pdf,.jpg,.jpeg,.png";
													input.type = "file";
													input.onchange = (e) => {
														const file = (e.target as HTMLInputElement)
															.files?.[0];
														if (file)
															handleDocumentUpload(docIdx, field.id, file);
													};
													input.click();
												}}
												type="button"
											>
												{doc?.isUploading ? (
													<p className="text-muted-foreground text-sm">
														Uploading...
													</p>
												) : (
													<div className="flex flex-col items-center gap-1">
														<IconUpload className="h-6 w-6 text-muted-foreground" />
														<p className="text-muted-foreground text-sm">
															PDF, JPG, PNG up to 10MB
														</p>
													</div>
												)}
											</button>
										)}
										{fileError ? (
											<p className="text-destructive text-xs">
												{fileError.message}
											</p>
										) : null}
									</div>
								</CardContent>
							</Card>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}
