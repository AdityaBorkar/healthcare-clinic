import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

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

export const Route = createFileRoute(
	"/(tenant)/(app)/old-age-home/residents/$id",
)({
	component: RouteComponent,
});

interface ResidentDetail {
	advance: number;
	alerts: unknown[];
	deliveries: unknown[];
	feedback: unknown[];
	id: string;
	name: string;
	payerName: string | null;
	status: string;
	stayType: string;
	uhid: string;
}

function RouteComponent() {
	const { id } = Route.useParams();
	const [detail, setDetail] = useState<ResidentDetail | null>(null);
	const [note, setNote] = useState("");
	const [bpSys, setBpSys] = useState("");
	const [bpDys, setBpDys] = useState("");
	const [sugar, setSugar] = useState("");
	const [spo2, setSpo2] = useState("");
	const [temp, setTemp] = useState("");
	const [findings, setFindings] = useState("");
	const [plan, setPlan] = useState("");
	const [referral, setReferral] = useState("");
	const [visitor, setVisitor] = useState("");
	const [timeIn, setTimeIn] = useState("");
	const [timeOut, setTimeOut] = useState("");
	const [chargeAmount, setChargeAmount] = useState("");
	const [chargeKind, setChargeKind] = useState("stay");
	const [bill, setBill] = useState<{
		advanceAlert: string | null;
		advanceUsedPct: number;
		duesBlocked: boolean;
		invoiceNo: string;
		total: number;
	} | null>(null);
	const [sendTo, setSendTo] = useState("");
	const [feedbackMsg, setFeedbackMsg] = useState("");
	const [alertKind, setAlertKind] = useState("fall");
	const [alertNote, setAlertNote] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	async function refresh() {
		try {
			const res = await orpc.residents.get({ branchId: "main", id });
			setDetail(res as ResidentDetail);
		} catch {
			setDetail(null);
		}
	}

	useEffect(() => {
		void orpc.residents
			.get({ branchId: "main", id })
			.then((res) => setDetail(res as ResidentDetail))
			.catch(() => setDetail(null));
	}, [id]);

	async function logDaily(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.residents.daily.log({
				bpDys: bpDys ? Number(bpDys) : undefined,
				bpSys: bpSys ? Number(bpSys) : undefined,
				branchId: "main",
				note,
				residentId: id,
				spo2: spo2 ? Number(spo2) : undefined,
				sugarMgDl: sugar ? Number(sugar) : undefined,
				tempC: temp ? Number(temp) : undefined,
			});
			const flags = res as { missedVitals?: boolean };
			setStatus(
				flags?.missedVitals
					? "Daily log saved. Vitals incomplete — flagged as missed."
					: "Daily log saved with full vitals.",
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Daily log failed.");
		}
	}

	async function round(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await orpc.residents.rounds({
				branchId: "main",
				doneBy: "mo",
				findings,
				plan: plan || undefined,
				referralNote: referral || undefined,
				residentId: id,
			});
			setStatus(
				`Round recorded (${(res as { nursingTasksCreated?: number })?.nursingTasksCreated ?? 0} nursing task(s) created).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Round failed.");
		}
	}

	async function visit(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.residents.visits.log({
				branchId: "main",
				purpose: "family visit",
				residentId: id,
				timeIn: timeIn || undefined,
				timeOut: timeOut || undefined,
				visitor,
			});
			setStatus("Visit logged with in/out timestamps.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Visit log failed.");
		}
	}

	async function charge(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.residents.stays.recordCharge({
				amount: Number(chargeAmount),
				branchId: "main",
				chargeDate: new Date().toISOString().slice(0, 10),
				kind: chargeKind as "stay",
				residentId: id,
			});
			setStatus(
				"Stay charge recorded (stay CNDN uses credit-note/debit-note kinds).",
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Charge failed.");
		}
	}

	async function compile() {
		setStatus(null);
		try {
			const res = await orpc.residents.stays.compileBill({
				branchId: "main",
				residentId: id,
			});
			setBill(res as typeof bill);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Billing failed.");
		}
	}

	async function send() {
		setStatus(null);
		try {
			await orpc.residents.family.sendSummary({
				branchId: "main",
				channel: "whatsapp",
				id,
				to: sendTo,
			});
			setStatus("Family summary sent; delivery logged.");
			await refresh();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Send failed.");
		}
	}

	async function feedback(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.residents.feedback({
				branchId: "main",
				category: "family",
				message: feedbackMsg,
				residentId: id,
				submittedBy: "staff",
			});
			setFeedbackMsg("");
			setStatus("Feedback captured in the register.");
			await refresh();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Feedback failed.");
		}
	}

	async function raise(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await orpc.residents.alerts.raise({
				branchId: "main",
				kind: alertKind as "fall",
				note: alertNote,
				residentId: id,
			});
			setStatus("Emergency escalation raised to MO + guardian.");
			await refresh();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Escalation failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description={`${detail?.name ?? id} · ${detail?.uhid ?? ""} · ${detail?.stayType ?? ""} · payer ${detail?.payerName ?? "—"} · advance ${detail?.advance ?? "—"}`}
					title="Resident detail"
				/>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Daily vitals log (BP / sugar / SpO2 / temp)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={logDaily}>
								<div className="grid gap-1.5">
									<Label>Note</Label>
									<Input
										onChange={(e) => setNote(e.target.value)}
										value={note}
									/>
								</div>
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
									<div className="grid gap-1.5">
										<Label>BP sys</Label>
										<Input
											onChange={(e) => setBpSys(e.target.value)}
											value={bpSys}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>BP dys</Label>
										<Input
											onChange={(e) => setBpDys(e.target.value)}
											value={bpDys}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Sugar</Label>
										<Input
											onChange={(e) => setSugar(e.target.value)}
											value={sugar}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>SpO2</Label>
										<Input
											onChange={(e) => setSpo2(e.target.value)}
											value={spo2}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Temp °C</Label>
										<Input
											onChange={(e) => setTemp(e.target.value)}
											value={temp}
										/>
									</div>
								</div>
								<Button type="submit">Save daily log</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								MO round (orders → nursing tasks + referral)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={round}>
								<div className="grid gap-1.5">
									<Label>Findings</Label>
									<Input
										onChange={(e) => setFindings(e.target.value)}
										value={findings}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Plan</Label>
									<Input
										onChange={(e) => setPlan(e.target.value)}
										value={plan}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Referral note</Label>
									<Input
										onChange={(e) => setReferral(e.target.value)}
										value={referral}
									/>
								</div>
								<Button type="submit">Save round</Button>
							</form>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Visit log (in/out)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={visit}>
								<div className="grid gap-1.5">
									<Label>Visitor</Label>
									<Input
										onChange={(e) => setVisitor(e.target.value)}
										value={visitor}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Time in</Label>
										<Input
											onChange={(e) => setTimeIn(e.target.value)}
											placeholder="17:00"
											value={timeIn}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Time out</Label>
										<Input
											onChange={(e) => setTimeOut(e.target.value)}
											placeholder="17:40"
											value={timeOut}
										/>
									</div>
								</div>
								<Button type="submit">Log visit</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Billing (stay charge + compile + 80% advance alert)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={charge}>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="grid gap-1.5">
										<Label>Amount</Label>
										<Input
											onChange={(e) => setChargeAmount(e.target.value)}
											value={chargeAmount}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Kind</Label>
										<Select
											onValueChange={(v) => setChargeKind(v ?? "stay")}
											value={chargeKind}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[
													"stay",
													"meal",
													"care",
													"consumable",
													"credit-note",
													"debit-note",
												].map((k) => (
													<SelectItem key={k} value={k}>
														{k}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<Button type="submit">Record charge</Button>
							</form>
							<Button onClick={() => void compile()} type="button">
								Compile stay bill
							</Button>
							{bill ? (
								<p className="text-sm text-muted-foreground">
									{bill.invoiceNo}: total {bill.total}, advance used{" "}
									{bill.advanceUsedPct}%.{" "}
									{bill.advanceAlert ? `${bill.advanceAlert} ` : ""}
									{bill.duesBlocked
										? "Dues gate: discharge blocked until settled."
										: ""}
								</p>
							) : null}
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Family summary (WhatsApp + delivery log)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="grid gap-1.5">
								<Label>Send to</Label>
								<Input
									onChange={(e) => setSendTo(e.target.value)}
									value={sendTo}
								/>
							</div>
							<Button onClick={() => void send()} type="button">
								Send summary
							</Button>
							<p className="text-sm text-muted-foreground">
								Deliveries logged: {detail?.deliveries.length ?? 0}
							</p>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Feedback register
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={feedback}>
								<div className="grid gap-1.5">
									<Label>Feedback</Label>
									<Input
										onChange={(e) => setFeedbackMsg(e.target.value)}
										value={feedbackMsg}
									/>
								</div>
								<Button type="submit">Capture</Button>
							</form>
							<p className="mt-2 text-sm text-muted-foreground">
								Entries: {detail?.feedback.length ?? 0}
							</p>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Emergency escalation
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={raise}>
								<div className="grid gap-1.5">
									<Label>Kind</Label>
									<Select
										onValueChange={(v) => setAlertKind(v ?? "fall")}
										value={alertKind}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[
												"fall",
												"chest-pain",
												"ulcer",
												"missed-dose",
												"missed-meal",
												"other",
											].map((k) => (
												<SelectItem key={k} value={k}>
													{k}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Note</Label>
									<Input
										onChange={(e) => setAlertNote(e.target.value)}
										value={alertNote}
									/>
								</div>
								<Button type="submit">Raise alert</Button>
							</form>
							<p className="mt-2 text-sm text-muted-foreground">
								Alerts: {detail?.alerts.length ?? 0}
							</p>
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
