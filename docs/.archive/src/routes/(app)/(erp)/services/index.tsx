import {
	IconPencil,
	IconPlus,
	IconStethoscope,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";
import type { FacilityCategory } from "#/rpc/router/facilities";
import type { ServiceWithFacilities } from "#/rpc/router/services";

export const Route = createFileRoute("/(app)/(erp)/services/")({
	component: ServicesList,
	head: () => ({
		meta: [{ title: "Services (Shaun)" }],
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

function ServicesList() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const { data: categories = [] } = useQuery<FacilityCategory[]>({
		queryFn: async () =>
			await client.facilities.categories.list({ isActive: true }),
		queryKey: ["facility-categories"],
	});

	const { data: services = [], isLoading } = useQuery<ServiceWithFacilities[]>({
		queryFn: async () =>
			await client.services.list({
				categoryId:
					categoryFilter !== "all" ? Number(categoryFilter) : undefined,
				isActive:
					statusFilter === "active"
						? true
						: statusFilter === "inactive"
							? false
							: undefined,
				search: search || undefined,
			}),
		queryKey: ["services", categoryFilter, statusFilter, search],
	});

	const deleteMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.services.delete>[0]) =>
			client.services.delete(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to deactivate service");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services"] });
		},
	});

	const handleDelete = async (service: ServiceWithFacilities) => {
		if (!confirm(`Are you sure you want to deactivate "${service.name}"?`)) {
			return;
		}
		await deleteMutation.mutateAsync({ id: service.id });
	};

	return (
		<div className="container mx-auto max-w-6xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Services</h1>
					<p className="text-muted-foreground">
						Manage hospital services, their costs, and facility requirements
					</p>
				</div>
				<Link to="/services/new">
					<Button className="gap-2">
						<IconPlus className="h-4 w-4" />
						Add Service
					</Button>
				</Link>
			</div>

			<Card>
				<CardContent className="space-y-4 p-4">
					<div className="flex flex-col gap-4 sm:flex-row">
						<Input
							className="max-w-sm"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or code..."
							value={search}
						/>
						<Select
							onValueChange={(value) => setCategoryFilter(value ?? "all")}
							value={categoryFilter}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
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
						<Select
							onValueChange={(value) => setStatusFilter(value ?? "all")}
							value={statusFilter}
						>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-muted-foreground">Loading services...</div>
						</div>
					) : services.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12">
							<IconStethoscope className="mb-4 h-12 w-12 text-muted-foreground/50" />
							<p className="text-muted-foreground">No services found</p>
							<p className="text-muted-foreground text-sm">
								Add your first service to get started
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Code</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Cost</TableHead>
									<TableHead>Facilities</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{services.map((service) => (
									<TableRow
										className={cn(!service.isActive && "opacity-50")}
										key={service.id}
									>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<IconStethoscope className="h-4 w-4 text-muted-foreground" />
												<Link
													className="hover:underline"
													params={{ id: service.id.toString() }}
													to="/services/$id"
												>
													{service.name}
												</Link>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{service.code}</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<div
													className="h-3 w-3 rounded-full"
													style={{
														backgroundColor: service.category.colorCode,
													}}
												/>
												{service.category.name}
											</div>
										</TableCell>
										<TableCell className="font-mono">
											{formatCost(service.cost)}
										</TableCell>
										<TableCell>
											{service.serviceFacilities.length > 0 ? (
												<div className="flex flex-wrap gap-1">
													{service.serviceFacilities.map((sf) => (
														<Badge key={sf.id} variant="secondary">
															{sf.facility.name}
														</Badge>
													))}
												</div>
											) : (
												<span className="text-muted-foreground text-sm">
													None
												</span>
											)}
										</TableCell>
										<TableCell>
											<Badge
												className={
													service.isActive
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}
											>
												{service.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link
													params={{ id: service.id.toString() }}
													to="/services/$id"
												>
													<Button size="sm" variant="ghost">
														<IconPencil className="h-4 w-4" />
													</Button>
												</Link>
												<Button
													disabled={deleteMutation.isPending}
													onClick={() => handleDelete(service)}
													size="sm"
													variant="ghost"
												>
													<IconTrash className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
