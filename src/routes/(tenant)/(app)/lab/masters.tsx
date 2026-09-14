import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/lab/masters")({
	component: RouteComponent,
});

function RouteComponent() {
	const [test, setTest] = useState({
		active: true,
		code: "",
		method: "",
		name: "",
		price: "",
		refHigh: "",
		refLow: "",
		specimen: "",
		turnaround: "",
		units: "",
	});
	const [panel, setPanel] = useState({ name: "", testIds: "" });
	const [qc, setQc] = useState({
		deviations: "",
		equipment: "",
		loggedBy: "",
		lots: "",
		param: "",
		status: "pass",
		testFamily: "",
		value: "",
	});
	const [result, setResult] = useState<string | null>(null);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function saveTest() {
		try {
			await orpc.diagnostics.masters.upsert({
				active: test.active,
				branchId: "main",
				code: test.code,
				method: test.method || undefined,
				name: test.name,
				price: test.price ? Number(test.price) : undefined,
				refHigh: test.refHigh ? Number(test.refHigh) : undefined,
				refLow: test.refLow ? Number(test.refLow) : undefined,
				specimen: test.specimen || undefined,
				turnaroundHrs: test.turnaround ? Number(test.turnaround) : undefined,
				units: test.units || undefined,
			});
			setResult(`Test ${test.code} saved (inactive tests hide from ordering).`);
		} catch (error) {
			fail(error);
		}
	}

	async function savePanel() {
		try {
			await orpc.diagnostics.masters.panels.create({
				branchId: "main",
				name: panel.name,
				testIds: panel.testIds
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			});
			setResult(`Panel ${panel.name} created.`);
		} catch (error) {
			fail(error);
		}
	}

	async function logQc() {
		try {
			await orpc.diagnostics.qc.log({
				branchId: "main",
				deviations: qc.deviations || undefined,
				equipment: qc.equipment,
				loggedBy: qc.loggedBy,
				param: qc.param,
				reagentLots: qc.lots
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
				status: qc.status as "pass" | "flag" | "fail",
				testFamily: qc.testFamily || undefined,
				value: qc.value,
			});
			setResult("QC run logged for NABL evidence.");
		} catch (error) {
			fail(error);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Test masters, panels, and NABL QC hooks."
					title="Lab masters"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Test master
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Code</Label>
									<Input
										onChange={(e) => setTest({ ...test, code: e.target.value })}
										value={test.code}
									/>
								</div>
								<div className="space-y-1">
									<Label>Name</Label>
									<Input
										onChange={(e) => setTest({ ...test, name: e.target.value })}
										value={test.name}
									/>
								</div>
								<div className="space-y-1">
									<Label>Specimen</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, specimen: e.target.value })
										}
										placeholder="EDTA whole blood"
										value={test.specimen}
									/>
								</div>
								<div className="space-y-1">
									<Label>Method</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, method: e.target.value })
										}
										value={test.method}
									/>
								</div>
								<div className="space-y-1">
									<Label>Units</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, units: e.target.value })
										}
										placeholder="g/dL"
										value={test.units}
									/>
								</div>
								<div className="space-y-1">
									<Label>Price</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, price: e.target.value })
										}
										value={test.price}
									/>
								</div>
								<div className="space-y-1">
									<Label>Ref low</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, refLow: e.target.value })
										}
										value={test.refLow}
									/>
								</div>
								<div className="space-y-1">
									<Label>Ref high</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, refHigh: e.target.value })
										}
										value={test.refHigh}
									/>
								</div>
								<div className="space-y-1">
									<Label>TAT hours</Label>
									<Input
										onChange={(e) =>
											setTest({ ...test, turnaround: e.target.value })
										}
										value={test.turnaround}
									/>
								</div>
								<div className="flex items-end gap-2">
									<label className="flex items-center gap-2 text-sm">
										<input
											checked={test.active}
											onChange={(e) =>
												setTest({ ...test, active: e.target.checked })
											}
											type="checkbox"
										/>{" "}
										Active (orderable)
									</label>
								</div>
							</div>
							<Button onClick={() => void saveTest()}>Save test</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">Panel</CardTitle>
							<div className="space-y-1">
								<Label>Panel name</Label>
								<Input
									onChange={(e) => setPanel({ ...panel, name: e.target.value })}
									value={panel.name}
								/>
							</div>
							<div className="space-y-1">
								<Label>Test IDs (comma-separated)</Label>
								<Input
									onChange={(e) =>
										setPanel({ ...panel, testIds: e.target.value })
									}
									value={panel.testIds}
								/>
							</div>
							<Button onClick={() => void savePanel()} variant="outline">
								Create panel
							</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs lg:col-span-2">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								QC log (NABL hook)
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="space-y-1">
									<Label>Equipment</Label>
									<Input
										onChange={(e) =>
											setQc({ ...qc, equipment: e.target.value })
										}
										value={qc.equipment}
									/>
								</div>
								<div className="space-y-1">
									<Label>Parameter</Label>
									<Input
										onChange={(e) => setQc({ ...qc, param: e.target.value })}
										value={qc.param}
									/>
								</div>
								<div className="space-y-1">
									<Label>Value</Label>
									<Input
										onChange={(e) => setQc({ ...qc, value: e.target.value })}
										value={qc.value}
									/>
								</div>
								<div className="space-y-1">
									<Label>Status</Label>
									<Input
										onChange={(e) => setQc({ ...qc, status: e.target.value })}
										placeholder="pass / flag / fail"
										value={qc.status}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reagent lots (comma-separated)</Label>
									<Input
										onChange={(e) => setQc({ ...qc, lots: e.target.value })}
										value={qc.lots}
									/>
								</div>
								<div className="space-y-1">
									<Label>Test family</Label>
									<Input
										onChange={(e) =>
											setQc({ ...qc, testFamily: e.target.value })
										}
										value={qc.testFamily}
									/>
								</div>
								<div className="space-y-1">
									<Label>Deviations</Label>
									<Input
										onChange={(e) =>
											setQc({ ...qc, deviations: e.target.value })
										}
										value={qc.deviations}
									/>
								</div>
								<div className="space-y-1">
									<Label>Logged by</Label>
									<Input
										onChange={(e) => setQc({ ...qc, loggedBy: e.target.value })}
										value={qc.loggedBy}
									/>
								</div>
							</div>
							<Button onClick={() => void logQc()} variant="outline">
								Log QC run
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
