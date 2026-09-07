import {
	IconAlertCircle,
	IconCamera,
	IconHeart,
	IconId,
	IconMapPin,
	IconPhone,
	IconPlus,
	IconShield,
	IconTrash,
	IconUser,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import * as v from "valibot";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { STATE_OPTIONS } from "#/lib/constants/indian-states";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/emr/new")({
	component: NewPatient,
	head: () => ({
		meta: [{ title: "New Patient (Shaun)" }],
	}),
	validateSearch: v.object({ draftId: v.optional(v.number()) }),
});

interface FormIdentifier {
	id: string;
	system: string;
	type: string;
	value: string;
}

interface FormEmergencyContact {
	id: string;
	name: string;
	phone: string;
	relation: string;
}

interface FormInsurancePolicy {
	id: string;
	policyNumber: string;
	providerName: string;
}

const patientSchema = v.object({
	active: v.optional(v.boolean(), true),
	addressLine1: v.optional(v.string()),
	addressLine2: v.optional(v.string()),
	allergies: v.optional(v.string()),
	birthDate: v.pipe(v.string(), v.minLength(1, "Date of birth is required")),
	bloodGroup: v.optional(
		v.union([
			v.picklist(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"]),
			v.literal(""),
		]),
	),
	city: v.optional(v.string()),
	country: v.optional(v.string(), "India"),
	email: v.optional(
		v.union([
			v.pipe(v.string(), v.email("Invalid email format")),
			v.literal(""),
		]),
	),
	gender: v.picklist(["male", "female", "other", "unknown"]),
	maritalStatus: v.optional(
		v.union([
			v.picklist(["single", "married", "divorced", "widowed", "unknown"]),
			v.literal(""),
		]),
	),
	name: v.pipe(v.string(), v.minLength(1, "Patient name is required")),
	nationality: v.optional(v.string(), "Indian"),
	occupation: v.optional(v.string()),
	phone: v.pipe(v.string(), v.minLength(1, "Phone number is required")),
	pincode: v.optional(
		v.union([
			v.pipe(
				v.string(),
				v.regex(/^[1-9][0-9]{5}$/, "Invalid pincode (6 digits required)"),
			),
			v.literal(""),
		]),
	),
	state: v.optional(v.string()),
});

type PatientFormData = v.InferOutput<typeof patientSchema> & {
	emergencyContacts?: FormEmergencyContact[];
	identifiers?: FormIdentifier[];
	insurancePolicies?: FormInsurancePolicy[];
	photoUrl?: string;
};

const NDHM_IDENTIFIER_TYPES = [
	{ code: "ABHA", label: "ABHA Number (14-digit)" },
	{ code: "ADN", label: "Aadhaar Number (12-digit)" },
	{ code: "PMJAY", label: "PMJAY ID" },
	{ code: "VID", label: "Voter ID" },
	{ code: "DL", label: "Driving License" },
	{ code: "PAN", label: "PAN Card" },
	{ code: "RCN", label: "Ration Card Number" },
	{ code: "CGHS", label: "CGHS ID" },
	{ code: "ECHS", label: "ECHS ID" },
	{ code: "HIN", label: "Health ID (NDHM)" },
	{ code: "ODN", label: "Other Document" },
];

const BLOOD_GROUPS = [
	{ label: "A+", value: "A+" },
	{ label: "A-", value: "A-" },
	{ label: "B+", value: "B+" },
	{ label: "B-", value: "B-" },
	{ label: "AB+", value: "AB+" },
	{ label: "AB-", value: "AB-" },
	{ label: "O+", value: "O+" },
	{ label: "O-", value: "O-" },
	{ label: "Unknown", value: "unknown" },
];

const MARITAL_STATUS_OPTIONS = [
	{ label: "Single", value: "single" },
	{ label: "Married", value: "married" },
	{ label: "Divorced", value: "divorced" },
	{ label: "Widowed", value: "widowed" },
	{ label: "Unknown", value: "unknown" },
];

const RELATION_OPTIONS = [
	{ label: "Spouse", value: "spouse" },
	{ label: "Parent", value: "parent" },
	{ label: "Sibling", value: "sibling" },
	{ label: "Child", value: "child" },
	{ label: "Friend", value: "friend" },
	{ label: "Other", value: "other" },
];

const TOC_SECTIONS = [
	{ id: "basic-info", label: "Basic Information" },
	{ id: "identifiers", label: "Identifiers" },
	{ id: "contact", label: "Contact Information" },
	{ id: "address", label: "Address" },
	{ id: "emergency-contacts", label: "Emergency Contacts" },
	{ id: "insurance", label: "Insurance" },
	{ id: "medical-notes", label: "Medical Notes" },
	{ id: "photo", label: "Photo" },
] as const;

const DEFAULT_FORM_DATA: PatientFormData = {
	active: true,
	addressLine1: "",
	addressLine2: "",
	allergies: "",
	birthDate: "",
	bloodGroup: "",
	city: "",
	country: "India",
	email: "",
	emergencyContacts: [],
	gender: "male",
	identifiers: [],
	insurancePolicies: [],
	maritalStatus: "",
	name: "",
	nationality: "Indian",
	occupation: "",
	phone: "",
	pincode: "",
	state: "",
};

function NewPatient() {
	const { branchId } = Route.useParams();
	const { draftId } = Route.useSearch();
	const baseId = useId();
	const navigate = useNavigate();
	const [formData, setFormData] = useState<PatientFormData>(DEFAULT_FORM_DATA);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [activeSection, setActiveSection] = useState<string>("basic-info");
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	const { data: draft } = useQuery({
		enabled: !!draftId,
		queryFn: () => client.drafts.get({ id: draftId as number }),
		queryKey: ["draft", draftId],
	});

	useEffect(() => {
		if (!draft?.data) return;
		const d = draft.data;
		setFormData((prev) => ({
			...prev,
			...d,
			emergencyContacts:
				(d.emergencyContacts as PatientFormData["emergencyContacts"]) ??
				prev.emergencyContacts,
			identifiers:
				(d.identifiers as PatientFormData["identifiers"]) ?? prev.identifiers,
			insurancePolicies:
				(d.insurancePolicies as PatientFormData["insurancePolicies"]) ??
				prev.insurancePolicies,
		}));
		if (d.photoUrl) {
			setPhotoPreview(d.photoUrl as string);
		}
	}, [draft]);

	useEffect(() => {
		const prefix = `${baseId}-`;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id.replace(prefix, ""));
					}
				}
			},
			{ rootMargin: "-80px 0px -60% 0px" },
		);

		for (const section of TOC_SECTIONS) {
			const el = sectionRefs.current[section.id];
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, [baseId]);

	const scrollToSection = (id: string) => {
		sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
	};

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			const data: Record<string, unknown> = { ...formData };
			const label = (formData.name as string) || "New Patient";
			if (draftId) {
				return client.drafts.update({ data, id: draftId, label });
			}
			return client.drafts.create({ data, formType: "patient", label });
		},
		onSuccess: (result) => {
			if (!draftId) {
				navigate({
					params: { branchId },
					search: { draftId: result.id },
					to: "/$branchId/emr/new",
				});
			}
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.patients.create>[0]) =>
			client.patients.create(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to create patient");
		},
		onSuccess: () => {
			if (draftId) {
				client.drafts.delete({ id: draftId }).catch(() => {});
			}
			navigate({ params: { branchId }, to: "/$branchId/emr" });
		},
	});

	const handleInputChange = (
		field: keyof PatientFormData,
		value: string | boolean | null,
	) => {
		if (value === null) return;
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleAddIdentifier = () => {
		setFormData((prev) => ({
			...prev,
			identifiers: [
				...(prev.identifiers || []),
				{ id: crypto.randomUUID(), system: "", type: "ODN", value: "" },
			],
		}));
	};

	const handleRemoveIdentifier = (id: string) => {
		setFormData((prev) => ({
			...prev,
			identifiers: prev.identifiers?.filter((item) => item.id !== id),
		}));
	};

	const handleIdentifierChange = (
		id: string,
		field: "type" | "system" | "value",
		value: string,
	) => {
		setFormData((prev) => {
			const identifiers = (prev.identifiers || []).map((item) => {
				if (item.id === id) {
					return { ...item, [field]: value };
				}
				return item;
			});
			return { ...prev, identifiers };
		});
	};

	const handleAbhaChange = (rawValue: string) => {
		const value = rawValue.replace(/\D/g, "");
		const existing = formData.identifiers?.find((i) => i.type === "ABHA");
		if (existing) {
			handleIdentifierChange(existing.id, "value", value);
		} else if (value) {
			setFormData((prev) => ({
				...prev,
				identifiers: [
					...(prev.identifiers || []),
					{ id: crypto.randomUUID(), system: "", type: "ABHA", value },
				],
			}));
		}
	};

	const abhaValue =
		formData.identifiers?.find((i) => i.type === "ABHA")?.value || "";

	const handleAddInsurancePolicy = () => {
		setFormData((prev) => ({
			...prev,
			insurancePolicies: [
				...(prev.insurancePolicies || []),
				{ id: crypto.randomUUID(), policyNumber: "", providerName: "" },
			],
		}));
	};

	const handleRemoveInsurancePolicy = (id: string) => {
		setFormData((prev) => ({
			...prev,
			insurancePolicies: prev.insurancePolicies?.filter(
				(item) => item.id !== id,
			),
		}));
	};

	const handleInsurancePolicyChange = (
		id: string,
		field: "providerName" | "policyNumber",
		value: string,
	) => {
		setFormData((prev) => {
			const insurancePolicies = (prev.insurancePolicies || []).map((item) => {
				if (item.id === id) {
					return { ...item, [field]: value };
				}
				return item;
			});
			return { ...prev, insurancePolicies };
		});
	};

	const handleAddEmergencyContact = () => {
		setFormData((prev) => ({
			...prev,
			emergencyContacts: [
				...(prev.emergencyContacts || []),
				{ id: crypto.randomUUID(), name: "", phone: "", relation: "spouse" },
			],
		}));
	};

	const handleRemoveEmergencyContact = (id: string) => {
		setFormData((prev) => ({
			...prev,
			emergencyContacts: prev.emergencyContacts?.filter(
				(item) => item.id !== id,
			),
		}));
	};

	const handleEmergencyContactChange = (
		id: string,
		field: "name" | "phone" | "relation",
		value: string,
	) => {
		setFormData((prev) => {
			const emergencyContacts = (prev.emergencyContacts || []).map((item) => {
				if (item.id === id) {
					return { ...item, [field]: value };
				}
				return item;
			});
			return { ...prev, emergencyContacts };
		});
	};

	const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const preview = URL.createObjectURL(file);
		setPhotoPreview(preview);

		try {
			const result = await client.patients.getPresignedPhotoUrl({
				contentType: file.type,
				patientId: `temp-${Date.now()}`,
			});

			const uploadResponse = await fetch(result.presignedUrl, {
				body: file,
				headers: { "Content-Type": file.type },
				method: "PUT",
			});

			if (uploadResponse.ok) {
				setFormData((prev) => ({ ...prev, photoUrl: result.publicUrl }));
			}
		} catch (error) {
			console.error("Failed to upload photo:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const dataToValidate = {
			...formData,
			emergencyContacts: formData.emergencyContacts?.map(
				({ id: _, ...rest }) => rest,
			),
			identifiers: formData.identifiers?.map(({ id: _, ...rest }) => rest),
			insurancePolicies: formData.insurancePolicies?.map(
				({ id: _, ...rest }) => rest,
			),
		};

		const result = v.safeParse(patientSchema, dataToValidate);
		if (!result.success) {
			const newErrors: Record<string, string> = {};
			for (const issue of result.issues) {
				const path = issue.path?.map((p) => String(p.key)).join(".") ?? "";
				if (!newErrors[path]) {
					newErrors[path] = issue.message;
				}
			}
			setErrors(newErrors);
			return;
		}

		const firstPolicy = formData.insurancePolicies?.[0];
		const submitData = {
			...result.output,
			emergencyContacts: formData.emergencyContacts?.map(
				({ id: _, ...rest }) => rest,
			),
			identifiers: formData.identifiers?.map(({ id: _, ...rest }) => rest),
			insurancePolicyNumber: firstPolicy?.policyNumber || undefined,
			insuranceProvider: firstPolicy?.providerName || undefined,
			photoUrl: formData.photoUrl,
		};

		await createMutation.mutateAsync(
			submitData as Parameters<typeof createMutation.mutateAsync>[0],
		);
	};

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Create New Patient</h1>
				<p className="text-muted-foreground">
					Register a new patient with NDHM FHIR-compliant fields
				</p>
			</div>

			<div className="flex gap-8">
				<nav className="hidden lg:block lg:w-52 lg:shrink-0">
					<div className="sticky top-24 space-y-1">
						<p className="mb-3 font-semibold text-sm">Contents</p>
						{TOC_SECTIONS.map((section) => (
							<button
								className={cn(
									"block w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors",
									activeSection === section.id
										? "bg-primary/10 font-medium text-primary"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
								key={section.id}
								onClick={() => scrollToSection(section.id)}
								type="button"
							>
								{section.label}
							</button>
						))}
					</div>
				</nav>

				<form className="max-w-4xl flex-1 space-y-6" onSubmit={handleSubmit}>
					<Card
						id={`${baseId}-basic-info`}
						ref={(el) => {
							sectionRefs.current["basic-info"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconUser className="h-5 w-5 text-primary" />
								<CardTitle>Basic Information</CardTitle>
							</div>
							<CardDescription>
								Patient demographics and personal details
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-name`}>Full Name *</Label>
								<Input
									aria-invalid={!!errors.name}
									id={`${baseId}-name`}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="Enter patient's full name"
									value={formData.name}
								/>
								{errors.name ? (
									<p className="text-destructive text-xs">{errors.name}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-gender`}>Gender *</Label>
								<Select
									onValueChange={(v) => handleInputChange("gender", v)}
									value={formData.gender}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
										<SelectItem value="other">Other</SelectItem>
										<SelectItem value="unknown">Unknown</SelectItem>
									</SelectContent>
								</Select>
								{errors.gender ? (
									<p className="text-destructive text-xs">{errors.gender}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-birthDate`}>Date of Birth *</Label>
								<Input
									aria-invalid={!!errors.birthDate}
									id={`${baseId}-birthDate`}
									max={new Date().toISOString().split("T")[0]}
									onChange={(e) =>
										handleInputChange("birthDate", e.target.value)
									}
									type="date"
									value={formData.birthDate}
								/>
								{errors.birthDate ? (
									<p className="text-destructive text-xs">{errors.birthDate}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-bloodGroup`}>Blood Group</Label>
								<Select
									onValueChange={(v) => handleInputChange("bloodGroup", v)}
									value={formData.bloodGroup ?? ""}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select blood group" />
									</SelectTrigger>
									<SelectContent>
										{BLOOD_GROUPS.map((bg) => (
											<SelectItem key={bg.value} value={bg.value}>
												{bg.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-maritalStatus`}>
									Marital Status
								</Label>
								<Select
									onValueChange={(v) => handleInputChange("maritalStatus", v)}
									value={formData.maritalStatus ?? ""}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select marital status" />
									</SelectTrigger>
									<SelectContent>
										{MARITAL_STATUS_OPTIONS.map((ms) => (
											<SelectItem key={ms.value} value={ms.value}>
												{ms.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-nationality`}>Nationality</Label>
								<Input
									id={`${baseId}-nationality`}
									onChange={(e) =>
										handleInputChange("nationality", e.target.value)
									}
									value={formData.nationality}
								/>
							</div>
							<div className="space-y-2 sm:col-span-2">
								<Label htmlFor={`${baseId}-occupation`}>Occupation</Label>
								<Input
									id={`${baseId}-occupation`}
									onChange={(e) =>
										handleInputChange("occupation", e.target.value)
									}
									placeholder="Patient's occupation"
									value={formData.occupation}
								/>
							</div>
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-identifiers`}
						ref={(el) => {
							sectionRefs.current["identifiers"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconId className="h-5 w-5 text-primary" />
								<CardTitle>Identifiers (NDHM/FHIR)</CardTitle>
							</div>
							<CardDescription>
								Government IDs and health identifiers
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-abha`}>ABHA Number</Label>
								<Input
									id={`${baseId}-abha`}
									maxLength={14}
									onChange={(e) => handleAbhaChange(e.target.value)}
									placeholder="14-digit ABHA number"
									value={abhaValue}
								/>
							</div>

							<div className="border-t pt-4">
								<div className="mb-3 flex items-center justify-between">
									<p className="font-medium text-muted-foreground text-sm">
										Other Identifiers
									</p>
									<Button
										onClick={handleAddIdentifier}
										size="sm"
										type="button"
										variant="outline"
									>
										<IconPlus data-icon="inline-start" />
										Add ID
									</Button>
								</div>
								{formData.identifiers
									?.filter((id) => id.type !== "ABHA")
									.map((id) => (
										<div
											className="mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_2fr_auto]"
											key={id.id}
										>
											<div className="space-y-1">
												<Label>Type</Label>
												<Select
													onValueChange={(v) =>
														handleIdentifierChange(id.id, "type", v ?? "")
													}
													value={id.type}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select type" />
													</SelectTrigger>
													<SelectContent>
														{NDHM_IDENTIFIER_TYPES.filter(
															(t) => t.code !== "ABHA",
														).map((t) => (
															<SelectItem key={t.code} value={t.code}>
																{t.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-1">
												<Label>Value</Label>
												<Input
													onChange={(e) =>
														handleIdentifierChange(
															id.id,
															"value",
															e.target.value,
														)
													}
													placeholder="Identifier value"
													value={id.value}
												/>
											</div>
											<div className="flex items-end">
												<Button
													onClick={() => handleRemoveIdentifier(id.id)}
													size="icon"
													type="button"
													variant="ghost"
												>
													<IconTrash className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</div>
									))}
								{(!formData.identifiers ||
									formData.identifiers.filter((i) => i.type !== "ABHA")
										.length === 0) && (
									<p className="py-2 text-center text-muted-foreground text-sm">
										No additional identifiers added
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-contact`}
						ref={(el) => {
							sectionRefs.current["contact"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconPhone className="h-5 w-5 text-primary" />
								<CardTitle>Contact Information</CardTitle>
							</div>
							<CardDescription>Phone and email details</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-phone`}>Primary Phone *</Label>
								<Input
									aria-invalid={!!errors.phone}
									id={`${baseId}-phone`}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									placeholder="+91 9876543210"
									value={formData.phone}
								/>
								{errors.phone ? (
									<p className="text-destructive text-xs">{errors.phone}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-email`}>Email</Label>
								<Input
									aria-invalid={!!errors.email}
									id={`${baseId}-email`}
									onChange={(e) => handleInputChange("email", e.target.value)}
									placeholder="patient@example.com"
									type="email"
									value={formData.email}
								/>
								{errors.email ? (
									<p className="text-destructive text-xs">{errors.email}</p>
								) : null}
							</div>
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-address`}
						ref={(el) => {
							sectionRefs.current["address"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconMapPin className="h-5 w-5 text-primary" />
								<CardTitle>Address</CardTitle>
							</div>
							<CardDescription>Residential address details</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2 sm:col-span-2">
								<Label htmlFor={`${baseId}-addressLine1`}>Address Line 1</Label>
								<Input
									id={`${baseId}-addressLine1`}
									onChange={(e) =>
										handleInputChange("addressLine1", e.target.value)
									}
									placeholder="Street address, building/flat number"
									value={formData.addressLine1}
								/>
							</div>
							<div className="space-y-2 sm:col-span-2">
								<Label htmlFor={`${baseId}-addressLine2`}>Address Line 2</Label>
								<Input
									id={`${baseId}-addressLine2`}
									onChange={(e) =>
										handleInputChange("addressLine2", e.target.value)
									}
									placeholder="Area, landmark (optional)"
									value={formData.addressLine2}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-city`}>City</Label>
								<Input
									id={`${baseId}-city`}
									onChange={(e) => handleInputChange("city", e.target.value)}
									placeholder="City name"
									value={formData.city}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-state`}>State</Label>
								<Select
									onValueChange={(v) => handleInputChange("state", v)}
									value={formData.state ?? ""}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select state" />
									</SelectTrigger>
									<SelectContent>
										{STATE_OPTIONS.map((s) => (
											<SelectItem key={s.value} value={s.value}>
												{s.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-pincode`}>Pincode</Label>
								<Input
									aria-invalid={!!errors.pincode}
									id={`${baseId}-pincode`}
									maxLength={6}
									onChange={(e) => handleInputChange("pincode", e.target.value)}
									placeholder="400001"
									value={formData.pincode}
								/>
								{errors.pincode ? (
									<p className="text-destructive text-xs">{errors.pincode}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-country`}>Country</Label>
								<Input
									id={`${baseId}-country`}
									onChange={(e) => handleInputChange("country", e.target.value)}
									value={formData.country}
								/>
							</div>
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-emergency-contacts`}
						ref={(el) => {
							sectionRefs.current["emergency-contacts"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<div className="flex items-center gap-2">
										<IconAlertCircle className="h-5 w-5 text-primary" />
										<CardTitle>Emergency Contacts</CardTitle>
									</div>
									<CardDescription>
										People to contact in case of emergency
									</CardDescription>
								</div>
								<Button
									onClick={handleAddEmergencyContact}
									size="sm"
									type="button"
									variant="outline"
								>
									<IconPlus data-icon="inline-start" />
									Add Contact
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{formData.emergencyContacts?.map((contact) => (
								<div
									className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
									key={contact.id}
								>
									<div className="space-y-1">
										<Label>Name</Label>
										<Input
											onChange={(e) =>
												handleEmergencyContactChange(
													contact.id,
													"name",
													e.target.value,
												)
											}
											placeholder="Contact name"
											value={contact.name}
										/>
									</div>
									<div className="space-y-1">
										<Label>Relationship</Label>
										<Select
											onValueChange={(v) =>
												handleEmergencyContactChange(
													contact.id,
													"relation",
													v ?? "",
												)
											}
											value={contact.relation}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select relation" />
											</SelectTrigger>
											<SelectContent>
												{RELATION_OPTIONS.map((r) => (
													<SelectItem key={r.value} value={r.value}>
														{r.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label>Phone</Label>
										<Input
											onChange={(e) =>
												handleEmergencyContactChange(
													contact.id,
													"phone",
													e.target.value,
												)
											}
											placeholder="Contact phone"
											value={contact.phone}
										/>
									</div>
									<div className="flex items-end">
										<Button
											onClick={() => handleRemoveEmergencyContact(contact.id)}
											size="icon"
											type="button"
											variant="ghost"
										>
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							))}
							{(!formData.emergencyContacts ||
								formData.emergencyContacts.length === 0) && (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No emergency contacts added. Click &quot;Add Contact&quot; to
									add one.
								</p>
							)}
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-insurance`}
						ref={(el) => {
							sectionRefs.current["insurance"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<div className="flex items-center gap-2">
										<IconShield className="h-5 w-5 text-primary" />
										<CardTitle>Insurance</CardTitle>
									</div>
									<CardDescription>
										Add insurance policy details
									</CardDescription>
								</div>
								<Button
									onClick={handleAddInsurancePolicy}
									size="sm"
									type="button"
									variant="outline"
								>
									<IconPlus data-icon="inline-start" />
									Add Policy
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{formData.insurancePolicies?.map((policy) => (
								<div
									className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]"
									key={policy.id}
								>
									<div className="space-y-1">
										<Label>Provider Name</Label>
										<Input
											onChange={(e) =>
												handleInsurancePolicyChange(
													policy.id,
													"providerName",
													e.target.value,
												)
											}
											placeholder="Insurance company name"
											value={policy.providerName}
										/>
									</div>
									<div className="space-y-1">
										<Label>Policy Number</Label>
										<Input
											onChange={(e) =>
												handleInsurancePolicyChange(
													policy.id,
													"policyNumber",
													e.target.value,
												)
											}
											placeholder="Insurance policy number"
											value={policy.policyNumber}
										/>
									</div>
									<div className="flex items-end">
										<Button
											onClick={() => handleRemoveInsurancePolicy(policy.id)}
											size="icon"
											type="button"
											variant="ghost"
										>
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							))}
							{(!formData.insurancePolicies ||
								formData.insurancePolicies.length === 0) && (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No insurance policies added. Click &quot;Add Policy&quot; to
									add one.
								</p>
							)}
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-medical-notes`}
						ref={(el) => {
							sectionRefs.current["medical-notes"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconHeart className="h-5 w-5 text-primary" />
								<CardTitle>Medical Notes</CardTitle>
							</div>
							<CardDescription>
								Known allergies and medical notes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-allergies`}>Known Allergies</Label>
								<Textarea
									id={`${baseId}-allergies`}
									onChange={(e) =>
										handleInputChange("allergies", e.target.value)
									}
									placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
									value={formData.allergies}
								/>
							</div>
						</CardContent>
					</Card>

					<Card
						id={`${baseId}-photo`}
						ref={(el) => {
							sectionRefs.current["photo"] = el;
						}}
					>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconCamera className="h-5 w-5 text-primary" />
								<CardTitle>Photo Upload (Optional)</CardTitle>
							</div>
							<CardDescription>
								Patient photograph for identification
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-6">
								<div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
									{photoPreview ? (
										<img
											alt="Patient preview"
											className="h-full w-full object-cover"
											src={photoPreview}
										/>
									) : (
										<IconUser className="h-12 w-12 text-muted-foreground" />
									)}
								</div>
								<div className="space-y-2">
									<input
										accept="image/*"
										className="hidden"
										onChange={handlePhotoChange}
										ref={fileInputRef}
										type="file"
									/>
									<Button
										onClick={() => fileInputRef.current?.click()}
										type="button"
										variant="outline"
									>
										<IconCamera data-icon="inline-start" />
										Upload Photo
									</Button>
									<p className="text-muted-foreground text-xs">
										Supported formats: JPG, PNG. Max size: 5MB
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-4">
						<Button
							onClick={() =>
								navigate({ params: { branchId }, to: "/$branchId/emr" })
							}
							type="button"
							variant="outline"
						>
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
						<Button disabled={createMutation.isPending} type="submit">
							{createMutation.isPending ? "Creating..." : "Create Patient"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
