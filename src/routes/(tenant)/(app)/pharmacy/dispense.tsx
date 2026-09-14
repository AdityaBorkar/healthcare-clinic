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

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [itemId, setItemId] = useState("");
	const [qty, setQty] = useState("1");
	const [result, setResult] = useState<string | null>(null);
	const [lowStock, setLowStock] = useState<
		Awaited<ReturnType<typeof orpc.pharmacy.reorderSuggest>>["suggestions"]
	>([]);

	useEffect(() => {
		orpc.pharmacy.reorderSuggest({ branchId: "main" }).then(
			(rows) => setLowStock(rows.suggestions),
			() => setLowStock([]),
		);
	}, []);

	async function dispense() {
		const sale = await orpc.pharmacy.saleFromRx({
			branchId: "main",
			items: [{ itemId, qty: Number(qty) || 1 }],
			mode: "cash",
			patientId,
		});
		setResult(`Sale ${sale.saleNo} posted.`);
		setItemId("");
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
								<Label>Item ID (2)</Label>
								<Input
									onChange={(e) => setItemId(e.target.value)}
									value={itemId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Qty (3)</Label>
								<Input
									onChange={(e) => setQty(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											void dispense();
										}
									}}
									value={qty}
								/>
							</div>
						</div>
						<Button onClick={() => void dispense()}>Dispense (Enter)</Button>
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
