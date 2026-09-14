import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/ayush/case")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [pathy, setPathy] = useState("ayurveda");
	const [prakriti, setPrakriti] = useState("vata-pitta");
	const [nadi, setNadi] = useState("");
	const [dosha, setDosha] = useState("");
	const [complaints, setComplaints] = useState("");
	const [caseId, setCaseId] = useState("");
	const [namaste, setNamaste] = useState("");
	const [tm2, setTm2] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const encId = useId();
	const patId = useId();
	const nadiId = useId();
	const doshaId = useId();
	const complaintsId = useId();
	const caseSheetId = useId();
	const namId = useId();
	const tm2Id = useId();

	async function saveCase(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.saveCaseSheet({
				branchId: "main",
				complaints,
				dosha,
				encounterId,
				nadi,
				pathy: pathy as "ayurveda" | "yoga" | "unani" | "siddha" | "homeopathy",
				patientId,
				prakriti: prakriti as
					| "vata"
					| "pitta"
					| "kapha"
					| "vata-pitta"
					| "pitta-kapha"
					| "vata-kapha"
					| "tridoshic",
			});
			if (res?.id) setCaseId(res.id);
			setStatus(`Case sheet saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Case sheet failed.");
		}
	}

	async function saveDualCode(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.dualCode({
				branchId: "main",
				caseId,
				encounterId,
				namasteCode: namaste,
				patientId,
				tm2Code: tm2,
			});
			setStatus(`Dual diagnosis coded (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Dual coding failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="AYUSH case sheets with prakriti / nadi / dosha, mandatory NAMASTE + TM2 dual coding, and therapy packages."
					title="AYUSH Case"
				/>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Case sheet
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3" onSubmit={saveCase}>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label htmlFor={encId}>Encounter ID</Label>
									<Input
										id={encId}
										onChange={(e) => setEncounterId(e.target.value)}
										value={encounterId}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={patId}>Patient ID</Label>
									<Input
										id={patId}
										onChange={(e) => setPatientId(e.target.value)}
										value={patientId}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Pathy</Label>
									<Select
										onValueChange={(v) => setPathy(v ?? "ayurveda")}
										value={pathy}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[
												"ayurveda",
												"yoga",
												"unani",
												"siddha",
												"homeopathy",
											].map((p) => (
												<SelectItem key={p} value={p}>
													{p}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Prakriti</Label>
									<Select
										onValueChange={(v) => setPrakriti(v ?? "vata-pitta")}
										value={prakriti}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{[
												"vata",
												"pitta",
												"kapha",
												"vata-pitta",
												"pitta-kapha",
												"vata-kapha",
												"tridoshic",
											].map((p) => (
												<SelectItem key={p} value={p}>
													{p}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={nadiId}>Nadi</Label>
									<Input
										id={nadiId}
										onChange={(e) => setNadi(e.target.value)}
										value={nadi}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={doshaId}>Dosha</Label>
									<Input
										id={doshaId}
										onChange={(e) => setDosha(e.target.value)}
										value={dosha}
									/>
								</div>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor={complaintsId}>Complaints</Label>
								<Input
									id={complaintsId}
									onChange={(e) => setComplaints(e.target.value)}
									value={complaints}
								/>
							</div>
							<Button type="submit">Save case sheet</Button>
						</form>
					</CardContent>
				</Card>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Dual diagnosis (NAMASTE + TM2, both mandatory)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3" onSubmit={saveDualCode}>
							<div className="grid gap-1.5">
								<Label htmlFor={caseSheetId}>Case sheet ID</Label>
								<Input
									id={caseSheetId}
									onChange={(e) => setCaseId(e.target.value)}
									value={caseId}
								/>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label htmlFor={namId}>NAMASTE code</Label>
									<Input
										id={namId}
										onChange={(e) => setNamaste(e.target.value)}
										value={namaste}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={tm2Id}>TM2 code</Label>
									<Input
										id={tm2Id}
										onChange={(e) => setTm2(e.target.value)}
										value={tm2}
									/>
								</div>
							</div>
							<Button type="submit">Save dual diagnosis</Button>
						</form>
					</CardContent>
				</Card>

				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
			</div>
		</main>
	);
}
