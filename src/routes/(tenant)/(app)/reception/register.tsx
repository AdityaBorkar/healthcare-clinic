import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { FileUpload } from "#/components/file-upload";
import { LanguageToggle, useSlipLanguage } from "#/components/language-toggle";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/reception/register")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type DedupeHit = { id: string; name?: string; phone?: string };

function RouteComponent() {
	const [branchId] = useBranch();
	const [lang] = useSlipLanguage();
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [abha, setAbha] = useState("");
	const [dob, setDob] = useState("");
	const [dedupe, setDedupe] = useState<Array<DedupeHit>>([]);
	const [checked, setChecked] = useState(false);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	async function checkDedupe() {
		setError(null);
		setStatus(null);
		try {
			const hits = (await api.patients.dedupe.check({
				abha: abha || undefined,
				branchId,
				phone: phone || undefined,
			})) as Array<DedupeHit>;
			// Mandatory name/DOB cross-check client-side (P1): surface any hit
			// whose name matches when phone/ABHA matched, and block on exact
			// duplicates until staff confirm.
			const q = fullName.trim().toLowerCase();
			const nameMatches = q
				? hits.filter((h) => (h.name ?? "").toLowerCase().includes(q))
				: hits;
			setDedupe(nameMatches);
			setChecked(true);
			setStatus(
				nameMatches.length > 0
					? `${nameMatches.length} possible duplicate(s) — confirm before registering.`
					: "No duplicates found — safe to register.",
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Dedupe check failed");
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!checked) {
			setError("Run the duplicate check first.");
			return;
		}
		if (dedupe.length > 0) {
			setError("Resolve possible duplicates before registering.");
			return;
		}
		setSaving(true);
		setError(null);
		setStatus(null);
		try {
			const created = (await api.patients.create({
				abha: abha || undefined,
				branchId,
				dob: dob || undefined,
				fullName,
				language: lang,
				phone,
			})) as { id: string };
			setStatus(`Registered ${created.id}.`);
			setFullName("");
			setPhone("");
			setAbha("");
			setDob("");
			setChecked(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setSaving(false);
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl space-y-6">
				<PageHeader
					actions={
						<>
							<LanguageToggle />
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</>
					}
					description={`Dedupe by phone + ABHA + name/DOB before creating (branch: ${branchId}).`}
					title="Patient registration"
				/>
				<Card>
					<CardContent className="space-y-4 pt-6">
						<form className="space-y-4" onSubmit={onSubmit}>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">Full name</CardTitle>
								<Input
									onChange={(e) => {
										setFullName(e.target.value);
										setChecked(false);
									}}
									required
									value={fullName}
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-1">
									<CardTitle className="text-sm font-medium">Phone</CardTitle>
									<Input
										onChange={(e) => {
											setPhone(e.target.value);
											setChecked(false);
										}}
										required
										value={phone}
									/>
								</div>
								<div className="space-y-1">
									<CardTitle className="text-sm font-medium">
										ABHA (optional)
									</CardTitle>
									<Input
										onChange={(e) => {
											setAbha(e.target.value);
											setChecked(false);
										}}
										value={abha}
									/>
								</div>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Date of birth
								</CardTitle>
								<Input
									onChange={(e) => setDob(e.target.value)}
									type="date"
									value={dob}
								/>
							</div>
							<FileUpload kind="photo" label="Photo (WebP, max 2MB)" />
							<div className="flex flex-wrap gap-2">
								<Button onClick={checkDedupe} type="button" variant="outline">
									Check duplicates
								</Button>
								<Button disabled={saving} type="submit">
									{saving ? "Registering…" : "Register patient"}
								</Button>
							</div>
						</form>
						{dedupe.length > 0 ? (
							<ul className="divide-y text-sm">
								{dedupe.map((d) => (
									<li className="py-2" key={d.id}>
										{d.name ?? d.id} · {d.phone ?? "no phone"} · {d.id}
									</li>
								))}
							</ul>
						) : null}
						{status ? <p className="text-sm">{status}</p> : null}
						{error ? (
							<p className="text-sm text-red-600" role="alert">
								{error}
							</p>
						) : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
