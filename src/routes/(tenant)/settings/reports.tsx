import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/reports")({
	component: ReportsPage,
});

const api: typeof orpc = orpc;

type ReportDef = { collection: string; id: string; name: string };

const PRESETS: Array<{ collection: string; name: string }> = [
	{ collection: "healthcare_invoice", name: "Daily collection" },
	{ collection: "healthcare_receipt", name: "Mode-wise receipts" },
	{ collection: "healthcare_advance", name: "Advance outstanding" },
	{ collection: "healthcare_package_balance", name: "Package liability" },
	{ collection: "healthcare_visit_log", name: "OPD/IPD census" },
	{ collection: "healthcare_message_log", name: "Message delivery" },
];

function ReportsPage() {
	const [branchId] = useBranch();
	const [defs, setDefs] = useState<Array<ReportDef>>([]);
	const [name, setName] = useState("");
	const [collection, setCollection] = useState("healthcare_invoice");
	const [filters, setFilters] = useState("");
	const [output, setOutput] = useState<Array<Record<string, unknown>>>([]);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const res = (await api.operations.reportsList({
				branchId,
			})) as Array<ReportDef>;
			setDefs(res);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Report load failed");
		}
	}, [branchId]);

	useEffect(() => {
		void load();
	}, [load]);

	async function define(preset?: { collection: string; name: string }) {
		setError(null);
		try {
			await api.operations.reportsDefine({
				branchId,
				collection: preset?.collection ?? collection,
				filters: filters || undefined,
				name: preset?.name ?? name,
			});
			setName("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Report define failed");
		}
	}

	async function run(reportId: string) {
		setError(null);
		try {
			const res = (await api.operations.reportsRun({
				branchId,
				limit: 200,
				reportId,
			})) as
				| { rows?: Array<Record<string, unknown>> }
				| Array<Record<string, unknown>>;
			setOutput(Array.isArray(res) ? res : (res.rows ?? []));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Report run failed");
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
									exportRowsCsv(
										"report.csv",
										output,
										Object.keys(output[0] ?? {}),
									)
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description="Collection, census, pharmacy, lab TAT, OT, therapy — printable + exportable."
					title="Reports"
				/>
				{error ? <p className="text-sm text-red-600">{error}</p> : null}
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							New saved view
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input onChange={(e) => setName(e.target.value)} value={name} />
							</div>
							<div className="space-y-1">
								<Label>Collection</Label>
								<Input
									onChange={(e) => setCollection(e.target.value)}
									value={collection}
								/>
							</div>
							<div className="space-y-1">
								<Label>Filters (JSON)</Label>
								<Input
									onChange={(e) => setFilters(e.target.value)}
									placeholder='{"status":"active"}'
									value={filters}
								/>
							</div>
						</div>
						<Button onClick={() => void define()}>Save view</Button>
						<div className="flex flex-wrap gap-2">
							{PRESETS.map((preset) => (
								<Button
									key={preset.name}
									onClick={() => void define(preset)}
									size="sm"
									variant="outline"
								>
									+ {preset.name}
								</Button>
							))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Saved views ({defs.length})
						</CardTitle>
						<ul className="divide-y text-sm">
							{defs.map((def) => (
								<li
									className="flex items-center justify-between gap-2 py-2"
									key={def.id}
								>
									<span>
										{def.name} · {def.collection}
									</span>
									<Button
										onClick={() => void run(def.id)}
										size="sm"
										variant="outline"
									>
										Run
									</Button>
								</li>
							))}
							{defs.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									No saved views — add a preset above.
								</li>
							) : null}
						</ul>
						{output.length > 0 ? (
							<p className="pt-3 text-sm text-muted-foreground">
								{output.length} rows — export CSV or print.
							</p>
						) : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
