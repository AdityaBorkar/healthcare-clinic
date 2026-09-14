import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/branches")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Branch = { id: string; name: string; subdomain: string };

function RouteComponent() {
	const [branchId] = useBranch();
	const [branches, setBranches] = useState<Array<Branch>>([]);
	const [name, setName] = useState("");
	const [subdomain, setSubdomain] = useState("");
	const [goLiveBranch, setGoLiveBranch] = useState("");
	const [pricelistName, setPricelistName] = useState("cash");
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			setBranches((await api.admin.branches.list()) as Array<Branch>);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Branch load failed");
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			await api.admin.branches.create({ name, subdomain });
			setName("");
			setSubdomain("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Branch creation failed");
		}
	}

	async function goLive() {
		setError(null);
		try {
			const target = goLiveBranch || branchId;
			await api.operations.presets.seed({
				branchId: target,
				preset: "facilities",
			});
			await api.operations.presets.seed({
				branchId: target,
				preset: "pricelist",
			});
			await api.billing.pricelists.upsert({
				branchId: target,
				name: pricelistName,
				rates: [],
			});
			setStatus(
				`Branch ${target} live: subdomain + facility presets + ${pricelistName} pricelist — no deploy.`,
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Go-live failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button
								onClick={() =>
									exportRowsCsv("branches.csv", branches, [
										"id",
										"name",
										"subdomain",
									])
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
					description="Branch units, each with its own subdomain."
					title="Branches"
				/>
				<Card>
					<CardContent className="pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-56"
								onChange={(e) => setName(e.target.value)}
								placeholder="Branch name"
								required
								value={name}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setSubdomain(e.target.value)}
								placeholder="subdomain"
								required
								value={subdomain}
							/>
							<Button type="submit">Add branch</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							Go live (no deploy)
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							New branch + subdomain + pricelist goes live through UI config
							alone: seed facility presets, seed the base pricelist, attach a
							named rate card. Login stays subdomain-compulsory.
						</p>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1">
								<Label>Branch ID (blank = current)</Label>
								<Input
									onChange={(e) => setGoLiveBranch(e.target.value)}
									value={goLiveBranch}
								/>
							</div>
							<div className="space-y-1">
								<Label>Pricelist name</Label>
								<Input
									onChange={(e) => setPricelistName(e.target.value)}
									value={pricelistName}
								/>
							</div>
						</div>
						<Button onClick={() => void goLive()} variant="outline">
							Seed presets + attach pricelist
						</Button>
						{status ? <p className="text-sm">{status}</p> : null}
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{branches.map((b) => (
								<li className="flex justify-between py-2" key={b.id}>
									<span>{b.name}</span>
									<span className="text-muted-foreground">{b.subdomain}</span>
								</li>
							))}
							{branches.length === 0 ? (
								<li className="py-4 text-muted-foreground">No branches yet.</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
