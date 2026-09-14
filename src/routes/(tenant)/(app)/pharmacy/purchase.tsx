import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/pharmacy/purchase")({
	component: RouteComponent,
});

function RouteComponent() {
	const [vendorName, setVendorName] = useState("");
	const [vendorPhone, setVendorPhone] = useState("");
	const [pricelistVendor, setPricelistVendor] = useState("");
	const [pricelistJson, setPricelistJson] = useState("");
	const [poVendor, setPoVendor] = useState("");
	const [poItems, setPoItems] = useState("");
	const [poId, setPoId] = useState("");
	const [grnLines, setGrnLines] = useState("");
	const [damaged, setDamaged] = useState("");
	const [short, setShort] = useState("");
	const [verifier, setVerifier] = useState("");
	const [grnId, setGrnId] = useState("");
	const [piNo, setPiNo] = useState("");
	const [piAmount, setPiAmount] = useState("");
	const [result, setResult] = useState<string | null>(null);

	function fail(error: unknown) {
		setResult(error instanceof Error ? error.message : "Operation failed");
	}

	async function saveVendor() {
		try {
			await orpc.operations.mastersUpsert({
				branchId: "main",
				domain: "pharmacy-vendor",
				key: vendorName,
				value: JSON.stringify({ name: vendorName, phone: vendorPhone }),
			});
			setResult(`Vendor ${vendorName} saved.`);
			setVendorName("");
			setVendorPhone("");
		} catch (error) {
			fail(error);
		}
	}

	async function savePricelist() {
		try {
			await orpc.operations.mastersUpsert({
				branchId: "main",
				domain: "purchase-pricelist",
				key: pricelistVendor,
				value: pricelistJson,
			});
			setResult(`Purchase pricelist for ${pricelistVendor} saved.`);
		} catch (error) {
			fail(error);
		}
	}

	async function createPo() {
		try {
			const items = poItems
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean)
				.map((line) => {
					const [itemId, qty] = line.split(/\s+/);
					return { itemId: itemId ?? "", qty: Number(qty) || 1 };
				});
			const po = (await orpc.pharmacy.poCreate({
				branchId: "main",
				items,
				vendor: poVendor,
			})) as { id: string; poNo: string };
			setPoId(po.id);
			setResult(`PO ${po.poNo} raised.`);
		} catch (error) {
			fail(error);
		}
	}

	async function verifyGrn() {
		try {
			const received = grnLines
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean)
				.map((line) => {
					const [itemId, qty, shortQty, damagedQty] = line.split(/\s+/);
					return {
						damagedQty: Number(damagedQty) || 0,
						itemId: itemId ?? "",
						qty: Number(qty) || 0,
						shortQty: Number(shortQty) || 0,
					};
				});
			const grn = (await orpc.pharmacy.grnVerify({
				branchId: "main",
				damagedQty: Number(damaged) || 0,
				poId,
				received,
				shortQty: Number(short) || 0,
				verifiedBy: verifier,
			})) as { id: string; grnNo: string; toleranceFlags: Array<string> };
			setGrnId(grn.id);
			setResult(
				`GRN ${grn.grnNo} verified.` +
					(grn.toleranceFlags.length > 0
						? ` Tolerance flags (>5% variance): ${grn.toleranceFlags.join(", ")}`
						: " No tolerance flags."),
			);
		} catch (error) {
			fail(error);
		}
	}

	async function bookPi() {
		try {
			await orpc.pharmacy.piBook({
				amount: Number(piAmount) || 0,
				branchId: "main",
				grnId,
				invoiceNo: piNo,
			});
			setResult(`Purchase invoice ${piNo} booked against GRN.`);
		} catch (error) {
			fail(error);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="One traceable chain: vendor → PO → GRN (short/damage) → purchase invoice."
					title="Pharmacy purchase"
				/>
				{result ? (
					<p className="text-sm text-muted-foreground">{result}</p>
				) : null}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Vendor master
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>Vendor name</Label>
									<Input
										onChange={(e) => setVendorName(e.target.value)}
										value={vendorName}
									/>
								</div>
								<div className="space-y-1">
									<Label>Phone</Label>
									<Input
										onChange={(e) => setVendorPhone(e.target.value)}
										value={vendorPhone}
									/>
								</div>
							</div>
							<Button onClick={() => void saveVendor()}>Save vendor</Button>
							<div className="space-y-1">
								<Label>Purchase pricelist (vendor key)</Label>
								<Input
									onChange={(e) => setPricelistVendor(e.target.value)}
									value={pricelistVendor}
								/>
							</div>
							<div className="space-y-1">
								<Label>Rates JSON (itemId → rate, tolerance %)</Label>
								<Input
									onChange={(e) => setPricelistJson(e.target.value)}
									placeholder='{"item-1": 42.5, "tolerancePct": 5}'
									value={pricelistJson}
								/>
							</div>
							<Button onClick={() => void savePricelist()} variant="outline">
								Save pricelist
							</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Purchase order
							</CardTitle>
							<div className="space-y-1">
								<Label>Vendor</Label>
								<Input
									onChange={(e) => setPoVendor(e.target.value)}
									value={poVendor}
								/>
							</div>
							<div className="space-y-1">
								<Label>Lines (itemId qty per line)</Label>
								<Input
									onChange={(e) => setPoItems(e.target.value)}
									placeholder={"item-1 200\nitem-2 50"}
									value={poItems}
								/>
							</div>
							<Button onClick={() => void createPo()}>Raise PO</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								GRN verify{" "}
								{poId ? `(PO ${poId.slice(0, 8)}…)` : "(raise PO first)"}
							</CardTitle>
							<div className="space-y-1">
								<Label>
									Received lines (itemId qty short damaged per line)
								</Label>
								<Input
									onChange={(e) => setGrnLines(e.target.value)}
									placeholder={"item-1 195 5 0"}
									value={grnLines}
								/>
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="space-y-1">
									<Label>Total short</Label>
									<Input
										onChange={(e) => setShort(e.target.value)}
										value={short}
									/>
								</div>
								<div className="space-y-1">
									<Label>Total damaged</Label>
									<Input
										onChange={(e) => setDamaged(e.target.value)}
										value={damaged}
									/>
								</div>
								<div className="space-y-1">
									<Label>Verified by (staff ID)</Label>
									<Input
										onChange={(e) => setVerifier(e.target.value)}
										value={verifier}
									/>
								</div>
							</div>
							<div className="space-y-1">
								<Label>PO ID</Label>
								<Input onChange={(e) => setPoId(e.target.value)} value={poId} />
							</div>
							<Button onClick={() => void verifyGrn()}>Verify GRN</Button>
						</CardContent>
					</Card>
					<Card className="shadow-xs">
						<CardContent className="space-y-4 py-6">
							<CardTitle className="text-base font-semibold">
								Purchase invoice
							</CardTitle>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1">
									<Label>GRN ID</Label>
									<Input
										onChange={(e) => setGrnId(e.target.value)}
										value={grnId}
									/>
								</div>
								<div className="space-y-1">
									<Label>Vendor invoice no</Label>
									<Input
										onChange={(e) => setPiNo(e.target.value)}
										value={piNo}
									/>
								</div>
							</div>
							<div className="space-y-1">
								<Label>Amount</Label>
								<Input
									onChange={(e) => setPiAmount(e.target.value)}
									value={piAmount}
								/>
							</div>
							<Button onClick={() => void bookPi()}>Book invoice</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
