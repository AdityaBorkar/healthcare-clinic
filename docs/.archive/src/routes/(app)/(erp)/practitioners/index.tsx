import {
	IconCalendar,
	IconClock,
	IconPencil,
	IconPhone,
	IconPhoto,
	IconStethoscope,
	IconTrash,
	IconUpload,
	IconUserPlus,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useId, useRef, useState } from "react";
import * as v from "valibot";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";
import type { DoctorWithSpecializations } from "#/rpc/router/doctors";

export const Route = createFileRoute("/(app)/(erp)/practitioners/")({
	component: PractitionersPage,
	head: () => ({
		meta: [{ title: "Practitioners (Shaun)" }],
	}),
});

interface Specialization {
	code: string | null;
	description: string | null;
	id: number;
	isActive: boolean;
	name: string;
}

const editDoctorSchema = v.object({
	additionalQualifications: v.optional(v.string()),
	bio: v.optional(v.string()),
	defaultSlotDuration: v.optional(v.number(), 15),
	name: v.pipe(v.string(), v.minLength(1, "Name is required")),
	phone: v.optional(v.string()),
	photoKey: v.optional(v.string()),
	practicingSince: v.optional(
		v.pipe(v.number(), v.minValue(1900), v.maxValue(new Date().getFullYear())),
	),
	qualification: v.pipe(
		v.string(),
		v.minLength(1, "Qualification is required"),
	),
	registrationCouncil: v.optional(v.string()),
	registrationDate: v.optional(v.string()),
	specializationIds: v.optional(
		v.array(
			v.object({
				isPrimary: v.optional(v.boolean(), false),
				specializationId: v.number(),
			}),
		),
	),
});

type EditDoctorFormData = v.InferOutput<typeof editDoctorSchema>;

