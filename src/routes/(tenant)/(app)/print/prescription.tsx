import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export const Route = createFileRoute("/(tenant)/(app)/print/prescription")({
	component: RouteComponent,
});

function RouteComponent() {
	const [patient, setPatient] = useState("");
	const [diagnosis, setDiagnosis] = useState("");
	const [lines, setLines] = useState("");
	const [doctor, setDoctor] = useState("");
	const patientId = useId();
	const doctorId = useId();
	const diagnosisId = useId();
	const linesId = useId();

	function onPrint(e: FormEvent) {
		e.preventDefault();
		window.print();
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

				<Card className="shadow-xs print:shadow-none">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Prescription builder
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3 print:hidden" onSubmit={onPrint}>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label htmlFor={patientId}>Patient</Label>
									<Input
										id={patientId}
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
							<Button type="submit">Print prescription</Button>
						</form>

						<div className="mt-6 space-y-4 border-t pt-6">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="font-semibold">Clinic prescription</p>
									<p className="text-sm text-muted-foreground">
										OPD / daycare / tele only
									</p>
								</div>
								<div className="text-right text-sm">
									<p>{doctor || "—"}</p>
									<p className="text-muted-foreground">
										{new Date().toLocaleDateString()}
									</p>
								</div>
							</div>
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
											<li key={line}>{line}</li>
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
