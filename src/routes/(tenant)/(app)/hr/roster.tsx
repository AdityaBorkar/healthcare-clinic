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
	const [department, setDepartment] = useState("");
	const [status, setStatus] = useState("active");
	const [doj, setDoj] = useState("");
	const [exitDate, setExitDate] = useState("");
	const [month, setMonth] = useState("");
	const [entries, setEntries] = useState("");
	const [result, setResult] = useState<string | null>(null);

	async function addStaff() {
		try {
			const staff = (await orpc.operations.hr.staff.upsert({
				branchId: "main",
				department: department || undefined,
				doj: doj || undefined,
				exitDate: exitDate || undefined,
				name,
				role,
				status: status as "active" | "on-notice" | "exited",
			})) as { id: string };
			setResult(`Staff ${staff.id} saved.`);
			setName("");
			setRole("");
		} catch (error) {
			setResult(error instanceof Error ? error.message : "Save failed");
		}
	}

	async function planRoster() {
		try {
			const parsed = entries
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean)
				.map((line) => {
					const [staffId, date, shift] = line.split(/\s+/);
					return {
						date: date ?? "",
						shift: (shift ?? "morning") as
							| "morning"
							| "evening"
							| "night"
							| "off",
						staffId: staffId ?? "",
					};
				});
			await orpc.operations.hr.roster.plan({
				branchId: "main",
				entries: parsed,
				month,
			});
			setResult(`Roster for ${month} saved (${parsed.length} entries).`);
		} catch (error) {
			setResult(error instanceof Error ? error.message : "Roster failed");
		}
	}

	async function exportPayroll() {
		const rows = await orpc.operations.hr.payroll.export({
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
						<CardTitle className="text-base font-semibold">
							Add staff (role · dept · branch · join/exit)
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input onChange={(e) => setName(e.target.value)} value={name} />
							</div>
							<div className="space-y-1">
								<Label>Role</Label>
								<Input onChange={(e) => setRole(e.target.value)} value={role} />
							</div>
							<div className="space-y-1">
								<Label>Department</Label>
								<Input
									onChange={(e) => setDepartment(e.target.value)}
									value={department}
								/>
							</div>
							<div className="space-y-1">
								<Label>Status</Label>
								<Input
									onChange={(e) => setStatus(e.target.value)}
									placeholder="active / on-notice / exited"
									value={status}
								/>
							</div>
							<div className="space-y-1">
								<Label>Join date</Label>
								<Input
									onChange={(e) => setDoj(e.target.value)}
									placeholder="YYYY-MM-DD"
									value={doj}
								/>
							</div>
							<div className="space-y-1">
								<Label>Exit date</Label>
								<Input
									onChange={(e) => setExitDate(e.target.value)}
									placeholder="YYYY-MM-DD"
									value={exitDate}
								/>
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
						<div className="space-y-1">
							<Label>Roster entries (staffId YYYY-MM-DD shift per line)</Label>
							<Input
								onChange={(e) => setEntries(e.target.value)}
								placeholder={"staff-1 2026-09-15 morning"}
								value={entries}
							/>
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
