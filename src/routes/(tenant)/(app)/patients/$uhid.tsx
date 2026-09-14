import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/patients/$uhid")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Timeline = {
	allergies: Array<{ id: string; name: string; severity: string }>;
	communications: Array<{ channel: string; id: string; message: string }>;
	consents: Array<{ granted: boolean; id: string; type: string }>;
	encounters: Array<{ id: string; specialty: string; status: string }>;
	flags: Array<{ id: string; label: string; level: string }>;
	patient: {
		fullName: string;
		id: string;
		language: string;
		phone: string;
		uhid: string;
	};
	recalls: Array<{ at: string; id: string; reason: string; status: string }>;
};

function RouteComponent() {
	const { uhid } = Route.useParams();
	const [data, setData] = useState<Timeline | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		api.patients
			.timeline({ id: uhid })
			.then((t: unknown) => {
				if (live) setData(t as Timeline);
			})
			.catch((err: unknown) => {
				if (live)
					setError(err instanceof Error ? err.message : "Timeline failed");
			});
		return () => {
			live = false;
		};
	}, [uhid]);

	function exportCsv() {
		if (!data) return;
		const lines = [
			"section,id,detail",
			...data.encounters.map(
				(e) => `encounter,${e.id},${e.specialty}/${e.status}`,
			),
			...data.allergies.map((a) => `allergy,${a.id},${a.name}/${a.severity}`),
			...data.recalls.map((r) => `recall,${r.id},${r.at} ${r.reason}`),
		];
		const blob = new Blob([lines.join("\n")], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `patient-${uhid}.csv`;
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
					description={`Record ${uhid}`}
					title={data ? data.patient.fullName : "Patient"}
				/>
				{error ? <p className="text-sm text-red-600">{error}</p> : null}
				{!data && !error ? (
					<p className="text-sm text-muted-foreground">Loading…</p>
				) : null}
				{data ? (
					<>
						<Card>
							<CardContent className="space-y-1 pt-6 text-sm">
								<p>UHID: {data.patient.uhid}</p>
								<p>Phone: {data.patient.phone}</p>
								<p>Language: {data.patient.language}</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="space-y-3 pt-6 text-sm">
								<CardTitle className="text-base">Encounters</CardTitle>
								<ul className="space-y-1">
									{data.encounters.map((e) => (
										<li key={e.id}>
											{e.id} · {e.specialty} · {e.status}
										</li>
									))}
									{data.encounters.length === 0 ? <li>None yet.</li> : null}
								</ul>
								<CardTitle className="text-base">Flags</CardTitle>
								<ul className="space-y-1">
									{data.flags.map((f) => (
										<li key={f.id}>
											{f.label} ({f.level})
										</li>
									))}
									{data.flags.length === 0 ? <li>None.</li> : null}
								</ul>
								<CardTitle className="text-base">Allergies</CardTitle>
								<ul className="space-y-1">
									{data.allergies.map((a) => (
										<li key={a.id}>
											{a.name} ({a.severity})
										</li>
									))}
									{data.allergies.length === 0 ? <li>None recorded.</li> : null}
								</ul>
								<CardTitle className="text-base">Recalls</CardTitle>
								<ul className="space-y-1">
									{data.recalls.map((r) => (
										<li key={r.id}>
											{r.at} · {r.reason} ({r.status})
										</li>
									))}
									{data.recalls.length === 0 ? <li>None.</li> : null}
								</ul>
							</CardContent>
						</Card>
					</>
				) : null}
			</div>
		</main>
	);
}
