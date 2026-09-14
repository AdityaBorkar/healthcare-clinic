import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/services")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Service = {
	code: string;
	id: string;
	name: string;
	status: string;
};

function RouteComponent() {
	const [rows, setRows] = useState<Array<Service>>([]);
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			setRows((await api.services.list({ branchId: "main" })).items);
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
			await api.services.create({ branchId: "main", code, name });
			setCode("");
			setName("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Creation failed");
		}
	}

	async function publish(id: string) {
		setError(null);
		try {
			await api.services.publish({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Publish failed");
		}
	}

	async function retire(id: string) {
		setError(null);
		try {
			await api.services.retire({ id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Retire failed");
		}
	}

	function exportCsv() {
		const blob = new Blob(
			[
				[
					"code,name,status",
					...rows.map((r) => `${r.code},${r.name},${r.status}`),
				].join("\n"),
			],
			{ type: "text/csv" },
		);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "services.csv";
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
					description="Service catalogue with immutable codes."
					title="Services"
				/>
				<Card>
					<CardContent className="pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-40"
								onChange={(e) => setCode(e.target.value)}
								placeholder="Code"
								required
								value={code}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setName(e.target.value)}
								placeholder="Service name"
								required
								value={name}
							/>
							<Button type="submit">Add service</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{rows.map((r) => (
								<li
									className="flex flex-wrap items-center justify-between gap-2 py-2"
									key={r.id}
								>
									<span>
										{r.code} · {r.name} · {r.status}
									</span>
									<span className="flex gap-2">
										<Button
											onClick={() => publish(r.id)}
											size="sm"
											variant="outline"
										>
											Publish
										</Button>
										<Button
											onClick={() => retire(r.id)}
											size="sm"
											variant="outline"
										>
											Retire
										</Button>
									</span>
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
