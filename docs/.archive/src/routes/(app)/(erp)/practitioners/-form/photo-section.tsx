import { IconPhoto, IconUpload, IconUser } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";

interface PhotoSectionProps {
	baseId: string;
	sectionRef: (el: HTMLElement | null) => void;
	setValue: UseFormSetValue<PractitionerFormValues>;
	watch: UseFormWatch<PractitionerFormValues>;
}

export default function PhotoSection({
	baseId,
	sectionRef,
	setValue,
	watch,
}: PhotoSectionProps) {
	const photoPreview = watch("photoPreview");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handlePhotoUpload = useCallback(
		async (file: File) => {
			setIsUploading(true);
			try {
				const tempId = `temp-${Date.now()}`;
				const { presignedUrl, key, publicUrl } =
					await client.doctors.getPresignedPhotoUrl({
						contentType: file.type,
						doctorId: tempId,
					});

				const response = await fetch(presignedUrl, {
					body: file,
					headers: { "Content-Type": file.type },
					method: "PUT",
				});

				if (!response.ok) throw new Error("Failed to upload photo");

				setValue("photoKey", key, { shouldDirty: true });
				setValue("photoPreview", publicUrl, { shouldDirty: true });
			} catch (error) {
				console.error("Photo upload error:", error);
				alert("Failed to upload photo. Please try again.");
			} finally {
				setIsUploading(false);
			}
		},
		[setValue],
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert("File size must be less than 5MB");
				return;
			}
			if (!file.type.startsWith("image/")) {
				alert("Only image files are allowed");
				return;
			}
			handlePhotoUpload(file);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert("File size must be less than 5MB");
				return;
			}
			if (!file.type.startsWith("image/")) {
				alert("Only image files are allowed");
				return;
			}
			handlePhotoUpload(file);
		}
	};

	return (
		<Card id={`${baseId}-photo`} ref={sectionRef}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconUser className="h-5 w-5" />
					Photo
				</CardTitle>
			</CardHeader>
			<CardContent>
				<button
					className={cn(
						"w-full cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
						"hover:border-primary hover:bg-primary/5",
						isUploading && "cursor-not-allowed opacity-50",
					)}
					disabled={isUploading}
					onClick={() => fileInputRef.current?.click()}
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
					type="button"
				>
					<input
						accept="image/*"
						className="hidden"
						disabled={isUploading}
						onChange={handleFileChange}
						ref={fileInputRef}
						type="file"
					/>
					{photoPreview ? (
						<div className="flex flex-col items-center gap-2">
							<Avatar className="h-24 w-24">
								<AvatarImage alt="Preview" src={photoPreview || undefined} />
								<AvatarFallback>
									<IconPhoto className="h-8 w-8" />
								</AvatarFallback>
							</Avatar>
							<p className="text-muted-foreground text-sm">
								Click or drag to change
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center gap-2">
							<IconUpload className="h-8 w-8 text-muted-foreground" />
							<p className="font-medium text-sm">Click or drag photo here</p>
							<p className="text-muted-foreground text-xs">
								PNG, JPG up to 5MB
							</p>
						</div>
					)}
				</button>
			</CardContent>
		</Card>
	);
}
