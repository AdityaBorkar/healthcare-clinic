import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as v from "valibot";

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

export const Route = createFileRoute("/(app)/(erp)/hr/staff/new")({
	component: CreateStaff,
	head: () => ({
		meta: [{ title: "Create Staff (Shaun)" }],
	}),
	validateSearch: v.object({ draftId: v.optional(v.number()) }),
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

function CreateStaff() {
	const { draftId } = Route.useSearch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: branches } = useQuery({
		queryFn: async () => await client.branches.listForCompany({}),
		queryKey: ["branches"],
	});

	const [form, setForm] = useState({
		branchId: "",
		department: "",
		designation: "",
		email: "",
		employeeId: "",
		employmentType: "",
		name: "",
		phone: "",
		reportToId: "",
		roleId: "",
	});

	const { data: draft } = useQuery({
		enabled: !!draftId,
		queryFn: () => client.drafts.get({ id: draftId as number }),
		queryKey: ["draft", draftId],
	});

	useEffect(() => {
		if (!draft?.data) return;
		const d = draft.data;
		setForm((prev) => ({
			...prev,
			branchId: (d.branchId as string) ?? prev.branchId,
			department: (d.department as string) ?? prev.department,
			designation: (d.designation as string) ?? prev.designation,
			email: (d.email as string) ?? prev.email,
			employeeId: (d.employeeId as string) ?? prev.employeeId,
			employmentType: (d.employmentType as string) ?? prev.employmentType,
			name: (d.name as string) ?? prev.name,
			phone: (d.phone as string) ?? prev.phone,
			reportToId: (d.reportToId as string) ?? prev.reportToId,
			roleId: (d.roleId as string) ?? prev.roleId,
		}));
	}, [draft]);

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			const data: Record<string, unknown> = { ...form };
			const label = form.name || "New Staff";
			if (draftId) {
				return client.drafts.update({ data, id: draftId, label });
			}
			return client.drafts.create({ data, formType: "staff", label });
		},
		onSuccess: (result) => {
			if (!draftId) {
				navigate({
					search: { draftId: result.id },
					to: "/hr/staff/new",
				});
			}
		},
	});

	const createMutation = useMutation({
		mutationFn: async () => {
			return await client.staff.create({
				branchId: form.branchId ? Number(form.branchId) : undefined,
				department: form.department || undefined,
				designation: form.designation || undefined,
				email: form.email,
				employeeId: form.employeeId,
				employmentType: form.employmentType || undefined,
				name: form.name,
				phone: form.phone || undefined,
				reportToId: form.reportToId || undefined,
				roleId: form.roleId,
			});
		},
		onSuccess: async () => {
			if (draftId) {
				client.drafts.delete({ id: draftId }).catch(() => {});
			}
			await queryClient.invalidateQueries({ queryKey: ["staff"] });
			navigate({ to: "/hr/staff" });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createMutation.mutate();
	};

	const updateField = (field: string, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center gap-4">
				<Link to="/hr/staff">
					<Button size="icon" variant="outline">
						<IconArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="font-bold text-2xl">Add New Staff</h1>
					<p className="text-muted-foreground">
						Create a new staff member account
					</p>
				</div>
			</div>

			<form className="max-w-2xl" onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Full Name *</Label>
								<Input
									onChange={(e) => updateField("name", e.target.value)}
									required
									value={form.name}
								/>
							</div>
							<div className="space-y-2">
								<Label>Email *</Label>
								<Input
									onChange={(e) => updateField("email", e.target.value)}
									required
									type="email"
									value={form.email}
								/>
							</div>
							<div className="space-y-2">
								<Label>Employee ID *</Label>
								<Input
									onChange={(e) => updateField("employeeId", e.target.value)}
									required
									value={form.employeeId}
								/>
							</div>
							<div className="space-y-2">
								<Label>Phone</Label>
								<Input
									onChange={(e) => updateField("phone", e.target.value)}
									value={form.phone}
								/>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Role *</Label>
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

				{createMutation.isError && (
					<div className="mt-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
						{createMutation.error?.message ?? "Failed to create staff member"}
					</div>
				)}

				<div className="mt-6 flex justify-end gap-3">
					<Link to="/hr/staff">
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<Button
						disabled={saveDraftMutation.isPending}
						onClick={() => saveDraftMutation.mutate()}
						type="button"
						variant="outline"
					>
						{saveDraftMutation.isPending ? "Saving..." : "Save as Draft"}
					</Button>
					<Button disabled={createMutation.isPending} type="submit">
						{createMutation.isPending ? "Creating..." : "Create Staff"}
					</Button>
				</div>
			</form>
		</div>
	);
}
