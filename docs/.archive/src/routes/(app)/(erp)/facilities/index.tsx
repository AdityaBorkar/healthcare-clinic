import {
	IconBed,
	IconBuilding,
	IconPencil,
	IconPlus,
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
import type {
	FacilityCategory,
	FacilityWithSchedules,
} from "#/rpc/router/facilities";

export const Route = createFileRoute("/(app)/(erp)/facilities/")({
	component: FacilitiesList,
	head: () => ({
		meta: [{ title: "Facilities (Shaun)" }],
	}),
});

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function FacilitiesList() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const { data: categories = [] } = useQuery<FacilityCategory[]>({
		queryFn: async () =>
			await client.facilities.categories.list({ isActive: true }),
		queryKey: ["facility-categories"],
	});

	const { data: facilities = [], isLoading } = useQuery<
		FacilityWithSchedules[]
	>({
		queryFn: async () =>
			await client.facilities.list({
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
		queryKey: ["facilities", categoryFilter, statusFilter, search],
	});

	const deleteMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.facilities.delete>[0]) =>
			client.facilities.delete(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to deactivate facility");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["facilities"] });
		},
	});

	const handleDelete = async (facility: FacilityWithSchedules) => {
		if (!confirm(`Are you sure you want to deactivate "${facility.name}"?`)) {
			return;
		}
		await deleteMutation.mutateAsync({ id: facility.id });
	};

	return (
		<div className="container mx-auto max-w-6xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Facilities</h1>
					<p className="text-muted-foreground">
						Manage hospital facilities and their availability schedules
					</p>
				</div>
				<Link to="/facilities/new">
					<Button className="gap-2">
						<IconPlus className="h-4 w-4" />
						Add Facility
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
							<div className="text-muted-foreground">Loading facilities...</div>
						</div>
					) : facilities.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12">
							<IconBuilding className="mb-4 h-12 w-12 text-muted-foreground/50" />
							<p className="text-muted-foreground">No facilities found</p>
							<p className="text-muted-foreground text-sm">
								Add your first facility to get started
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Code</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Qty</TableHead>
									<TableHead>Bed</TableHead>
									<TableHead>Schedule</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{facilities.map((facility) => (
									<TableRow
										className={cn(!facility.isActive && "opacity-50")}
										key={facility.id}
									>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<IconBuilding className="h-4 w-4 text-muted-foreground" />
												<Link
													className="hover:underline"
													params={{ id: facility.id.toString() }}
													to="/facilities/$id"
												>
													{facility.name}
												</Link>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{facility.code}</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<div
													className="h-3 w-3 rounded-full"
													style={{
														backgroundColor: facility.category.colorCode,
													}}
												/>
												{facility.category.name}
											</div>
										</TableCell>
										<TableCell>{facility.quantity}</TableCell>
										<TableCell>
											{facility.isBed ? (
												<IconBed className="h-4 w-4 text-blue-600" />
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell>
											{facility.schedules.length > 0 ? (
												<div className="flex gap-1">
													{Array.from(
														new Set(facility.schedules.map((s) => s.dayOfWeek)),
													).map((day) => (
														<Badge
															className="h-5 w-8 justify-center p-0 text-xs"
															key={day}
															variant="secondary"
														>
															{DAY_NAMES[day]}
														</Badge>
													))}
												</div>
											) : (
												<span className="text-muted-foreground text-sm">
													No schedule
												</span>
											)}
										</TableCell>
										<TableCell>
											<Badge
												className={
													facility.isActive
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}
											>
												{facility.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link
													params={{ id: facility.id.toString() }}
													to="/facilities/$id"
												>
													<Button size="sm" variant="ghost">
														<IconPencil className="h-4 w-4" />
													</Button>
												</Link>
												<Button
													disabled={deleteMutation.isPending}
													onClick={() => handleDelete(facility)}
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
