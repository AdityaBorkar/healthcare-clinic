import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

const api: typeof orpc = orpc;

export const Route = createFileRoute("/(tenant)/(app)/lab/orders")({
	component: RouteComponent,
});

interface LabOrder {
	id: string;
	orderNo: string;
	patientId: string;
	priority: string;
	status: string;
}

function RouteComponent() {
	const [orders, setOrders] = useState<LabOrder[]>([]);
	const [patientId, setPatientId] = useState("");
	const [testCode, setTestCode] = useState("");

	const refresh = useCallback(async () => {
		try {
			setOrders(
				(await api.diagnostics.queue({
					branchId: "main",
					id: "queue",
				})) as Array<LabOrder>,
			);
		} catch {
			setOrders([]);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	async function order() {
		await api.diagnostics.orderLabs({
			branchId: "main",
			patientId,
			priority: "routine",
			tests: [testCode],
		});
		setTestCode("");
		await refresh();
	}

	const queue = [...orders].sort((a, b) => {
		const rank = (p: string) => (p === "stat" ? 0 : p === "urgent" ? 1 : 2);
		return rank(a.priority) - rank(b.priority);
	});

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Collection queue orders STAT first, then urgent, then routine."
					title="Lab orders"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							New lab order
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1">
								<Label>Patient ID</Label>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Test code</Label>
								<Input
									onChange={(e) => setTestCode(e.target.value)}
									value={testCode}
								/>
							</div>
						</div>
						<Button onClick={() => void order()}>Order</Button>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Collection queue ({queue.length})
						</CardTitle>
						<ul className="divide-y text-sm">
							{queue.map((o) => (
								<li className="flex justify-between py-2" key={o.id}>
									<span>
										{o.orderNo} · {o.patientId}
									</span>
									<span className="text-muted-foreground">
										{o.priority} · {o.status}
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
