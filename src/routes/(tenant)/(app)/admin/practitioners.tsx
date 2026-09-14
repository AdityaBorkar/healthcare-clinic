import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/practitioners")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Practitioner = {
	id: string;
	name: string;
	specialty: string | null;
	status: string;
};

function RouteComponent() {
	const [rows, setRows] = useState<Array<Practitioner>>([]);
	const [name, setName] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			setRows((await api.practitioners.list({ branchId: "main" })).items);
		} catch (err) {
			setError(err instanceof Error ? err.message : "List failed");
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			await api.practitioners.create({
				branchId: "main",
				name,
				specialty: specialty || undefined,
			});
			setName("");
			setSpecialty("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Creation failed");
		}
	}

	function exportCsv() {
		const blob = new Blob(
			[
				[
					"id,name,specialty,status",
					...rows.map(
						(r) => `${r.id},${r.name},${r.specialty ?? ""},${r.status}`,
					),
				].join("\n"),
			],
			{ type: "text/csv" },
		);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "practitioners.csv";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<>
							<Button onClick={exportCsv} variant="outline">
								Export CSV
							</Button>
							<Button onClick={() => window.print()} variant="outline">
								Print
							</Button>
						</>
					}
					description="Doctors and specialists on the roster."
					title="Practitioners"
				/>
				<Card>
					<CardContent className="pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-56"
								onChange={(e) => setName(e.target.value)}
								placeholder="Full name"
								required
								value={name}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setSpecialty(e.target.value)}
								placeholder="Specialty (optional)"
								value={specialty}
							/>
							<Button type="submit">Add practitioner</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{rows.map((r) => (
								<li className="flex justify-between py-2" key={r.id}>
									<span>
										{r.name} · {r.specialty ?? "general"}
									</span>
									<span className="text-muted-foreground">{r.status}</span>
								</li>
							))}
							{rows.length === 0 ? (
								<li className="py-4 text-muted-foreground">None yet.</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
