import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef } from "react";
import { useForm } from "react-hook-form";

import TableOfContents from "#/components/forms/table-of-contents";
import { Button } from "#/components/ui/button";
import { client } from "#/lib/rpc";
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";
import { practitionerFormSchema } from "#/schemas/forms/practitioner";
import BankAccountsSection from "./bank-accounts-section";
import BasicInfoSection from "./basic-info-section";
import { TOC_SECTIONS } from "./constants";
import DocumentsSection from "./documents-section";
import OutOfOfficeSection from "./out-of-office-section";
import PhotoSection from "./photo-section";
import ServicesSection from "./services-section";

interface Branch {
	branchCode: string;
	id: number;
	name: string;
}

interface Specialization {
	code: string | null;
	description: string | null;
	id: number;
	isActive: boolean;
	name: string;
}

interface PractitionerFormProps {
	draftId?: number;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function PractitionerForm({
	draftId,
	onCancel,
	onSuccess,
}: PractitionerFormProps) {
	const baseId = useId();
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	const form = useForm<PractitionerFormValues>({
		defaultValues: {
			additionalQualifications: "",
			bankAccounts: [],
			bio: "",
			branchConfigs: [],
			doctorId: "",
			documents: [],
			email: "",
			name: "",
			outOfOfficeEntries: [],
			phone: "",
			photoKey: null,
			photoPreview: null,
			practicingSince: undefined,
			qualification: "",
			registrationCouncil: "",
			registrationDate: "",
			registrationNumber: "",
			specializationIds: [],
		},
		resolver: valibotResolver(practitionerFormSchema),
	});

	const {
		formState: { errors },
		getValues,
		handleSubmit,
		register,
		reset,
		setValue,
		watch,
	} = form;

	const { data: specializations = [] } = useQuery<Specialization[]>({
		queryFn: async () => client.specializations.list({ isActive: true }),
		queryKey: ["specializations"],
	});

	const { data: branches = [] } = useQuery<Branch[]>({
		queryFn: async () => client.branches.list({}),
		queryKey: ["branches"],
	});

	const { data: draft } = useQuery({
		enabled: !!draftId,
		queryFn: () => client.drafts.get({ id: draftId as number }),
		queryKey: ["draft", draftId],
	});

	useEffect(() => {
		if (!draft?.data) return;
		const d = draft.data as Record<string, unknown>;
		reset({
			additionalQualifications: (d.additionalQualifications as string) ?? "",
			bankAccounts:
				(d.bankAccounts as PractitionerFormValues["bankAccounts"]) ?? [],
			bio: (d.bio as string) ?? "",
			branchConfigs:
				(d.branchConfigs as PractitionerFormValues["branchConfigs"]) ?? [],
			doctorId: (d.doctorId as string) ?? "",
			documents: (d.documents as PractitionerFormValues["documents"]) ?? [],
			email: (d.email as string) ?? "",
			name: (d.name as string) ?? "",
			outOfOfficeEntries:
				(d.outOfOfficeEntries as PractitionerFormValues["outOfOfficeEntries"]) ??
				[],
			phone: (d.phone as string) ?? "",
			photoKey: (d.photoKey as string | null) ?? null,
			photoPreview: (d.photoPreview as string | null) ?? null,
			practicingSince: d.practicingSince as number | undefined,
			qualification: (d.qualification as string) ?? "",
			registrationCouncil: (d.registrationCouncil as string) ?? "",
			registrationDate: (d.registrationDate as string) ?? "",
			registrationNumber: (d.registrationNumber as string) ?? "",
			specializationIds:
				(d.specializationIds as PractitionerFormValues["specializationIds"]) ??
				[],
		});
	}, [draft, reset]);

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			const values = getValues();
			const data: Record<string, unknown> = {
				additionalQualifications: values.additionalQualifications,
				bankAccounts: values.bankAccounts,
				bio: values.bio,
				branchConfigs: values.branchConfigs,
				doctorId: values.doctorId,
				documents: values.documents.map((doc) => ({
					description: doc.description,
					fileKey: doc.fileKey,
					fileName: doc.fileName,
					fileSize: doc.fileSize,
					fileType: doc.fileType,
					id: doc.id,
					title: doc.title,
				})),
				email: values.email,
				name: values.name,
				outOfOfficeEntries: values.outOfOfficeEntries,
				phone: values.phone,
				photoKey: values.photoKey,
				photoPreview: values.photoPreview,
				practicingSince: values.practicingSince,
				qualification: values.qualification,
				registrationCouncil: values.registrationCouncil,
				registrationDate: values.registrationDate,
				registrationNumber: values.registrationNumber,
				specializationIds: values.specializationIds,
			};
			const label = values.name || "New Practitioner";
			if (draftId) {
				return client.drafts.update({ data, id: draftId, label });
			}
			return client.drafts.create({ data, formType: "practitioner", label });
		},
	});

	const createMutation = useMutation({
		mutationFn: async (values: PractitionerFormValues) => {
			const doctor = await client.doctors.create({
				additionalQualifications: values.additionalQualifications || undefined,
				bio: values.bio || undefined,
				defaultSlotDuration:
					values.branchConfigs.find((b) => b.opd.enabled)?.opd.slotDuration ??
					15,
				doctorId: values.doctorId,
				email: values.email,
				name: values.name,
				phone: values.phone || undefined,
				photoKey: values.photoKey || undefined,
				practicingSince: values.practicingSince || undefined,
				qualification: values.qualification,
				registrationCouncil: values.registrationCouncil || undefined,
				registrationDate: values.registrationDate || undefined,
				registrationNumber: values.registrationNumber,
				specializationIds:
					values.specializationIds.length > 0
						? values.specializationIds
						: undefined,
			});

			for (const branchConfig of values.branchConfigs) {
				if (branchConfig.opd.enabled) {
					for (const [
						dayIdx,
						schedule,
					] of branchConfig.opd.schedules.entries()) {
						if (schedule.enabled) {
							for (const timeSlot of schedule.timeSlots) {
								await client.doctors.opdSchedules.create({
									branchId: branchConfig.branchId,
									dayOfWeek: dayIdx,
									doctorId: doctor.id,
									endTime: timeSlot.endTime,
									roomNumber: timeSlot.roomNumber || undefined,
									slotDuration: branchConfig.opd.slotDuration,
									startTime: timeSlot.startTime,
								});
							}
						}
					}
				}

				if (branchConfig.ipd.enabled) {
					for (const [
						dayIdx,
						schedule,
					] of branchConfig.ipd.schedules.entries()) {
						if (schedule.enabled) {
							for (const [slotIdx, timeSlot] of schedule.timeSlots.entries()) {
								await client.doctors.ipdSchedules.create({
									branchId: branchConfig.branchId,
									dayOfWeek: dayIdx,
									doctorId: doctor.id,
									visitEndTime: timeSlot.visitEndTime,
									visitStartTime: timeSlot.visitStartTime,
									wardRoundTime:
										slotIdx === 0 && schedule.wardRoundTime
											? schedule.wardRoundTime
											: undefined,
								});
							}
						}
					}
				}
			}

			for (const entry of values.outOfOfficeEntries) {
				if (entry.startDate && entry.endDate) {
					await client.doctors.unavailability.create({
						affectsIpd: entry.affectsIpd,
						affectsOpd: entry.affectsOpd,
						doctorId: doctor.id,
						endDate: new Date(entry.endDate).toISOString(),
						reason: entry.reason || undefined,
						startDate: new Date(entry.startDate).toISOString(),
					});
				}
			}

			for (const doc of values.documents) {
				if (doc.fileKey) {
					await client.doctors.documents.create({
						description: doc.description || undefined,
						doctorId: doctor.id,
						fileKey: doc.fileKey,
						fileName: doc.fileName,
						fileSize: doc.fileSize,
						fileType: doc.fileType,
						title: doc.title,
					});
				}
			}

			for (const account of values.bankAccounts) {
				await client.bankAccounts.create({
					accountHolderName: account.accountHolderName,
					accountNumber: account.accountNumber,
					bankBranch: account.bankBranch || undefined,
					bankName: account.bankName,
					ifscCode: account.ifscCode,
					isDefault: account.isDefault,
					ownerId: doctor.id,
					ownerType: "practitioner",
				});
			}

			return doctor;
		},
		onError: (error: Error) => {
			alert(error.message || "Failed to create practitioner");
		},
		onSuccess: () => {
			if (draftId) {
				client.drafts.delete({ id: draftId }).catch(() => {});
			}
			onSuccess();
		},
	});

	const sectionRef = (id: string) => (el: HTMLElement | null) => {
		sectionRefs.current[id] = el;
	};

	const onSubmit = (values: PractitionerFormValues) => {
		createMutation.mutate(values);
	};

	const isUploading = watch("documents")?.some((d) => d.isUploading) ?? false;

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">New Practitioner</h1>
				<p className="text-muted-foreground">
					Add a new practitioner to the system
				</p>
			</div>

			<div className="flex gap-8">
				<TableOfContents sectionRefs={sectionRefs} sections={TOC_SECTIONS} />

				<form
					className="max-w-4xl flex-1 space-y-6"
					onSubmit={handleSubmit(onSubmit)}
				>
					<PhotoSection
						baseId={baseId}
						sectionRef={sectionRef("photo")}
						setValue={setValue}
						watch={watch}
					/>

					<BasicInfoSection
						baseId={baseId}
						control={form.control}
						errors={errors}
						register={register}
						sectionRef={sectionRef("basic-info")}
						setValue={setValue}
						specializations={specializations}
						watch={watch()}
					/>

					<ServicesSection
						baseId={baseId}
						branches={branches}
						form={form}
						sectionRef={sectionRef("services")}
					/>

					<OutOfOfficeSection
						baseId={baseId}
						form={form}
						sectionRef={sectionRef("out-of-office")}
					/>

					<DocumentsSection
						baseId={baseId}
						form={form}
						sectionRef={sectionRef("documents")}
					/>

					<BankAccountsSection
						baseId={baseId}
						form={form}
						sectionRef={sectionRef("bank-accounts")}
					/>

					<div className="flex justify-end gap-3">
						<Button onClick={onCancel} type="button" variant="outline">
							Cancel
						</Button>
						<Button
							disabled={saveDraftMutation.isPending}
							onClick={() => saveDraftMutation.mutate()}
							type="button"
							variant="outline"
						>
							{saveDraftMutation.isPending ? "Saving..." : "Save as Draft"}
						</Button>
						<Button
							disabled={createMutation.isPending || isUploading}
							type="submit"
						>
							{createMutation.isPending ? "Creating..." : "Create Practitioner"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