function PractitionersPage() {
	const baseId = useId();
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingDoctor, setEditingDoctor] =
		useState<DoctorWithSpecializations | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterActive, setFilterActive] = useState<boolean | undefined>(
		undefined,
	);
	const [filterVerified, setFilterVerified] = useState<boolean | undefined>(
		undefined,
	);
	const [filterSpecialization, setFilterSpecialization] = useState<
		number | undefined
	>(undefined);

	const [formData, setFormData] = useState<EditDoctorFormData>({
		additionalQualifications: "",
		bio: "",
		defaultSlotDuration: 15,
		name: "",
		phone: "",
		photoKey: "",
		practicingSince: undefined,
		qualification: "",
		registrationCouncil: "",
		registrationDate: "",
		specializationIds: [],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { data: specializations = [] } = useQuery<Specialization[]>({
		queryFn: async () => {
			return await client.specializations.list({ isActive: true });
		},
		queryKey: ["specializations"],
	});

	const { data: doctors = [], isLoading } = useQuery<
		DoctorWithSpecializations[]
	>({
		queryFn: async () => {
			return await client.doctors.list({
				isActive: filterActive,
				isVerified: filterVerified,
				search: searchTerm || undefined,
				specializationId: filterSpecialization,
			});
		},
		queryKey: [
			"doctors",
			filterActive,
			filterVerified,
			searchTerm,
			filterSpecialization,
		],
	});

	const updateMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.doctors.update>[0]) =>
			client.doctors.update(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to update practitioner");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["doctors"] });
			setIsDialogOpen(false);
			setEditingDoctor(null);
			resetForm();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.doctors.delete>[0]) =>
			client.doctors.delete(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to delete practitioner");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["doctors"] });
		},
	});

	const resetForm = () => {
		setFormData({
			additionalQualifications: "",
			bio: "",
			defaultSlotDuration: 15,
			name: "",
			phone: "",
			photoKey: "",
			practicingSince: undefined,
			qualification: "",
			registrationCouncil: "",
			registrationDate: "",
			specializationIds: [],
		});
		setErrors({});
		setPhotoPreview(null);
		setIsUploading(false);
	};

	const handleEdit = (doctor: DoctorWithSpecializations) => {
		setEditingDoctor(doctor);
		setFormData({
			additionalQualifications: doctor.additionalQualifications || "",
			bio: doctor.bio || "",
			defaultSlotDuration: doctor.defaultSlotDuration || 15,
			name: doctor.name,
			phone: doctor.phone || "",
			photoKey: doctor.photoKey || "",
			practicingSince: doctor.practicingSince || undefined,
			qualification: doctor.qualification,
			registrationCouncil: doctor.registrationCouncil || "",
			registrationDate: doctor.registrationDate
				? new Date(doctor.registrationDate).toISOString().split("T")[0]
				: "",
			specializationIds: doctor.specializations.map((s) => ({
				isPrimary: s.isPrimary,
				specializationId: s.specializationId,
			})),
		});
		setPhotoPreview(doctor.photoKey || null);
		setIsDialogOpen(true);
	};

	const handleDelete = async (doctor: DoctorWithSpecializations) => {
		if (
			!confirm(
				`Are you sure you want to deactivate practitioner "${doctor.name}"?`,
			)
		) {
			return;
		}
		await deleteMutation.mutateAsync({ id: doctor.id });
	};

	const handleInputChange = (
		field: keyof EditDoctorFormData,
		value: string | number | undefined,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSpecializationChange = (
		specializationId: number,
		isPrimary: boolean,
	) => {
		setFormData((prev) => {
			const existing = prev.specializationIds || [];
			const filtered = existing.filter(
				(s) => s.specializationId !== specializationId,
			);

			if (existing.some((s) => s.specializationId === specializationId)) {
				return { ...prev, specializationIds: filtered };
			}

			return {
				...prev,
				specializationIds: [...filtered, { isPrimary, specializationId }],
			};
		});
	};

	const handlePhotoUpload = useCallback(
		async (file: File) => {
			if (!file || !editingDoctor) return;

			setIsUploading(true);
			try {
				const { presignedUrl, key, publicUrl } =
					await client.doctors.getPresignedPhotoUrl({
						contentType: file.type,
						doctorId: editingDoctor.doctorId,
					});

				const response = await fetch(presignedUrl, {
					body: file,
					headers: { "Content-Type": file.type },
					method: "PUT",
				});

				if (!response.ok) {
					throw new Error("Failed to upload photo");
				}

				setFormData((prev) => ({ ...prev, photoKey: key }));
				setPhotoPreview(publicUrl);
			} catch (error) {
				console.error("Photo upload error:", error);
				alert("Failed to upload photo. Please try again.");
			} finally {
				setIsUploading(false);
			}
		},
		[editingDoctor],
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingDoctor) return;

		const result = v.safeParse(editDoctorSchema, formData);
		if (!result.success) {
			const newErrors: Record<string, string> = {};
			for (const issue of result.issues) {
				newErrors[String(issue.path?.[0]?.key ?? "")] = issue.message;
			}
			setErrors(newErrors);
			return;
		}

		const { specializationIds: _specIds, ...updateData } = formData;
		await updateMutation.mutateAsync({
			id: editingDoctor.id,
			...updateData,
		});

		if (formData.specializationIds && formData.specializationIds.length > 0) {
			await client.doctors.updateSpecializations({
				doctorId: editingDoctor.id,
				specializations: formData.specializationIds,
			});
		}
	};

	const handleDialogOpenChange = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setEditingDoctor(null);
			resetForm();
		}
	};

	return (
		<div className="container mx-auto max-w-7xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Practitioners</h1>
					<p className="text-muted-foreground">
						Manage practitioner profiles and specializations
					</p>
				</div>
				<Link to="/practitioners/new">
					<Button className="gap-2">
						<IconUserPlus className="h-4 w-4" />
						Add Practitioner
					</Button>
				</Link>
			</div>

			<Dialog onOpenChange={handleDialogOpenChange} open={isDialogOpen}>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>Edit Practitioner</DialogTitle>
							<DialogDescription>
								Update practitioner profile information
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-6 py-4">
							<div className="space-y-2">
								<Label>Photo</Label>
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
												<AvatarImage alt="Preview" src={photoPreview} />
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
											<p className="font-medium text-sm">
												Click or drag photo here
											</p>
											<p className="text-muted-foreground text-xs">
												PNG, JPG up to 5MB
											</p>
										</div>
									)}
								</button>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-name`}>
										Full Name <span className="text-destructive">*</span>
									</Label>
									<Input
										aria-invalid={!!errors.name}
										id={`${baseId}-name`}
										onChange={(e) => handleInputChange("name", e.target.value)}
										placeholder="Dr. John Smith"
										value={formData.name}
									/>
									{errors.name ? (
										<p className="text-destructive text-xs">{errors.name}</p>
									) : null}
								</div>
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-phone`}>
										<IconPhone className="mr-1 inline h-4 w-4" />
										Phone
									</Label>
									<Input
										id={`${baseId}-phone`}
										onChange={(e) => handleInputChange("phone", e.target.value)}
										placeholder="+1 234 567 8900"
										value={formData.phone}
									/>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-registrationCouncil`}>
										Registration Council
									</Label>
									<Input
										id={`${baseId}-registrationCouncil`}
										onChange={(e) =>
											handleInputChange("registrationCouncil", e.target.value)
										}
										placeholder="Medical Council of India"
										value={formData.registrationCouncil}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-qualification`}>
										Qualification <span className="text-destructive">*</span>
									</Label>
									<Input
										aria-invalid={!!errors.qualification}
										id={`${baseId}-qualification`}
										onChange={(e) =>
											handleInputChange("qualification", e.target.value)
										}
										placeholder="MBBS, MD"
										value={formData.qualification}
									/>
									{errors.qualification ? (
										<p className="text-destructive text-xs">
											{errors.qualification}
										</p>
									) : null}
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-additionalQualifications`}>
										Additional Qualifications
									</Label>
									<Input
										id={`${baseId}-additionalQualifications`}
										onChange={(e) =>
											handleInputChange(
												"additionalQualifications",
												e.target.value,
											)
										}
										placeholder="DM, MCh, Fellowship"
										value={formData.additionalQualifications}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-practicingSince`}>
										Practicing Since
									</Label>
									<Input
										id={`${baseId}-practicingSince`}
										max={new Date().getFullYear()}
										min={1900}
										onChange={(e) =>
											handleInputChange(
												"practicingSince",
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
										placeholder="e.g., 2010"
										type="number"
										value={formData.practicingSince || ""}
									/>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-defaultSlotDuration`}>
										<IconClock className="mr-1 inline h-4 w-4" />
										Slot Duration (min)
									</Label>
									<Input
										id={`${baseId}-defaultSlotDuration`}
										onChange={(e) =>
											handleInputChange(
												"defaultSlotDuration",
												e.target.value ? Number(e.target.value) : 15,
											)
										}
										placeholder="15"
										type="number"
										value={formData.defaultSlotDuration}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Specializations</Label>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
									{specializations.map((spec) => {
										const isSelected = formData.specializationIds?.some(
											(s) => s.specializationId === spec.id,
										);
										const isPrimary = formData.specializationIds?.find(
											(s) => s.specializationId === spec.id,
										)?.isPrimary;

										return (
											<div
												className={cn(
													"flex items-center justify-between rounded-lg border p-2",
													isSelected
														? "border-primary bg-primary/5"
														: "border-border",
												)}
												key={spec.id}
											>
												<div className="flex items-center gap-2">
													<input
														checked={isSelected}
														className="h-4 w-4"
														onChange={() =>
															handleSpecializationChange(spec.id, false)
														}
														type="checkbox"
													/>
													<span className="text-sm">{spec.name}</span>
												</div>
												{isSelected ? (
													<label className="flex items-center gap-1 text-xs">
														<input
															checked={isPrimary || false}
															className="h-3 w-3"
															name="primarySpecialization"
															onChange={(e) => {
																if (e.target.checked) {
																	setFormData((prev) => ({
																		...prev,
																		specializationIds:
																			prev.specializationIds?.map((s) => ({
																				...s,
																				isPrimary:
																					s.specializationId === spec.id,
																			})),
																	}));
																}
															}}
															type="radio"
														/>
														Primary
													</label>
												) : null}
											</div>
										);
									})}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor={`${baseId}-bio`}>Bio</Label>
								<textarea
									className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id={`${baseId}-bio`}
									onChange={(e) => handleInputChange("bio", e.target.value)}
									placeholder="Brief professional biography..."
									value={formData.bio}
								/>
							</div>
						</div>

						<DialogFooter showCloseButton={false}>
							<DialogClose
								render={
									<Button type="button" variant="outline">
										Cancel
									</Button>
								}
							/>
							<Button
								disabled={updateMutation.isPending || isUploading}
								type="submit"
							>
								{updateMutation.isPending ? "Saving..." : "Update Practitioner"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
					<CardDescription>
						Filter practitioners by status and specialization
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<div className="min-w-[200px] flex-1">
							<Input
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search by name, ID, or registration..."
								value={searchTerm}
							/>
						</div>
						<Select
							onValueChange={(value) =>
								setFilterActive(value === "all" ? undefined : value === "true")
							}
							value={
								filterActive === undefined ? "all" : filterActive.toString()
							}
						>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="true">Active</SelectItem>
								<SelectItem value="false">Inactive</SelectItem>
							</SelectContent>
						</Select>
						<Select
							onValueChange={(value) =>
								setFilterVerified(
									value === "all" ? undefined : value === "true",
								)
							}
							value={
								filterVerified === undefined ? "all" : filterVerified.toString()
							}
						>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Verification" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="true">Verified</SelectItem>
								<SelectItem value="false">Unverified</SelectItem>
							</SelectContent>
						</Select>
						<Select
							onValueChange={(value) =>
								setFilterSpecialization(
									value === "all" ? undefined : Number(value),
								)
							}
							value={filterSpecialization?.toString() || "all"}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Specialization" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Specializations</SelectItem>
								{specializations.map((spec) => (
									<SelectItem key={spec.id} value={spec.id.toString()}>
										{spec.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{isLoading ? (
				<Card>
					<CardContent className="p-8">
						<div className="flex items-center justify-center">
							<div className="text-muted-foreground">
								Loading practitioners...
							</div>
						</div>
					</CardContent>
				</Card>
			) : doctors.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<IconStethoscope className="mb-4 h-12 w-12 text-muted-foreground/50" />
						<p className="text-muted-foreground">No practitioners found</p>
						<p className="text-muted-foreground text-sm">
							Add your first practitioner to get started
						</p>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Photo</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Practitioner ID</TableHead>
									<TableHead>Specializations</TableHead>
									<TableHead>Qualification</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Verified</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{doctors.map((doctor) => (
									<TableRow
										className={cn(!doctor.isActive && "opacity-50")}
										key={doctor.id}
									>
										<TableCell>
											<Avatar className="h-10 w-10">
												<AvatarImage
													alt={doctor.name}
													src={doctor.photoKey || undefined}
												/>
												<AvatarFallback className="bg-primary/10 text-primary">
													{doctor.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell className="font-medium">{doctor.name}</TableCell>
										<TableCell>{doctor.doctorId}</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{doctor.specializations.slice(0, 2).map((s) => (
													<Badge
														className={cn(
															s.isPrimary &&
																"bg-primary text-primary-foreground",
														)}
														key={s.id}
														variant="secondary"
													>
														{s.specialization.name}
														{s.isPrimary && " (P)"}
													</Badge>
												))}
												{doctor.specializations.length > 2 && (
													<Badge variant="outline">
														+{doctor.specializations.length - 2}
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>{doctor.qualification}</TableCell>
										<TableCell>
											<Badge
												className={
													doctor.isActive
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}
											>
												{doctor.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												className={
													doctor.isVerified
														? "bg-blue-100 text-blue-800"
														: "bg-yellow-100 text-yellow-800"
												}
											>
												{doctor.isVerified ? "Verified" : "Pending"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link
													params={{ id: doctor.id.toString() }}
													to="/practitioners/$id"
												>
													<Button size="sm" variant="ghost">
														<IconCalendar className="h-4 w-4" />
													</Button>
												</Link>
												<Button
													onClick={() => handleEdit(doctor)}
													size="sm"
													variant="ghost"
												>
													<IconPencil className="h-4 w-4" />
												</Button>
												<Button
													disabled={deleteMutation.isPending}
													onClick={() => handleDelete(doctor)}
													size="sm"
													variant="ghost"
												>
													<IconTrash className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
