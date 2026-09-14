import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/psych/consent")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

interface RecallRow {
	daysOverdue: number;
	id: string;
	level: string;
	patientId: string;
}

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [caregiver, setCaregiver] = useState("");
	const [relation, setRelation] = useState("");
	const [scope, setScope] = useState("");
	const [idNumber, setIdNumber] = useState("");
	const [minor, setMinor] = useState("no");
	const [legalRef, setLegalRef] = useState("");
	const [authority, setAuthority] = useState("");
	const [reviewDate, setReviewDate] = useState("");
	const [reason, setReason] = useState("");
	const [minOverdue, setMinOverdue] = useState("");
	const [recall, setRecall] = useState<RecallRow[]>([]);
	const [status, setStatus] = useState<string | null>(null);
	const patId = useId();

	async function consent(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.psych.consents.caregiver({
				branchId: "main",
				caregiverName: caregiver,
				idNumber: idNumber || undefined,
				patientId,
				patientIsMinor: minor === "yes" ? true : undefined,
				relation,
				scope,
				status: "Signed",
			});
			setStatus(
				`Caregiver consent signed (${(res as { id?: string })?.id ?? "ok"}).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Consent failed.");
		}
	}

	async function involuntary(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.psych.involuntary({
				authority: authority || undefined,
				branchId: "main",
				legalRef,
				patientId,
				reason,
				reviewDate: reviewDate || undefined,
			});
			setStatus("Involuntary hook recorded (no certificate issued).");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Hook failed.");
		}
	}

	async function loadRecall() {
		setStatus(null);
		try {
			const res = await api.psych.recalls.list({
				branchId: "main",
				minDaysOverdue: minOverdue ? Number(minOverdue) : undefined,
			});
			setRecall(res as RecallRow[]);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Recall failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Caregiver consent with ID capture, involuntary-admission hook, and missed follow-up recall."
					title="Consent & recall"
				/>
				<Card className="shadow-xs">
					<CardContent className="grid gap-1.5 py-6">
						<Label htmlFor={patId}>Patient ID</Label>
						<Input
							id={patId}
							onChange={(e) => setPatientId(e.target.value)}
							value={patientId}
						/>
					</CardContent>
				</Card>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Caregiver consent
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={consent}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Caregiver name</Label>
										<Input
											onChange={(e) => setCaregiver(e.target.value)}
											value={caregiver}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Relation</Label>
										<Input
											onChange={(e) => setRelation(e.target.value)}
											value={relation}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>ID number</Label>
										<Input
											onChange={(e) => setIdNumber(e.target.value)}
											value={idNumber}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Minor patient?</Label>
										<Select
											onValueChange={(v) => setMinor(v ?? "no")}
											value={minor}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="no">No</SelectItem>
												<SelectItem value="yes">Yes</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Scope</Label>
									<Input
										onChange={(e) => setScope(e.target.value)}
										placeholder="Therapy + medication decisions"
										value={scope}
									/>
								</div>
								<Button type="submit">Sign consent</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Involuntary-admission hook
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={involuntary}>
								<div className="grid gap-1.5">
									<Label>Legal reference</Label>
									<Input
										onChange={(e) => setLegalRef(e.target.value)}
										value={legalRef}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Authority</Label>
										<Input
											onChange={(e) => setAuthority(e.target.value)}
											value={authority}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Review date</Label>
										<Input
											onChange={(e) => setReviewDate(e.target.value)}
											placeholder="2026-10-14"
											value={reviewDate}
										/>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Reason</Label>
									<Input
										onChange={(e) => setReason(e.target.value)}
										value={reason}
									/>
								</div>
								<Button type="submit">Record hook</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Missed follow-up recall
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3">
						<div className="flex gap-3">
							<div className="grid flex-1 gap-1.5">
								<Label>Min days overdue</Label>
								<Input
									onChange={(e) => setMinOverdue(e.target.value)}
									value={minOverdue}
								/>
							</div>
							<Button
								className="self-end"
								onClick={() => void loadRecall()}
								type="button"
							>
								Load recall
							</Button>
						</div>
						<ul className="divide-y text-sm">
							{recall.map((r) => (
								<li className="flex justify-between py-2" key={r.id}>
									<span>
										{r.patientId} · {r.level}
									</span>
									<span className="text-muted-foreground">
										{r.daysOverdue} day(s) overdue
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
			</div>
		</main>
	);
}
