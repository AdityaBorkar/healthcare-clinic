import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/audit-log")({
	component: AuditLogPage,
});

const api: typeof orpc = orpc;

type LogRow = {
	action?: string;
	at?: string;
	entityId?: string;
	entityType?: string;
	id?: string;
};

function AuditLogPage() {
	const [branchId] = useBranch();
	const [rows, setRows] = useState<Array<LogRow>>([]);
	const [error, setError] = useState<string | null>(null);

	async function load() {
		setError(null);
		try {
			const res = (await api.admin.auditLogs.list({ branchId, limit: 100 })) as
				| Array<LogRow>
				| { items: Array<LogRow> };
			setRows(Array.isArray(res) ? res : (res.items ?? []));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Audit log load failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button
								onClick={() =>
									exportRowsCsv("audit-log.csv", rows, [
										"at",
										"action",
										"entityType",
										"entityId",
									])
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
							<Button onClick={load}>Refresh</Button>
						</>
					}
					description="Latest admin audit events for the branch."
					title="Audit Log"
				/>
				<BranchSelector />
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{rows.map((r, i) => (
								<li className="py-2" key={r.id ?? i}>
									{r.at ?? "—"} · {r.action ?? "—"} · {r.entityType ?? "—"} ·{" "}
									{r.entityId ?? "—"}
								</li>
							))}
							{rows.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									No events — refresh to load.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
