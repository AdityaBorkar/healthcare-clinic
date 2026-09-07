import {
	IconCertificate,
	IconMail,
	IconPhone,
	IconStethoscope,
} from "@tabler/icons-react";
import type {
	Control,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { cn } from "#/lib/utils";
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";
import { CURRENT_YEAR } from "./constants";

interface Specialization {
	code: string | null;
	description: string | null;
	id: number;
	isActive: boolean;
	name: string;
}

interface BasicInfoSectionProps {
	baseId: string;
	control: Control<PractitionerFormValues>;
	errors: Record<string, { message?: string }>;
	register: UseFormRegister<PractitionerFormValues>;
	sectionRef: (el: HTMLElement | null) => void;
	setValue: UseFormSetValue<PractitionerFormValues>;
	specializations: Specialization[];
	watch: PractitionerFormValues;
}

export default function BasicInfoSection({
	baseId,
	control,
	errors,
	register,
	sectionRef,
	setValue,
	specializations,
	watch,
}: BasicInfoSectionProps) {
	const specializationIds = watch.specializationIds;

	const handleSpecializationChange = (specId: number) => {
		const existing = specializationIds.find(
			(s) => s.specializationId === specId,
		);
		if (existing) {
			setValue(
				"specializationIds",
				specializationIds.filter((s) => s.specializationId !== specId),
				{ shouldDirty: true },
			);
		} else {
			setValue(
				"specializationIds",
				[...specializationIds, { isPrimary: false, specializationId: specId }],
				{ shouldDirty: true },
			);
		}
	};

	return (
		<Card id={`${baseId}-basic-info`} ref={sectionRef}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconStethoscope className="h-5 w-5" />
					Basic Information
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-doctorId`}>
							Practitioner ID <span className="text-destructive">*</span>
						</Label>
						<Input
							aria-invalid={!!errors.doctorId}
							id={`${baseId}-doctorId`}
							placeholder="e.g., DOC001"
							{...register("doctorId")}
						/>
						{errors.doctorId ? (
							<p className="text-destructive text-xs">
								{errors.doctorId.message}
							</p>
						) : null}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-name`}>
							Full Name <span className="text-destructive">*</span>
						</Label>
						<Input
							aria-invalid={!!errors.name}
							id={`${baseId}-name`}
							placeholder="Dr. John Smith"
							{...register("name")}
						/>
						{errors.name ? (
							<p className="text-destructive text-xs">{errors.name.message}</p>
						) : null}
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-email`}>
							<IconMail className="mr-1 inline h-4 w-4" />
							Email <span className="text-destructive">*</span>
						</Label>
						<Input
							aria-invalid={!!errors.email}
							id={`${baseId}-email`}
							placeholder="doctor@hospital.com"
							type="email"
							{...register("email")}
						/>
						{errors.email ? (
							<p className="text-destructive text-xs">{errors.email.message}</p>
						) : null}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-phone`}>
							<IconPhone className="mr-1 inline h-4 w-4" />
							Phone
						</Label>
						<Input
							id={`${baseId}-phone`}
							placeholder="+91 98765 43210"
							{...register("phone")}
						/>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-registrationNumber`}>
							<IconCertificate className="mr-1 inline h-4 w-4" />
							Registration Number <span className="text-destructive">*</span>
						</Label>
						<Input
							aria-invalid={!!errors.registrationNumber}
							id={`${baseId}-registrationNumber`}
							placeholder="MCI-12345"
							{...register("registrationNumber")}
						/>
						{errors.registrationNumber ? (
							<p className="text-destructive text-xs">
								{errors.registrationNumber.message}
							</p>
						) : null}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-registrationCouncil`}>
							Registration Council
						</Label>
						<Input
							id={`${baseId}-registrationCouncil`}
							placeholder="Medical Council of India"
							{...register("registrationCouncil")}
						/>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-registrationDate`}>
							Registration Date
						</Label>
						<Input
							id={`${baseId}-registrationDate`}
							type="date"
							{...register("registrationDate")}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-qualification`}>
							Qualification <span className="text-destructive">*</span>
						</Label>
						<Input
							aria-invalid={!!errors.qualification}
							id={`${baseId}-qualification`}
							placeholder="MBBS, MD"
							{...register("qualification")}
						/>
						{errors.qualification ? (
							<p className="text-destructive text-xs">
								{errors.qualification.message}
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
							placeholder="DM, MCh, Fellowship"
							{...register("additionalQualifications")}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor={`${baseId}-practicingSince`}>
							Practicing Since
						</Label>
						<Controller
							control={control}
							name="practicingSince"
							render={({ field }) => (
								<Input
									id={`${baseId}-practicingSince`}
									max={CURRENT_YEAR}
									min={1900}
									onChange={(e) =>
										field.onChange(
											e.target.value ? Number(e.target.value) : undefined,
										)
									}
									placeholder="e.g., 2010"
									type="number"
									value={field.value ?? ""}
								/>
							)}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Specializations</Label>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{specializations.map((spec) => {
							const isSelected = specializationIds.some(
								(s) => s.specializationId === spec.id,
							);
							return (
								<div
									className={cn(
										"flex items-center gap-2 rounded-lg border p-2",
										isSelected
											? "border-primary bg-primary/5"
											: "border-border",
									)}
									key={spec.id}
								>
									<input
										checked={isSelected}
										className="h-4 w-4"
										onChange={() => handleSpecializationChange(spec.id)}
										type="checkbox"
									/>
									<span className="text-sm">{spec.name}</span>
								</div>
							);
						})}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor={`${baseId}-bio`}>Bio</Label>
					<Textarea
						id={`${baseId}-bio`}
						placeholder="Brief professional biography..."
						{...register("bio")}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
