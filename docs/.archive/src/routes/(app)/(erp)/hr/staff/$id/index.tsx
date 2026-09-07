import {
	IconArrowLeft,
	IconEdit,
	IconShield,
	IconUser,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/hr/staff/$id/")({
	component: StaffDetail,
	head: () => ({
		meta: [{ title: "Staff Details (Shaun)" }],
	}),
});

function StaffDetail() {
	const { id } = Route.useParams();
	const staffId = Number(id);

	const { data: staff, isLoading } = useQuery({
		queryFn: async () => await client.staff.get({ id: staffId }),
		queryKey: ["staff", staffId],
	});

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="py-8 text-center text-muted-foreground">
					Loading staff details...
				</div>
			</div>
		);
	}

	if (!staff) {
		return (
			<div className="p-6">
				<div className="py-8 text-center text-muted-foreground">
					Staff member not found.
				</div>
			</div>
		);
	}

	const user = staff.user;
	const branch = staff.branch;

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link to="/hr/staff">
						<Button size="icon" variant="outline">
							<IconArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="font-bold text-2xl">{user?.name ?? "Unknown"}</h1>
						<p className="text-muted-foreground">
							{staff.employeeId} &middot; {staff.roleId}
						</p>
					</div>
				</div>
				<Link params={{ id: String(staff.id) }} to="/hr/staff/$id/edit">
					<Button>
						<IconEdit className="mr-2 h-4 w-4" />
						Edit
					</Button>
				</Link>
			</div>

			{/* Header Card */}
			<Card className="mb-6">
				<CardContent className="p-6">
					<div className="flex items-center gap-6">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user?.image ?? undefined} />
							<AvatarFallback className="text-2xl">
								{user?.name?.charAt(0)?.toUpperCase() ?? "?"}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h2 className="font-semibold text-xl">{user?.name}</h2>
							<p className="text-muted-foreground">{user?.email}</p>
							{user?.phoneNumber && (
								<p className="text-muted-foreground text-sm">
									{user.phoneNumber}
								</p>
							)}
						</div>
						<div className="flex flex-col items-end gap-2">
							<Badge variant={staff.isActive ? "default" : "destructive"}>
								{staff.isActive ? "Active" : "Inactive"}
							</Badge>
							{branch && (
								<p className="text-muted-foreground text-sm">{branch.name}</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs */}
			<Tabs className="flex flex-col" defaultValue="profile">
				<TabsList variant="line">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="employment">Employment</TabsTrigger>
					<TabsTrigger value="permissions">Permissions</TabsTrigger>
					<TabsTrigger value="kyc">KYC</TabsTrigger>
					<TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
					<TabsTrigger value="audit">Audit Log</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<ProfileTab staff={staff} />
				</TabsContent>
				<TabsContent value="employment">
					<EmploymentTab staff={staff} />
				</TabsContent>
				<TabsContent value="permissions">
					<PermissionsTab staffId={staff.id} />
				</TabsContent>
				<TabsContent value="kyc">
					<KycTab staff={staff} />
				</TabsContent>
				<TabsContent value="emergency">
					<EmergencyTab staff={staff} />
				</TabsContent>
				<TabsContent value="audit">
					<AuditTab userId={staff.userId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ProfileTab({ staff }: { staff: Record<string, unknown> }) {
	const fields = [
		{ label: "Date of Birth", value: staff.dateOfBirth },
		{ label: "Gender", value: staff.gender },
		{ label: "Blood Group", value: staff.bloodGroup },
		{ label: "Marital Status", value: staff.maritalStatus },
		{ label: "Nationality", value: staff.nationality },
		{ label: "Address Line 1", value: staff.addressLine1 },
		{ label: "Address Line 2", value: staff.addressLine2 },
		{ label: "City", value: staff.city },
		{ label: "State", value: staff.state },
		{ label: "Pincode", value: staff.pincode },
		{ label: "Country", value: staff.country },
		{ label: "Alternate Phone", value: staff.phoneAlt },
	];

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconUser className="h-5 w-5" />
					Personal Details
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					{fields.map((field) => (
						<div key={field.label}>
							<p className="text-muted-foreground text-sm">{field.label}</p>
							<p className="font-medium">
								{field.value ? String(field.value) : "—"}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function EmploymentTab({ staff }: { staff: Record<string, unknown> }) {
	const branch = staff.branch as Record<string, unknown> | null;
	const company = staff.company as Record<string, unknown> | null;

	const fields = [
		{ label: "Company", value: company?.name },
		{ label: "Branch", value: branch?.name },
		{ label: "Employee ID", value: staff.employeeId },
		{ label: "Role", value: staff.roleId },
		{ label: "Designation", value: staff.designation },
		{ label: "Department", value: staff.department },
		{ label: "Employment Type", value: staff.employmentType },
		{ label: "Joining Date", value: staff.joiningDate },
		{ label: "Probation End Date", value: staff.probationEndDate },
		{ label: "Resignation Date", value: staff.resignationDate },
		{ label: "Exit Date", value: staff.exitDate },
		{ label: "Report To", value: staff.reportToId },
	];

	const branchAccess = staff.branchAccess as number[] | null;

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>Employment Details</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					{fields.map((field) => (
						<div key={field.label}>
							<p className="text-muted-foreground text-sm">{field.label}</p>
							<p className="font-medium">
								{field.value ? String(field.value) : "—"}
							</p>
						</div>
					))}
				</div>
				{branchAccess && branchAccess.length > 0 && (
					<div className="mt-4">
						<p className="mb-2 text-muted-foreground text-sm">Branch Access</p>
						<div className="flex flex-wrap gap-2">
							{branchAccess.map((id) => (
								<Badge key={id} variant="outline">
									Branch #{id}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function PermissionsTab({ staffId }: { staffId: number }) {
	const { data: permData } = useQuery({
		queryFn: async () => await client.staff.listPermissions({ staffId }),
		queryKey: ["staffPermissions", staffId],
	});

	const permissions = permData?.permissions ?? [];

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconShield className="h-5 w-5" />
					Permissions
				</CardTitle>
			</CardHeader>
			<CardContent>
				{permissions.length === 0 ? (
					<p className="text-muted-foreground">
						No permissions assigned. Permissions are granted based on role.
					</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{permissions.map((perm) => (
							<Badge key={perm} variant="secondary">
								{perm}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function KycTab({ staff }: { staff: Record<string, unknown> }) {
	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>KYC Details</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<p className="text-muted-foreground text-sm">PAN Number</p>
						<p className="font-medium font-mono">
							{staff.panNumber ? String(staff.panNumber) : "—"}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Aadhar Number</p>
						<p className="font-medium font-mono">
							{staff.aadharNumber ? String(staff.aadharNumber) : "—"}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function EmergencyTab({ staff }: { staff: Record<string, unknown> }) {
	const contacts = staff.emergencyContacts as Array<{
		name: string;
		phone: string;
		phoneAlt?: string;
		relationship: string;
	}> | null;

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>Emergency Contacts</CardTitle>
			</CardHeader>
			<CardContent>
				{!contacts || contacts.length === 0 ? (
					<p className="text-muted-foreground">No emergency contacts added.</p>
				) : (
					<div className="space-y-4">
						{contacts.map((contact) => (
							<div
								className="rounded-lg border p-4"
								key={`${contact.name}-${contact.phone}`}
							>
								<p className="font-medium">{contact.name}</p>
								<p className="text-muted-foreground text-sm">
									{contact.relationship}
								</p>
								<p className="text-sm">{contact.phone}</p>
								{contact.phoneAlt && (
									<p className="text-muted-foreground text-sm">
										Alt: {contact.phoneAlt}
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function AuditTab({ userId }: { userId: string }) {
	const { data: auditEntries, isLoading } = useQuery({
		queryFn: async () =>
			await client.cdc.getAuditLogForUser({ limit: 50, offset: 0, userId }),
		queryKey: ["auditLog", userId],
	});

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>Audit Log</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<p className="text-muted-foreground">Loading audit log...</p>
				) : !auditEntries || auditEntries.length === 0 ? (
					<p className="text-muted-foreground">No audit entries found.</p>
				) : (
					<div className="space-y-2">
						{auditEntries.map((entry) => (
							<div
								className="flex items-center justify-between rounded-lg border p-3"
								key={entry.id}
							>
								<div>
									<p className="font-medium text-sm">
										{entry.field}
										{" — "}
										<span className="text-muted-foreground">
											{entry.operation}
										</span>
									</p>
									<p className="text-muted-foreground text-xs">
										{entry.oldValue ?? "null"} → {entry.newValue ?? "null"}
									</p>
								</div>
								<p className="text-muted-foreground text-xs">
									{entry.timestamp
										? new Date(entry.timestamp).toLocaleString()
										: ""}
								</p>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
