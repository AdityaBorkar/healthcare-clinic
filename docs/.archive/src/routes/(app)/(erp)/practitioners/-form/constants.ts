import type {
	BranchConfig,
	DayIpdSchedule,
	DayOpdSchedule,
	IpdTimeSlot,
	OpdTimeSlot,
} from "#/schemas/forms/practitioner";

export const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;

export const CURRENT_YEAR = new Date().getFullYear();

export const TOC_SECTIONS = [
	{ id: "photo", label: "Photo" },
	{ id: "basic-info", label: "Basic Information" },
	{ id: "services", label: "Services" },
	{ id: "out-of-office", label: "Out of Office" },
	{ id: "documents", label: "Documents" },
	{ id: "bank-accounts", label: "Bank Accounts" },
] as const;

export const defaultOpdTimeSlot: OpdTimeSlot = {
	endTime: "17:00",
	id: "",
	roomNumber: "",
	startTime: "09:00",
};

export const defaultDayOpdSchedule: DayOpdSchedule = {
	enabled: false,
	timeSlots: [{ ...defaultOpdTimeSlot, id: crypto.randomUUID() }],
};

export const defaultIpdTimeSlot: IpdTimeSlot = {
	id: "",
	visitEndTime: "17:00",
	visitStartTime: "09:00",
};

export const defaultDayIpdSchedule: DayIpdSchedule = {
	enabled: false,
	timeSlots: [{ ...defaultIpdTimeSlot, id: crypto.randomUUID() }],
	wardRoundTime: "",
};

export function createDefaultBranchConfig(branchId: number): BranchConfig {
	return {
		branchId,
		id: crypto.randomUUID(),
		ipd: {
			enabled: false,
			schedules: Array.from({ length: 7 }, () => ({
				...defaultDayIpdSchedule,
				timeSlots: [{ ...defaultIpdTimeSlot, id: crypto.randomUUID() }],
			})),
		},
		opd: {
			enabled: false,
			schedules: Array.from({ length: 7 }, () => ({
				...defaultDayOpdSchedule,
				timeSlots: [{ ...defaultOpdTimeSlot, id: crypto.randomUUID() }],
			})),
			slotDuration: 15,
		},
	};
}

export function createDefaultOutOfOfficeEntry() {
	return {
		affectsIpd: true,
		affectsOpd: true,
		endDate: "",
		id: crypto.randomUUID(),
		reason: "",
		startDate: "",
	};
}

export function createDefaultDocumentEntry() {
	return {
		description: "",
		fileKey: null as string | null,
		fileName: "",
		fileSize: 0,
		fileType: "",
		id: crypto.randomUUID(),
		isUploading: false,
		previewUrl: null as string | null,
		title: "",
	};
}

export function createDefaultBankAccount(isFirst: boolean) {
	return {
		accountHolderName: "",
		accountNumber: "",
		bankBranch: "",
		bankName: "",
		id: crypto.randomUUID(),
		ifscCode: "",
		isDefault: isFirst,
	};
}
