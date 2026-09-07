import {
	IconCalendar,
	IconClock,
	IconPlus,
	IconTrash,
	IconX,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { client } from "#/lib/rpc";
import { cn } from "#/lib/utils";
import type {
	IpdScheduleWithBranch,
	OpdScheduleWithBranch,
} from "#/rpc/router/doctors";

export const Route = createFileRoute(
	"/(app)/(erp)/practitioners/$id/availability",
)({
	component: PractitionerAvailabilityPage,
	head: () => ({
		meta: [{ title: "Practitioner Availability (Shaun)" }],
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

interface Branch {
	branchCode: string;
	id: number;
	name: string;
}

interface Unavailability {
	affectsIpd: boolean;
	affectsOpd: boolean;
	createdAt: Date | null;
	doctorId: number;
	endDate: Date;
	id: number;
	reason: string | null;
	startDate: Date;
	type: string | null;
	updatedAt: Date | null;
}

function PractitionerAvailabilityPage() {
	const baseId = useId();
	const { id } = Route.useParams();
	const queryClient = useQueryClient();

	const [opdDialogOpen, setOpdDialogOpen] = useState(false);
	const [ipdDialogOpen, setIpdDialogOpen] = useState(false);
	const [unavailabilityDialogOpen, setUnavailabilityDialogOpen] =
		useState(false);

	const [editingOpd, setEditingOpd] = useState<OpdScheduleWithBranch | null>(
		null,
	);
	const [editingIpd, setEditingIpd] = useState<IpdScheduleWithBranch | null>(
		null,
	);

	const [opdForm, setOpdForm] = useState({
		branchId: 0,
		dayOfWeek: 1,
		effectiveFrom: "",
		effectiveTo: "",
		endTime: "17:00",
		maxAppointments: undefined as number | undefined,
		roomNumber: "",
		slotDuration: 15,
		startTime: "09:00",
	});

	const [ipdForm, setIpdForm] = useState({
		branchId: 0,
		dayOfWeek: 1,
		maxAdmissions: undefined as number | undefined,
		visitEndTime: "12:00",
		visitStartTime: "10:00",
		wardRoundTime: "",
	});

	const [unavailabilityForm, setUnavailabilityForm] = useState({
		affectsIpd: true,
		affectsOpd: true,
		endDate: "",
		reason: "",
		startDate: "",
		type: "full_day" as "full_day" | "partial",
	});

	const [slotPreviewDate, setSlotPreviewDate] = useState(
		new Date().toISOString().split("T")[0],
	);

	const { data: doctor } = useQuery({
		queryFn: async () => {
			return await client.doctors.get({ id: Number(id) });
		},
		queryKey: ["doctor", id],
	});

	const { data: branches = [] } = useQuery<Branch[]>({
		queryFn: async () => {
			return await client.branches.list({});
		},
		queryKey: ["branches"],
	});

	const { data: opdSchedules = [] } = useQuery<OpdScheduleWithBranch[]>({
		queryFn: async () => {
			return await client.doctors.opdSchedules.list({ doctorId: Number(id) });
		},
		queryKey: ["opd-availability", id],
	});

	const { data: ipdSchedules = [] } = useQuery<IpdScheduleWithBranch[]>({
		queryFn: async () => {
			return await client.doctors.ipdSchedules.list({ doctorId: Number(id) });
		},
		queryKey: ["ipd-availability", id],
	});

	const { data: unavailabilities = [] } = useQuery({
		queryFn: async () => {
			return await client.doctors.unavailability.list({ doctorId: Number(id) });
		},
		queryKey: ["unavailability", id],
	});

	const { data: availableSlots = [] } = useQuery({
		queryFn: async () => {
			return await client.doctors.availableSlots.get({
				date: slotPreviewDate,
				doctorId: Number(id),
			});
		},
		queryKey: ["available-slots", id, slotPreviewDate],
	});

	const createOpdMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.opdSchedules.create>[0],
		) => client.doctors.opdSchedules.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["opd-availability", id] });
			queryClient.invalidateQueries({ queryKey: ["available-slots", id] });
			setOpdDialogOpen(false);
			resetOpdForm();
		},
	});

	const updateOpdMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.opdSchedules.update>[0],
		) => client.doctors.opdSchedules.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["opd-availability", id] });
			queryClient.invalidateQueries({ queryKey: ["available-slots", id] });
			setOpdDialogOpen(false);
			setEditingOpd(null);
			resetOpdForm();
		},
	});

	const deleteOpdMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.opdSchedules.delete>[0],
		) => client.doctors.opdSchedules.delete(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["opd-availability", id] });
			queryClient.invalidateQueries({ queryKey: ["available-slots", id] });
		},
	});

	const createIpdMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.ipdSchedules.create>[0],
		) => client.doctors.ipdSchedules.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ipd-availability", id] });
			setIpdDialogOpen(false);
			resetIpdForm();
		},
	});

	const updateIpdMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.ipdSchedules.update>[0],
		) => client.doctors.ipdSchedules.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ipd-availability", id] });
			setIpdDialogOpen(false);
			setEditingIpd(null);
			resetIpdForm();
		},
	});

	const deleteIpdMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.ipdSchedules.delete>[0],
		) => client.doctors.ipdSchedules.delete(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ipd-availability", id] });
		},
	});

	const createUnavailabilityMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.unavailability.create>[0],
		) => client.doctors.unavailability.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["unavailability", id] });
			queryClient.invalidateQueries({ queryKey: ["available-slots", id] });
			setUnavailabilityDialogOpen(false);
			resetUnavailabilityForm();
		},
	});

	const deleteUnavailabilityMutation = useMutation({
		mutationFn: (
			data: Parameters<typeof client.doctors.unavailability.delete>[0],
		) => client.doctors.unavailability.delete(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["unavailability", id] });
			queryClient.invalidateQueries({ queryKey: ["available-slots", id] });
		},
	});

	const resetOpdForm = () => {
		setOpdForm({
			branchId: 0,
			dayOfWeek: 1,
			effectiveFrom: "",
			effectiveTo: "",
			endTime: "17:00",
			maxAppointments: undefined,
			roomNumber: "",
			slotDuration: 15,
			startTime: "09:00",
		});
	};

	const resetIpdForm = () => {
		setIpdForm({
			branchId: 0,
			dayOfWeek: 1,
			maxAdmissions: undefined,
			visitEndTime: "12:00",
			visitStartTime: "10:00",
			wardRoundTime: "",
		});
	};

	const resetUnavailabilityForm = () => {
		setUnavailabilityForm({
			affectsIpd: true,
			affectsOpd: true,
			endDate: "",
			reason: "",
			startDate: "",
			type: "full_day",
		});
	};

	const handleEditOpd = (schedule: OpdScheduleWithBranch) => {
		setEditingOpd(schedule);
		setOpdForm({
			branchId: schedule.branchId,
			dayOfWeek: schedule.dayOfWeek,
			effectiveFrom: schedule.effectiveFrom
				? new Date(schedule.effectiveFrom).toISOString().split("T")[0]
				: "",
			effectiveTo: schedule.effectiveTo
				? new Date(schedule.effectiveTo).toISOString().split("T")[0]
				: "",
			endTime: schedule.endTime,
			maxAppointments: schedule.maxAppointments || undefined,
			roomNumber: schedule.roomNumber || "",
			slotDuration: schedule.slotDuration || 15,
			startTime: schedule.startTime,
		});
		setOpdDialogOpen(true);
	};

	const handleAddTimingForDay = (schedule: OpdScheduleWithBranch) => {
		setEditingOpd(null);
		setOpdForm({
			branchId: schedule.branchId,
			dayOfWeek: schedule.dayOfWeek,
			effectiveFrom: "",
			effectiveTo: "",
			endTime: "17:00",
			maxAppointments: undefined,
			roomNumber: schedule.roomNumber || "",
			slotDuration: schedule.slotDuration || 15,
			startTime: "09:00",
		});
		setOpdDialogOpen(true);
	};

	const handleEditIpd = (schedule: IpdScheduleWithBranch) => {
		setEditingIpd(schedule);
		setIpdForm({
			branchId: schedule.branchId,
			dayOfWeek: schedule.dayOfWeek,
			maxAdmissions: schedule.maxAdmissions || undefined,
			visitEndTime: schedule.visitEndTime,
			visitStartTime: schedule.visitStartTime,
			wardRoundTime: schedule.wardRoundTime || "",
		});
		setIpdDialogOpen(true);
	};

	const handleAddIpdTimingForDay = (schedule: IpdScheduleWithBranch) => {
		setEditingIpd(null);
		setIpdForm({
			branchId: schedule.branchId,
			dayOfWeek: schedule.dayOfWeek,
			maxAdmissions: undefined,
			visitEndTime: "17:00",
			visitStartTime: "09:00",
			wardRoundTime: "",
		});
		setIpdDialogOpen(true);
	};

	const handleOpdSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = {
			...opdForm,
			doctorId: Number(id),
			effectiveFrom: opdForm.effectiveFrom || undefined,
			effectiveTo: opdForm.effectiveTo || undefined,
		};

		if (editingOpd) {
			await updateOpdMutation.mutateAsync({ id: editingOpd.id, ...data });
		} else {
			await createOpdMutation.mutateAsync(data);
		}
	};

	const handleIpdSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = {
			...ipdForm,
			doctorId: Number(id),
		};

		if (editingIpd) {
			await updateIpdMutation.mutateAsync({ id: editingIpd.id, ...data });
		} else {
			await createIpdMutation.mutateAsync(data);
		}
	};

	const handleUnavailabilitySubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await createUnavailabilityMutation.mutateAsync({
			...unavailabilityForm,
			doctorId: Number(id),
			endDate: new Date(unavailabilityForm.endDate).toISOString(),
			startDate: new Date(unavailabilityForm.startDate).toISOString(),
		});
	};

	return (
		<div className="container mx-auto max-w-6xl space-y-6 p-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Link className="hover:text-foreground" to="/practitioners">
					Practitioners
				</Link>
				<span>/</span>
				<Link
					className="hover:text-foreground"
					params={{ id }}
					to="/practitioners/$id"
				>
					{doctor?.name || "Practitioner"}
				</Link>
				<span>/</span>
				<span className="text-foreground">Availability</span>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Availability Management</h1>
					<p className="text-muted-foreground">
						Configure OPD and IPD schedules for {doctor?.name}
					</p>
				</div>
				<Dialog
					onOpenChange={setUnavailabilityDialogOpen}
					open={unavailabilityDialogOpen}
				>
					<DialogTrigger
						render={
							<Button className="gap-2" variant="outline">
								<IconCalendar className="h-4 w-4" />
								Block Dates
							</Button>
						}
					/>
					<DialogContent>
						<form onSubmit={handleUnavailabilitySubmit}>
							<DialogHeader>
								<DialogTitle>Block Dates</DialogTitle>
								<DialogDescription>
									Mark dates when the practitioner is unavailable
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4 py-4">
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor={`${baseId}-startDate`}>Start Date</Label>
										<Input
											id={`${baseId}-startDate`}
											onChange={(e) =>
												setUnavailabilityForm((prev) => ({
													...prev,
													startDate: e.target.value,
												}))
											}
											required
											type="date"
											value={unavailabilityForm.startDate}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor={`${baseId}-endDate`}>End Date</Label>
										<Input
											id={`${baseId}-endDate`}
											onChange={(e) =>
												setUnavailabilityForm((prev) => ({
													...prev,
													endDate: e.target.value,
												}))
											}
											required
											type="date"
											value={unavailabilityForm.endDate}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor={`${baseId}-reason`}>Reason</Label>
									<Input
										id={`${baseId}-reason`}
										onChange={(e) =>
											setUnavailabilityForm((prev) => ({
												...prev,
												reason: e.target.value,
											}))
										}
										placeholder="Leave, Conference, Training..."
										value={unavailabilityForm.reason}
									/>
								</div>

								<div className="space-y-2">
									<Label>Type</Label>
									<Select
										onValueChange={(value) =>
											setUnavailabilityForm((prev) => ({
												...prev,
												type: value as "full_day" | "partial",
											}))
										}
										value={unavailabilityForm.type}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full_day">Full Day</SelectItem>
											<SelectItem value="partial">Partial</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="flex gap-4">
									<div className="flex items-center gap-2">
										<Switch
											checked={unavailabilityForm.affectsOpd}
											onCheckedChange={(checked) =>
												setUnavailabilityForm((prev) => ({
													...prev,
													affectsOpd: checked,
												}))
											}
										/>
										<Label>Affects OPD</Label>
									</div>
									<div className="flex items-center gap-2">
										<Switch
											checked={unavailabilityForm.affectsIpd}
											onCheckedChange={(checked) =>
												setUnavailabilityForm((prev) => ({
													...prev,
													affectsIpd: checked,
												}))
											}
										/>
										<Label>Affects IPD</Label>
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
									disabled={createUnavailabilityMutation.isPending}
									type="submit"
								>
									{createUnavailabilityMutation.isPending
										? "Saving..."
										: "Block Dates"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs className="flex flex-col" defaultValue="opd">
				<TabsList>
					<TabsTrigger value="opd">OPD Schedule</TabsTrigger>
					<TabsTrigger value="ipd">IPD Schedule</TabsTrigger>
					<TabsTrigger value="blocked">Blocked Dates</TabsTrigger>
					<TabsTrigger value="preview">Slot Preview</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4 space-y-4" value="opd">
					<div className="flex justify-end">
						<Dialog onOpenChange={setOpdDialogOpen} open={opdDialogOpen}>
							<DialogTrigger
								render={
									<Button className="gap-2">
										<IconPlus className="h-4 w-4" />
										Add OPD Schedule
									</Button>
								}
							/>
							<DialogContent className="max-w-lg">
								<form onSubmit={handleOpdSubmit}>
									<DialogHeader>
										<DialogTitle>
											{editingOpd ? "Edit OPD Schedule" : "Add OPD Schedule"}
										</DialogTitle>
										<DialogDescription>
											Configure outpatient department availability
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4 py-4">
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Day of Week</Label>
												<Select
													onValueChange={(value) =>
														setOpdForm((prev) => ({
															...prev,
															dayOfWeek: Number(value),
														}))
													}
													value={opdForm.dayOfWeek.toString()}
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
											<div className="space-y-2">
												<Label>Branch</Label>
												<Select
													onValueChange={(value) =>
														setOpdForm((prev) => ({
															...prev,
															branchId: Number(value),
														}))
													}
													value={opdForm.branchId.toString()}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select branch" />
													</SelectTrigger>
													<SelectContent>
														{branches.map((branch) => (
															<SelectItem
																key={branch.id}
																value={branch.id.toString()}
															>
																{branch.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Start Time</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															startTime: e.target.value,
														}))
													}
													type="time"
													value={opdForm.startTime}
												/>
											</div>
											<div className="space-y-2">
												<Label>End Time</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															endTime: e.target.value,
														}))
													}
													type="time"
													value={opdForm.endTime}
												/>
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-3">
											<div className="space-y-2">
												<Label>Slot Duration (min)</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															slotDuration: Number(e.target.value),
														}))
													}
													type="number"
													value={opdForm.slotDuration}
												/>
											</div>
											<div className="space-y-2">
												<Label>Max per Slot</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															maxAppointments: e.target.value
																? Number(e.target.value)
																: undefined,
														}))
													}
													placeholder="Unlimited"
													type="number"
													value={opdForm.maxAppointments || ""}
												/>
											</div>
											<div className="space-y-2">
												<Label>Default Room</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															roomNumber: e.target.value,
														}))
													}
													placeholder="OPD-1"
													value={opdForm.roomNumber}
												/>
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Effective From</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															effectiveFrom: e.target.value,
														}))
													}
													type="date"
													value={opdForm.effectiveFrom}
												/>
											</div>
											<div className="space-y-2">
												<Label>Effective To</Label>
												<Input
													onChange={(e) =>
														setOpdForm((prev) => ({
															...prev,
															effectiveTo: e.target.value,
														}))
													}
													type="date"
													value={opdForm.effectiveTo}
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
											disabled={
												createOpdMutation.isPending ||
												updateOpdMutation.isPending
											}
											type="submit"
										>
											{createOpdMutation.isPending ||
											updateOpdMutation.isPending
												? "Saving..."
												: editingOpd
													? "Update"
													: "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					{opdSchedules.length > 0 ? (
						<Card>
							<CardContent className="p-0">
								<div className="divide-y">
									{opdSchedules.map((schedule) => (
										<div
											className="flex items-center justify-between p-4"
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
														{schedule.branch?.name} | Default Room:{" "}
														{schedule.roomNumber || "TBD"} |{" "}
														{schedule.slotDuration}min slots
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
													onClick={() => handleAddTimingForDay(schedule)}
													size="sm"
													variant="outline"
												>
													<IconPlus className="mr-1 h-3 w-3" />
													Add timing
												</Button>
												<Button
													onClick={() => handleEditOpd(schedule)}
													size="sm"
													variant="ghost"
												>
													Edit
												</Button>
												<Button
													disabled={deleteOpdMutation.isPending}
													onClick={() => {
														if (confirm("Delete this schedule?")) {
															deleteOpdMutation.mutate({ id: schedule.id });
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
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<IconClock className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<p className="text-muted-foreground">
									No OPD schedules configured
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="ipd">
					<div className="flex justify-end">
						<Dialog onOpenChange={setIpdDialogOpen} open={ipdDialogOpen}>
							<DialogTrigger
								render={
									<Button className="gap-2">
										<IconPlus className="h-4 w-4" />
										Add IPD Schedule
									</Button>
								}
							/>
							<DialogContent className="max-w-lg">
								<form onSubmit={handleIpdSubmit}>
									<DialogHeader>
										<DialogTitle>
											{editingIpd ? "Edit IPD Schedule" : "Add IPD Schedule"}
										</DialogTitle>
										<DialogDescription>
											Configure inpatient department availability
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4 py-4">
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Day of Week</Label>
												<Select
													onValueChange={(value) =>
														setIpdForm((prev) => ({
															...prev,
															dayOfWeek: Number(value),
														}))
													}
													value={ipdForm.dayOfWeek.toString()}
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
											<div className="space-y-2">
												<Label>Branch</Label>
												<Select
													onValueChange={(value) =>
														setIpdForm((prev) => ({
															...prev,
															branchId: Number(value),
														}))
													}
													value={ipdForm.branchId.toString()}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select branch" />
													</SelectTrigger>
													<SelectContent>
														{branches.map((branch) => (
															<SelectItem
																key={branch.id}
																value={branch.id.toString()}
															>
																{branch.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Visit Start Time</Label>
												<Input
													onChange={(e) =>
														setIpdForm((prev) => ({
															...prev,
															visitStartTime: e.target.value,
														}))
													}
													type="time"
													value={ipdForm.visitStartTime}
												/>
											</div>
											<div className="space-y-2">
												<Label>Visit End Time</Label>
												<Input
													onChange={(e) =>
														setIpdForm((prev) => ({
															...prev,
															visitEndTime: e.target.value,
														}))
													}
													type="time"
													value={ipdForm.visitEndTime}
												/>
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<Label>Ward Round Time</Label>
												<Input
													onChange={(e) =>
														setIpdForm((prev) => ({
															...prev,
															wardRoundTime: e.target.value,
														}))
													}
													placeholder="06:00-08:00"
													value={ipdForm.wardRoundTime}
												/>
											</div>
											<div className="space-y-2">
												<Label>Max Admissions</Label>
												<Input
													onChange={(e) =>
														setIpdForm((prev) => ({
															...prev,
															maxAdmissions: e.target.value
																? Number(e.target.value)
																: undefined,
														}))
													}
													placeholder="Unlimited"
													type="number"
													value={ipdForm.maxAdmissions || ""}
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
											disabled={
												createIpdMutation.isPending ||
												updateIpdMutation.isPending
											}
											type="submit"
										>
											{createIpdMutation.isPending ||
											updateIpdMutation.isPending
												? "Saving..."
												: editingIpd
													? "Update"
													: "Create"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					{ipdSchedules.length > 0 ? (
						<Card>
							<CardContent className="p-0">
								<div className="divide-y">
									{ipdSchedules.map((schedule) => (
										<div
											className="flex items-center justify-between p-4"
											key={schedule.id}
										>
											<div className="flex items-center gap-4">
												<div
													className={cn(
														"flex h-10 w-10 items-center justify-center rounded-lg",
														"bg-green-100 text-green-700",
													)}
												>
													{DAY_NAMES[schedule.dayOfWeek].slice(0, 3)}
												</div>
												<div>
													<p className="font-medium">
														Visit: {schedule.visitStartTime} -{" "}
														{schedule.visitEndTime}
													</p>
													<p className="text-muted-foreground text-sm">
														{schedule.branch?.name} | Rounds:{" "}
														{schedule.wardRoundTime || "N/A"} | Max:{" "}
														{schedule.maxAdmissions || "Unlimited"}
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
													onClick={() => handleAddIpdTimingForDay(schedule)}
													size="sm"
													variant="outline"
												>
													<IconPlus className="mr-1 h-3 w-3" />
													Add timing
												</Button>
												<Button
													onClick={() => handleEditIpd(schedule)}
													size="sm"
													variant="ghost"
												>
													Edit
												</Button>
												<Button
													disabled={deleteIpdMutation.isPending}
													onClick={() => {
														if (confirm("Delete this schedule?")) {
															deleteIpdMutation.mutate({ id: schedule.id });
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
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<IconClock className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<p className="text-muted-foreground">
									No IPD schedules configured
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent className="mt-4" value="blocked">
					{unavailabilities.length > 0 ? (
						<Card>
							<CardContent className="p-0">
								<div className="divide-y">
									{unavailabilities.map((block: Unavailability) => (
										<div
											className="flex items-center justify-between p-4"
											key={block.id}
										>
											<div className="flex items-center gap-4">
												<div
													className={cn(
														"flex h-10 w-10 items-center justify-center rounded-lg",
														"bg-red-100 text-red-700",
													)}
												>
													<IconX className="h-5 w-5" />
												</div>
												<div>
													<p className="font-medium">
														{new Date(block.startDate).toLocaleDateString()} -{" "}
														{new Date(block.endDate).toLocaleDateString()}
													</p>
													<p className="text-muted-foreground text-sm">
														{block.reason || "No reason provided"}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="flex gap-1">
													{block.affectsOpd ? (
														<Badge variant="outline">OPD</Badge>
													) : null}
													{block.affectsIpd ? (
														<Badge variant="outline">IPD</Badge>
													) : null}
												</div>
												<Button
													disabled={deleteUnavailabilityMutation.isPending}
													onClick={() => {
														if (confirm("Remove this block?")) {
															deleteUnavailabilityMutation.mutate({
																id: block.id,
															});
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
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<IconCalendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<p className="text-muted-foreground">No blocked dates</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent className="mt-4" value="preview">
					<Card>
						<CardHeader>
							<CardTitle>Slot Preview</CardTitle>
							<CardDescription>
								View available appointment slots for a specific date
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-4">
								<Input
									className="max-w-xs"
									onChange={(e) => setSlotPreviewDate(e.target.value)}
									type="date"
									value={slotPreviewDate}
								/>
							</div>

							{availableSlots.length > 0 ? (
								<div className="grid gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
									{availableSlots.map((slot) => (
										<div
											className="flex flex-col items-center justify-center rounded-lg border bg-blue-50 p-2 text-center"
											key={slot.startTime}
										>
											<p className="font-medium text-sm">{slot.startTime}</p>
											<p className="text-muted-foreground text-xs">
												{slot.slotDuration}min
											</p>
										</div>
									))}
								</div>
							) : (
								<div className="py-8 text-center text-muted-foreground">
									No available slots for this date
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
