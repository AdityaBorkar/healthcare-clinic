import { IconBuilding, IconStethoscope } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import { client } from "#/lib/rpc";
import type {
	FacilityCategory,
	FacilityWithSchedules,
} from "#/rpc/router/facilities";

export const Route = createFileRoute("/(app)/(erp)/services/new")({
	component: CreateService,
	head: () => ({
		meta: [{ title: "Create Service (Shaun)" }],
	}),
	validateSearch: v.object({ draftId: v.optional(v.number()) }),
});

const serviceSchema = v.object({
	categoryId: v.pipe(v.number(), v.minValue(1, "Category is required")),
	code: v.pipe(v.string(), v.minLength(1, "Code is required")),
	cost: v.pipe(v.number(), v.minValue(0, "Cost must be non-negative")),
	description: v.optional(v.string()),
	duration: v.optional(v.number()),
	facilityIds: v.optional(v.array(v.number())),
	name: v.pipe(v.string(), v.minLength(1, "Name is required")),
});

function CreateService() {
	const { draftId } = Route.useSearch();
	const baseId = useId();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		categoryId: 0,
		code: "",
		cost: "",
		description: "",
		duration: "",
		name: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [selectedFacilityIds, setSelectedFacilityIds] = useState<number[]>([]);

	const { data: categories = [] } = useQuery<FacilityCategory[]>({
		queryFn: async () =>
			await client.facilities.categories.list({ isActive: true }),
		queryKey: ["facility-categories"],
	});

	const { data: facilities = [] } = useQuery<FacilityWithSchedules[]>({
		queryFn: async () => await client.facilities.list({ isActive: true }),
		queryKey: ["facilities", "active"],
	});

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
			categoryId: (d.categoryId as number) ?? prev.categoryId,
			code: (d.code as string) ?? prev.code,
			cost: (d.cost as string) ?? prev.cost,
			description: (d.description as string) ?? prev.description,
			duration: (d.duration as string) ?? prev.duration,
			name: (d.name as string) ?? prev.name,
		}));
		if (d.selectedFacilityIds) {
			setSelectedFacilityIds(d.selectedFacilityIds as number[]);
		}
	}, [draft]);

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			const data: Record<string, unknown> = {
				...formData,
				selectedFacilityIds,
			};
			const label = (formData.name as string) || "New Service";
			if (draftId) {
				return client.drafts.update({ data, id: draftId, label });
			}
			return client.drafts.create({ data, formType: "service", label });
		},
		onSuccess: (result) => {
			if (!draftId) {
				navigate({
					search: { draftId: result.id },
					to: "/services/new",
				});
			}
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.services.create>[0]) =>
			client.services.create(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to create service");
		},
		onSuccess: () => {
			if (draftId) {
				client.drafts.delete({ id: draftId }).catch(() => {});
			}
			navigate({ to: "/services" });
		},
	});

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const toggleFacility = (facilityId: number) => {
		setSelectedFacilityIds((prev) =>
			prev.includes(facilityId)
				? prev.filter((id) => id !== facilityId)
				: [...prev, facilityId],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const costInPaise = Math.round(Number.parseFloat(formData.cost) * 100);

		const dataToValidate = {
			categoryId: formData.categoryId,
			code: formData.code,
			cost: costInPaise,
			description: formData.description || undefined,
			duration: formData.duration
				? Number.parseInt(formData.duration, 10)
				: undefined,
			facilityIds:
				selectedFacilityIds.length > 0 ? selectedFacilityIds : undefined,
			name: formData.name,
		};

		const result = v.safeParse(serviceSchema, dataToValidate);
		if (!result.success) {
			const newErrors: Record<string, string> = {};
			for (const issue of result.issues) {
				const path = issue.path?.map((p) => String(p.key)).join(".") ?? "";
				if (!newErrors[path]) newErrors[path] = issue.message;
			}
			setErrors(newErrors);
			return;
		}

		await createMutation.mutateAsync(result.output);
	};

	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Link className="hover:text-foreground" to="/services">
					Services
				</Link>
				<span>/</span>
				<span className="text-foreground">New Service</span>
			</div>

			<div>
				<h1 className="font-bold text-2xl">Create Service</h1>
				<p className="text-muted-foreground">
					Add a new hospital service with cost and facility requirements
				</p>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconStethoscope className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle>Service Details</CardTitle>
								<CardDescription>
									Basic information about the service
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-name`}>
									Name <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.name}
									id={`${baseId}-name`}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="e.g., MRI Brain"
									value={formData.name}
								/>
								{errors.name ? (
									<p className="text-destructive text-xs">{errors.name}</p>
								) : null}
							</div>

							<div className="space-y-2">
								<Label htmlFor={`${baseId}-code`}>
									Code <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.code}
									id={`${baseId}-code`}
									onChange={(e) => handleInputChange("code", e.target.value)}
									placeholder="e.g., MRI-BRAIN"
									value={formData.code}
								/>
								{errors.code ? (
									<p className="text-destructive text-xs">{errors.code}</p>
								) : null}
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-category`}>
									Category <span className="text-destructive">*</span>
								</Label>
								<Select
									onValueChange={(value) =>
										handleInputChange("categoryId", Number(value))
									}
									value={formData.categoryId.toString()}
								>
									<SelectTrigger
										aria-invalid={!!errors.categoryId}
										id={`${baseId}-category`}
									>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat.id} value={cat.id.toString()}>
												<div className="flex items-center gap-2">
													<div
														className="h-3 w-3 rounded-full"
														style={{ backgroundColor: cat.colorCode }}
													/>
													{cat.name}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.categoryId ? (
									<p className="text-destructive text-xs">
										{errors.categoryId}
									</p>
								) : null}
							</div>

							<div className="space-y-2">
								<Label htmlFor={`${baseId}-cost`}>
									Cost (₹) <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.cost}
									id={`${baseId}-cost`}
									min="0"
									onChange={(e) => handleInputChange("cost", e.target.value)}
									placeholder="e.g., 5000"
									step="0.01"
									type="number"
									value={formData.cost}
								/>
								{errors.cost ? (
									<p className="text-destructive text-xs">{errors.cost}</p>
								) : null}
							</div>

							<div className="space-y-2">
								<Label htmlFor={`${baseId}-duration`}>Duration (min)</Label>
								<Input
									id={`${baseId}-duration`}
									min="0"
									onChange={(e) =>
										handleInputChange("duration", e.target.value)
									}
									placeholder="e.g., 30"
									type="number"
									value={formData.duration}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor={`${baseId}-description`}>Description</Label>
							<Textarea
								id={`${baseId}-description`}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
								placeholder="Brief description of the service..."
								value={formData.description}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconBuilding className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle>Required Facilities</CardTitle>
								<CardDescription>
									Select the facilities needed for this service
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{facilities.length === 0 ? (
							<p className="text-muted-foreground text-sm">
								No active facilities available. Create facilities first.
							</p>
						) : (
							<div className="grid gap-3 sm:grid-cols-2">
								{facilities.map((facility) => {
									const isSelected = selectedFacilityIds.includes(facility.id);
									return (
										<button
											className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
												isSelected
													? "border-primary bg-primary/5"
													: "hover:bg-muted/50"
											}`}
											key={facility.id}
											onClick={() => toggleFacility(facility.id)}
											type="button"
										>
											<Switch checked={isSelected} />
											<div>
												<p className="font-medium text-sm">{facility.name}</p>
												<p className="text-muted-foreground text-xs">
													{facility.code}
												</p>
											</div>
										</button>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				<div className="flex justify-end gap-3">
					<Link to="/services">
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
						{createMutation.isPending ? "Creating..." : "Create Service"}
					</Button>
				</div>
			</form>
		</div>
	);
}
