import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/settings/roles")({
	component: RolesPage,
});

const api: typeof orpc = orpc;

type Role = { id: string; name: string; permissions?: Array<string> };

function RolesPage() {
	const [branchId] = useBranch();
	const [roles, setRoles] = useState<Array<Role>>([]);
	const [name, setName] = useState("");
	const [permissions, setPermissions] = useState("");
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			setRoles((await api.admin.roles.list({ branchId })) as Array<Role>);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Role load failed");
		}
	}, [branchId]);

	useEffect(() => {
		void load();
	}, [load]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			await api.admin.roles.create({
				branchId,
				name,
				permissions: permissions
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			});
			setName("");
			setPermissions("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Role creation failed");
		}
	}

	async function remove(id: string) {
		setError(null);
		try {
			await api.admin.roles.remove({ branchId, id });
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Role deletion failed");
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
									exportRowsCsv("roles.csv", roles, ["id", "name"])
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
					description={`Role → view mapping for branch ${branchId}. ERP sees all; Doctor/Nursing/Reception views are filtered in the sidebar.`}
					title="Roles"
				/>
				<Card>
					<CardContent className="pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-56"
								onChange={(e) => setName(e.target.value)}
								placeholder="Role name"
								required
								value={name}
							/>
							<Input
								className="max-w-64"
								onChange={(e) => setPermissions(e.target.value)}
								placeholder="Permissions, comma-separated"
								value={permissions}
							/>
							<Button type="submit">Add role</Button>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{roles.map((r) => (
								<li
									className="flex flex-wrap items-center justify-between gap-2 py-2"
									key={r.id}
								>
									<span>
										{r.name}
										{(r.permissions ?? []).length > 0
											? ` · ${(r.permissions ?? []).join(", ")}`
											: ""}
									</span>
									<Button
										onClick={() => remove(r.id)}
										size="sm"
										variant="outline"
									>
										Delete
									</Button>
								</li>
							))}
							{roles.length === 0 ? (
								<li className="py-4 text-muted-foreground">No roles yet.</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
