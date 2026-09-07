import { IconCalendar, IconPlus, IconTrash } from "@tabler/icons-react";
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
import { Switch } from "#/components/ui/switch";
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";
import { createDefaultOutOfOfficeEntry } from "./constants";

interface OutOfOfficeSectionProps {
	baseId: string;
	form: UseFormReturn<PractitionerFormValues>;
	sectionRef: (el: HTMLElement | null) => void;
}

export default function OutOfOfficeSection({
	baseId,
	form,
	sectionRef,
}: OutOfOfficeSectionProps) {
	const { control, register, setValue, watch } = form;

	const { append, fields, remove } = useFieldArray({
		control,
		name: "outOfOfficeEntries",
	});

	return (
		<Card id={`${baseId}-out-of-office`} ref={sectionRef}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<IconCalendar className="h-5 w-5" />
							Out of Office
						</CardTitle>
						<CardDescription>
							Add date ranges when the practitioner is unavailable
						</CardDescription>
					</div>
					<Button
						className="gap-2"
						onClick={() => append(createDefaultOutOfOfficeEntry())}
						type="button"
						variant="outline"
					>
						<IconPlus className="h-4 w-4" />
						Add Period
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{fields.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground">
						No out-of-office periods added
					</p>
				) : (
					fields.map((field, entryIdx) => (
						<Card key={field.id}>
							<CardContent className="space-y-3 pt-4">
								<div className="flex items-center justify-between">
									<span className="font-medium text-sm">
										Unavailable Period
									</span>
									<Button
										onClick={() => remove(entryIdx)}
										size="sm"
										type="button"
										variant="ghost"
									>
										<IconTrash className="h-4 w-4 text-destructive" />
									</Button>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="space-y-1">
										<Label className="text-xs">From</Label>
										<Input
											type="date"
											{...register(`outOfOfficeEntries.${entryIdx}.startDate`)}
										/>
									</div>
									<div className="space-y-1">
										<Label className="text-xs">To</Label>
										<Input
											type="date"
											{...register(`outOfOfficeEntries.${entryIdx}.endDate`)}
										/>
									</div>
								</div>
								<div className="space-y-1">
									<Label className="text-xs">Reason</Label>
									<Input
										placeholder="Vacation, conference, etc."
										{...register(`outOfOfficeEntries.${entryIdx}.reason`)}
									/>
								</div>
								<div className="flex gap-4">
									<div className="flex items-center gap-2">
										<Switch
											checked={
												watch(`outOfOfficeEntries.${entryIdx}.affectsOpd`) ??
												true
											}
											onCheckedChange={(checked) =>
												setValue(
													`outOfOfficeEntries.${entryIdx}.affectsOpd`,
													checked,
													{ shouldDirty: true },
												)
											}
										/>
										<Label className="text-xs">Affects OPD</Label>
									</div>
									<div className="flex items-center gap-2">
										<Switch
											checked={
												watch(`outOfOfficeEntries.${entryIdx}.affectsIpd`) ??
												true
											}
											onCheckedChange={(checked) =>
												setValue(
													`outOfOfficeEntries.${entryIdx}.affectsIpd`,
													checked,
													{ shouldDirty: true },
												)
											}
										/>
										<Label className="text-xs">Affects IPD</Label>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</CardContent>
		</Card>
	);
}
