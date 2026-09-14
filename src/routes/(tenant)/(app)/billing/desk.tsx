import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/billing/desk")({
	component: RouteComponent,
});

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [tab, setTab] = useState<Awaited<
		ReturnType<typeof orpc.billing.interimTab>
	> | null>(null);
	const [invoiceId, setInvoiceId] = useState("");
	const [amount, setAmount] = useState("");

	async function openTab() {
		setTab(await orpc.billing.interimTab({ branchId: "main", patientId }));
	}

	async function collect() {
		await orpc.billing.collect({
			amount: Number(amount) || 0,
			branchId: "main",
			invoiceId,
			mode: "upi",
		});
		setAmount("");
		await openTab();
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="60-second desk flow: open tab → finalize → collect. Cash desk only."
					title="Billing desk"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							Patient tab
						</CardTitle>
						<div className="flex gap-3">
							<div className="flex-1 space-y-1">
								<Label>Patient ID</Label>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<Button className="self-end" onClick={() => void openTab()}>
								Open tab
							</Button>
						</div>
						{tab ? (
							<div className="text-sm">
								<p className="font-medium">Due: {tab.totalDue}</p>
								<ul className="divide-y">
									{tab.invoices.map((i) => (
										<li className="flex justify-between py-2" key={i.id}>
											<span>
												{i.invoiceNo} · {i.status}
											</span>
											<span>{i.total}</span>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							Collect payment
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1">
								<Label>Invoice ID</Label>
								<Input
									onChange={(e) => setInvoiceId(e.target.value)}
									value={invoiceId}
								/>
							</div>
							<div className="space-y-1">
								<Label>Amount</Label>
								<Input
									onChange={(e) => setAmount(e.target.value)}
									value={amount}
								/>
							</div>
						</div>
						<Button onClick={() => void collect()}>Collect (UPI)</Button>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
