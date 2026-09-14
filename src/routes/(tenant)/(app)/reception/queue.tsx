import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
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

function toCsv(rows: Array<Token>): string {
	const head = "tokenNo,id,patientId,practitionerId,status";
	const body = rows.map((t) =>
		[t.tokenNo, t.id, t.patientId ?? "", t.practitionerId ?? "", t.status].join(
			",",
		),
	);
	return [head, ...body].join("\n");
}

function RouteComponent() {
	const [tokens, setTokens] = useState<Array<Token>>([]);
	const [patientId, setPatientId] = useState("");
	const [practitionerId, setPractitionerId] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function load() {
		setError(null);
		try {
			setTokens(await api.appointments.queueBoard({ branchId: "main" }));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Queue load failed");
		}
	}

	async function callNext() {
		setError(null);
		try {
			await api.appointments.callNext({ branchId: "main" });
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
				branchId: "main",
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

	function exportCsv() {
		const blob = new Blob([toCsv(tokens)], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "queue.csv";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={load} variant="outline">
								Refresh
							</Button>
							<Button onClick={exportCsv} variant="outline">
								Export CSV
							</Button>
							<Button onClick={() => window.print()} variant="outline">
								Print
							</Button>
							<Button onClick={callNext}>Call next</Button>
						</>
					}
					description="Live token queue for the branch."
					title="Reception queue"
				/>
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
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{tokens.map((t) => (
								<li className="flex justify-between py-2" key={t.id}>
									<span>
										#{t.tokenNo} · {t.patientId ?? "walk-in"} ·{" "}
										{t.practitionerId ?? "any"}
									</span>
									<span className="text-muted-foreground">{t.status}</span>
								</li>
							))}
							{tokens.length === 0 ? (
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
