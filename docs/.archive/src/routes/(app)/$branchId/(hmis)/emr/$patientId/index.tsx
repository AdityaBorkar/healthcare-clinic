import {
	IconArrowLeft,
	IconClipboardHeart,
	IconFileText,
	IconHeartbeat,
	IconReceipt,
	IconUser,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { client } from "#/lib/rpc";
import type { Patient } from "#/schemas/db";

export const Route = createFileRoute("/(app)/$branchId/(hmis)/emr/$patientId/")(
	{
		component: PatientDetail,
		head: () => ({
			meta: [{ title: "Patient Details (Shaun)" }],
		}),
	},
);

function PatientDetail() {
	const { patientId, branchId } = Route.useParams();
	const id = Number(patientId);

	const { data: patient, isLoading } = useQuery({
		queryFn: async () => await client.patients.get({ id }),
		queryKey: ["patient", id],
	});

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="py-8 text-center text-muted-foreground">
					Loading patient details...
				</div>
			</div>
		);
	}

	if (!patient) {
		return (
			<div className="p-6">
				<div className="py-8 text-center text-muted-foreground">
					Patient not found.
				</div>
			</div>
		);
	}

	const initials = patient.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center gap-4">
				<Link params={{ branchId }} to="/$branchId/emr">
					<Button size="icon" variant="outline">
						<IconArrowLeft />
					</Button>
				</Link>
				<div>
					<h1 className="font-bold text-2xl">{patient.name}</h1>
					<p className="text-muted-foreground">
						{patient.mrn ?? "No MRN"} &middot; {patient.gender ?? "Unknown"}
					</p>
				</div>
			</div>

			{/* Header Card */}
			<Card className="mb-6">
				<CardContent className="p-6">
					<div className="flex items-center gap-6">
						<Avatar className="size-20">
							<AvatarImage
								alt={patient.name}
								src={patient.photoUrl ?? undefined}
							/>
							<AvatarFallback className="text-2xl">{initials}</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h2 className="font-semibold text-xl">{patient.name}</h2>
							<p className="text-muted-foreground">
								{patient.email ?? "No email"}
							</p>
							<p className="text-muted-foreground text-sm">
								{patient.phone ?? "No phone"}
							</p>
						</div>
						<div className="flex flex-col items-end gap-2">
							<Badge variant={patient.active ? "default" : "destructive"}>
								{patient.active ? "Active" : "Inactive"}
							</Badge>
							{patient.bloodGroup && (
								<Badge variant="outline">{patient.bloodGroup}</Badge>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs */}
			<Tabs className="flex flex-col" defaultValue="ongoing">
				<TabsList variant="line">
					<TabsTrigger className="gap-2" value="ongoing">
						<IconHeartbeat />
						Ongoing
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="medical-records">
						<IconClipboardHeart />
						Medical Records
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="health-records">
						<IconFileText />
						Health Records
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="patient-info">
						<IconUser />
						Patient Info
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="billing">
						<IconReceipt />
						Billing
					</TabsTrigger>
				</TabsList>

				<TabsContent value="ongoing">
					<OngoingTab />
				</TabsContent>
				<TabsContent value="medical-records">
					<MedicalRecordsTab />
				</TabsContent>
				<TabsContent value="health-records">
					<HealthRecordsTab />
				</TabsContent>
				<TabsContent value="patient-info">
					<PatientInfoTab patient={patient} />
				</TabsContent>
				<TabsContent value="billing">
					<BillingTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function OngoingTab() {
	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconHeartbeat />
					Ongoing Treatments
				</CardTitle>
				<CardDescription>
					Active treatments and current clinical status.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">No ongoing treatments recorded.</p>
			</CardContent>
		</Card>
	);
}

function MedicalRecordsTab() {
	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconClipboardHeart />
					Medical Records
				</CardTitle>
				<CardDescription>
					Diagnoses, procedures, and clinical notes.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Doctor</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell
								className="py-8 text-center text-muted-foreground"
								colSpan={4}
							>
								No medical records found.
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

function HealthRecordsTab() {
	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconFileText />
					Health Records
				</CardTitle>
				<CardDescription>
					Vitals, lab results, and uploaded documents.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">No health records available.</p>
			</CardContent>
		</Card>
	);
}

function PatientInfoTab({ patient }: { patient: Patient }) {
	const personalFields = [
		{ label: "Date of Birth", value: patient.birthDate },
		{ label: "Gender", value: patient.gender },
		{ label: "Blood Group", value: patient.bloodGroup },
		{ label: "Marital Status", value: patient.maritalStatus },
		{ label: "Nationality", value: patient.nationality },
		{ label: "Occupation", value: patient.occupation },
		{ label: "Alternate Phone", value: patient.phoneAlt },
	];

	const insuranceFields = [
		{ label: "Insurance Provider", value: patient.insuranceProvider },
		{ label: "Policy Number", value: patient.insurancePolicyNumber },
	];

	return (
		<div className="mt-4 flex flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconUser />
						Personal Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2">
						{personalFields.map((field) => (
							<div key={field.label}>
								<p className="text-muted-foreground text-sm">{field.label}</p>
								<p className="font-medium">
									{field.value ? String(field.value) : "\u2014"}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Insurance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2">
						{insuranceFields.map((field) => (
							<div key={field.label}>
								<p className="text-muted-foreground text-sm">{field.label}</p>
								<p className="font-medium">
									{field.value ? String(field.value) : "\u2014"}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{patient.allergies && (
				<Card>
					<CardHeader>
						<CardTitle>Allergies</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{patient.allergies}</p>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Emergency Contacts</CardTitle>
				</CardHeader>
				<CardContent>
					{!patient.emergencyContacts ||
					patient.emergencyContacts.length === 0 ? (
						<p className="text-muted-foreground">
							No emergency contacts added.
						</p>
					) : (
						<div className="flex flex-col gap-3">
							{patient.emergencyContacts.map((contact) => (
								<div
									className="rounded-lg border p-4"
									key={`${contact.name}-${contact.phone}`}
								>
									<p className="font-medium">{contact.name}</p>
									<p className="text-muted-foreground text-sm">
										{contact.relation}
									</p>
									<p className="text-sm">{contact.phone}</p>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{patient.identifiers && patient.identifiers.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Identifiers</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{patient.identifiers.map((id) => (
								<Badge key={`${id.type}-${id.value}`} variant="secondary">
									{id.type}: {id.value}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function BillingTab() {
	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconReceipt />
					Billing
				</CardTitle>
				<CardDescription>
					Invoices, payments, and outstanding balance.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice #</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell
								className="py-8 text-center text-muted-foreground"
								colSpan={4}
							>
								No billing records found.
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
