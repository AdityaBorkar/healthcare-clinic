import {
	IconBed,
	IconBuilding,
	IconClock,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
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
import { cn } from "#/lib/utils";
import type {
	FacilityCategory,
	FacilityWithSchedules,
} from "#/rpc/router/facilities";

export const Route = createFileRoute("/(app)/(erp)/facilities/$id/")({
	component: FacilityDetailPage,
	head: () => ({
		meta: [{ title: "Facility Details (Shaun)" }],
	}),
});

const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

interface FacilitySchedule {
	createdAt: Date | null;
	dayOfWeek: number;
	endTime: string;
	facilityId: number;
	id: number;
	isActive: boolean;
	startTime: string;
	updatedAt: Date | null;
}

function FacilityDetailPage() {
	const baseId = useId();
	const { id } = Route.useParams();
	const queryClient = useQueryClient();

	const [isEditing, setIsEditing] = useState(false);
	const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
	const [editingSchedule, setEditingSchedule] =
		useState<FacilitySchedule | null>(null);

	const [formData, setFormData] = useState({
		categoryId: 0,
		code: "",
		description: "",
		isBed: false,
		name: "",
		quantity: 1,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [scheduleForm, setScheduleForm] = useState({
		dayOfWeek: 1,
		endTime: "17:00",
		startTime: "09:00",
	});

	const { data: facility, isLoading } = useQuery<FacilityWithSchedules>({
		queryFn: async () => await client.facilities.get({ id: Number(id) }),
		queryKey: ["facility", id],
	});

	const { data: categories = [] } = useQuery<FacilityCategory[]>({
		queryFn: async () =>
			await client.facilities.categories.list({ isActive: true }),
		queryKey: ["facility-categories"],
	});

	const updateMutation = useMutation({
		mutationFn: (data: Parameters<typeof client.facilities.update>[0]) =>
			client.facilities.update(data),
		onError: (error: Error) => {
			alert(error.message || "Failed to update facility");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["facility", id] });
			queryClient.invalidateQueries({ queryKey: ["facilities"] });
			setIsEditing(false);
		},
	});

	const createScheduleMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.facilities.schedules.create>[0],
		) => client.facilities.schedules.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["facility", id] });
			setScheduleDialogOpen(false);
			resetScheduleForm();
		},
	});

	const deleteScheduleMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.facilities.schedules.delete>[0],
		) => client.facilities.schedules.delete(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["facility", id] });
		},
	});

	const resetScheduleForm = () => {
		setScheduleForm({ dayOfWeek: 1, endTime: "17:00", startTime: "09:00" });
		setEditingSchedule(null);
	};

	const handleEdit = () => {
		if (!facility) return;
		setFormData({
			categoryId: facility.categoryId,
			code: facility.code,
			description: facility.description || "",
			isBed: facility.isBed,
			name: facility.name,
			quantity: facility.quantity,
		});
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setErrors({});
	};

	const handleInputChange = (
		field: string,
		value: string | number | boolean,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSave = async () => {
		if (!facility) return;

		await updateMutation.mutateAsync({
			categoryId: formData.categoryId,
			code: formData.code,
			description: formData.description || undefined,
			id: facility.id,
			isBed: formData.isBed,
			name: formData.name,
			quantity: formData.quantity,
		});
	};

	const handleEditSchedule = (schedule: FacilitySchedule) => {
		setEditingSchedule(schedule);
		setScheduleForm({
			dayOfWeek: schedule.dayOfWeek,
			endTime: schedule.endTime,
			startTime: schedule.startTime,
		});
		setScheduleDialogOpen(true);
	};

	const handleScheduleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (editingSchedule) {
			await client.facilities.schedules.update({
				id: editingSchedule.id,
				...scheduleForm,
			});
		} else {
			await createScheduleMutation.mutateAsync({
				...scheduleForm,
				facilityId: Number(id),
			});
		}
		queryClient.invalidateQueries({ queryKey: ["facility", id] });
		setScheduleDialogOpen(false);
		resetScheduleForm();
	};

	if (isLoading) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="flex items-center justify-center py-12">
					<div className="text-muted-foreground">Loading facility...</div>
				</div>
			</div>
		);
	}

	if (!facility) {
		return (
			<div className="container mx-auto max-w-4xl p-6">
				<div className="flex flex-col items-center justify-center py-12">
					<IconBuilding className="mb-4 h-12 w-12 text-muted-foreground/50" />
					<p className="text-muted-foreground">Facility not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Link className="hover:text-foreground" to="/facilities">
					Facilities
				</Link>
				<span>/</span>
				<span className="text-foreground">{facility.name}</span>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">{facility.name}</h1>
					<p className="flex items-center gap-2 text-muted-foreground">
						<span
							className="inline-block h-3 w-3 rounded-full"
							style={{ backgroundColor: facility.category.colorCode }}
						/>
						{facility.category.name} &middot; {facility.code}
					</p>
				</div>
				<div className="flex gap-2">
					{!isEditing ? (
						<Button onClick={handleEdit} variant="outline">
							Edit Details
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
						<IconBuilding className="h-5 w-5 text-muted-foreground" />
						<div>
							<CardTitle>Facility Details</CardTitle>
							<CardDescription>
								Basic information about the facility
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
									<Label htmlFor={`${baseId}-quantity`}>
										Quantity <span className="text-destructive">*</span>
									</Label>
									<Input
										id={`${baseId}-quantity`}
										min="1"
										onChange={(e) =>
											handleInputChange("quantity", Number(e.target.value))
										}
										type="number"
										value={formData.quantity}
									/>
								</div>
								<div className="flex items-end gap-2 pb-1">
									<Switch
										checked={formData.isBed}
										onCheckedChange={(checked) =>
											handleInputChange("isBed", checked)
										}
									/>
									<Label>Is Bed?</Label>
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
								<p className="font-medium">{facility.name}</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Code</p>
								<Badge variant="outline">{facility.code}</Badge>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Category</p>
								<div className="flex items-center gap-2">
									<div
										className="h-3 w-3 rounded-full"
										style={{
											backgroundColor: facility.category.colorCode,
										}}
									/>
									<p className="font-medium">{facility.category.name}</p>
								</div>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Quantity</p>
								<p className="font-medium">{facility.quantity}</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Is Bed?</p>
								<div className="flex items-center gap-2">
									{facility.isBed ? (
										<>
											<IconBed className="h-4 w-4 text-blue-600" />
											<p className="font-medium">Yes</p>
										</>
									) : (
										<p className="font-medium">No</p>
									)}
								</div>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Status</p>
								<Badge
									className={
										facility.isActive
											? "bg-green-100 text-green-800"
											: "bg-gray-100 text-gray-800"
									}
								>
									{facility.isActive ? "Active" : "Inactive"}
								</Badge>
							</div>
							<div className="sm:col-span-2">
								<p className="text-muted-foreground text-sm">Description</p>
								<p className="font-medium">{facility.description || "-"}</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<IconClock className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle>Availability Schedule</CardTitle>
								<CardDescription>
									Weekly schedule for this facility
								</CardDescription>
							</div>
						</div>
						<Dialog
							onOpenChange={(open) => {
								setScheduleDialogOpen(open);
								if (!open) resetScheduleForm();
							}}
							open={scheduleDialogOpen}
						>
							<DialogTrigger
								render={
									<Button className="gap-2" size="sm">
										<IconPlus className="h-4 w-4" />
										Add Schedule
									</Button>
								}
							/>
							<DialogContent>
								<form onSubmit={handleScheduleSubmit}>
									<DialogHeader>
										<DialogTitle>
											{editingSchedule ? "Edit Schedule" : "Add Schedule"}
										</DialogTitle>
										<DialogDescription>
											Set the availability time for a day of the week
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label>Day of Week</Label>
											<Select
												onValueChange={(value) =>
													setScheduleForm((prev) => ({
														...prev,
														dayOfWeek: Number(value),
													}))
												}
												value={scheduleForm.dayOfWeek.toString()}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{DAY_NAMES.map((day, idx) => (
														<SelectItem
															key={idx.toString()}
															value={idx.toString()}
														>
															{day}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Start Time</Label>
												<Input
													onChange={(e) =>
														setScheduleForm((prev) => ({
															...prev,
															startTime: e.target.value,
														}))
													}
													type="time"
													value={scheduleForm.startTime}
												/>
											</div>
											<div className="space-y-2">
												<Label>End Time</Label>
												<Input
													onChange={(e) =>
														setScheduleForm((prev) => ({
															...prev,
															endTime: e.target.value,
														}))
													}
													type="time"
													value={scheduleForm.endTime}
												/>
											</div>
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
										<Button
											disabled={createScheduleMutation.isPending}
											type="submit"
										>
											{createScheduleMutation.isPending
												? "Saving..."
												: editingSchedule
													? "Update"
													: "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{facility.schedules.length > 0 ? (
						<div className="divide-y">
							{facility.schedules.map((schedule) => (
								<div
									className="flex items-center justify-between py-3"
									key={schedule.id}
								>
									<div className="flex items-center gap-4">
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-lg",
												"bg-blue-100 text-blue-700",
											)}
										>
											{DAY_NAMES[schedule.dayOfWeek].slice(0, 3)}
										</div>
										<div>
											<p className="font-medium">
												{schedule.startTime} - {schedule.endTime}
											</p>
											<p className="text-muted-foreground text-sm">
												{DAY_NAMES[schedule.dayOfWeek]}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={schedule.isActive ? "default" : "secondary"}
										>
											{schedule.isActive ? "Active" : "Inactive"}
										</Badge>
										<Button
											onClick={() => handleEditSchedule(schedule)}
											size="sm"
											variant="ghost"
										>
											Edit
										</Button>
										<Button
											disabled={deleteScheduleMutation.isPending}
											onClick={() => {
												if (confirm("Delete this schedule?")) {
													deleteScheduleMutation.mutate({ id: schedule.id });
												}
											}}
											size="sm"
											variant="ghost"
										>
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12">
							<IconClock className="mb-4 h-12 w-12 text-muted-foreground/50" />
							<p className="text-muted-foreground">No schedules configured</p>
							<p className="text-muted-foreground text-sm">
								Add a schedule to define availability
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
