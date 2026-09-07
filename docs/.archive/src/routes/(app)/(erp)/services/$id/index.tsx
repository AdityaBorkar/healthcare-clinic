import { IconBuilding, IconStethoscope } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useState } from "react";

import { Badge } from "#/components/ui/badge";
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
import type { ServiceWithFacilities } from "#/rpc/router/services";

export const Route = createFileRoute("/(app)/(erp)/services/$id/")({
	component: ServiceDetailPage,
	head: () => ({
		meta: [{ title: "Service Details (Shaun)" }],
	}),
});

function formatCost(costInPaise: number): string {
	return new Intl.NumberFormat("en-IN", {
		currency: "INR",
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
		style: "currency",
	}).format(costInPaise / 100);
}

function ServiceDetailPage() {
	const baseId = useId();
	const { id } = Route.useParams();
	const queryClient = useQueryClient();

	const [isEditing, setIsEditing] = useState(false);
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

	const { data: service, isLoading } = useQuery<ServiceWithFacilities>({
		queryFn: async () => await client.services.get({ id: Number(id) }),
		queryKey: ["service", id],
	});

	const { data: categories = [] } = useQuery<FacilityCategory[]>({
		queryFn: async () =>
			await client.facilities.categories.list({ isActive: true }),
		queryKey: ["facility-categories"],
	});

	const { data: facilities = [] } = useQuery<FacilityWithSchedules[]>({
		queryFn: async () => await client.facilities.list({ isActive: true }),
		queryKey: ["facilities", "active"],
	});

	const updateMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.services.update>[0]) =>
			client.services.update(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to update service");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["service", id] });
			queryClient.invalidateQueries({ queryKey: ["services"] });
			setIsEditing(false);
		},
	});

	const handleEdit = () => {
		if (!service) return;
		setFormData({
			categoryId: service.categoryId,
			code: service.code,
			cost: (service.cost / 100).toString(),
			description: service.description || "",
			duration: service.duration?.toString() || "",
			name: service.name,
		});
		setSelectedFacilityIds(
			service.serviceFacilities.map((sf) => sf.facilityId),
		);
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setErrors({});
	};

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

	const handleSave = async () => {
		if (!service) return;

		const costInPaise = Math.round(Number.parseFloat(formData.cost) * 100);

		await updateMutation.mutateAsync({
			categoryId: formData.categoryId,
			code: formData.code,
			cost: costInPaise,
			description: formData.description || undefined,
			duration: formData.duration
				? Number.parseInt(formData.duration, 10)
				: undefined,
			facilityIds: selectedFacilityIds,
			id: service.id,
			name: formData.name,
		});
	};

	if (isLoading) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="text-muted-foreground">Loading service...</div>
				</div>
			</div>
		);
	}

	if (!service) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="flex flex-col items-center justify-center py-12">
					<IconStethoscope className="mb-4 h-12 w-12 text-muted-foreground/50" />
					<p className="text-muted-foreground">Service not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Link className="hover:text-foreground" to="/services">
					Services
				</Link>
				<span>/</span>
				<span className="text-foreground">{service.name}</span>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">{service.name}</h1>
					<p className="flex items-center gap-2 text-muted-foreground">
						<span
							className="inline-block h-3 w-3 rounded-full"
							style={{ backgroundColor: service.category.colorCode }}
						/>
						{service.category.name} &middot; {service.code} &middot;{" "}
						{formatCost(service.cost)}
					</p>
				</div>
				<div className="flex gap-2">
					{!isEditing ? (
						<Button onClick={handleEdit} variant="outline">
							Edit
						</Button>
					) : (
						<>
							<Button onClick={handleCancelEdit} variant="outline">
								Cancel
							</Button>
							<Button disabled={updateMutation.isPending} onClick={handleSave}>
								{updateMutation.isPending ? "Saving..." : "Save"}
							</Button>
						</>
					)}
				</div>
			</div>

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
					{isEditing ? (
						<>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-name`}>
										Name <span className="text-destructive">*</span>
									</Label>
									<Input
										id={`${baseId}-name`}
										onChange={(e) => handleInputChange("name", e.target.value)}
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
										id={`${baseId}-code`}
										onChange={(e) => handleInputChange("code", e.target.value)}
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
										<SelectTrigger id={`${baseId}-category`}>
											<SelectValue />
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
								</div>
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-cost`}>
										Cost (₹) <span className="text-destructive">*</span>
									</Label>
									<Input
										id={`${baseId}-cost`}
										min="0"
										onChange={(e) => handleInputChange("cost", e.target.value)}
										step="0.01"
										type="number"
										value={formData.cost}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-duration`}>Duration (min)</Label>
									<Input
										id={`${baseId}-duration`}
										min="0"
										onChange={(e) =>
											handleInputChange("duration", e.target.value)
										}
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
									value={formData.description}
								/>
							</div>
						</>
					) : (
						<div className="grid gap-6 sm:grid-cols-2">
							<div>
								<p className="text-muted-foreground text-sm">Name</p>
								<p className="font-medium">{service.name}</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Code</p>
								<Badge variant="outline">{service.code}</Badge>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Category</p>
								<div className="flex items-center gap-2">
									<div
										className="h-3 w-3 rounded-full"
										style={{
											backgroundColor: service.category.colorCode,
										}}
									/>
									<p className="font-medium">{service.category.name}</p>
								</div>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Cost</p>
								<p className="font-medium font-mono">
									{formatCost(service.cost)}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Duration</p>
								<p className="font-medium">
									{service.duration ? `${service.duration} minutes` : "-"}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Status</p>
								<Badge
									className={
										service.isActive
											? "bg-green-100 text-green-800"
											: "bg-gray-100 text-gray-800"
									}
								>
									{service.isActive ? "Active" : "Inactive"}
								</Badge>
							</div>
							<div className="sm:col-span-2">
								<p className="text-muted-foreground text-sm">Description</p>
								<p className="font-medium">{service.description || "-"}</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconBuilding className="h-5 w-5 text-muted-foreground" />
						<div>
							<CardTitle>Required Facilities</CardTitle>
							<CardDescription>
								{isEditing
									? "Select the facilities needed for this service"
									: "Facilities required to perform this service"}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isEditing ? (
						facilities.length === 0 ? (
							<p className="text-muted-foreground text-sm">
								No active facilities available.
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
						)
					) : service.serviceFacilities.length > 0 ? (
						<div className="grid gap-3 sm:grid-cols-2">
							{service.serviceFacilities.map((sf) => (
								<div
									className="flex items-center gap-3 rounded-lg border p-3"
									key={sf.id}
								>
									<IconBuilding className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium text-sm">{sf.facility.name}</p>
										<p className="text-muted-foreground text-xs">
											{sf.facility.code}
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-8">
							<IconBuilding className="mb-4 h-8 w-8 text-muted-foreground/50" />
							<p className="text-muted-foreground text-sm">
								No facilities assigned
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
