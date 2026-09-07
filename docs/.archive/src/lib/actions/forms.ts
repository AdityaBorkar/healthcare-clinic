export const FORM_TYPES = {
	facility: {
		label: "Facility",
		route: "/facilities/new",
	},
	patient: {
		label: "Patient",
		route: "/patients/new",
	},
	practitioner: {
		label: "Practitioner",
		route: "/practitioners/new",
	},
	service: {
		label: "Service",
		route: "/services/new",
	},
	staff: {
		label: "Staff",
		route: "/hr/staff/new",
	},
	vendor: {
		label: "Vendor",
		route: "/vendors/new",
	},
} as const;

export type FormType = keyof typeof FORM_TYPES;
