import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/pharmacy/dispense")({
	component: RouteComponent,
});

type SaleLine = {
	batchId: string;
	itemId: string;
	qty: string;
	substituteOf: string;
	substituteReason: string;
	uid: string;
};

let lineSeq = 0;
const emptyLine = (): SaleLine => {
	lineSeq += 1;
	return {
		batchId: "",
		itemId: "",
		qty: "1",
		substituteOf: "",
		substituteReason: "",
		uid: `line-${lineSeq}`,
	};
};

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [prescriptionId, setPrescriptionId] = useState("");
	const [fefoReason, setFefoReason] = useState("");
	const [lines, setLines] = useState<Array<SaleLine>>([emptyLine()]);
	const [result, setResult] = useState<string | null>(null);
	const [saleId, setSaleId] = useState<string | null>(null);
	const [lowStock, setLowStock] = useState<
		Array<{ itemId: string; name: string; stock: number }>
	>([]);

	useEffect(() => {
		orpc.pharmacy.reorderSuggest({ branchId: "main" }).then(
			(rows) => setLowStock(rows.suggestions),
			() => setLowStock([]),
		);
	}, []);

	function setLine(index: number, patch: Partial<SaleLine>) {
		setLines((current) =>
			current.map((line, i) => (i === index ? { ...line, ...patch } : line)),
		);
	}

	async function dispense() {
		setResult(null);
		try {
			const sale = (await orpc.pharmacy.saleFromRx({
				branchId: "main",
				fefoOverrideReason: fefoReason || undefined,
				items: lines
					.filter((line) => line.itemId.trim() !== "")
					.map((line) => ({
						batchId: line.batchId || undefined,
						itemId: line.itemId.trim(),
						qty: Number(line.qty) || 1,
						substituteOf: line.substituteOf || undefined,
						substituteReason: line.substituteReason || undefined,
					})),
				mode: "cash",
				patientId,
				prescriptionId: prescriptionId || undefined,
			})) as { saleNo: string; id: string };
			setSaleId(sale.id);
			setResult(`Sale ${sale.saleNo} posted with batch trace.`);
			setLines([emptyLine()]);
		} catch (error) {
			setResult(error instanceof Error ? error.message : "Dispense failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Keyboard-first counter sale: Tab through patient → item → qty → Enter."
					title="Pharmacy dispense"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							Dispense (FEFO default; H1 needs Rx)
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Patient ID (1)</Label>
								<Input
									autoFocus
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Prescription ID (H1 required)</Label>
								<Input
									onChange={(e) => setPrescriptionId(e.target.value)}
									value={prescriptionId}
								/>
							</div>
							<div className="space-y-1">
								<Label>FEFO override reason</Label>
								<Input
									onChange={(e) => setFefoReason(e.target.value)}
									placeholder="Only when picking non-FEFO batch"
									value={fefoReason}
								/>
							</div>
						</div>
						{lines.map((line, i) => (
							<div
								className="grid gap-3 rounded-md border p-3 sm:grid-cols-5"
								key={line.uid}
							>
								<div className="space-y-1">
									<Label>Item ID</Label>
									<Input
										onChange={(e) => setLine(i, { itemId: e.target.value })}
										value={line.itemId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Qty</Label>
									<Input
										onChange={(e) => setLine(i, { qty: e.target.value })}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												void dispense();
											}
										}}
										value={line.qty}
									/>
								</div>
								<div className="space-y-1">
									<Label>Batch (blank = FEFO)</Label>
									<Input
										onChange={(e) => setLine(i, { batchId: e.target.value })}
										value={line.batchId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Substitute of (item ID)</Label>
									<Input
										onChange={(e) =>
											setLine(i, { substituteOf: e.target.value })
										}
										placeholder="Original OOS item"
										value={line.substituteOf}
									/>
								</div>
								<div className="space-y-1">
									<Label>Substitute reason</Label>
									<Input
										onChange={(e) =>
											setLine(i, { substituteReason: e.target.value })
										}
										placeholder="Same salt+strength swap"
										value={line.substituteReason}
									/>
								</div>
							</div>
						))}
						<div className="flex flex-wrap gap-2">
							<Button
								onClick={() => setLines((current) => [...current, emptyLine()])}
								variant="outline"
							>
								Add line
							</Button>
							<Button onClick={() => void dispense()}>Dispense (Enter)</Button>
							{saleId ? (
								<>
									<Button
										onClick={() => window.print()}
										type="button"
										variant="outline"
									>
										Print invoice
									</Button>
									<Button
										onClick={() =>
											orpc.pharmacy
												.getSale({ branchId: "main", id: saleId })
												.then(() =>
													setResult("Sale fetched for WhatsApp send."),
												)
												.catch((error: unknown) =>
													setResult(
														error instanceof Error
															? error.message
															: "Lookup failed",
													),
												)
										}
										type="button"
										variant="outline"
									>
										WhatsApp receipt
									</Button>
								</>
							) : null}
						</div>
						{result ? (
							<p className="text-sm text-muted-foreground">{result}</p>
						) : null}
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Reorder suggestions ({lowStock.length})
						</CardTitle>
						<ul className="divide-y text-sm">
							{lowStock.map((r) => (
								<li className="flex justify-between py-2" key={r.itemId}>
									<span>{r.name}</span>
									<span className="text-muted-foreground">stock {r.stock}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
