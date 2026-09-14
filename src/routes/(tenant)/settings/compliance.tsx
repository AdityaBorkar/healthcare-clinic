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

export const Route = createFileRoute("/(tenant)/settings/compliance")({
	component: CompliancePage,
});

const api: typeof orpc = orpc;

type Framework = "CEA" | "NABH" | "NABL";
type Evidence = {
	control: string;
	evidencePath: string;
	framework: string;
	id: string;
	recordedAt: string;
};

const CHECKLISTS: Record<Framework, Array<string>> = {
	CEA: [
		"Registration certificate",
		"Staff qualification register",
		"Biomedical waste register",
		"Drug license display",
	],
	NABH: [
		"Patient safety goals",
		"Medication management",
		"Infection control",
		"Facility management",
	],
	NABL: [
		"QC compliance log",
		"Equipment calibration",
		"Personnel authorization",
		"Sample rejection register",
	],
};

function CompliancePage() {
	const [branchId] = useBranch();
	const [framework, setFramework] = useState<Framework>("NABH");
	const [evidence, setEvidence] = useState<Array<Evidence>>([]);
	const [control, setControl] = useState("");
	const [path, setPath] = useState("");
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const res = (await api.operations.complianceList({
				branchId,
				framework,
			})) as Array<Evidence>;
			setEvidence(res);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Compliance load failed");
		}
	}, [branchId, framework]);

	useEffect(() => {
		void load();
	}, [load]);

	const covered = new Set(evidence.map((row) => row.control));

	async function attach() {
		setError(null);
		try {
			await api.operations.complianceEvidence({
				branchId,
				control,
				evidencePath: path,
				framework,
			});
			setControl("");
			setPath("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Evidence attach failed");
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
									exportRowsCsv("compliance.csv", evidence, [
										"framework",
										"control",
										"evidencePath",
										"recordedAt",
									])
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
					description="CEA registers, NABH/NABL checklists with evidence + verification."
					title="Compliance"
				/>
				{error ? <p className="text-sm text-red-600">{error}</p> : null}
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">Checklist</CardTitle>
						<div className="flex flex-wrap gap-2">
							{(Object.keys(CHECKLISTS) as Array<Framework>).map((fw) => (
								<Button
									key={fw}
									onClick={() => setFramework(fw)}
									size="sm"
									variant={fw === framework ? "default" : "outline"}
								>
									{fw}
								</Button>
							))}
						</div>
						<ul className="divide-y text-sm">
							{CHECKLISTS[framework].map((item) => (
								<li className="flex justify-between py-2" key={item}>
									<span>{item}</span>
									<span
										className={
											covered.has(item)
												? "text-green-700"
												: "text-muted-foreground"
										}
									>
										{covered.has(item) ? "evidenced" : "pending"}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							Attach evidence
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1">
								<Label>Control</Label>
								<Input
									onChange={(e) => setControl(e.target.value)}
									value={control}
								/>
							</div>
							<div className="space-y-1">
								<Label>Evidence path</Label>
								<Input onChange={(e) => setPath(e.target.value)} value={path} />
							</div>
						</div>
						<Button onClick={() => void attach()}>Attach</Button>
						<ul className="divide-y text-sm">
							{evidence.map((row) => (
								<li className="flex justify-between py-2" key={row.id}>
									<span>{row.control}</span>
									<span className="text-muted-foreground">
										{row.recordedAt.slice(0, 10)}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
