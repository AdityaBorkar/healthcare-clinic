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

export const Route = createFileRoute("/(tenant)/(app)/records/registers")({
	component: RouteComponent,
});

interface PendingRow {
	encounterId: string | null;
	id: string;
	patientId: string | null;
	uploadedAt: string;
}

function RouteComponent() {
	const [register, setRegister] = useState("birth");
	const [details, setDetails] = useState("");
	const [ward, setWard] = useState("");
	const [pending, setPending] = useState<PendingRow[]>([]);
	const [retention, setRetention] = useState<{
		blocked: string[];
		eligible: number;
		periods: Record<string, number | string>;
		purgeBlocked: boolean;
	} | null>(null);
	const [recordClass, setRecordClass] = useState("opd");
	const [residentIds, setResidentIds] = useState("");
	const [multi, setMulti] = useState<{ count: number } | null>(null);
	const [shareRecipient, setShareRecipient] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const detailsId = useId();

	async function append(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.records.registers.append({
				branchId: "main",
				details,
				enteredBy: "mro",
				register: register as "birth",
			});
			setStatus(`${register} register entry appended with serial number.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Append failed.");
		}
	}

	async function loadPending() {
		setStatus(null);
		try {
			const res = await orpc.records.discharges.pending({
				branchId: "main",
				ward: ward || undefined,
			});
			setPending((res as { pending?: PendingRow[] }).pending ?? []);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Pending load failed.");
		}
	}

	async function checkRetention() {
		setStatus(null);
		try {
			const res = await orpc.records.retention.check({
				branchId: "main",
				recordClass: recordClass as "opd",
			});
			setRetention(res as typeof retention);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Retention check failed.");
		}
	}

	async function summarize() {
		setStatus(null);
		try {
			const res = await orpc.records.family.summaryMulti({
				branchId: "main",
				patientIds: residentIds
					.split(",")
					.map((id) => id.trim())
					.filter(Boolean),
			});
			setMulti(res as typeof multi);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Summary failed.");
		}
	}

	async function share(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.records.sharing.whatsapp({
				branchId: "main",
				channel: "whatsapp",
				recipient: shareRecipient,
				recipientConfirm: "yes",
				sharedBy: "mro",
			});
			setStatus("Share logged (recipient confirmed before sending).");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Share failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Statutory registers, discharge-pending per ward, retention/purge guard, multi-resident family summaries, and logged sharing."
					title="Registers & MRD"
				/>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Register entry
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={append}>
								<div className="grid gap-1.5">
									<Label>Register</Label>
									<Select
										onValueChange={(v) => setRegister(v ?? "birth")}
										value={register}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[
												"opd",
												"lab",
												"radio",
												"pharmacy",
												"birth",
												"death",
												"mlc",
												"referral",
											].map((r) => (
												<SelectItem key={r} value={r}>
													{r}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={detailsId}>Entry details</Label>
									<Input
										id={detailsId}
										onChange={(e) => setDetails(e.target.value)}
										value={details}
									/>
								</div>
								<Button type="submit">Append entry</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Discharge pending (per ward)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="flex gap-3">
								<div className="grid flex-1 gap-1.5">
									<Label>Ward (optional)</Label>
									<Input
										onChange={(e) => setWard(e.target.value)}
										value={ward}
									/>
								</div>
								<Button
									className="self-end"
									onClick={() => void loadPending()}
									type="button"
								>
									Load pending
								</Button>
							</div>
							<ul className="divide-y text-sm">
								{pending.map((p) => (
									<li className="flex justify-between py-2" key={p.id}>
										<span>
											{p.patientId} · {p.encounterId}
										</span>
										<span className="text-muted-foreground">
											{p.uploadedAt}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Retention & purge guard
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="grid gap-1.5">
								<Label>Record class</Label>
								<Select
									onValueChange={(v) => setRecordClass(v ?? "opd")}
									value={recordClass}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{["opd", "ipd", "mlc"].map((c) => (
											<SelectItem key={c} value={c}>
												{c}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button onClick={() => void checkRetention()} type="button">
								Check retention
							</Button>
							{retention ? (
								<p className="text-sm text-muted-foreground">
									{retention.purgeBlocked
										? `Purge blocked: ${retention.blocked.length} record(s) inside retention.`
										: `${retention.eligible} record(s) eligible for archival.`}{" "}
									Periods (days): {JSON.stringify(retention.periods)}
								</p>
							) : null}
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Family summary (multi-resident)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="grid gap-1.5">
								<Label>Resident IDs (comma separated)</Label>
								<Input
									onChange={(e) => setResidentIds(e.target.value)}
									value={residentIds}
								/>
							</div>
							<Button onClick={() => void summarize()} type="button">
								Aggregate summary
							</Button>
							{multi ? (
								<p className="text-sm text-muted-foreground">
									Aggregated {multi.count} resident(s).
								</p>
							) : null}
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Share (logged)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={share}>
								<div className="grid gap-1.5">
									<Label>Recipient (confirmed)</Label>
									<Input
										onChange={(e) => setShareRecipient(e.target.value)}
										value={shareRecipient}
									/>
								</div>
								<Button type="submit">Share via WhatsApp</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
			</div>
		</main>
	);
}
