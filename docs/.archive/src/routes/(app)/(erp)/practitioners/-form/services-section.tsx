import {
	IconCalendar,
	IconClock,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

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
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";
import { createDefaultBranchConfig, DAY_NAMES } from "./constants";

interface Branch {
	branchCode: string;
	id: number;
	name: string;
}

interface ServicesSectionProps {
	baseId: string;
	branches: Branch[];
	form: UseFormReturn<PractitionerFormValues>;
	sectionRef: (el: HTMLElement | null) => void;
}

export default function ServicesSection({
	baseId,
	branches,
	form,
	sectionRef,
}: ServicesSectionProps) {
	const {
		clearErrors,
		control,
		formState: { errors },
		register,
		setValue,
		watch,
	} = form;

	const { append, fields, remove } = useFieldArray({
		control,
		name: "branchConfigs",
	});

	const branchConfigs = watch("branchConfigs");
	const usedBranchIds = new Set(branchConfigs.map((b) => b.branchId));
	const availableBranches = branches.filter((b) => !usedBranchIds.has(b.id));

	const addBranchConfig = (branchId: number) => {
		append(createDefaultBranchConfig(branchId));
	};

	return (
		<Card id={`${baseId}-services`} ref={sectionRef}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<IconCalendar className="h-5 w-5" />
							Services
						</CardTitle>
						<CardDescription>
							Add branches and configure OPD/IPD schedules
						</CardDescription>
					</div>
					{availableBranches.length > 0 ? (
						<Select onValueChange={(value) => addBranchConfig(Number(value))}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Add Branch" />
							</SelectTrigger>
							<SelectContent>
								{availableBranches.map((branch) => (
									<SelectItem key={branch.id} value={branch.id.toString()}>
										{branch.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<Button
							className="gap-2"
							disabled={branches.length === 0}
							onClick={() => {
								if (branches.length > 0 && availableBranches.length > 0) {
									addBranchConfig(availableBranches[0].id);
								}
							}}
							type="button"
							variant="outline"
						>
							<IconPlus className="h-4 w-4" />
							Add Branch
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{fields.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground">
						No branches added yet. Add a branch to configure OPD/IPD schedules.
					</p>
				) : (
					fields.map((field, configIdx) => {
						const branchConfig = branchConfigs[configIdx];
						const branch = branches.find(
							(b) => b.id === branchConfig?.branchId,
						);
						return (
							<Card key={field.id}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg">
											{branch?.name || `Branch #${branchConfig?.branchId}`}
										</CardTitle>
										<Button
											onClick={() => remove(configIdx)}
											size="sm"
											type="button"
											variant="ghost"
										>
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex gap-6">
										<div className="flex items-center gap-2">
											<Switch
												checked={branchConfig?.opd.enabled ?? false}
												onCheckedChange={(checked) => {
													setValue(
														`branchConfigs.${configIdx}.opd.enabled`,
														checked,
														{ shouldDirty: true },
													);
													if (checked)
														clearErrors(`branchConfigs.${configIdx}.opd`);
												}}
											/>
											<Label className="font-medium">OPD</Label>
										</div>
										<div className="flex items-center gap-2">
											<Switch
												checked={branchConfig?.ipd.enabled ?? false}
												onCheckedChange={(checked) => {
													setValue(
														`branchConfigs.${configIdx}.ipd.enabled`,
														checked,
														{ shouldDirty: true },
													);
													if (checked)
														clearErrors(`branchConfigs.${configIdx}.ipd`);
												}}
											/>
											<Label className="font-medium">IPD</Label>
										</div>
									</div>

									{branchConfig?.opd.enabled ? (
										<OpdSchedule
											configIdx={configIdx}
											errors={errors}
											register={register}
											setValue={setValue}
											watch={watch}
										/>
									) : null}

									{branchConfig?.ipd.enabled ? (
										<IpdSchedule
											configIdx={configIdx}
											errors={errors}
											register={register}
											setValue={setValue}
											watch={watch}
										/>
									) : null}
								</CardContent>
							</Card>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}

function OpdSchedule({
	configIdx,
	errors,
	register,
	setValue,
	watch,
}: {
	configIdx: number;
	errors: UseFormReturn<PractitionerFormValues>["formState"]["errors"];
	register: UseFormReturn<PractitionerFormValues>["register"];
	setValue: UseFormReturn<PractitionerFormValues>["setValue"];
	watch: UseFormReturn<PractitionerFormValues>["watch"];
}) {
	const branchConfig = watch(`branchConfigs.${configIdx}`);
	const branchError = errors.branchConfigs?.[configIdx]?.opd;

	return (
		<div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/30 p-4">
			<div className="flex items-center justify-between">
				<Label className="font-medium text-blue-700">OPD Schedule</Label>
				<div className="flex items-center gap-2">
					<Label className="text-xs">
						<IconClock className="mr-1 inline h-3 w-3" />
						Slot Duration
					</Label>
					<Input
						className="w-20"
						min={5}
						type="number"
						{...register(`branchConfigs.${configIdx}.opd.slotDuration`, {
							setValueAs: (v: string) => (v ? Number(v) : 15),
						})}
					/>
				</div>
			</div>

			{branchError ? (
				<p className="text-destructive text-xs">{branchError.message}</p>
			) : null}

			{DAY_NAMES.map((day, dayIdx) => {
				const schedule = branchConfig?.opd.schedules[dayIdx];
				return (
					<div className="rounded-lg border bg-background p-3" key={day}>
						<div className="space-y-3">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<Switch
										checked={schedule?.enabled ?? false}
										onCheckedChange={(checked) =>
											setValue(
												`branchConfigs.${configIdx}.opd.schedules.${dayIdx}.enabled`,
												checked,
												{ shouldDirty: true },
											)
										}
									/>
									<span className="w-20 font-medium text-sm">{day}</span>
								</div>
							</div>
							{schedule?.enabled ? (
								<div className="space-y-2 pl-8">
									{(schedule.timeSlots ?? []).map((slot, slotIdx) => (
										<div
											className="flex flex-wrap items-end gap-3"
											key={slot.id}
										>
											<div className="space-y-1">
												<Label className="text-xs">Start</Label>
												<Input
													className="w-[110px]"
													type="time"
													{...register(
														`branchConfigs.${configIdx}.opd.schedules.${dayIdx}.timeSlots.${slotIdx}.startTime`,
													)}
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-xs">End</Label>
												<Input
													className="w-[110px]"
													type="time"
													{...register(
														`branchConfigs.${configIdx}.opd.schedules.${dayIdx}.timeSlots.${slotIdx}.endTime`,
													)}
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-xs">Default Room</Label>
												<Input
													className="w-[100px]"
													placeholder="OPD-1"
													{...register(
														`branchConfigs.${configIdx}.opd.schedules.${dayIdx}.timeSlots.${slotIdx}.roomNumber`,
													)}
												/>
											</div>
											{(schedule.timeSlots?.length ?? 0) > 1 ? (
												<Button
													className="h-8 w-8"
													onClick={() => {
														const timeSlots = [...schedule.timeSlots];
														timeSlots.splice(slotIdx, 1);
														setValue(
															`branchConfigs.${configIdx}.opd.schedules.${dayIdx}.timeSlots`,
															timeSlots,
															{ shouldDirty: true },
														);
													}}
													size="icon"
													type="button"
													variant="ghost"
												>
													<IconX className="h-4 w-4 text-muted-foreground" />
												</Button>
											) : null}
										</div>
									))}
									<Button
										className="h-7 gap-1 text-xs"
										onClick={() => {
											const timeSlots = [
												...(schedule?.timeSlots ?? []),
												{
													endTime: "17:00",
													id: crypto.randomUUID(),
													roomNumber: "",
													startTime: "09:00",
												},
											];
											setValue(
												`branchConfigs.${configIdx}.opd.schedules.${dayIdx}.timeSlots`,
												timeSlots,
												{ shouldDirty: true },
											);
										}}
										size="sm"
										type="button"
										variant="outline"
									>
										<IconPlus className="h-3 w-3" />
										Add timing
									</Button>
								</div>
							) : null}
						</div>
					</div>
				);
			})}
		</div>
	);
}

function IpdSchedule({
	configIdx,
	errors,
	register,
	setValue,
	watch,
}: {
	configIdx: number;
	errors: UseFormReturn<PractitionerFormValues>["formState"]["errors"];
	register: UseFormReturn<PractitionerFormValues>["register"];
	setValue: UseFormReturn<PractitionerFormValues>["setValue"];
	watch: UseFormReturn<PractitionerFormValues>["watch"];
}) {
	const branchConfig = watch(`branchConfigs.${configIdx}`);
	const branchError = errors.branchConfigs?.[configIdx]?.ipd;

	return (
		<div className="space-y-3 rounded-lg border border-green-200 bg-green-50/30 p-4">
			<Label className="font-medium text-green-700">IPD Schedule</Label>

			{branchError ? (
				<p className="text-destructive text-xs">{branchError.message}</p>
			) : null}

			{DAY_NAMES.map((day, dayIdx) => {
				const schedule = branchConfig?.ipd.schedules[dayIdx];
				return (
					<div className="rounded-lg border bg-background p-3" key={day}>
						<div className="space-y-3">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<Switch
										checked={schedule?.enabled ?? false}
										onCheckedChange={(checked) =>
											setValue(
												`branchConfigs.${configIdx}.ipd.schedules.${dayIdx}.enabled`,
												checked,
												{ shouldDirty: true },
											)
										}
									/>
									<span className="w-20 font-medium text-sm">{day}</span>
								</div>
							</div>
							{schedule?.enabled ? (
								<div className="space-y-2 pl-8">
									<div className="space-y-1">
										<Label className="text-xs">Ward Round Time</Label>
										<Input
											className="w-[110px]"
											placeholder="08:00"
											type="time"
											{...register(
												`branchConfigs.${configIdx}.ipd.schedules.${dayIdx}.wardRoundTime`,
											)}
										/>
									</div>
									{(schedule.timeSlots ?? []).map((slot, slotIdx) => (
										<div
											className="flex flex-wrap items-end gap-3"
											key={slot.id}
										>
											<div className="space-y-1">
												<Label className="text-xs">Visit Start</Label>
												<Input
													className="w-[110px]"
													type="time"
													{...register(
														`branchConfigs.${configIdx}.ipd.schedules.${dayIdx}.timeSlots.${slotIdx}.visitStartTime`,
													)}
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-xs">Visit End</Label>
												<Input
													className="w-[110px]"
													type="time"
													{...register(
														`branchConfigs.${configIdx}.ipd.schedules.${dayIdx}.timeSlots.${slotIdx}.visitEndTime`,
													)}
												/>
											</div>
											{(schedule.timeSlots?.length ?? 0) > 1 ? (
												<Button
													className="h-8 w-8"
													onClick={() => {
														const timeSlots = [...schedule.timeSlots];
														timeSlots.splice(slotIdx, 1);
														setValue(
															`branchConfigs.${configIdx}.ipd.schedules.${dayIdx}.timeSlots`,
															timeSlots,
															{ shouldDirty: true },
														);
													}}
													size="icon"
													type="button"
													variant="ghost"
												>
													<IconX className="h-4 w-4 text-muted-foreground" />
												</Button>
											) : null}
										</div>
									))}
									<Button
										className="h-7 gap-1 text-xs"
										onClick={() => {
											const timeSlots = [
												...(schedule?.timeSlots ?? []),
												{
													id: crypto.randomUUID(),
													visitEndTime: "17:00",
													visitStartTime: "09:00",
												},
											];
											setValue(
												`branchConfigs.${configIdx}.ipd.schedules.${dayIdx}.timeSlots`,
												timeSlots,
												{ shouldDirty: true },
											);
										}}
										size="sm"
										type="button"
										variant="outline"
									>
										<IconPlus className="h-3 w-3" />
										Add timing
									</Button>
								</div>
							) : null}
						</div>
					</div>
				);
			})}
		</div>
	);
}
