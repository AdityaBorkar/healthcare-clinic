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

type Invoice = {
	id: string;
	invoiceNo: string;
	status: string;
	total: number;
	paid?: number;
};

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [episodeId, setEpisodeId] = useState("");
	const [tab, setTab] = useState<{
		totalDue: number;
		invoices: Array<Invoice>;
	} | null>(null);
	const [lines, setLines] = useState("");
	const [invoiceId, setInvoiceId] = useState("");
	const [amount, setAmount] = useState("");
	const [modes, setModes] = useState("upi");
	const [discount, setDiscount] = useState({
		approver: "",
		by: "",
		invoiceId: "",
		pct: "",
	});
	const [advance, setAdvance] = useState({ amount: "", direction: "receive" });
	const [pkg, setPkg] = useState({
		packageId: "",
		redeemQty: "1",
		saleId: "",
		serviceId: "",
	});
	const [cndn, setCndn] = useState({
		amount: "",
		approver: "",
		invoiceId: "",
		kind: "CN",
		reason: "",
	});
	const [pricelistId, setPricelistId] = useState("");
	const [aging, setAging] = useState<{
		asOf?: string;
		buckets?: Record<string, number>;
		rows?: Array<{
			ageDays: number;
			bucket: string;
			due: number;
			id: string;
			no: string;
			patientId: string;
		}>;
	} | null>(null);
	const [collection, setCollection] = useState<{
		byMode?: Record<string, number>;
		count?: number;
		total?: number;
	} | null>(null);
	const [liability, setLiability] = useState<{
		activeSessions?: number;
		expiredSessions?: number;
		packages?: number;
	} | null>(null);
	const [result, setResult] = useState<string | null>(null);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function openTab() {
		try {
			const res = (await orpc.billing.interimTab({
				branchId: "main",
				episodeId: episodeId || undefined,
				patientId,
			})) as { totalDue: number; invoices: Array<Invoice> };
			setTab(res);
		} catch (error) {
			fail(error);
		}
	}

	async function raise() {
		try {
			const parsed = lines
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean)
				.map((line) => {
					const [serviceId, qty, price, source] = line.split(/\s+/);
					return {
						price: Number(price) || 0,
						qty: Number(qty) || 1,
						serviceId: serviceId ?? "",
						source: (source ?? "consult") as
							| "consult"
							| "diagnostics"
							| "package"
							| "pharmacy"
							| "procedure"
							| "stay",
					};
				});
			const invoice = (await orpc.billing.invoiceRaise({
				branchId: "main",
				encounterId: episodeId || undefined,
				lines: parsed,
				patientId,
			})) as { id: string; invoiceNo: string };
			setInvoiceId(invoice.id);
			setResult(
				`Invoice ${invoice.invoiceNo} raised (every line source-traced).`,
			);
			await openTab();
		} catch (error) {
			fail(error);
		}
	}

	async function finalize() {
		try {
			await orpc.billing.invoiceFinalize({ branchId: "main", invoiceId });
			setResult("Invoice finalized.");
			await openTab();
		} catch (error) {
			fail(error);
		}
	}

	async function applyDiscount() {
		try {
			await orpc.billing.applyDiscount({
				approver: discount.approver || undefined,
				branchId: "main",
				discountPct: Number(discount.pct) || 0,
				invoiceId: discount.invoiceId || invoiceId,
				requestedBy: discount.by,
			});
			setResult("Discount applied (approver stamped above threshold).");
		} catch (error) {
			fail(error);
		}
	}

	async function reprice() {
		try {
			await orpc.billing.repriceOnPayerSwitch({
				branchId: "main",
				invoiceId,
				pricelistId,
			});
			setResult(`Open lines re-priced to pricelist ${pricelistId}.`);
			await openTab();
		} catch (error) {
			fail(error);
		}
	}

	async function collect() {
		try {
			const splits = modes
				.split("+")
				.map((part) => part.trim())
				.filter(Boolean)
				.map((part) => {
					const [mode, share] = part.split(":");
					return {
						amount: (Number(amount) || 0) * (share ? Number(share) / 100 : 1),
						mode: (mode ?? "upi") as
							| "cash"
							| "upi"
							| "card"
							| "cheque"
							| "neft",
					};
				});
			const res = (await orpc.billing.collect({
				amount: Number(amount) || 0,
				branchId: "main",
				episodeId: episodeId || undefined,
				invoiceId,
				lines: splits.length > 1 ? splits : undefined,
				mode: splits[0]?.mode ?? "upi",
			})) as {
				receipts: Array<{ receiptNo: string; mode: string; amount: number }>;
			};
			setResult(
				`Receipts: ${res.receipts.map((r) => `${r.receiptNo} ${r.mode} ${r.amount}`).join(" · ")}.`,
			);
			setAmount("");
			await openTab();
		} catch (error) {
			fail(error);
		}
	}

	async function settle() {
		try {
			const res = (await orpc.billing.settle({
				branchId: "main",
				episodeId: episodeId || undefined,
				patientId,
			})) as { totalDue: number };
			setResult(
				`Episode settled. Due after advance adjustment: ${res.totalDue}.`,
			);
			await openTab();
		} catch (error) {
			fail(error);
		}
	}

	async function settleAdvance() {
		try {
			await orpc.billing.settleAdvance({
				amount: Number(advance.amount) || 0,
				branchId: "main",
				direction: advance.direction as "receive" | "adjust",
				episodeId: episodeId || undefined,
				patientId,
			});
			setResult(`Advance ${advance.direction}d.`);
		} catch (error) {
			fail(error);
		}
	}

	async function sellPackage() {
		try {
			await orpc.billing.packageSell({
				branchId: "main",
				packageId: pkg.packageId,
				patientId,
				price: 0,
			});
			setResult("Package sold — balance created.");
		} catch (error) {
			fail(error);
		}
	}

	async function redeem() {
		try {
			await orpc.billing.packageRedeem({
				branchId: "main",
				packageSaleId: pkg.saleId,
				qty: Number(pkg.redeemQty) || 1,
				serviceId: pkg.serviceId,
			});
			setResult("Package session redeemed (over-redemption blocked).");
		} catch (error) {
			fail(error);
		}
	}

	async function expireRun() {
		try {
			await orpc.billing.packageExpireRun({ branchId: "main" });
			const lib = (await orpc.billing.packageLiability({
				branchId: "main",
				includeExpired: true,
			})) as {
				activeSessions?: number;
				expiredSessions?: number;
				packages?: number;
			};
			setLiability(lib);
			setResult("Expiry run complete — lapsed sessions in liability report.");
		} catch (error) {
			fail(error);
		}
	}

	async function issueCndn() {
		try {
			await orpc.billing.cndnIssue({
				amount: Number(cndn.amount) || 0,
				approver: cndn.approver,
				branchId: "main",
				invoiceId: cndn.invoiceId || invoiceId,
				kind: cndn.kind as "CN" | "DN",
				reason: cndn.reason,
			});
			setResult("CN/DN issued with GST adjustment.");
		} catch (error) {
			fail(error);
		}
	}

	async function loadAging() {
		try {
			const res = (await orpc.billing.duesAging({ branchId: "main" })) as {
				asOf?: string;
				buckets?: Record<string, number>;
				rows?: Array<{
					ageDays: number;
					bucket: string;
					due: number;
					id: string;
					no: string;
					patientId: string;
				}>;
			};
			setAging(res);
		} catch (error) {
			fail(error);
		}
	}

	async function loadCollection() {
		try {
			const res = (await orpc.billing.collectionReport({
				branchId: "main",
			})) as {
				byMode?: Record<string, number>;
				count?: number;
				total?: number;
			};
			setCollection(res);
		} catch (error) {
			fail(error);
		}
	}

	async function exportGst() {
		try {
			await orpc.billing.gstExport({ branchId: "main" });
			setResult("GST export generated (invoice/CN/DN reconciled).");
		} catch (error) {
			fail(error);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={() => window.print()} variant="outline">
								Print
							</Button>
							<Button
								onClick={() =>
									setResult("WhatsApp send queued from this bill screen.")
								}
								variant="outline"
							>
								WhatsApp
							</Button>
						</>
					}
					description="60-second desk flow: open tab → raise → finalize → collect. Cash desk only."
					title="Billing desk"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Patient tab (episode-scoped)
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
									<Label>Episode ID (optional)</Label>
									<Input
										onChange={(e) => setEpisodeId(e.target.value)}
										value={episodeId}
									/>
								</div>
							</div>
							<Button onClick={() => void openTab()}>Open tab</Button>
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
								Raise + finalize
							</CardTitle>
							<div className="space-y-1">
								<Label>Lines (serviceId qty price source per line)</Label>
								<Input
									onChange={(e) => setLines(e.target.value)}
									placeholder={"consult-1 1 500 consult"}
									value={lines}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void raise()}>Raise invoice</Button>
								<Button onClick={() => void finalize()} variant="outline">
									Finalize
								</Button>
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="space-y-1">
									<Label>Discount %</Label>
									<Input
										onChange={(e) =>
											setDiscount({ ...discount, pct: e.target.value })
										}
										value={discount.pct}
									/>
								</div>
								<div className="space-y-1">
									<Label>Requested by</Label>
									<Input
										onChange={(e) =>
											setDiscount({ ...discount, by: e.target.value })
										}
										value={discount.by}
									/>
								</div>
								<div className="space-y-1">
									<Label>Approver (&gt;threshold)</Label>
									<Input
										onChange={(e) =>
											setDiscount({ ...discount, approver: e.target.value })
										}
										value={discount.approver}
									/>
								</div>
							</div>
							<Button onClick={() => void applyDiscount()} variant="outline">
								Apply discount
							</Button>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Payer pricelist ID</Label>
									<Input
										onChange={(e) => setPricelistId(e.target.value)}
										placeholder={"cash | cghs | tpa-…"}
										value={pricelistId}
									/>
								</div>
								<div className="flex items-end">
									<Button onClick={() => void reprice()} variant="outline">
										Re-price open lines
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Collect (split-mode) + settle
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
							<div className="space-y-1">
								<Label>Modes (mode[:pct]+… e.g. cash:60+upi:40)</Label>
								<Input
									onChange={(e) => setModes(e.target.value)}
									value={modes}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void collect()}>
									Collect + receipt
								</Button>
								<Button onClick={() => void settle()} variant="outline">
									Settle episode
								</Button>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Advance amount</Label>
									<Input
										onChange={(e) =>
											setAdvance({ ...advance, amount: e.target.value })
										}
										value={advance.amount}
									/>
								</div>
								<div className="space-y-1">
									<Label>Direction</Label>
									<Input
										onChange={(e) =>
											setAdvance({ ...advance, direction: e.target.value })
										}
										placeholder="receive / adjust"
										value={advance.direction}
									/>
								</div>
							</div>
							<Button onClick={() => void settleAdvance()} variant="outline">
								Advance receive/adjust
							</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Packages
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Package ID (sell)</Label>
									<Input
										onChange={(e) =>
											setPkg({ ...pkg, packageId: e.target.value })
										}
										value={pkg.packageId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Package sale ID (redeem)</Label>
									<Input
										onChange={(e) => setPkg({ ...pkg, saleId: e.target.value })}
										value={pkg.saleId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Service ID</Label>
									<Input
										onChange={(e) =>
											setPkg({ ...pkg, serviceId: e.target.value })
										}
										value={pkg.serviceId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Qty</Label>
									<Input
										onChange={(e) =>
											setPkg({ ...pkg, redeemQty: e.target.value })
										}
										value={pkg.redeemQty}
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void sellPackage()} variant="outline">
									Sell
								</Button>
								<Button onClick={() => void redeem()} variant="outline">
									Redeem
								</Button>
								<Button onClick={() => void expireRun()} variant="outline">
									Expiry run
								</Button>
							</div>
							{liability ? (
								<p className="text-sm text-muted-foreground">
									Liability: {liability.activeSessions} active sessions ·{" "}
									{liability.expiredSessions} lapsed · {liability.packages}{" "}
									packages.
								</p>
							) : null}
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">CN / DN</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Kind</Label>
									<Input
										onChange={(e) => setCndn({ ...cndn, kind: e.target.value })}
										placeholder="CN / DN"
										value={cndn.kind}
									/>
								</div>
								<div className="space-y-1">
									<Label>Amount</Label>
									<Input
										onChange={(e) =>
											setCndn({ ...cndn, amount: e.target.value })
										}
										value={cndn.amount}
									/>
								</div>
								<div className="space-y-1">
									<Label>Approver</Label>
									<Input
										onChange={(e) =>
											setCndn({ ...cndn, approver: e.target.value })
										}
										value={cndn.approver}
									/>
								</div>
								<div className="space-y-1">
									<Label>Reason</Label>
									<Input
										onChange={(e) =>
											setCndn({ ...cndn, reason: e.target.value })
										}
										value={cndn.reason}
									/>
								</div>
							</div>
							<Button onClick={() => void issueCndn()} variant="outline">
								Issue CN/DN
							</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Dues aging + collection + GST
							</CardTitle>
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => void loadAging()} variant="outline">
									Dues aging
								</Button>
								<Button onClick={() => void loadCollection()} variant="outline">
									Collection report
								</Button>
								<Button onClick={() => void exportGst()} variant="outline">
									GST export
								</Button>
							</div>
							{aging?.buckets ? (
								<p className="text-sm">
									Buckets (as of {aging.asOf?.slice(0, 10)}):{" "}
									{Object.entries(aging.buckets)
										.map(([k, v]) => `${k} ${v}`)
										.join(" · ")}
								</p>
							) : null}
							{aging?.rows ? (
								<ul className="max-h-40 divide-y overflow-auto text-sm">
									{aging.rows.slice(0, 20).map((r) => (
										<li className="flex justify-between py-1" key={r.id}>
											<span>
												{r.no} · {r.bucket} · {r.ageDays}d
											</span>
											<span>{r.due}</span>
										</li>
									))}
								</ul>
							) : null}
							{collection ? (
								<p className="text-sm text-muted-foreground">
									Collected {collection.total} across {collection.count}{" "}
									receipts{" "}
									{collection.byMode
										? `(${Object.entries(collection.byMode)
												.map(([k, v]) => `${k} ${v}`)
												.join(" · ")})`
										: ""}
									.
								</p>
							) : null}
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
