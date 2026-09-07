export const INDIAN_STATES_AND_UTS = [
	{ code: "AN", isUT: true, name: "Andaman and Nicobar Islands" },
	{ code: "AP", isUT: false, name: "Andhra Pradesh" },
	{ code: "AR", isUT: false, name: "Arunachal Pradesh" },
	{ code: "AS", isUT: false, name: "Assam" },
	{ code: "BR", isUT: false, name: "Bihar" },
	{ code: "CH", isUT: true, name: "Chandigarh" },
	{ code: "CT", isUT: false, name: "Chhattisgarh" },
	{ code: "DN", isUT: true, name: "Dadra and Nagar Haveli and Daman and Diu" },
	{ code: "DL", isUT: true, name: "Delhi" },
	{ code: "GA", isUT: false, name: "Goa" },
	{ code: "GJ", isUT: false, name: "Gujarat" },
	{ code: "HR", isUT: false, name: "Haryana" },
	{ code: "HP", isUT: false, name: "Himachal Pradesh" },
	{ code: "JK", isUT: true, name: "Jammu and Kashmir" },
	{ code: "JH", isUT: false, name: "Jharkhand" },
	{ code: "KA", isUT: false, name: "Karnataka" },
	{ code: "KL", isUT: false, name: "Kerala" },
	{ code: "LA", isUT: true, name: "Ladakh" },
	{ code: "LD", isUT: true, name: "Lakshadweep" },
	{ code: "MP", isUT: false, name: "Madhya Pradesh" },
	{ code: "MH", isUT: false, name: "Maharashtra" },
	{ code: "MN", isUT: false, name: "Manipur" },
	{ code: "ML", isUT: false, name: "Meghalaya" },
	{ code: "MZ", isUT: false, name: "Mizoram" },
	{ code: "NL", isUT: false, name: "Nagaland" },
	{ code: "OR", isUT: false, name: "Odisha" },
	{ code: "PY", isUT: true, name: "Puducherry" },
	{ code: "PB", isUT: false, name: "Punjab" },
	{ code: "RJ", isUT: false, name: "Rajasthan" },
	{ code: "SK", isUT: false, name: "Sikkim" },
	{ code: "TN", isUT: false, name: "Tamil Nadu" },
	{ code: "TG", isUT: false, name: "Telangana" },
	{ code: "TR", isUT: false, name: "Tripura" },
	{ code: "UP", isUT: false, name: "Uttar Pradesh" },
	{ code: "UT", isUT: false, name: "Uttarakhand" },
	{ code: "WB", isUT: false, name: "West Bengal" },
] as const;

export const INDIAN_STATES = INDIAN_STATES_AND_UTS.filter((s) => !s.isUT);

export const INDIAN_UNION_TERRITORIES = INDIAN_STATES_AND_UTS.filter(
	(s) => s.isUT,
);

export const STATE_OPTIONS = INDIAN_STATES_AND_UTS.map((s) => ({
	label: s.name,
	value: s.name,
}));
