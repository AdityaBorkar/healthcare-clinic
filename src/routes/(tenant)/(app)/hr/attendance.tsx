import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/hr/attendance")({
	component: RouteComponent,
});

function RouteComponent() {
	const [att, setAtt] = useState({ date: "", staffId: "", status: "present" });
	const [leave, setLeave] = useState({
		from: "",
		reason: "",
		staffId: "",
		to: "",
	});
	const [decide, setDecide] = useState({
		by: "",
		decision: "approve",
		leaveId: "",
	});
	const [result, setResult] = useState<string | null>(null);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function mark() {
		try {
			await orpc.operations.hr.attendance.mark({
				branchId: "main",
				date: att.date,
				staffId: att.staffId,
				status: att.status as "present" | "absent" | "leave" | "half",
			});
			setResult(`Attendance marked ${att.status}.`);
		} catch (error) {
			fail(error);
		}
	}

	async function request() {
		try {
			const res = (await orpc.operations.hr.leave.request({
				branchId: "main",
				from: leave.from,
				reason: leave.reason,
				staffId: leave.staffId,
				to: leave.to,
			})) as { id: string };
			setDecide((current) => ({ ...current, leaveId: res.id }));
			setResult(`Leave ${res.id} applied — awaiting decision.`);
		} catch (error) {
			fail(error);
		}
	}

	async function decideLeave() {
		try {
			await orpc.operations.hr.leave.decide({
				branchId: "main",
				decidedBy: decide.by,
				decision: decide.decision as "approve" | "reject",
				leaveId: decide.leaveId,
			});
			setResult(`Leave ${decide.decision}d — payroll hook event emitted.`);
		} catch (error) {
			fail(error);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Daily attendance, leave flow, payroll-hook export."
					title="HR attendance & leave"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Mark attendance
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="space-y-1">
									<Label>Staff ID</Label>
									<Input
										onChange={(e) =>
											setAtt({ ...att, staffId: e.target.value })
										}
										value={att.staffId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Date</Label>
									<Input
										onChange={(e) => setAtt({ ...att, date: e.target.value })}
										placeholder="YYYY-MM-DD"
										value={att.date}
									/>
								</div>
								<div className="space-y-1">
									<Label>Status</Label>
									<Input
										onChange={(e) => setAtt({ ...att, status: e.target.value })}
										placeholder="present / absent / leave / half"
										value={att.status}
									/>
								</div>
							</div>
							<Button onClick={() => void mark()}>Mark</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Leave request → decide
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Staff ID</Label>
									<Input
										onChange={(e) =>
											setLeave({ ...leave, staffId: e.target.value })
										}
										value={leave.staffId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reason</Label>
									<Input
										onChange={(e) =>
											setLeave({ ...leave, reason: e.target.value })
										}
										value={leave.reason}
									/>
								</div>
								<div className="space-y-1">
									<Label>From</Label>
									<Input
										onChange={(e) =>
											setLeave({ ...leave, from: e.target.value })
										}
										value={leave.from}
									/>
								</div>
								<div className="space-y-1">
									<Label>To</Label>
									<Input
										onChange={(e) => setLeave({ ...leave, to: e.target.value })}
										value={leave.to}
									/>
								</div>
							</div>
							<Button onClick={() => void request()} variant="outline">
								Request leave
							</Button>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="space-y-1">
									<Label>Leave ID</Label>
									<Input
										onChange={(e) =>
											setDecide({ ...decide, leaveId: e.target.value })
										}
										value={decide.leaveId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Decision</Label>
									<Input
										onChange={(e) =>
											setDecide({ ...decide, decision: e.target.value })
										}
										placeholder="approve / reject"
										value={decide.decision}
									/>
								</div>
								<div className="space-y-1">
									<Label>Decided by</Label>
									<Input
										onChange={(e) =>
											setDecide({ ...decide, by: e.target.value })
										}
										value={decide.by}
									/>
								</div>
							</div>
							<Button onClick={() => void decideLeave()} variant="outline">
								Decide
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
