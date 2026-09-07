import {
	IconBuilding,
	IconCreditCard,
	IconId,
	IconMapPin,
	IconPhone,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
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
import { STATE_OPTIONS } from "#/lib/constants/indian-states";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/vendors/new")({
	component: NewVendor,
	head: () => ({
		meta: [{ title: "New Vendor (Shaun)" }],
	}),
	validateSearch: v.object({ draftId: v.optional(v.number()) }),
});

const identifierSchema = v.object({
	system: v.string(),
	type: v.string(),
	value: v.string(),
});

interface FormIdentifier {
	id: string;
	system: string;
	type: string;
	value: string;
}

const vendorSchema = v.object({
	accountHolderName: v.optional(v.string()),
	accountNumber: v.optional(v.string()),
	active: v.optional(v.boolean(), true),
	addressLine1: v.optional(v.string()),
	addressLine2: v.optional(v.string()),
	bankBranch: v.optional(v.string()),
	bankName: v.optional(v.string()),
	cin: v.optional(v.string()),
	city: v.optional(v.string()),
	country: v.optional(v.string(), "India"),
	email: v.optional(
		v.union([
			v.pipe(v.string(), v.email("Invalid email format")),
			v.literal(""),
		]),
	),
	gstn: v.optional(
		v.union([
			v.pipe(
				v.string(),
				v.regex(
					/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
					"Invalid GSTN format (e.g., 22AAAAA0000A1Z5)",
				),
			),
			v.literal(""),
		]),
	),
	identifiers: v.optional(v.array(identifierSchema)),
	iec: v.optional(v.string()),
	ifscCode: v.optional(
		v.union([
			v.pipe(
				v.string(),
				v.regex(
					/^[A-Z]{4}0[A-Z0-9]{6}$/,
					"Invalid IFSC format (e.g., SBIN0001234)",
				),
			),
			v.literal(""),
		]),
	),
	name: v.pipe(v.string(), v.minLength(1, "Vendor name is required")),
	organizationType: v.optional(v.string()),
	pan: v.optional(
		v.union([
			v.pipe(
				v.string(),
				v.regex(
					/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
					"Invalid PAN format (e.g., ABCDE1234F)",
				),
			),
			v.literal(""),
		]),
	),
	phone: v.optional(v.string()),
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
	tan: v.optional(
		v.union([
			v.pipe(
				v.string(),
				v.regex(
					/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/,
					"Invalid TAN format (e.g., ABCD12345E)",
				),
			),
			v.literal(""),
		]),
	),
	udyamRegistration: v.optional(v.string()),
	vendorType: v.optional(v.string()),
	website: v.optional(v.string()),
});

type VendorFormData = Omit<
	v.InferOutput<typeof vendorSchema>,
	"identifiers"
> & {
	identifiers?: FormIdentifier[];
};

const VENDOR_TYPES = [
	{ label: "Proprietorship", value: "proprietorship" },
	{ label: "Partnership", value: "partnership" },
	{ label: "Private Limited", value: "pvt-ltd" },
	{ label: "Limited", value: "ltd" },
	{ label: "LLP", value: "llp" },
	{ label: "OPC", value: "opc" },
	{ label: "Trust", value: "trust" },
	{ label: "Society", value: "society" },
	{ label: "HUF", value: "huf" },
];

const ORGANIZATION_TYPES = [
	{ code: "prov", label: "Healthcare Provider" },
	{ code: "govt", label: "Government" },
	{ code: "ins", label: "Insurance Company" },
	{ code: "pay", label: "Payer" },
	{ code: "educ", label: "Educational Institution" },
	{ code: "reli", label: "Religious Institution" },
	{ code: "crs", label: "Clinical Research Sponsor" },
	{ code: "cg", label: "Community Group" },
	{ code: "bus", label: "Business" },
	{ code: "other", label: "Other" },
];

const FHIR_IDENTIFIER_TYPES = [
	{ code: "NATIONAL_ID_NUMBER", label: "National ID Number" },
	{ code: "PASSPORT", label: "Passport Number" },
	{ code: "REGISTRATION_NUMBER", label: "Registration Number" },
	{ code: "HEALTH_ID", label: "Health ID" },
	{ code: "EMPLOYEE_ID", label: "Employee ID" },
	{ code: "OTHER", label: "Other" },
];

const DEFAULT_FORM_DATA: VendorFormData = {
	accountHolderName: "",
	accountNumber: "",
	active: true,
	addressLine1: "",
	addressLine2: "",
	bankBranch: "",
	bankName: "",
	cin: "",
	city: "",
	country: "India",
	email: "",
	gstn: "",
	identifiers: [],
	iec: "",
	ifscCode: "",
	name: "",
	organizationType: "",
	pan: "",
	phone: "",
	pincode: "",
	state: "",
	tan: "",
	udyamRegistration: "",
	vendorType: "",
	website: "",
};

