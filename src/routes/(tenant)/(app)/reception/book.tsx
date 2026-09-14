import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { LanguageToggle } from "#/components/language-toggle";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/reception/book")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type VideoResult = {
	consentRequired?: boolean;
	expiresAt?: string;
	link?: string;
	url?: string;
};

/**
 * One-action booking (P1): 6 elements, book in <3 clicks after IDs typed.
 * Video round-trip: expiring link display + consent gate before joining.
 */
function RouteComponent() {
	const [branchId] = useBranch();
	const [patientId, setPatientId] = useState("");
	const [practitionerId, setPractitionerId] = useState("");
	const [slotStart, setSlotStart] = useState("");
	const [note, setNote] = useState("");
	const [tele, setTele] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [video, setVideo] = useState<VideoResult | null>(null);
	const [consent, setConsent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setResult(null);
		setVideo(null);
		setError(null);
		try {
			if (tele) {
				const booked = (await api.appointments.video.create({
					branchId,
					note: note || undefined,
					patientId,
					practitionerId,
					slotStart,
				})) as VideoResult & { id?: string; slotStart?: string };
				setVideo(booked);
				setResult(
					`Video booked${booked.id ? ` ${booked.id}` : ""}${booked.slotStart ? ` for ${booked.slotStart}` : ""}`,
				);
			} else {
				const booked = (await api.appointments.create({
					branchId,
					note: note || undefined,
					patientId,
					practitionerId,
					slotStart,
				})) as { id: string; slotStart: string };
				setResult(`Booked ${booked.id} for ${booked.slotStart}`);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Booking failed");
		} finally {
			setSaving(false);
		}
	}

	const videoLink = video?.link ?? video?.url;

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
					description="Book a patient against a practitioner slot."
					title="Reception booking"
				/>
				<BranchSelector />
				<Card>
					<CardContent className="space-y-4 pt-6">
						<form className="space-y-4" onSubmit={onSubmit}>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Patient ID
								</CardTitle>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									placeholder="pat_…"
									required
									value={patientId}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Practitioner ID
								</CardTitle>
								<Input
									onChange={(e) => setPractitionerId(e.target.value)}
									placeholder="doc_…"
									required
									value={practitionerId}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">
									Slot start
								</CardTitle>
								<Input
									onChange={(e) => setSlotStart(e.target.value)}
									required
									type="datetime-local"
									value={slotStart}
								/>
							</div>
							<div className="space-y-1">
								<CardTitle className="text-sm font-medium">Note</CardTitle>
								<Input
									onChange={(e) => setNote(e.target.value)}
									placeholder="Optional note"
									value={note}
								/>
							</div>
							<label className="flex items-center gap-2 text-sm">
								<input
									checked={tele}
									onChange={(e) => setTele(e.target.checked)}
									type="checkbox"
								/>
								Video visit (expiring link + consent gate)
							</label>
							<Button disabled={saving} type="submit">
								{saving ? "Booking…" : "Book appointment"}
							</Button>
						</form>
						{result ? <p className="text-sm text-green-700">{result}</p> : null}
						{videoLink ? (
							<div className="space-y-2 rounded border p-3 text-sm">
								<p>
									Join link (expires{" "}
									{video?.expiresAt ?? "at the scheduled time"}):
								</p>
								<label className="flex items-center gap-2">
									<input
										checked={consent}
										onChange={(e) => setConsent(e.target.checked)}
										type="checkbox"
									/>
									Patient consented to video consult
								</label>
								<a
									className={
										consent
											? "text-primary underline"
											: "pointer-events-none text-muted-foreground"
									}
									href={videoLink}
									rel="noreferrer"
									target="_blank"
								>
									{consent ? videoLink : "Consent required to reveal link"}
								</a>
							</div>
						) : null}
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
