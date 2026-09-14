import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/access-history")({
	component: AccessHistoryPage,
});

const api: typeof orpc = orpc;

type AccessRow = Record<string, unknown>;

function AccessHistoryPage() {
	const [branchId] = useBranch();
	const [rows, setRows] = useState<Array<AccessRow>>([]);
	const [error, setError] = useState<string | null>(null);

	async function load() {
		setError(null);
		try {
			const res = (await api.operations.audit.query({
				branchId,
				id: "access-history",
			})) as Array<AccessRow>;
			setRows(Array.isArray(res) ? res : []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Access history load failed",
			);
		}
	}

	function cell(row: AccessRow): string {
		const pick = (keys: Array<string>) => {
			for (const key of keys) {
				const value = row[key];
				if (typeof value === "string" || typeof value === "number") {
					return String(value);
				}
			}
			return "—";
		};
		return `${pick(["at", "createdAt", "created_at"])} · ${pick(["actorId", "actor_id", "actor"])} · ${pick(["action", "crudAction", "crud_action"])} · ${pick(["entityType", "entity_type"])} · ${pick(["entityId", "entity_id"])}`;
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button
								onClick={() =>
									exportRowsCsv(
										"access-history.csv",
										rows,
										Object.keys(rows[0] ?? {}),
									)
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
					description="Every PHI touch reconstructible: who / when / what / patient."
					title="Access History"
				/>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{rows.map((row, i) => (
								<li className="py-2" key={String(row.id ?? i)}>
									{cell(row)}
								</li>
							))}
							{rows.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									No touches — refresh to load.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
