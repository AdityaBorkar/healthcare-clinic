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

export const Route = createFileRoute("/(tenant)/(app)/print/prescription")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [patient, setPatient] = useState("");
	const [diagnosis, setDiagnosis] = useState("");
	const [lines, setLines] = useState("");
	const [frequency, setFrequency] = useState("");
	const [doctor, setDoctor] = useState("");
	const [language, setLanguage] = useState("en");
	const [recipient, setRecipient] = useState("");
	const [allergies, setAllergies] = useState<Array<string>>([]);
	const [status, setStatus] = useState<string | null>(null);
	const patientFieldId = useId();
	const doctorId = useId();
	const diagnosisId = useId();
	const linesId = useId();

	function onPrint(e: FormEvent) {
		e.preventDefault();
		window.print();
	}

	async function saveAndPrint(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			if (!diagnosis.trim()) {
				setStatus(
					"Diagnosis is required — prescription is blocked without it.",
				);
				return;
			}
			const items = lines
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean)
				.map((drug) => ({
					days: 0,
					dose: "",
					drug,
					frequency: frequency || undefined,
				}));
			const check = await api.allopathy.checkInteraction({
				acknowledged: [],
				allergies,
				branchId: "main",
				drugs: items.map((i) => i.drug),
				encounterId: encounterId || undefined,
				patientId,
			});
			if (check?.blocked) {
				const count = (check.unacknowledged as Array<unknown>).length;
				setStatus(
					`Allergy/interaction alert: ${count} warning(s) — acknowledge on the OPD screen before prescribing.`,
				);
				return;
			}
			const res = await api.encounters.prescribe({
				encounterId,
				items,
				patientId,
			});
			setStatus(`Prescription saved (${res?.id ?? "ok"}) — ready to print.`);
			window.print();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Prescription failed.");
		}
	}

	async function sendWhatsApp() {
		setStatus(null);
		try {
			const res = await api.records.shareWhatsapp({
				branchId: "main",
				channel: "whatsapp",
				patientId: patientId || undefined,
				recipient,
				recipientConfirm: "yes",
				sharedBy: doctor || "doctor",
			});
			setStatus(`WhatsApp queued (${res?.id ?? "ok"}) in ${language}.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "WhatsApp share failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl space-y-6">
				<PageHeader
					actions={
						<Button onClick={() => window.print()} type="button">
							Print
						</Button>
					}
					description="Shared OPD prescription printout. Psych prescriptions render with masked identifiers."
					title="Prescription Print"
				/>

				{allergies.length > 0 ? (
					<div
						className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm print:hidden"
						role="alert"
					>
						<p className="font-semibold text-destructive">Allergy banner</p>
						<p>{allergies.join(", ")}</p>
					</div>
				) : null}

				<Card className="shadow-xs print:shadow-none">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Prescription builder (RPC-backed)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3 print:hidden" onSubmit={saveAndPrint}>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label htmlFor={patientFieldId}>Patient</Label>
									<Input
										id={patientFieldId}
										onChange={(e) => setPatient(e.target.value)}
										value={patient}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={doctorId}>Doctor</Label>
									<Input
										id={doctorId}
										onChange={(e) => setDoctor(e.target.value)}
										value={doctor}
									/>
								</div>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label>Encounter ID</Label>
									<Input
										onChange={(e) => setEncounterId(e.target.value)}
										value={encounterId}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Patient ID</Label>
									<Input
										onChange={(e) => setPatientId(e.target.value)}
										value={patientId}
									/>
								</div>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor={diagnosisId}>
									Diagnosis (at least one required)
								</Label>
								<Input
									id={diagnosisId}
									onChange={(e) => setDiagnosis(e.target.value)}
									value={diagnosis}
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor={linesId}>Medicine lines (one per line)</Label>
								<Input
									id={linesId}
									onChange={(e) => setLines(e.target.value)}
									value={lines}
								/>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label>Frequency</Label>
									<Input
										onChange={(e) => setFrequency(e.target.value)}
										placeholder="e.g. TDS × 5d"
										value={frequency}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Language (print + WhatsApp)</Label>
									<Select
										onValueChange={(v) => setLanguage(v ?? "en")}
										value={language}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en">English</SelectItem>
											<SelectItem value="hi">Hindi</SelectItem>
											<SelectItem value="mr">Marathi</SelectItem>
											<SelectItem value="ta">Tamil</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="grid gap-1.5">
								<Label>Known allergies (comma separated, for banner)</Label>
								<Input
									onChange={(e) =>
										setAllergies(
											e.target.value
												.split(",")
												.map((a) => a.trim())
												.filter(Boolean),
										)
									}
									value={allergies.join(", ")}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button onClick={onPrint} type="button" variant="outline">
									Print only
								</Button>
								<Button type="submit">Save via RPC + print</Button>
							</div>
							<div className="grid gap-3 border-t pt-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label>WhatsApp recipient</Label>
									<Input
										onChange={(e) => setRecipient(e.target.value)}
										placeholder="phone"
										value={recipient}
									/>
								</div>
								<div className="flex items-end">
									<Button
										onClick={sendWhatsApp}
										type="button"
										variant="outline"
									>
										Send via WhatsApp
									</Button>
								</div>
							</div>
							{status ? (
								<p className="text-sm text-muted-foreground">{status}</p>
							) : null}
						</form>

						<div className="mt-6 space-y-4 border-t pt-6">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="font-semibold">Clinic prescription</p>
									<p className="text-sm text-muted-foreground">
										OPD / daycare / tele only · {language}
									</p>
								</div>
								<div className="text-right text-sm">
									<p>{doctor || "—"}</p>
									<p className="text-muted-foreground">
										{new Date().toLocaleDateString()}
									</p>
								</div>
							</div>
							{allergies.length > 0 ? (
								<p className="text-sm font-medium text-destructive">
									Allergies: {allergies.join(", ")}
								</p>
							) : null}
							<div className="text-sm">
								<p>
									<span className="font-medium">Patient: </span>
									{patient || "—"}
								</p>
								<p>
									<span className="font-medium">Diagnosis: </span>
									{diagnosis || "—"}
								</p>
							</div>
							<div className="text-sm">
								<p className="font-medium">Rx</p>
								{lines ? (
									<ul className="list-disc pl-5">
										{lines.split("\n").map((line) => (
											<li key={line}>
												{line}
												{frequency ? ` — ${frequency}` : ""}
											</li>
										))}
									</ul>
								) : (
									<p className="text-muted-foreground">—</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
