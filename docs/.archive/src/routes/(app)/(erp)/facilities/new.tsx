import { IconBuilding, IconClock } from "@tabler/icons-react";
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
import { cn } from "#/lib/utils";
import type { FacilityCategory } from "#/rpc/router/facilities";

export const Route = createFileRoute("/(app)/(erp)/facilities/new")({
	component: CreateFacility,
	head: () => ({
		meta: [{ title: "Create Facility (Shaun)" }],
	}),
	validateSearch: v.object({ draftId: v.optional(v.number()) }),
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

const facilitySchema = v.object({
	categoryId: v.pipe(v.number(), v.minValue(1, "Category is required")),
	code: v.pipe(v.string(), v.minLength(1, "Code is required")),
	description: v.optional(v.string()),
	isBed: v.boolean(),
	name: v.pipe(v.string(), v.minLength(1, "Name is required")),
	quantity: v.pipe(v.number(), v.minValue(1, "Quantity must be at least 1")),
});

interface DaySchedule {
	enabled: boolean;
	endTime: string;
	startTime: string;
}

const defaultDaySchedule: DaySchedule = {
	enabled: false,
	endTime: "17:00",
	startTime: "09:00",
};

function createDefaultWeekSchedules(): DaySchedule[] {
	return Array.from({ length: 7 }, () => ({ ...defaultDaySchedule }));
}

function CreateFacility() {
	const { draftId } = Route.useSearch();
	const baseId = useId();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		categoryId: 0,
		code: "",
		description: "",
		isBed: false,
		name: "",
		quantity: 1,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [weekSchedules, setWeekSchedules] = useState<DaySchedule[]>(
		createDefaultWeekSchedules,
	);

	const { data: categories = [] } = useQuery<FacilityCategory[]>({
		queryFn: async () =>
			await client.facilities.categories.list({ isActive: true }),
		queryKey: ["facility-categories"],
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
			description: (d.description as string) ?? prev.description,
			isBed: (d.isBed as boolean) ?? prev.isBed,
			name: (d.name as string) ?? prev.name,
			quantity: (d.quantity as number) ?? prev.quantity,
		}));
		if (d.weekSchedules) {
			setWeekSchedules(d.weekSchedules as DaySchedule[]);
		}
	}, [draft]);

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			const data: Record<string, unknown> = { ...formData, weekSchedules };
			const label = (formData.name as string) || "New Facility";
			if (draftId) {
				return client.drafts.update({ data, id: draftId, label });
			}
			return client.drafts.create({ data, formType: "facility", label });
		},
		onSuccess: (result) => {
			if (!draftId) {
				navigate({
					search: { draftId: result.id },
					to: "/facilities/new",
				});
			}
		},
	});

	const createMutation = useMutation({
		mutationFn: async (
			data: Parameters<typeof client.facilities.create>[0],
		) => {
			return await client.facilities.create(data);
		},
		onError: (error: Error) => {
			alert(error.message || "Failed to create facility");
		},
		onSuccess: async (facility) => {
			const schedulesToCreate = weekSchedules
				.map((schedule, dayOfWeek) => ({
					dayOfWeek,
					enabled: schedule.enabled,
					endTime: schedule.endTime,
					startTime: schedule.startTime,
				}))
				.filter((s) => s.enabled);

			for (const schedule of schedulesToCreate) {
				await client.facilities.schedules.create({
					dayOfWeek: schedule.dayOfWeek,
					endTime: schedule.endTime,
					facilityId: facility.id,
					startTime: schedule.startTime,
				});
			}

			if (draftId) {
				client.drafts.delete({ id: draftId }).catch(() => {});
			}
			navigate({ to: "/facilities" });
		},
	});

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

	const handleScheduleChange = (
		dayIndex: number,
		field: keyof DaySchedule,
		value: string | boolean,
	) => {
		setWeekSchedules((prev) => {
			const updated = [...prev];
			updated[dayIndex] = { ...updated[dayIndex], [field]: value };
			return updated;
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = v.safeParse(facilitySchema, formData);
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
				<Link className="hover:text-foreground" to="/facilities">
					Facilities
				</Link>
				<span>/</span>
				<span className="text-foreground">New Facility</span>
			</div>

			<div>
				<h1 className="font-bold text-2xl">Create Facility</h1>
				<p className="text-muted-foreground">
					Add a new hospital facility with availability schedule
				</p>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
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
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`${baseId}-name`}>
									Name <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.name}
									id={`${baseId}-name`}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="e.g., MRI Room 1"
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
									placeholder="e.g., MRI-01"
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
								<Label htmlFor={`${baseId}-quantity`}>
									Quantity <span className="text-destructive">*</span>
								</Label>
								<Input
									aria-invalid={!!errors.quantity}
									id={`${baseId}-quantity`}
									min="1"
									onChange={(e) =>
										handleInputChange("quantity", Number(e.target.value))
									}
									type="number"
									value={formData.quantity}
								/>
								{errors.quantity ? (
									<p className="text-destructive text-xs">{errors.quantity}</p>
								) : null}
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
								placeholder="Brief description of the facility..."
								value={formData.description}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<IconClock className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle>Availability Schedule</CardTitle>
								<CardDescription>
									Define when this facility is available
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{DAY_NAMES.map((day, idx) => (
							<div
								className="flex items-center gap-4 rounded-lg border p-4"
								key={day}
							>
								<div className="w-28">
									<Switch
										checked={weekSchedules[idx].enabled}
										onCheckedChange={(checked) =>
											handleScheduleChange(idx, "enabled", checked)
										}
									/>
									<p
										className={cn(
											"mt-1 font-medium text-sm",
											!weekSchedules[idx].enabled && "text-muted-foreground",
										)}
									>
										{day}
									</p>
								</div>
								{weekSchedules[idx].enabled ? (
									<div className="flex items-center gap-3">
										<div className="space-y-1">
											<Label className="text-xs">Start</Label>
											<Input
												className="w-28"
												onChange={(e) =>
													handleScheduleChange(idx, "startTime", e.target.value)
												}
												type="time"
												value={weekSchedules[idx].startTime}
											/>
										</div>
										<span className="mt-5 text-muted-foreground">to</span>
										<div className="space-y-1">
											<Label className="text-xs">End</Label>
											<Input
												className="w-28"
												onChange={(e) =>
													handleScheduleChange(idx, "endTime", e.target.value)
												}
												type="time"
												value={weekSchedules[idx].endTime}
											/>
										</div>
									</div>
								) : (
									<p className="text-muted-foreground text-sm">Unavailable</p>
								)}
							</div>
						))}
					</CardContent>
				</Card>

				<div className="flex justify-end gap-3">
					<Link to="/facilities">
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
						{createMutation.isPending ? "Creating..." : "Create Facility"}
					</Button>
				</div>
			</form>
		</div>
	);
}
