import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/hr/staff/$id/edit")({
	component: EditStaff,
	head: () => ({
		meta: [{ title: "Edit Staff (Shaun)" }],
	}),
});

const ROLES = [
	{ id: "admin-dept", label: "Admin" },
	{ id: "receptionist", label: "Receptionist" },
	{ id: "financial-counsellor", label: "Financial Counsellor" },
	{ id: "doctor", label: "Doctor" },
	{ id: "medical-assistant", label: "Medical Assistant" },
	{ id: "nurse", label: "Nurse" },
	{ id: "wardboy", label: "Ward Boy" },
	{ id: "security", label: "Security" },
];

function EditStaff() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const staffId = Number(id);

	const { data: staff, isLoading } = useQuery({
		queryFn: async () => await client.staff.get({ id: staffId }),
		queryKey: ["staff", staffId],
	});

	const { data: branches } = useQuery({
		queryFn: async () => await client.branches.listForCompany({}),
		queryKey: ["branches"],
	});

	const [form, setForm] = useState({
		aadharNumber: "",
		bloodGroup: "",
		branchId: "",
		dateOfBirth: "",
		department: "",
		designation: "",
		email: "",
		employeeId: "",
		employmentType: "",
		gender: "",
		maritalStatus: "",
		name: "",
		nationality: "India",
		panNumber: "",
		phone: "",
		phoneAlt: "",
		reportToId: "",
		roleId: "",
	});

	useEffect(() => {
		if (staff && staff.user) {
			setForm({
				aadharNumber: (staff.aadharNumber as string) ?? "",
				bloodGroup: (staff.bloodGroup as string) ?? "",
				branchId: staff.branchId ? String(staff.branchId) : "",
				dateOfBirth: staff.dateOfBirth
					? new Date(staff.dateOfBirth as unknown as string)
							.toISOString()
							.split("T")[0]
					: "",
				department: staff.department ?? "",
				designation: staff.designation ?? "",
				email: staff.user.email,
				employeeId: staff.employeeId,
				employmentType: (staff.employmentType as string) ?? "",
				gender: (staff.gender as string) ?? "",
				maritalStatus: (staff.maritalStatus as string) ?? "",
				name: staff.user.name,
				nationality: (staff.nationality as string) ?? "India",
				panNumber: (staff.panNumber as string) ?? "",
				phone: staff.user.phoneNumber ?? "",
				phoneAlt: (staff.phoneAlt as string) ?? "",
				reportToId: staff.reportToId ?? "",
				roleId: staff.roleId,
			});
		}
	}, [staff]);

	const updateMutation = useMutation({
		mutationFn: async () => {
			return await client.staff.update({
				aadharNumber: form.aadharNumber || undefined,
				bloodGroup: form.bloodGroup || undefined,
				branchId: form.branchId ? Number(form.branchId) : undefined,
				dateOfBirth: form.dateOfBirth
					? new Date(form.dateOfBirth).toISOString()
					: undefined,
				department: form.department || undefined,
				designation: form.designation || undefined,
				employmentType: form.employmentType || undefined,
				gender: form.gender || undefined,
				id: staffId,
				maritalStatus: form.maritalStatus || undefined,
				name: form.name || undefined,
				nationality: form.nationality || undefined,
				panNumber: form.panNumber || undefined,
				phone: form.phone || undefined,
				phoneAlt: form.phoneAlt || undefined,
				reportToId: form.reportToId || undefined,
				roleId: form.roleId || undefined,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["staff"] });
			navigate({
				params: { id: String(staffId) },
				to: "/hr/staff/$id",
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateMutation.mutate();
	};

	const updateField = (field: string, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

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

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center gap-4">
				<Link params={{ id: String(staffId) }} to="/hr/staff/$id">
					<Button size="icon" variant="outline">
						<IconArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="font-bold text-2xl">Edit Staff</h1>
					<p className="text-muted-foreground">Update staff member details</p>
				</div>
			</div>

			<form className="max-w-2xl space-y-6" onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Full Name</Label>
								<Input
									onChange={(e) => updateField("name", e.target.value)}
									value={form.name}
								/>
							</div>
							<div className="space-y-2">
								<Label>Employee ID</Label>
								<Input disabled value={form.employeeId} />
							</div>
							<div className="space-y-2">
								<Label>Phone</Label>
								<Input
									onChange={(e) => updateField("phone", e.target.value)}
									value={form.phone}
								/>
							</div>
							<div className="space-y-2">
								<Label>Alternate Phone</Label>
								<Input
									onChange={(e) => updateField("phoneAlt", e.target.value)}
									value={form.phoneAlt}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Employment</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Role</Label>
								<Select
									onValueChange={(v) => {
										if (v) updateField("roleId", v);
									}}
									value={form.roleId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										{ROLES.map((role) => (
											<SelectItem key={role.id} value={role.id}>
												{role.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Branch</Label>
								<Select
									onValueChange={(v) => {
										if (v) updateField("branchId", v);
									}}
									value={form.branchId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select branch" />
									</SelectTrigger>
									<SelectContent>
										{branches?.map((b) => (
											<SelectItem key={b.id} value={String(b.id)}>
												{b.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Designation</Label>
								<Input
									onChange={(e) => updateField("designation", e.target.value)}
									value={form.designation}
								/>
							</div>
							<div className="space-y-2">
								<Label>Department</Label>
								<Input
									onChange={(e) => updateField("department", e.target.value)}
									value={form.department}
								/>
							</div>
							<div className="space-y-2">
								<Label>Employment Type</Label>
								<Select
									onValueChange={(v) => {
										if (v) updateField("employmentType", v);
									}}
									value={form.employmentType}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="full-time">Full Time</SelectItem>
										<SelectItem value="part-time">Part Time</SelectItem>
										<SelectItem value="contract">Contract</SelectItem>
										<SelectItem value="intern">Intern</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Personal Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Date of Birth</Label>
								<Input
									onChange={(e) => updateField("dateOfBirth", e.target.value)}
									type="date"
									value={form.dateOfBirth}
								/>
							</div>
							<div className="space-y-2">
								<Label>Gender</Label>
								<Select
									onValueChange={(v) => {
										if (v) updateField("gender", v);
									}}
									value={form.gender}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Blood Group</Label>
								<Select
									onValueChange={(v) => {
										if (v) updateField("bloodGroup", v);
									}}
									value={form.bloodGroup}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select blood group" />
									</SelectTrigger>
									<SelectContent>
										{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
											(bg) => (
												<SelectItem key={bg} value={bg}>
													{bg}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Marital Status</Label>
								<Select
									onValueChange={(v) => {
										if (v) updateField("maritalStatus", v);
									}}
									value={form.maritalStatus}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="single">Single</SelectItem>
										<SelectItem value="married">Married</SelectItem>
										<SelectItem value="divorced">Divorced</SelectItem>
										<SelectItem value="widowed">Widowed</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Nationality</Label>
								<Input
									onChange={(e) => updateField("nationality", e.target.value)}
									value={form.nationality}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>KYC</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>PAN Number</Label>
								<Input
									onChange={(e) => updateField("panNumber", e.target.value)}
									value={form.panNumber}
								/>
							</div>
							<div className="space-y-2">
								<Label>Aadhar Number</Label>
								<Input
									onChange={(e) => updateField("aadharNumber", e.target.value)}
									value={form.aadharNumber}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{updateMutation.isError && (
					<div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
						{updateMutation.error?.message ?? "Failed to update staff member"}
					</div>
				)}

				<div className="flex justify-end gap-3">
					<Link params={{ id: String(staffId) }} to="/hr/staff/$id">
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<Button disabled={updateMutation.isPending} type="submit">
						{updateMutation.isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</div>
	);
}
