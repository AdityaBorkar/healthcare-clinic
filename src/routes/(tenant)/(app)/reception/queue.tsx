import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { LanguageToggle, useSlipText } from "#/components/language-toggle";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/reception/queue")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Token = {
	facilityId?: string | null;
	id: string;
	patientId?: string | null;
	practitionerId?: string | null;
	status: string;
	tokenNo: number;
};

/** Room-wise queue with hold / no-show / done transitions (P0-8, P1). */
function RouteComponent() {
	const [branchId] = useBranch();
	const queueLabel = useSlipText("queue");
	const [tokens, setTokens] = useState<Array<Token>>([]);
	const [patientId, setPatientId] = useState("");
	const [practitionerId, setPractitionerId] = useState("");
	const [roomFilter, setRoomFilter] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	async function load() {
		setError(null);
		try {
			setTokens(await api.appointments.queueBoard({ branchId }));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Queue load failed");
		}
	}

	async function callNext() {
		setError(null);
		try {
			await api.appointments.callNext({ branchId });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Call-next failed");
		}
	}

	async function walkin(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			await api.appointments.walkinToken({
				branchId,
				patientId: patientId || undefined,
				practitionerId: practitionerId || undefined,
				walkin: true,
			});
			setPatientId("");
			setPractitionerId("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Walk-in token failed");
		}
	}

	async function markNoShow(id: string) {
		setError(null);
		setNotice(null);
		try {
			await api.appointments.markNoShow({ id });
			// Auto-flag note: surface repeat no-shows on the patient record.
			const token = tokens.find((t) => t.id === id);
			if (token?.patientId) {
				try {
					await api.patients.setFlag({
						branchId,
						label: "no-show",
						level: "watch",
						patientId: token.patientId,
					});
				} catch {
					// flag is advisory — queue transition already succeeded.
				}
			}
			setNotice(`Marked no-show ${id}. Use recall to re-book in one click.`);
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Mark-no-show failed");
		}
	}

	async function recall(patientIdValue: string) {
		setError(null);
		setNotice(null);
		try {
			const at = new Date(Date.now() + 24 * 3600 * 1000)
				.toISOString()
				.slice(0, 16);
			await api.appointments.issueRecall({
				at,
				branchId,
				patientId: patientIdValue,
				reason: "no-show recall",
			});
			setNotice(`Recall issued for ${patientIdValue}.`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Recall failed");
		}
	}

	async function done(id: string) {
		setError(null);
		try {
			await api.appointments.checkin({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Check-in failed");
		}
	}

	const rooms = Array.from(
		new Set(tokens.map((t) => t.facilityId ?? "unassigned")),
	);
	const visible = roomFilter
		? tokens.filter((t) => (t.facilityId ?? "unassigned") === roomFilter)
		: tokens;

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<LanguageToggle />
							<Button onClick={load} variant="outline">
								Refresh
							</Button>
							<Button
								onClick={() =>
									exportRowsCsv("queue.csv", tokens, [
										"tokenNo",
										"id",
										"patientId",
										"practitionerId",
										"status",
									])
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
							<Button onClick={callNext}>Call next</Button>
						</>
					}
					description={`Live token queue for the branch (${queueLabel}).`}
					title="Reception queue"
				/>
				<BranchSelector />
				<Card>
					<CardContent className="pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={walkin}>
							<Input
								className="max-w-56"
								onChange={(e) => setPatientId(e.target.value)}
								placeholder="Patient ID (optional)"
								value={patientId}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setPractitionerId(e.target.value)}
								placeholder="Practitioner ID (optional)"
								value={practitionerId}
							/>
							<Button type="submit" variant="outline">
								Walk-in token
							</Button>
							{rooms.length > 1 ? (
								<select
									aria-label="Filter by room"
									className="h-9 rounded-md border border-border bg-background px-2 text-sm"
									onChange={(e) => setRoomFilter(e.target.value)}
									value={roomFilter}
								>
									<option value="">All rooms</option>
									{rooms.map((r) => (
										<option key={r} value={r}>
											{r}
										</option>
									))}
								</select>
							) : null}
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						{notice ? <p className="text-sm">{notice}</p> : null}
						<ul className="divide-y text-sm">
							{visible.map((t) => (
								<li
									className="flex flex-wrap items-center justify-between gap-2 py-2"
									key={t.id}
								>
									<span>
										#{t.tokenNo} · {t.patientId ?? "walk-in"} ·{" "}
										{t.practitionerId ?? "any"} · room{" "}
										{t.facilityId ?? "unassigned"}
									</span>
									<span className="flex items-center gap-2">
										<span className="text-muted-foreground">{t.status}</span>
										<Button
											onClick={() => markNoShow(t.id)}
											size="sm"
											variant="outline"
										>
											No-show
										</Button>
										{t.patientId ? (
											<Button
												onClick={() => recall(t.patientId as string)}
												size="sm"
												variant="outline"
											>
												Recall
											</Button>
										) : null}
										<Button
											onClick={() => done(t.id)}
											size="sm"
											variant="outline"
										>
											Done
										</Button>
									</span>
								</li>
							))}
							{visible.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									No tokens — refresh to load the board.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
