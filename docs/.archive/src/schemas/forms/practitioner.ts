import * as v from "valibot";

import type { FieldMeta, InputFieldType } from "#/forms";
import { client } from "#/lib/rpc";

export type { FieldMeta, InputFieldType };

function field<TInput>(label: string, input_type?: InputFieldType) {
	return v.metadata<TInput, FieldMeta & Record<string, unknown>>({
		label,
		...(input_type && { input_type }),
	});
}

export const opdTimeSlotSchema = v.object({
	endTime: v.pipe(v.string(), v.nonEmpty()),
	id: v.string(),
	roomNumber: v.string(),
	startTime: v.pipe(v.string(), v.nonEmpty()),
});

export const dayOpdScheduleSchema = v.object({
	enabled: v.boolean(),
	timeSlots: v.array(opdTimeSlotSchema),
});

export const ipdTimeSlotSchema = v.object({
	id: v.string(),
	visitEndTime: v.pipe(v.string(), v.nonEmpty()),
	visitStartTime: v.pipe(v.string(), v.nonEmpty()),
});

export const dayIpdScheduleSchema = v.object({
	enabled: v.boolean(),
	timeSlots: v.array(ipdTimeSlotSchema),
	wardRoundTime: v.string(),
});

export const branchConfigSchema = v.object({
	branchId: v.pipe(
		v.number(),
		v.minValue(1),
		field<number>("Branch", "combobox"),
	),
	id: v.string(),
	ipd: v.object({
		enabled: v.boolean(),
		schedules: v.array(dayIpdScheduleSchema),
	}),
	opd: v.object({
		enabled: v.boolean(),
		schedules: v.array(dayOpdScheduleSchema),
		slotDuration: v.pipe(v.number(), v.minValue(1)),
	}),
});

export const outOfOfficeEntrySchema = v.object({
	affectsIpd: v.boolean(),
	affectsOpd: v.boolean(),
	endDate: v.pipe(v.string(), field<string>("To", "date")),
	id: v.string(),
	reason: v.pipe(v.string(), field<string>("Reason")),
	startDate: v.pipe(v.string(), field<string>("From", "date")),
});

export const documentEntrySchema = v.object({
	description: v.pipe(v.string(), field<string>("Description")),
	fileKey: v.nullable(v.string()),
	fileName: v.string(),
	fileSize: v.number(),
	fileType: v.string(),
	id: v.string(),
	isUploading: v.boolean(),
	previewUrl: v.nullable(v.string()),
	title: v.pipe(
		v.string(),
		v.nonEmpty("Document title is required"),
		field<string>("Title"),
	),
});

export const bankAccountSchema = v.object({
	accountHolderName: v.pipe(
		v.string(),
		v.nonEmpty("Account holder name is required"),
		field<string>("Account Holder Name"),
	),
	accountNumber: v.pipe(
		v.string(),
		v.nonEmpty("Account number is required"),
		field<string>("Account Number"),
	),
	bankBranch: v.pipe(v.string(), field<string>("Branch")),
	bankName: v.pipe(
		v.string(),
		v.nonEmpty("Bank name is required"),
		field<string>("Bank Name"),
	),
	id: v.string(),
	ifscCode: v.pipe(
		v.string(),
		v.nonEmpty("IFSC code is required"),
		field<string>("IFSC Code"),
	),
	isDefault: v.boolean(),
});

export const practitionerFormSchema = v.pipeAsync(
	v.objectAsync({
		additionalQualifications: v.pipe(
			v.string(),
			field<string>("Additional Qualifications"),
		),
		bankAccounts: v.array(bankAccountSchema),
		bio: v.pipe(v.string(), field<string>("Bio", "textarea")),
		branchConfigs: v.array(branchConfigSchema),
		doctorId: v.pipeAsync(
			v.string(),
			v.nonEmpty("Practitioner ID is required"),
			v.checkAsync(async (doctorId) => {
				try {
					const result = await client.doctors.checkDoctorIdUniqueness({
						doctorId,
					});
					return result.isUnique;
				} catch {
					return true;
				}
			}, "Practitioner ID already exists"),
			field<string>("Practitioner ID"),
		),
		documents: v.array(documentEntrySchema),
		email: v.pipeAsync(
			v.string(),
			v.nonEmpty("Email is required"),
			v.email("Invalid email format"),
			v.checkAsync(async (email) => {
				try {
					const result = await client.doctors.checkEmailUniqueness({ email });
					return result.isUnique;
				} catch {
					return true;
				}
			}, "Email already exists"),
			field<string>("Email", "email"),
		),
		name: v.pipe(
			v.string(),
			v.nonEmpty("Name is required"),
			field<string>("Full Name"),
		),
		outOfOfficeEntries: v.array(outOfOfficeEntrySchema),
		phone: v.pipe(v.string(), field<string>("Phone", "tel")),
		photoKey: v.nullable(v.string()),
		photoPreview: v.nullable(v.string()),
		practicingSince: v.optional(
			v.pipe(v.number(), field<number>("Practicing Since", "number")),
		),
		qualification: v.pipe(
			v.string(),
			v.nonEmpty("Qualification is required"),
			field<string>("Qualification"),
		),
		registrationCouncil: v.pipe(
			v.string(),
			field<string>("Registration Council"),
		),
		registrationDate: v.pipe(
			v.string(),
			field<string>("Registration Date", "date"),
		),
		registrationNumber: v.pipeAsync(
			v.string(),
			v.nonEmpty("Registration number is required"),
			v.checkAsync(async (registrationNumber) => {
				try {
					const result = await client.doctors.checkRegistrationNumberUniqueness(
						{
							registrationNumber,
						},
					);
					return result.isUnique;
				} catch {
					return true;
				}
			}, "Registration number already exists"),
			field<string>("Registration Number"),
		),
		specializationIds: v.pipe(
			v.array(
				v.object({
					isPrimary: v.boolean(),
					specializationId: v.number(),
				}),
			),
			field<Array<{ isPrimary: boolean; specializationId: number }>>(
				"Specializations",
				"multi-select",
			),
		),
	}),
	v.check(
		(data) =>
			data.branchConfigs.every((config) => {
				if (config.opd.enabled)
					return config.opd.schedules.some((s) => s.enabled);
				return true;
			}),
		"At least one OPD day schedule is required when OPD is enabled",
	),
	v.check(
		(data) =>
			data.branchConfigs.every((config) => {
				if (config.ipd.enabled)
					return config.ipd.schedules.some((s) => s.enabled);
				return true;
			}),
		"At least one IPD day schedule is required when IPD is enabled",
	),
	v.check(
		(data) => data.documents.every((doc) => doc.fileKey !== null),
		"Document file is required",
	),
);

export type OpdTimeSlot = v.InferInput<typeof opdTimeSlotSchema>;
export type DayOpdSchedule = v.InferInput<typeof dayOpdScheduleSchema>;
export type IpdTimeSlot = v.InferInput<typeof ipdTimeSlotSchema>;
export type DayIpdSchedule = v.InferInput<typeof dayIpdScheduleSchema>;
export type BranchConfig = v.InferInput<typeof branchConfigSchema>;
export type OutOfOfficeEntry = v.InferInput<typeof outOfOfficeEntrySchema>;
export type DocumentEntry = v.InferInput<typeof documentEntrySchema>;
export type BankAccount = v.InferInput<typeof bankAccountSchema>;
export type PractitionerFormValues = v.InferInput<
	typeof practitionerFormSchema
>;
