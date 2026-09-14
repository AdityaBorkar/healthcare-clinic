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
	const [barcode, setBarcode] = useState("");
	const [staffId, setStaffId] = useState("");
	const [orderId, setOrderId] = useState("");
	const [rejectReason, setRejectReason] = useState("hemolysed");
	const [result, setResult] = useState<string | null>(null);

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

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function order() {
		try {
			await api.diagnostics.orderLabs({
				branchId: "main",
				patientId,
				priority: "routine",
				tests: [testCode],
			});
			setTestCode("");
			await refresh();
		} catch (error) {
			fail(error);
		}
	}

	async function collect() {
		try {
			await api.diagnostics.collectSample({
				barcode,
				branchId: "main",
				collectedBy: staffId,
				orderId,
			});
			setResult(`Sample ${barcode} collected — print barcode label.`);
			window.print();
			await refresh();
		} catch (error) {
			fail(error);
		}
	}

	async function receive() {
		try {
			await api.diagnostics.receiveSample({
				barcode,
				branchId: "main",
				condition: "ok",
				receivedBy: staffId,
			});
			setResult(`Sample ${barcode} received.`);
			await refresh();
		} catch (error) {
			fail(error);
		}
	}

	async function reject() {
		try {
			await api.diagnostics.sampleReject({
				barcode,
				branchId: "main",
				reason: rejectReason as
					| "hemolysed"
					| "insufficient"
					| "clotted"
					| "mislabeled"
					| "other",
				rejectedBy: staffId,
			});
			setResult(
				`Sample ${barcode} rejected (${rejectReason}) — recollect required.`,
			);
			await refresh();
		} catch (error) {
			fail(error);
		}
	}

	async function addon() {
		try {
			await api.diagnostics.addonTest({
				branchId: "main",
				orderId,
				requestedBy: staffId,
				tests: [testCode],
			});
			setResult("Add-on test appended to collected sample.");
			await refresh();
		} catch (error) {
			fail(error);
		}
	}

	async function startProcessing() {
		try {
			await api.diagnostics.processingStart({
				branchId: "main",
				orderId,
				startedBy: staffId,
			});
			setResult("Order moved to processing.");
			await refresh();
		} catch (error) {
			fail(error);
		}
	}

	async function cancel(id: string) {
		try {
			await api.diagnostics.cancelOrder({
				branchId: "main",
				cancelledBy: staffId || "desk",
				orderId: id,
				reason: "cancelled at desk with reason",
			});
			await refresh();
		} catch (error) {
			fail(error);
		}
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
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
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
						<div className="flex flex-wrap gap-2">
							<Button onClick={() => void order()}>Order</Button>
							<Button onClick={() => void addon()} variant="outline">
								Add-on to order below
							</Button>
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							Collect → receive queue actions
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-4">
							<div className="space-y-1">
								<Label>Order ID</Label>
								<Input
									onChange={(e) => setOrderId(e.target.value)}
									value={orderId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Barcode (print hook)</Label>
								<Input
									onChange={(e) => setBarcode(e.target.value)}
									value={barcode}
								/>
							</div>
							<div className="space-y-1">
								<Label>Staff ID</Label>
								<Input
									onChange={(e) => setStaffId(e.target.value)}
									value={staffId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Reject reason</Label>
								<Input
									onChange={(e) => setRejectReason(e.target.value)}
									placeholder="hemolysed / insufficient / clotted / mislabeled / other"
									value={rejectReason}
								/>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button onClick={() => void collect()}>
								Collect + print barcode
							</Button>
							<Button onClick={() => void receive()} variant="outline">
								Receive
							</Button>
							<Button onClick={() => void reject()} variant="outline">
								Reject (reason-coded)
							</Button>
							<Button onClick={() => void startProcessing()} variant="outline">
								Start processing
							</Button>
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Collection queue ({queue.length})
						</CardTitle>
						<ul className="divide-y text-sm">
							{queue.map((o) => (
								<li
									className="flex items-center justify-between gap-2 py-2"
									key={o.id}
								>
									<span>
										{o.orderNo} · {o.patientId}
									</span>
									<span className="text-muted-foreground">
										{o.priority} · {o.status}
									</span>
									<Button
										onClick={() => void cancel(o.id)}
										size="sm"
										variant="outline"
									>
										Cancel
									</Button>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