function NewVendor() {
	const { draftId } = Route.useSearch();
	const navigate = useNavigate();
	const baseId = useId();
	const [formData, setFormData] = useState<VendorFormData>(DEFAULT_FORM_DATA);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { data: draft } = useQuery({
		enabled: !!draftId,
		queryFn: () => client.drafts.get({ id: draftId as number }),
		queryKey: ["draft", draftId],
	});

	useEffect(() => {
		if (!draft?.data) return;
		setFormData((prev) => ({
			...prev,
			...draft.data,
			identifiers:
				(draft.data.identifiers as VendorFormData["identifiers"]) ??
				prev.identifiers,
		}));
	}, [draft]);

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			const data: Record<string, unknown> = { ...formData };
			const label = (formData.name as string) || "New Vendor";
			if (draftId) {
				return client.drafts.update({ data, id: draftId, label });
			}
			return client.drafts.create({ data, formType: "vendor", label });
		},
		onSuccess: (result) => {
			if (!draftId) {
				navigate({
					search: { draftId: result.id },
					to: "/vendors/new",
				});
			}
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.vendors.create>[0]) =>
			client.vendors.create(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to create vendor");
		},
		onSuccess: () => {
			if (draftId) {
				client.drafts.delete({ id: draftId }).catch(() => {});
			}
			navigate({ to: "/vendors" });
		},
	});

	const handleInputChange = (
		field: keyof VendorFormData,
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
				{ id: crypto.randomUUID(), system: "", type: "OTHER", value: "" },
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const dataToValidate = {
			...formData,
			identifiers: formData.identifiers?.map(({ id: _, ...rest }) => rest),
		};

		const result = v.safeParse(vendorSchema, dataToValidate);
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

		const cleanData = Object.fromEntries(
			Object.entries(result.output).filter(([_, v]) => v !== ""),
		);

		await createMutation.mutateAsync(cleanData as typeof result.output);
	};

	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<div>
				<h1 className="font-bold text-2xl">Create New Vendor</h1>
				<p className="text-muted-foreground">
					Add a new vendor or business partner
				</p>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconBuilding className="h-5 w-5 text-primary" />
							<CardTitle>Basic Information</CardTitle>
						</div>
						<CardDescription>
							Enter the vendor name and classification
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-name`}>Vendor Name *</Label>
							<Input
								aria-invalid={!!errors.name}
								id={`${baseId}-name`}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="Enter vendor name"
								value={formData.name}
							/>
							{errors.name ? (
								<p className="text-destructive text-xs">{errors.name}</p>
							) : null}
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-vendorType`}>Vendor Type</Label>
							<Select
								onValueChange={(v) => handleInputChange("vendorType", v)}
								value={formData.vendorType ?? ""}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select vendor type" />
								</SelectTrigger>
								<SelectContent>
									{VENDOR_TYPES.map((t) => (
										<SelectItem key={t.value} value={t.value}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-organizationType`}>
								Organization Type (FHIR)
							</Label>
							<Select
								onValueChange={(v) => handleInputChange("organizationType", v)}
								value={formData.organizationType ?? ""}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select organization type" />
								</SelectTrigger>
								<SelectContent>
									{ORGANIZATION_TYPES.map((t) => (
										<SelectItem key={t.code} value={t.code}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-active`}>Status</Label>
							<Select
								onValueChange={(v) => handleInputChange("active", v === "true")}
								value={String(formData.active)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">Active</SelectItem>
									<SelectItem value="false">Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconId className="h-5 w-5 text-primary" />
							<CardTitle>Identifiers (FHIR + Legal)</CardTitle>
						</div>
						<CardDescription>
							Indian legal identifiers and FHIR-compliant identifiers
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-gstn`}>GSTN</Label>
								<Input
									aria-invalid={!!errors.gstn}
									id={`${baseId}-gstn`}
									onChange={(e) => handleInputChange("gstn", e.target.value)}
									placeholder="22AAAAA0000A1Z5"
									value={formData.gstn}
								/>
								{errors.gstn ? (
									<p className="text-destructive text-xs">{errors.gstn}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-pan`}>PAN</Label>
								<Input
									aria-invalid={!!errors.pan}
									id={`${baseId}-pan`}
									maxLength={10}
									onChange={(e) =>
										handleInputChange("pan", e.target.value.toUpperCase())
									}
									placeholder="ABCDE1234F"
									value={formData.pan}
								/>
								{errors.pan ? (
									<p className="text-destructive text-xs">{errors.pan}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-tan`}>TAN</Label>
								<Input
									aria-invalid={!!errors.tan}
									id={`${baseId}-tan`}
									maxLength={10}
									onChange={(e) =>
										handleInputChange("tan", e.target.value.toUpperCase())
									}
									placeholder="ABCD12345E"
									value={formData.tan}
								/>
								{errors.tan ? (
									<p className="text-destructive text-xs">{errors.tan}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-cin`}>CIN</Label>
								<Input
									id={`${baseId}-cin`}
									maxLength={21}
									onChange={(e) =>
										handleInputChange("cin", e.target.value.toUpperCase())
									}
									placeholder="U12345MH2020PTC123456"
									value={formData.cin}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-udyamRegistration`}>
									UDYAM Reg.
								</Label>
								<Input
									id={`${baseId}-udyamRegistration`}
									onChange={(e) =>
										handleInputChange("udyamRegistration", e.target.value)
									}
									placeholder="UDYAM-MH-00-0000000"
									value={formData.udyamRegistration}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-iec`}>IEC (Import Export)</Label>
								<Input
									id={`${baseId}-iec`}
									maxLength={10}
									onChange={(e) =>
										handleInputChange("iec", e.target.value.toUpperCase())
									}
									placeholder="AAFCB1234D"
									value={formData.iec}
								/>
							</div>
						</div>

						<div className="border-t pt-4">
							<div className="mb-3 flex items-center justify-between">
								<p className="font-medium text-muted-foreground text-sm">
									Custom Identifiers (FHIR)
								</p>
								<Button
									onClick={handleAddIdentifier}
									size="sm"
									type="button"
									variant="outline"
								>
									<IconPlus className="mr-1 h-4 w-4" />
									Add Identifier
								</Button>
							</div>
							{formData.identifiers?.map((id) => (
								<div
									className="mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_2fr_1fr_auto]"
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
												{FHIR_IDENTIFIER_TYPES.map((t) => (
													<SelectItem key={t.code} value={t.code}>
														{t.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label>System/Authority</Label>
										<Input
											onChange={(e) =>
												handleIdentifierChange(id.id, "system", e.target.value)
											}
											placeholder="e.g., https://nrces.in/ndhm"
											value={id.system}
										/>
									</div>
									<div className="space-y-1">
										<Label>Value</Label>
										<Input
											onChange={(e) =>
												handleIdentifierChange(id.id, "value", e.target.value)
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
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconPhone className="h-5 w-5 text-primary" />
							<CardTitle>Contact Information</CardTitle>
						</div>
						<CardDescription>Phone, email, and website</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-phone`}>Phone</Label>
							<Input
								id={`${baseId}-phone`}
								onChange={(e) => handleInputChange("phone", e.target.value)}
								placeholder="+91 9876543210"
								value={formData.phone}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-email`}>Email</Label>
							<Input
								aria-invalid={!!errors.email}
								id={`${baseId}-email`}
								onChange={(e) => handleInputChange("email", e.target.value)}
								placeholder="contact@example.com"
								type="email"
								value={formData.email}
							/>
							{errors.email ? (
								<p className="text-destructive text-xs">{errors.email}</p>
							) : null}
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor={`${baseId}-website`}>Website</Label>
							<Input
								id={`${baseId}-website`}
								onChange={(e) => handleInputChange("website", e.target.value)}
								placeholder="https://example.com"
								value={formData.website}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconMapPin className="h-5 w-5 text-primary" />
							<CardTitle>Address</CardTitle>
						</div>
						<CardDescription>Registered address details</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor={`${baseId}-addressLine1`}>Address Line 1</Label>
							<Input
								id={`${baseId}-addressLine1`}
								onChange={(e) =>
									handleInputChange("addressLine1", e.target.value)
								}
								placeholder="Street address, building name"
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
							<Label htmlFor={`${baseId}-organizationType`}>
								Organization Type (FHIR)
							</Label>
							<Select
								onValueChange={(v) => handleInputChange("organizationType", v)}
								value={formData.organizationType ?? ""}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select organization type" />
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

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconCreditCard className="h-5 w-5 text-primary" />
							<CardTitle>Bank Details</CardTitle>
						</div>
						<CardDescription>
							Primary bank account for transactions
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-bankName`}>Bank Name</Label>
							<Input
								id={`${baseId}-bankName`}
								onChange={(e) => handleInputChange("bankName", e.target.value)}
								placeholder="Bank name"
								value={formData.bankName}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-bankBranch`}>Bank Branch</Label>
							<Input
								id={`${baseId}-bankBranch`}
								onChange={(e) =>
									handleInputChange("bankBranch", e.target.value)
								}
								placeholder="Branch name"
								value={formData.bankBranch}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-accountHolderName`}>
								Account Holder Name
							</Label>
							<Input
								id={`${baseId}-accountHolderName`}
								onChange={(e) =>
									handleInputChange("accountHolderName", e.target.value)
								}
								placeholder="Account holder name"
								value={formData.accountHolderName}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-accountNumber`}>Account Number</Label>
							<Input
								id={`${baseId}-accountNumber`}
								onChange={(e) =>
									handleInputChange("accountNumber", e.target.value)
								}
								placeholder="Account number"
								value={formData.accountNumber}
							/>
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor={`${baseId}-ifscCode`}>IFSC Code</Label>
							<Input
								aria-invalid={!!errors.ifscCode}
								id={`${baseId}-ifscCode`}
								maxLength={11}
								onChange={(e) =>
									handleInputChange("ifscCode", e.target.value.toUpperCase())
								}
								placeholder="SBIN0001234"
								value={formData.ifscCode}
							/>
							{errors.ifscCode ? (
								<p className="text-destructive text-xs">{errors.ifscCode}</p>
							) : null}
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Button
						onClick={() => navigate({ to: "/vendors" })}
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
						{createMutation.isPending ? "Creating..." : "Create Vendor"}
					</Button>
				</div>
			</form>
		</div>
	);
}
