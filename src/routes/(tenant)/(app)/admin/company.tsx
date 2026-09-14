import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/company")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [logo, setLogo] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		api.admin
			.getCompany()
			.then((c: unknown) => {
				if (live && c) {
					const company = c as { logo?: string; name?: string; slug?: string };
					setName(company.name ?? "");
					setSlug(company.slug ?? "");
					setLogo(company.logo ?? "");
				}
			})
			.catch(() => undefined);
		return () => {
			live = false;
		};
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.admin.saveCompany({
				logo: logo || undefined,
				name,
				slug: slug || undefined,
			});
			setStatus("Company profile saved.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Save failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl space-y-6">
				<PageHeader
					actions={
						<Button onClick={() => window.print()} variant="outline">
							Print
						</Button>
					}
					description="Workspace-level company profile."
					title="Company"
				/>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<form className="space-y-4" onSubmit={onSubmit}>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">Name</CardTitle>
								<Input
									onChange={(e) => setName(e.target.value)}
									required
									value={name}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">Slug</CardTitle>
								<Input onChange={(e) => setSlug(e.target.value)} value={slug} />
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">Logo URL</CardTitle>
								<Input onChange={(e) => setLogo(e.target.value)} value={logo} />
							</div>
							<Button type="submit">Save company</Button>
						</form>
						{status ? <p className="text-sm">{status}</p> : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
