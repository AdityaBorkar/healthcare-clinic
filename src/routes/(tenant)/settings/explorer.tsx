import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/explorer")({
	component: ExplorerPage,
});

const api: typeof orpc = orpc;

const COLLECTIONS = [
	"healthcare_invoice",
	"healthcare_receipt",
	"healthcare_advance",
	"healthcare_package_balance",
	"healthcare_leave_request",
	"healthcare_attendance",
	"healthcare_staff",
	"healthcare_message_log",
	"healthcare_visit_log",
];

function ExplorerPage() {
	const [branchId] = useBranch();
	const listId = useId();
	const [collection, setCollection] = useState("healthcare_invoice");
	const [filters, setFilters] = useState("");
	const [sort, setSort] = useState("");
	const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
	const [error, setError] = useState<string | null>(null);

	async function grant() {
		setError(null);
		try {
			await api.operations.explorer.grant({
				branchId,
				granteeId: "self",
				scope: collection,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Grant failed");
		}
	}

	async function query() {
		setError(null);
		try {
			const res = (await api.operations.explorer.query({
				branchId,
				collection,
				filters: filters || undefined,
				limit: 200,
				sort: sort || undefined,
			})) as Array<Record<string, unknown>>;
			setRows(res);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Query failed");
		}
	}

	async function exportCsv() {
		setError(null);
		try {
			const res = await api.operations.explorer.exportCsv({
				branchId,
				collection,
				filters: filters || undefined,
				limit: 1000,
			});
			const blob = new Blob([res.csv], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${collection}.csv`;
			link.click();
			URL.revokeObjectURL(url);
		} catch {
			exportRowsCsv(`${collection}.csv`, rows, Object.keys(rows[0] ?? {}));
		}
	}

	const columns = Object.keys(rows[0] ?? {}).slice(0, 8);

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={() => void exportCsv()} variant="outline">
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description="Ad-hoc filtered views over appointments, billing, pharmacy, lab, OT, therapy."
					title="Data Explorer"
				/>
				{error ? <p className="text-sm text-red-600">{error}</p> : null}
				<Card>
					<CardContent className="space-y-4 pt-6">
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Collection</Label>
								<Input
									list={listId}
									onChange={(e) => setCollection(e.target.value)}
									value={collection}
								/>
								<datalist id={listId}>
									{COLLECTIONS.map((c) => (
										<option key={c} value={c} />
									))}
								</datalist>
							</div>
							<div className="space-y-1">
								<Label>Filters (JSON equality)</Label>
								<Input
									onChange={(e) => setFilters(e.target.value)}
									placeholder='{"status":"active"}'
									value={filters}
								/>
							</div>
							<div className="space-y-1">
								<Label>Sort (field:asc|desc)</Label>
								<Input
									onChange={(e) => setSort(e.target.value)}
									placeholder="created_at:desc"
									value={sort}
								/>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button onClick={() => void grant()} variant="outline">
								Request access
							</Button>
							<Button onClick={() => void query()}>Run query</Button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Rows ({rows.length})
						</CardTitle>
						<div className="overflow-auto text-xs">
							<table className="w-full">
								<thead>
									<tr>
										{columns.map((col) => (
											<th className="px-2 py-1 text-left font-medium" key={col}>
												{col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{rows.map((row) => (
										<tr
											className="border-t"
											key={String(row.id ?? JSON.stringify(row).slice(0, 64))}
										>
											{columns.map((col) => (
												<td className="px-2 py-1" key={col}>
													{String(row[col] ?? "—").slice(0, 40)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
