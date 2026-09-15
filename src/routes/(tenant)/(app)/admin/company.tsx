import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useBranch } from "#/lib/branch-store";
import { printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/company")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [branchId] = useBranch();
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [logo, setLogo] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [versions, setVersions] = useState<
		Awaited<ReturnType<typeof api.admin.masters.versions.list>>
	>([]);
	const [domain, setDomain] = useState("");
	const [version, setVersion] = useState("");
	const [payload, setPayload] = useState("");

	useEffect(() => {
		let live = true;
		api.admin.company
			.get()
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
			await api.admin.company.update({
				logo: logo || undefined,
				name,
				slug: slug || undefined,
			});
			setStatus("Company profile saved.");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Save failed");
		}
	}

	const loadVersions = useCallback(async () => {
		const res = await api.admin.masters.versions.list({}).catch(() => []);
		setVersions(res);
	}, []);

	useEffect(() => {
		void loadVersions();
	}, [loadVersions]);

	async function saveVersion() {
		setStatus(null);
		try {
			await api.admin.masters.versions.save({
				branchId,
				domain,
				payload: payload || undefined,
				version,
			});
			setStatus(
				`Master ${domain}@${version} saved — effective forward only, history kept.`,
			);
			setDomain("");
			setVersion("");
			setPayload("");
			await loadVersions();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Version save failed");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl space-y-6">
				<PageHeader
					actions={
						<Button onClick={printPage} variant="outline">
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
				<Card>
					<CardContent className="space-y-4 pt-6">
						<CardTitle className="text-base font-semibold">
							Masters versioning ({versions.length})
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Price/master edits are effective-date forward only — historical
							invoices never rewrite.
						</p>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Domain</Label>
								<Input
									onChange={(e) => setDomain(e.target.value)}
									value={domain}
								/>
							</div>
							<div className="space-y-1">
								<Label>Version</Label>
								<Input
									onChange={(e) => setVersion(e.target.value)}
									value={version}
								/>
							</div>
							<div className="space-y-1">
								<Label>Payload (JSON)</Label>
								<Input
									onChange={(e) => setPayload(e.target.value)}
									value={payload}
								/>
							</div>
						</div>
						<Button onClick={() => void saveVersion()} variant="outline">
							Save version
						</Button>
						<ul className="divide-y text-sm">
							{versions.map((v, i) => (
								<li className="py-2" key={String(v.id ?? i)}>
									{String(v.domain ?? "—")} @ {String(v.version ?? "—")}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
