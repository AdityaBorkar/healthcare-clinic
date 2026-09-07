import { IconBuildingBank, IconPlus, IconTrash } from "@tabler/icons-react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

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
import { cn } from "#/lib/utils";
import type { PractitionerFormValues } from "#/schemas/forms/practitioner";
import { createDefaultBankAccount } from "./constants";

interface BankAccountsSectionProps {
	baseId: string;
	form: UseFormReturn<PractitionerFormValues>;
	sectionRef: (el: HTMLElement | null) => void;
}

export default function BankAccountsSection({
	baseId,
	form,
	sectionRef,
}: BankAccountsSectionProps) {
	const {
		control,
		formState: { errors },
		register,
		setValue,
		watch,
	} = form;

	const { append, fields, remove } = useFieldArray({
		control,
		name: "bankAccounts",
	});

	const bankAccounts = watch("bankAccounts");

	const setDefaultBankAccount = (idx: number) => {
		for (let i = 0; i < bankAccounts.length; i++) {
			setValue(`bankAccounts.${i}.isDefault`, i === idx, {
				shouldDirty: true,
			});
		}
	};

	const handleRemove = (idx: number) => {
		const isRemovingDefault = bankAccounts[idx]?.isDefault;
		remove(idx);
		if (isRemovingDefault && fields.length > 1) {
			setValue("bankAccounts.0.isDefault", true, { shouldDirty: true });
		}
	};

	return (
		<Card id={`${baseId}-bank-accounts`} ref={sectionRef}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<IconBuildingBank className="h-5 w-5" />
							Bank Accounts
						</CardTitle>
						<CardDescription>
							Add bank accounts for this practitioner. Select one as the
							default.
						</CardDescription>
					</div>
					<Button
						className="gap-2"
						onClick={() =>
							append(createDefaultBankAccount(fields.length === 0))
						}
						type="button"
						variant="outline"
					>
						<IconPlus className="h-4 w-4" />
						Add Account
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{fields.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground">
						No bank accounts added yet
					</p>
				) : (
					fields.map((field, idx) => {
						const account = bankAccounts[idx];
						const isDefault = account?.isDefault ?? false;
						return (
							<Card
								className={cn(isDefault && "border-green-300 bg-green-50/30")}
								key={field.id}
							>
								<CardContent className="space-y-3 pt-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Badge
												className={
													isDefault
														? "bg-green-100 text-green-800"
														: "cursor-pointer"
												}
												onClick={() => !isDefault && setDefaultBankAccount(idx)}
												variant={isDefault ? "default" : "outline"}
											>
												{isDefault ? "Default" : "Set as default"}
											</Badge>
											<span className="font-medium text-sm">
												Account {idx + 1}
											</span>
										</div>
										<Button
											onClick={() => handleRemove(idx)}
											size="sm"
											type="button"
											variant="ghost"
										>
											<IconTrash className="h-4 w-4 text-destructive" />
										</Button>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1">
											<Label className="text-xs">
												Bank Name <span className="text-destructive">*</span>
											</Label>
											<Input
												aria-invalid={!!errors.bankAccounts?.[idx]?.bankName}
												placeholder="State Bank of India"
												{...register(`bankAccounts.${idx}.bankName`)}
											/>
											{errors.bankAccounts?.[idx]?.bankName ? (
												<p className="text-destructive text-xs">
													{errors.bankAccounts[idx].bankName.message}
												</p>
											) : null}
										</div>
										<div className="space-y-1">
											<Label className="text-xs">Branch</Label>
											<Input
												placeholder="Main Branch"
												{...register(`bankAccounts.${idx}.bankBranch`)}
											/>
										</div>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1">
											<Label className="text-xs">
												Account Holder Name{" "}
												<span className="text-destructive">*</span>
											</Label>
											<Input
												aria-invalid={
													!!errors.bankAccounts?.[idx]?.accountHolderName
												}
												placeholder="Dr. John Smith"
												{...register(`bankAccounts.${idx}.accountHolderName`)}
											/>
											{errors.bankAccounts?.[idx]?.accountHolderName ? (
												<p className="text-destructive text-xs">
													{errors.bankAccounts[idx].accountHolderName.message}
												</p>
											) : null}
										</div>
										<div className="space-y-1">
											<Label className="text-xs">
												Account Number{" "}
												<span className="text-destructive">*</span>
											</Label>
											<Input
												aria-invalid={
													!!errors.bankAccounts?.[idx]?.accountNumber
												}
												placeholder="1234567890"
												{...register(`bankAccounts.${idx}.accountNumber`)}
											/>
											{errors.bankAccounts?.[idx]?.accountNumber ? (
												<p className="text-destructive text-xs">
													{errors.bankAccounts[idx].accountNumber.message}
												</p>
											) : null}
										</div>
									</div>

									<div className="space-y-1">
										<Label className="text-xs">
											IFSC Code <span className="text-destructive">*</span>
										</Label>
										<Input
											aria-invalid={!!errors.bankAccounts?.[idx]?.ifscCode}
											className="max-w-xs"
											placeholder="SBIN0001234"
											{...register(`bankAccounts.${idx}.ifscCode`)}
										/>
										{errors.bankAccounts?.[idx]?.ifscCode ? (
											<p className="text-destructive text-xs">
												{errors.bankAccounts[idx].ifscCode.message}
											</p>
										) : null}
									</div>
								</CardContent>
							</Card>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}
