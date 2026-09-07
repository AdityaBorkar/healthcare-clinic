import {
	IconBuilding,
	IconBuildingBank,
	IconClock,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import * as v from "valibot";

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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/(app)/(erp)/branches/")({
	component: AdministrationPage,
	head: () => ({
		meta: [{ title: "Administration (Shaun)" }],
	}),
});

interface Company {
	createdAt: Date | null;
	gstn: string | null;
	id: number;
	name: string;
	updatedAt: Date | null;
}

interface Branch {
	branchCode: string;
	companyId: number;
	createdAt: Date | null;
	gstn: string | null;
	id: number;
	isActive: boolean;
	name: string;
	updatedAt: Date | null;
}

const companySchema = v.object({
	gstn: v.optional(v.string()),
	name: v.pipe(v.string(), v.minLength(1, "Company name is required")),
});

type CompanyFormData = v.InferOutput<typeof companySchema>;

function AdministrationPage() {
	const baseId = useId();
	const queryClient = useQueryClient();

	const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
	const [companyForm, setCompanyForm] = useState<CompanyFormData>({
		gstn: "",
		name: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [saveMessage, setSaveMessage] = useState<{
		text: string;
		type: "error" | "success";
	} | null>(null);

	const { data: company, isLoading: companyLoading } = useQuery<Company | null>(
		{
			queryFn: async () => {
				try {
					return await client.companies.get({});
				} catch {
					return null;
				}
			},
			queryKey: ["company"],
		},
	);

	const { data: branches = [], isLoading: branchesLoading } = useQuery<
		Branch[]
	>({
		queryFn: async () => await client.branches.list({}),
		queryKey: ["branches"],
	});

	useEffect(() => {
		if (company) {
			setCompanyForm({
				gstn: company.gstn || "",
				name: company.name || "",
			});
		}
	}, [company]);

	const updateCompanyMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.companies.update>[0]) =>
			client.companies.update(data),
		onError: (error: Error) => {
			setSaveMessage({
				text: error.message || "Failed to save company details",
				type: "error",
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["company"],
			});
			setSaveMessage({
				text: "Company details saved successfully",
				type: "success",
			});
			setTimeout(() => setSaveMessage(null), 3000);
		},
	});

	const deleteBranchMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.branches.delete>[0]) =>
			client.branches.delete(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to delete branch");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["branches"],
			});
		},
	});

	const handleCompanyInputChange = (
		field: keyof CompanyFormData,
		value: string,
	) => {
		setCompanyForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const handleCompanySubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = v.safeParse(companySchema, companyForm);
		if (!result.success) {
			const newErrors: Record<string, string> = {};
			for (const issue of result.issues) {
				newErrors[String(issue.path?.[0]?.key ?? "")] = issue.message;
			}
			setErrors(newErrors);
			return;
		}
		await updateCompanyMutation.mutateAsync({
			...companyForm,
		});
		setIsCompanyDialogOpen(false);
	};

	const handleDeleteBranch = async (branch: Branch) => {
		if (!confirm(`Delete branch "${branch.name}"?`)) return;
		await deleteBranchMutation.mutateAsync({ id: branch.id });
	};

	const isLoading = companyLoading || branchesLoading;

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="flex items-center gap-3 text-muted-foreground">
					<IconClock className="h-5 w-5 animate-pulse" />
					<span>Loading administration...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">Administration</h1>
					<p className="mt-1 text-muted-foreground">
						Manage your organization and branches
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
								<IconBuilding className="h-6 w-6 text-primary" />
							</div>
							<div>
								<CardTitle className="text-xl">
									{company?.name || "Organization"}
								</CardTitle>
								<CardDescription>Parent Company</CardDescription>
							</div>
						</div>
						<Dialog
							onOpenChange={setIsCompanyDialogOpen}
							open={isCompanyDialogOpen}
						>
							<DialogTrigger
								render={
									<Button size="sm" variant="outline">
										<IconPencil className="mr-1.5 h-4 w-4" />
										Edit Details
									</Button>
								}
							/>
							<DialogContent className="max-w-2xl">
								<form onSubmit={handleCompanySubmit}>
									<DialogHeader>
										<DialogTitle>Edit Company Details</DialogTitle>
										<DialogDescription>
											Update the parent company information
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4 sm:grid-cols-2">
										<div className="space-y-2 sm:col-span-2">
											<Label htmlFor={`${baseId}-companyName`}>
												Company Name *
											</Label>
											<Input
												aria-invalid={!!errors.name}
												id={`${baseId}-companyName`}
												onChange={(e) =>
													handleCompanyInputChange("name", e.target.value)
												}
												placeholder="Enter company name"
												value={companyForm.name}
											/>
											{errors.name ? (
												<p className="text-destructive text-xs">
													{errors.name}
												</p>
											) : null}
										</div>
										<div className="space-y-2">
											<Label htmlFor={`${baseId}-companyGstn`}>GSTN</Label>
											<Input
												id={`${baseId}-companyGstn`}
												onChange={(e) =>
													handleCompanyInputChange("gstn", e.target.value)
												}
												placeholder="GSTN number"
												value={companyForm.gstn}
											/>
										</div>
									</div>
									<DialogFooter showCloseButton={false}>
										<DialogClose
											render={
												<Button type="button" variant="outline">
													Cancel
												</Button>
											}
										/>
										<Button disabled={updateCompanyMutation.isPending}>
											{updateCompanyMutation.isPending
												? "Saving..."
												: "Save Changes"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{company?.gstn ? (
							<div className="flex items-center gap-2 text-sm">
								<Badge variant="outline">GSTN</Badge>
								<span>{company.gstn}</span>
							</div>
						) : null}
					</div>
				</CardContent>
			</Card>

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="font-semibold text-xl">Branches</h2>
						<p className="text-muted-foreground text-sm">
							{branches.length} branch{branches.length !== 1 ? "es" : ""} in
							your organization
						</p>
					</div>
					<Link to="/branches/new">
						<Button className="gap-2">
							<IconPlus className="h-4 w-4" />
							Add Branch
						</Button>
					</Link>
				</div>

				{branches.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-16">
							<IconBuildingBank className="mb-4 h-14 w-14 text-muted-foreground/30" />
							<p className="font-medium text-muted-foreground">
								No branches found
							</p>
							<p className="text-muted-foreground text-sm">
								Add your first branch to start managing decentralized operations
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{branches.map((branch) => (
							<Card
								className={cn(!branch.isActive && "opacity-60")}
								key={branch.id}
							>
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-3">
											<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
												<IconBuildingBank className="h-5 w-5" />
											</div>
											<div>
												<div className="flex items-center gap-2">
													<CardTitle className="text-base">
														{branch.name}
													</CardTitle>
													{!branch.isActive ? (
														<Badge variant="outline">Inactive</Badge>
													) : null}
												</div>
												<CardDescription className="mt-0.5">
													{branch.branchCode}
													{branch.gstn && ` \u00b7 GSTN: ${branch.gstn}`}
												</CardDescription>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<Link
												params={{ id: String(branch.id) }}
												to="/branches/$id"
											>
												<Button size="sm" variant="ghost">
													<IconPencil className="mr-1 h-4 w-4" />
													Edit
												</Button>
											</Link>
											<Button
												disabled={deleteBranchMutation.isPending}
												onClick={() => handleDeleteBranch(branch)}
												size="sm"
												variant="ghost"
											>
												<IconTrash className="mr-1 h-4 w-4" />
												Delete
											</Button>
										</div>
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				)}
			</div>

			{saveMessage ? (
				<div
					className={cn(
						"fixed right-6 bottom-6 z-50 rounded-lg px-4 py-3 text-sm shadow-lg",
						saveMessage.type === "success"
							? "bg-green-600 text-white"
							: "bg-destructive text-destructive-foreground",
					)}
				>
					{saveMessage.text}
				</div>
			) : null}
		</div>
	);
}
