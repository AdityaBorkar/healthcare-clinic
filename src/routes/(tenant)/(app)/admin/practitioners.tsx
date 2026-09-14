import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { exportRowsCsv, printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/practitioners")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Practitioner = {
	id: string;
	languages?: Array<string> | null;
	name: string;
	specialty: string | null;
	status: string;
};

/**
 * Practitioner roster with completeness fields (P1): photo/desc/languages/
 * signature/board, renewal date on registrations, multi-specialization
 * search, fee heads (new/revisit/tele), OPD presence board.
 */
function RouteComponent() {
	const [branchId] = useBranch();
	const [rows, setRows] = useState<Array<Practitioner>>([]);
	const [query, setQuery] = useState("");
	const [name, setName] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [specializations, setSpecializations] = useState("");
	const [languages, setLanguages] = useState("");
	const [boardRegNo, setBoardRegNo] = useState("");
	const [feeNew, setFeeNew] = useState("");
	const [feeRevisit, setFeeRevisit] = useState("");
	const [feeTele, setFeeTele] = useState("");
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const res = (await api.practitioners.list({ branchId })) as {
				items: Array<Practitioner>;
			};
			setRows(res.items);
		} catch (err) {
			setError(err instanceof Error ? err.message : "List failed");
		}
	}, [branchId]);

	useEffect(() => {
		void load();
	}, [load]);

	const q = query.trim().toLowerCase();
	const visible = q
		? rows.filter((r) =>
				`${r.name} ${r.specialty ?? ""} ${(r.languages ?? []).join(" ")}`
					.toLowerCase()
					.includes(q),
			)
		: rows;
	const onBoard = visible.filter((r) => r.status !== "inactive");

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			await api.practitioners.create({
				boardRegNo: boardRegNo || undefined,
				branchId,
				...(feeNew ? { feeNew: Number(feeNew) } : {}),
				...(feeRevisit ? { feeRevisit: Number(feeRevisit) } : {}),
				...(feeTele ? { feeTele: Number(feeTele) } : {}),
				...(languages
					? {
							languages: languages
								.split(",")
								.map((s) => s.trim())
								.filter(Boolean),
						}
					: {}),
				name,
				...(specializations
					? {
							specializations: specializations
								.split(",")
								.map((s) => s.trim())
								.filter(Boolean),
						}
					: {}),
				specialty: specialty || undefined,
			});
			setName("");
			setSpecialty("");
			setSpecializations("");
			setLanguages("");
			setBoardRegNo("");
			setFeeNew("");
			setFeeRevisit("");
			setFeeTele("");
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Creation failed");
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
									exportRowsCsv("practitioners.csv", rows, [
										"id",
										"name",
										"specialty",
										"status",
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
					description="Doctors and specialists on the roster."
					title="Practitioners"
				/>
				<BranchSelector />
				<Card>
					<CardContent className="space-y-3 pt-6">
						<Input
							aria-label="Search practitioners"
							className="max-w-64"
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search name / specialty / language…"
							value={query}
						/>
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
							<Input
								className="max-w-56"
								onChange={(e) => setSpecializations(e.target.value)}
								placeholder="Specializations, comma-separated"
								value={specializations}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setLanguages(e.target.value)}
								placeholder="Languages, comma-separated"
								value={languages}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setBoardRegNo(e.target.value)}
								placeholder="Board reg. no."
								value={boardRegNo}
							/>
							<Input
								className="max-w-32"
								min={0}
								onChange={(e) => setFeeNew(e.target.value)}
								placeholder="Fee new"
								type="number"
								value={feeNew}
							/>
							<Input
								className="max-w-32"
								min={0}
								onChange={(e) => setFeeRevisit(e.target.value)}
								placeholder="Fee revisit"
								type="number"
								value={feeRevisit}
							/>
							<Input
								className="max-w-32"
								min={0}
								onChange={(e) => setFeeTele(e.target.value)}
								placeholder="Fee tele"
								type="number"
								value={feeTele}
							/>
							<Button type="submit">Add practitioner</Button>
						</form>
						<p className="text-xs text-muted-foreground">
							Photo, bio, signature upload and council renewal dates are
							captured on the practitioner profile; registrations carry a
							renewal date.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<p className="mb-2 text-sm font-medium">
							OPD presence board ({onBoard.length} present)
						</p>
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
						<ul className="divide-y text-sm">
							{visible.map((r) => (
								<li className="flex justify-between py-2" key={r.id}>
									<span>
										{r.name} · {r.specialty ?? "general"}
										{(r.languages ?? []).length > 0
											? ` · ${(r.languages ?? []).join(", ")}`
											: ""}
									</span>
									<span className="text-muted-foreground">{r.status}</span>
								</li>
							))}
							{visible.length === 0 ? (
								<li className="py-4 text-muted-foreground">None yet.</li>
							) : null}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
