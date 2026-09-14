import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/pharmacy/stock")({
	component: RouteComponent,
});

type Alert = {
	batchId: string;
	daysLeft: number;
	expired: boolean;
	expiry: string;
	itemId: string;
	itemName: string;
	lot: string;
	qty: number;
	store: string;
};

type Movement = {
	at: string;
	detail: string;
	direction: string;
	id: string;
	itemId: string | null;
	kind: string;
	qty: number | null;
	ref: string;
};

function RouteComponent() {
	const [item, setItem] = useState({
		coldChain: false,
		name: "",
		pack: "",
		salt: "",
		schedule: "OTC",
		strength: "",
	});
	const [batch, setBatch] = useState({
		expiry: "",
		itemId: "",
		lot: "",
		mrp: "",
		qty: "",
		rate: "",
	});
	const [transfer, setTransfer] = useState({
		decidedBy: "",
		itemId: "",
		qty: "",
		reason: "",
		to: "ward",
		transferId: "",
	});
	const [correction, setCorrection] = useState({
		batchId: "",
		by: "",
		delta: "",
		reason: "",
	});
	const [ret, setRet] = useState({
		batchId: "",
		billId: "",
		disposition: "restock",
		itemId: "",
		qty: "",
		reason: "",
	});
	const [alerts, setAlerts] = useState<Array<Alert>>([]);
	const [ledger, setLedger] = useState<Array<Movement>>([]);
	const [result, setResult] = useState<string | null>(null);

	const loadAlerts = useCallback(async () => {
		try {
			const res = (await orpc.pharmacy.expiryAlerts({
				branchId: "main",
				withinDays: 90,
			})) as { alerts: Array<Alert> };
			setAlerts(res.alerts);
		} catch {
			setAlerts([]);
		}
	}, []);

	const loadLedger = useCallback(async () => {
		try {
			const res = (await orpc.pharmacy.stockLedger({
				branchId: "main",
				limit: 100,
			})) as { movements: Array<Movement> };
			setLedger(res.movements);
		} catch {
			setLedger([]);
		}
	}, []);

	useEffect(() => {
		void loadAlerts();
		void loadLedger();
	}, [loadAlerts, loadLedger]);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function saveItem() {
		try {
			await orpc.pharmacy.itemUpsert({
				branchId: "main",
				coldChain: item.coldChain,
				name: item.name,
				pack: item.pack,
				salt: item.salt,
				schedule: item.schedule as "H" | "H1" | "X" | "OTC",
				strength: item.strength,
			});
			setResult(`Item ${item.name} saved (dup salt+strength+pack guarded).`);
		} catch (error) {
			fail(error);
		}
	}

	async function receiveBatch() {
		try {
			await orpc.pharmacy.batchReceive({
				branchId: "main",
				expiry: batch.expiry,
				itemId: batch.itemId,
				lot: batch.lot,
				mrp: Number(batch.mrp) || 0,
				qty: Number(batch.qty) || 1,
				rate: Number(batch.rate) || 0,
			});
			setResult(`Batch ${batch.lot} received (FEFO-tracked).`);
			await loadAlerts();
		} catch (error) {
			fail(error);
		}
	}

	async function moveStock() {
		try {
			const res = (await orpc.pharmacy.transfer({
				branchId: "main",
				itemId: transfer.itemId,
				qty: Number(transfer.qty) || 1,
				to: transfer.to as "ward" | "daycare" | "store",
			})) as { id: string; transferNo: string };
			setTransfer((current) => ({ ...current, transferId: res.id }));
			setResult(
				`Transfer ${res.transferNo} in transit — needs receiver accept.`,
			);
			await loadLedger();
		} catch (error) {
			fail(error);
		}
	}

	async function decideTransfer(decision: "accept" | "reject") {
		try {
			await orpc.pharmacy.transferAccept({
				acceptedBy: transfer.decidedBy,
				branchId: "main",
				decision,
				reason: transfer.reason || undefined,
				transferId: transfer.transferId,
			});
			setResult(`Transfer ${decision}ed.`);
			await loadLedger();
		} catch (error) {
			fail(error);
		}
	}

	async function correctStock() {
		try {
			await orpc.pharmacy.stockCorrect({
				batchId: correction.batchId,
				branchId: "main",
				correctedBy: correction.by,
				deltaQty: Number(correction.delta) || 0,
				reason: correction.reason,
			});
			setResult("Correction note recorded (no backdated edits).");
			await loadLedger();
			await loadAlerts();
		} catch (error) {
			fail(error);
		}
	}

	async function returnBill() {
		try {
			await orpc.pharmacy.returnAgainstBill({
				branchId: "main",
				items: [
					{
						batchId: ret.batchId || undefined,
						disposition: ret.disposition as "restock" | "quarantine",
						itemId: ret.itemId,
						qty: Number(ret.qty) || 1,
					},
				],
				originalBillId: ret.billId,
				reason: ret.reason,
			});
			setResult("Return recorded with restock/quarantine.");
		} catch (error) {
			fail(error);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Item master, batch receive, transfers, ledger + corrections, returns."
					title="Pharmacy stock"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Item master
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Name</Label>
									<Input
										onChange={(e) => setItem({ ...item, name: e.target.value })}
										value={item.name}
									/>
								</div>
								<div className="space-y-1">
									<Label>Salt</Label>
									<Input
										onChange={(e) => setItem({ ...item, salt: e.target.value })}
										value={item.salt}
									/>
								</div>
								<div className="space-y-1">
									<Label>Strength</Label>
									<Input
										onChange={(e) =>
											setItem({ ...item, strength: e.target.value })
										}
										value={item.strength}
									/>
								</div>
								<div className="space-y-1">
									<Label>Pack</Label>
									<Input
										onChange={(e) => setItem({ ...item, pack: e.target.value })}
										value={item.pack}
									/>
								</div>
								<div className="space-y-1">
									<Label>Schedule</Label>
									<Input
										onChange={(e) =>
											setItem({ ...item, schedule: e.target.value })
										}
										placeholder="H / H1 / X / OTC"
										value={item.schedule}
									/>
								</div>
								<div className="flex items-end gap-2">
									<label className="flex items-center gap-2 text-sm">
										<input
											checked={item.coldChain}
											onChange={(e) =>
												setItem({ ...item, coldChain: e.target.checked })
											}
											type="checkbox"
										/>{" "}
										Cold chain
									</label>
								</div>
							</div>
							<Button onClick={() => void saveItem()}>Save item</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Batch receive
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Item ID</Label>
									<Input
										onChange={(e) =>
											setBatch({ ...batch, itemId: e.target.value })
										}
										value={batch.itemId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Lot</Label>
									<Input
										onChange={(e) =>
											setBatch({ ...batch, lot: e.target.value })
										}
										value={batch.lot}
									/>
								</div>
								<div className="space-y-1">
									<Label>Expiry (YYYY-MM-DD)</Label>
									<Input
										onChange={(e) =>
											setBatch({ ...batch, expiry: e.target.value })
										}
										value={batch.expiry}
									/>
								</div>
								<div className="space-y-1">
									<Label>Qty</Label>
									<Input
										onChange={(e) =>
											setBatch({ ...batch, qty: e.target.value })
										}
										value={batch.qty}
									/>
								</div>
								<div className="space-y-1">
									<Label>MRP</Label>
									<Input
										onChange={(e) =>
											setBatch({ ...batch, mrp: e.target.value })
										}
										value={batch.mrp}
									/>
								</div>
								<div className="space-y-1">
									<Label>Rate</Label>
									<Input
										onChange={(e) =>
											setBatch({ ...batch, rate: e.target.value })
										}
										value={batch.rate}
									/>
								</div>
							</div>
							<Button onClick={() => void receiveBatch()}>Receive batch</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Morning checklist — expiry &lt;90d ({alerts.length})
							</CardTitle>
							<ul className="max-h-64 divide-y overflow-auto text-sm">
								{alerts.map((a) => (
									<li
										className="flex justify-between gap-2 py-2"
										key={a.batchId}
									>
										<span>
											{a.itemName} · {a.lot} · {a.store}
										</span>
										<span
											className={
												a.expired
													? "font-semibold text-red-600"
													: "text-muted-foreground"
											}
										>
											{a.expired
												? `EXPIRED (${a.expiry})`
												: `${a.daysLeft}d left`}{" "}
											· qty {a.qty}
										</span>
									</li>
								))}
								{alerts.length === 0 ? (
									<li className="py-4 text-muted-foreground">
										No near-expiry batches.
									</li>
								) : null}
							</ul>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Store → ward/daycare transfer
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Item ID</Label>
									<Input
										onChange={(e) =>
											setTransfer({ ...transfer, itemId: e.target.value })
										}
										value={transfer.itemId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Qty</Label>
									<Input
										onChange={(e) =>
											setTransfer({ ...transfer, qty: e.target.value })
										}
										value={transfer.qty}
									/>
								</div>
								<div className="space-y-1">
									<Label>To</Label>
									<Input
										onChange={(e) =>
											setTransfer({ ...transfer, to: e.target.value })
										}
										placeholder="ward / daycare / store"
										value={transfer.to}
									/>
								</div>
								<div className="space-y-1">
									<Label>Transfer ID (for decision)</Label>
									<Input
										onChange={(e) =>
											setTransfer({ ...transfer, transferId: e.target.value })
										}
										value={transfer.transferId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Decided by (staff ID)</Label>
									<Input
										onChange={(e) =>
											setTransfer({ ...transfer, decidedBy: e.target.value })
										}
										value={transfer.decidedBy}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reject reason</Label>
									<Input
										onChange={(e) =>
											setTransfer({ ...transfer, reason: e.target.value })
										}
										value={transfer.reason}
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void moveStock()}>Issue transfer</Button>
								<Button
									onClick={() => void decideTransfer("accept")}
									variant="outline"
								>
									Accept
								</Button>
								<Button
									onClick={() => void decideTransfer("reject")}
									variant="outline"
								>
									Reject with reason
								</Button>
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Return against bill
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Original bill ID</Label>
									<Input
										onChange={(e) => setRet({ ...ret, billId: e.target.value })}
										value={ret.billId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Item ID</Label>
									<Input
										onChange={(e) => setRet({ ...ret, itemId: e.target.value })}
										value={ret.itemId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Qty</Label>
									<Input
										onChange={(e) => setRet({ ...ret, qty: e.target.value })}
										value={ret.qty}
									/>
								</div>
								<div className="space-y-1">
									<Label>Batch ID</Label>
									<Input
										onChange={(e) =>
											setRet({ ...ret, batchId: e.target.value })
										}
										value={ret.batchId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Disposition</Label>
									<Input
										onChange={(e) =>
											setRet({ ...ret, disposition: e.target.value })
										}
										placeholder="restock / quarantine"
										value={ret.disposition}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reason</Label>
									<Input
										onChange={(e) => setRet({ ...ret, reason: e.target.value })}
										value={ret.reason}
									/>
								</div>
							</div>
							<Button onClick={() => void returnBill()}>Record return</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Stock correction note
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Batch ID</Label>
									<Input
										onChange={(e) =>
											setCorrection({ ...correction, batchId: e.target.value })
										}
										value={correction.batchId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Delta qty (+/-)</Label>
									<Input
										onChange={(e) =>
											setCorrection({ ...correction, delta: e.target.value })
										}
										value={correction.delta}
									/>
								</div>
								<div className="space-y-1">
									<Label>Corrected by</Label>
									<Input
										onChange={(e) =>
											setCorrection({ ...correction, by: e.target.value })
										}
										value={correction.by}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reason</Label>
									<Input
										onChange={(e) =>
											setCorrection({ ...correction, reason: e.target.value })
										}
										value={correction.reason}
									/>
								</div>
							</div>
							<Button onClick={() => void correctStock()} variant="outline">
								Record correction
							</Button>
						</CardContent>
					</Card>
				</div>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Stock ledger ({ledger.length})
						</CardTitle>
						<ul className="max-h-96 divide-y overflow-auto text-sm">
							{ledger.map((m) => (
								<li
									className="flex justify-between gap-2 py-2"
									key={`${m.kind}-${m.id}-${m.itemId}`}
								>
									<span>
										{m.at.slice(0, 16)} · {m.kind} {m.ref} · {m.detail}
									</span>
									<span className="text-muted-foreground">
										{m.direction} {m.qty ?? "—"}
									</span>
								</li>
							))}
							{ledger.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									No movements yet.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
