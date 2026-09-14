import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/hr/roster")({
	component: RouteComponent,
});

function RouteComponent() {
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [month, setMonth] = useState("");
	const [result, setResult] = useState<string | null>(null);

	async function addStaff() {
		const staff = await orpc.operations.hrStaffUpsert({
			branchId: "main",
			name,
			role,
		});
		setResult(`Staff ${(staff as { id: string }).id} saved.`);
		setName("");
		setRole("");
	}

	async function planRoster() {
		await orpc.operations.rosterPlan({ branchId: "main", entries: [], month });
		setResult(`Roster shell for ${month} saved — add entries next.`);
	}

	async function exportPayroll() {
		const rows = await orpc.operations.payrollExport({
			branchId: "main",
			month,
		});
		setResult(`Payroll hook: ${JSON.stringify(rows).slice(0, 160)}`);
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Staff, rosters, attendance, leave — plus payroll export hook."
					title="HR roster"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">Add staff</CardTitle>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input onChange={(e) => setName(e.target.value)} value={name} />
							</div>
							<div className="space-y-1">
								<Label>Role</Label>
								<Input onChange={(e) => setRole(e.target.value)} value={role} />
							</div>
						</div>
						<Button onClick={() => void addStaff()}>Save staff</Button>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							Roster + payroll
						</CardTitle>
						<div className="space-y-1">
							<Label>Month (YYYY-MM)</Label>
							<Input onChange={(e) => setMonth(e.target.value)} value={month} />
						</div>
						<div className="flex gap-3">
							<Button onClick={() => void planRoster()}>Plan roster</Button>
							<Button onClick={() => void exportPayroll()} variant="secondary">
								Payroll export
							</Button>
						</div>
						{result ? (
							<p className="text-sm text-muted-foreground">{result}</p>
						) : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
