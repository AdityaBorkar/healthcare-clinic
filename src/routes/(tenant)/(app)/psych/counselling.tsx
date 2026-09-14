import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
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

export const Route = createFileRoute("/(tenant)/(app)/psych/counselling")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [date, setDate] = useState("");
	const [duration, setDuration] = useState("45");
	const [mode, setMode] = useState("in-person");
	const [consentId, setConsentId] = useState("");
	const [link, setLink] = useState("");
	const [minor, setMinor] = useState("no");
	const [status, setStatus] = useState<string | null>(null);
	const patId = useId();

	async function book(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const payload = {
				branchId: "main",
				consentId: consentId || undefined,
				date,
				durationMins: Number(duration) as 30 | 45 | 60,
				link: link || undefined,
				mode: mode as "in-person" | "tele",
				patientId,
				patientIsMinor: minor === "yes" ? true : undefined,
			};
			const res =
				mode === "tele"
					? await api.psych.tele.book(payload)
					: await api.psych.counselling.book(payload);
			const detail = res as { id?: string; billingSlab?: string };
			setStatus(
				`Session booked (${detail?.id ?? "ok"}). Duration billing slab: ${detail?.billingSlab ?? `${duration}min`}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Booking failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl space-y-6">
				<PageHeader
					description="Duration-slab booking with billing hook. Tele needs recorded consent; minors need signed caregiver consent."
					title="Counselling & tele-psychiatry"
				/>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<form className="grid gap-3" onSubmit={book}>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-1.5">
									<Label htmlFor={patId}>Patient ID</Label>
									<Input
										id={patId}
										onChange={(e) => setPatientId(e.target.value)}
										value={patientId}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Date</Label>
									<Input
										onChange={(e) => setDate(e.target.value)}
										placeholder="2026-09-14"
										value={date}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Duration (mins)</Label>
									<Select
										onValueChange={(v) => setDuration(v ?? "45")}
										value={duration}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["30", "45", "60"].map((d) => (
												<SelectItem key={d} value={d}>
													{d} min
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Mode</Label>
									<Select
										onValueChange={(v) => setMode(v ?? "in-person")}
										value={mode}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="in-person">In person</SelectItem>
											<SelectItem value="tele">Tele</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5">
									<Label>Consent ID (required for tele)</Label>
									<Input
										onChange={(e) => setConsentId(e.target.value)}
										value={consentId}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Tele link (logged)</Label>
									<Input
										onChange={(e) => setLink(e.target.value)}
										value={link}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Minor patient?</Label>
									<Select
										onValueChange={(v) => setMinor(v ?? "no")}
										value={minor}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="no">No</SelectItem>
											<SelectItem value="yes">Yes</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<Button type="submit">Book session</Button>
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
