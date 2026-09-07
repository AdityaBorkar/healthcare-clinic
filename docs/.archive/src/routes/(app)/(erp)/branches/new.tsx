import { IconBuildingBank } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
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
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/branches/new")({
	component: CreateBranchPage,
	head: () => ({
		meta: [{ title: "Create Branch (Shaun)" }],
	}),
});

const branchSchema = v.object({
	branchCode: v.pipe(v.string(), v.minLength(1, "Branch code is required")),
	gstn: v.optional(v.string()),
	name: v.pipe(v.string(), v.minLength(1, "Branch name is required")),
});

type BranchFormData = v.InferOutput<typeof branchSchema>;

function CreateBranchPage() {
	const baseId = useId();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState<BranchFormData>({
		branchCode: "",
		gstn: "",
		name: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const createMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.branches.create>[0]) =>
			client.branches.create(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to create branch");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["branches"],
			});
			navigate({
				to: "/branches",
			});
		},
	});

	const handleInputChange = (field: keyof BranchFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = v.safeParse(branchSchema, formData);
		if (!result.success) {
			const newErrors: Record<string, string> = {};
			for (const issue of result.issues) {
				newErrors[String(issue.path?.[0]?.key ?? "")] = issue.message;
			}
			setErrors(newErrors);
			return;
		}
		await createMutation.mutateAsync({
			...formData,
		});
	};

	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Link className="hover:text-foreground" to="/branches">
					Administration
				</Link>
				<span>/</span>
				<span className="text-foreground">New Branch</span>
			</div>

			<div>
				<h1 className="font-bold text-2xl">Create Branch</h1>
				<p className="text-muted-foreground">
					Add a new branch to your organization
				</p>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconBuildingBank className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle>Branch Details</CardTitle>
								<CardDescription>
									Basic information about the branch
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-branchCode`}>
									Branch Code <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.branchCode}
									id={`${baseId}-branchCode`}
									onChange={(e) =>
										handleInputChange("branchCode", e.target.value)
									}
									placeholder="e.g., BR01, HQ"
									value={formData.branchCode}
								/>
								{errors.branchCode ? (
									<p className="text-destructive text-xs">
										{errors.branchCode}
									</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-branchName`}>
									Branch Name <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.name}
									id={`${baseId}-branchName`}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="Enter branch name"
									value={formData.name}
								/>
								{errors.name ? (
									<p className="text-destructive text-xs">{errors.name}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-branchGstn`}>GSTN</Label>
								<Input
									id={`${baseId}-branchGstn`}
									onChange={(e) => handleInputChange("gstn", e.target.value)}
									placeholder="GSTN (optional)"
									value={formData.gstn}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-3">
					<Link to="/branches">
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<Button disabled={createMutation.isPending} type="submit">
						{createMutation.isPending ? "Creating..." : "Create Branch"}
					</Button>
				</div>
			</form>
		</div>
	);
}
