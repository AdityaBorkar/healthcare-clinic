import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/uom")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Uom = {
	category: string;
	code: string;
	conversion_factor: number | null;
	decimal_places: number;
	id: string;
	is_active: boolean;
	is_base_unit: boolean;
	is_default: boolean;
	is_indivisible: boolean;
	is_system: boolean;
	name: string;
	status: string;
	symbol: string | null;
};

const CATEGORIES = [
	"count",
	"session",
	"time",
	"mass",
	"volume",
	"length",
	"area",
	"data",
	"temperature",
	"other",
] as const;

type UomCategory = (typeof CATEGORIES)[number];

/** Governed units of measure: one master every qty field references. */
function RouteComponent() {
	const [rows, setRows] = useState<Array<Uom>>([]);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<UomCategory>("count");
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [symbol, setSymbol] = useState("");
	const [factor, setFactor] = useState("");
	const [precision, setPrecision] = useState("2");
	const [isBase, setIsBase] = useState(false);
	const [isDefault, setIsDefault] = useState(false);
	const [isIndivisible, setIsIndivisible] = useState(false);
	const [reason, setReason] = useState("");
	const [convertFrom, setConvertFrom] = useState("");
	const [convertQty, setConvertQty] = useState("1.5");
	const [convertTo, setConvertTo] = useState("");
	const [convertOut, setConvertOut] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const res = (await api.uom.list({
				...(query.trim() ? { search: query.trim() } : {}),
			})) as Array<Uom>;
			setRows(res);
		} catch (err) {
			setError(err instanceof Error ? err.message : "List failed");
		}
	}, [query]);

	useEffect(() => {
		void load();
	}, [load]);

	async function onSeed() {
		setError(null);
		setNotice(null);
		try {
			const res = (await api.uom.seed({})) as {
				created: number;
				skipped: number;
			};
			setNotice(
				`Seed complete: ${res.created} created, ${res.skipped} already present.`,
			);
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Seed failed");
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		try {
			await api.uom.create({
				category,
				code,
				...(factor ? { conversionFactor: Number(factor) } : {}),
				decimalPlaces: Number(precision || "2"),
				isBaseUnit: isBase,
				isDefault,
				isIndivisible,
				name,
				...(symbol ? { symbol } : {}),
			});
			setCode("");
			setName("");
			setSymbol("");
			setFactor("");
			await load();
			setNotice("Unit created as draft — publish it to make it usable.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Creation failed");
		}
	}

	async function act(id: string, action: "publish" | "retire" | "setDefault") {
		setError(null);
		setNotice(null);
		try {
			if (action === "publish") await api.uom.publish({ id });
			if (action === "retire")
				await api.uom.retire({ id, ...(reason ? { reason } : {}) });
			if (action === "setDefault") await api.uom.setDefault({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Action failed");
		}
	}

	async function onConvert(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setConvertOut(null);
		try {
			const res = (await api.uom.convert({
				fromUomId: convertFrom,
				quantity: Number(convertQty),
				...(convertTo ? { toUomId: convertTo } : {}),
			})) as {
				baseQuantity: number;
				convertedQuantity: number;
				category: string;
			};
			setConvertOut(
				`${convertQty} → ${res.convertedQuantity} (base ${res.baseQuantity}, ${res.category})`,
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Conversion failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={onSeed} variant="outline">
								Seed system units
							</Button>
							<Button
								onClick={() =>
									exportRowsCsv("uom.csv", rows, ["code", "name", "status"])
								}
								variant="outline"
							>
								Export CSV
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description="One governed master for every quantity. Conversions stay inside a category; history is never rewritten."
					title="Units of Measure"
				/>
				<Card>
					<CardContent className="space-y-3 pt-6">
						<Input
							aria-label="Type-ahead search"
							className="max-w-64"
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search name, symbol, code…"
							value={query}
						/>
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-32"
								onChange={(e) => setCode(e.target.value)}
								placeholder="Code"
								required
								value={code}
							/>
							<Input
								className="max-w-48"
								onChange={(e) => setName(e.target.value)}
								placeholder="Name"
								required
								value={name}
							/>
							<Input
								className="max-w-28"
								onChange={(e) => setSymbol(e.target.value)}
								placeholder="Symbol"
								value={symbol}
							/>
							<select
								aria-label="Category"
								className="rounded-md border px-2 py-1 text-sm"
								onChange={(e) => setCategory(e.target.value as UomCategory)}
								value={category}
							>
								{CATEGORIES.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
							<Input
								className="max-w-28"
								min={0}
								onChange={(e) => setFactor(e.target.value)}
								placeholder="Factor"
								type="number"
								value={factor}
							/>
							<Input
								className="max-w-24"
								min={0}
								onChange={(e) => setPrecision(e.target.value)}
								placeholder="Prec"
								type="number"
								value={precision}
							/>
							<label className="flex items-center gap-1 text-xs">
								<input
									checked={isBase}
									onChange={(e) => setIsBase(e.target.checked)}
									type="checkbox"
								/>
								Base
							</label>
							<label className="flex items-center gap-1 text-xs">
								<input
									checked={isDefault}
									onChange={(e) => setIsDefault(e.target.checked)}
									type="checkbox"
								/>
								Default
							</label>
							<label className="flex items-center gap-1 text-xs">
								<input
									checked={isIndivisible}
									onChange={(e) => setIsIndivisible(e.target.checked)}
									type="checkbox"
								/>
								Indivisible
							</label>
							<Button type="submit">Add unit</Button>
						</form>
						<Input
							className="max-w-96"
							onChange={(e) => setReason(e.target.value)}
							placeholder="Retire reason (used when retiring below)"
							value={reason}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						{notice ? <p className="text-sm">{notice}</p> : null}
						<ul className="divide-y text-sm">
							{rows.map((r) => (
								<li
									className="flex flex-wrap items-center justify-between gap-2 py-2"
									key={r.id}
								>
									<span>
										{r.code} · {r.name}
										{r.symbol ? ` (${r.symbol})` : ""} · {r.category} ·{" "}
										{r.status}
										{r.is_base_unit ? " · base" : ""}
										{r.is_default ? " · default" : ""}
										{r.is_system ? " · system" : ""}
										{r.is_indivisible ? " · indivisible" : ""}
										{!r.is_active ? " · hidden" : ""}
									</span>
									<span className="flex gap-2">
										<Button
											onClick={() => act(r.id, "publish")}
											size="sm"
											variant="outline"
										>
											Publish
										</Button>
										<Button
											onClick={() => act(r.id, "setDefault")}
											size="sm"
											variant="outline"
										>
											Set default
										</Button>
										<Button
											onClick={() => act(r.id, "retire")}
											size="sm"
											variant="outline"
										>
											Retire
										</Button>
									</span>
								</li>
							))}
							{rows.length === 0 ? (
								<li className="py-4 text-muted-foreground">
									None yet — seed the system set to begin.
								</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-3 pt-6">
						<p className="text-sm font-medium">
							Conversion tester (same category only)
						</p>
						<form className="flex flex-wrap gap-2" onSubmit={onConvert}>
							<Input
								className="max-w-64"
								onChange={(e) => setConvertFrom(e.target.value)}
								placeholder="From UOM id"
								required
								value={convertFrom}
							/>
							<Input
								className="max-w-28"
								onChange={(e) => setConvertQty(e.target.value)}
								placeholder="Qty"
								required
								type="number"
								value={convertQty}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setConvertTo(e.target.value)}
								placeholder="To UOM id (optional)"
								value={convertTo}
							/>
							<Button type="submit" variant="outline">
								Convert
							</Button>
						</form>
						{convertOut ? <p className="text-sm">{convertOut}</p> : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
