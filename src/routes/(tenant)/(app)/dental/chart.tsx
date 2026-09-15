import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useId, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Badge } from "#/components/ui/badge";
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

export const Route = createFileRoute("/(tenant)/(app)/dental/chart")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

const UPPER_PERM = [
	"18",
	"17",
	"16",
	"15",
	"14",
	"13",
	"12",
	"11",
	"21",
	"22",
	"23",
	"24",
	"25",
	"26",
	"27",
	"28",
];
const LOWER_PERM = [
	"48",
	"47",
	"46",
	"45",
	"44",
	"43",
	"42",
	"41",
	"31",
	"32",
	"33",
	"34",
	"35",
	"36",
	"37",
	"38",
];
const UPPER_DEC = ["55", "54", "53", "52", "51", "61", "62", "63", "64", "65"];
const LOWER_DEC = ["85", "84", "83", "82", "81", "71", "72", "73", "74", "75"];

type DentalCondition =
	| "healthy"
	| "caries"
	| "fracture"
	| "missing"
	| "filling"
	| "crown"
	| "implant"
	| "root-canal"
	| "perio"
	| "abscess"
	| "other";

const CONDITIONS: Array<DentalCondition> = [
	"healthy",
	"caries",
	"fracture",
	"missing",
	"filling",
	"crown",
	"implant",
	"root-canal",
	"perio",
	"abscess",
	"other",
];

const SURFACES = [
	"mesial",
	"distal",
	"buccal",
	"lingual",
	"occlusal",
	"incisal",
];

type LabJobRow = {
	dueDate: string | null;
	id: string;
	kind: string;
	labName: string;
	overdue?: boolean;
	patientId: string;
	shade: string | null;
	status: string;
	tooth: string | null;
};

function ToothRow({
	marks,
	onToggle,
	teeth,
}: {
	marks: Record<string, string>;
	onToggle: (tooth: string) => void;
	teeth: Array<string>;
}) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{teeth.map((t) => {
				const marked = marks[t];
				return (
					<button
						className={`flex h-10 w-10 flex-col items-center justify-center rounded-md border text-xs font-medium transition-colors ${
							marked
								? "border-primary bg-primary/15 text-primary"
								: "border-border bg-background text-muted-foreground hover:border-primary/50"
						}`}
						key={t}
						onClick={() => onToggle(t)}
						title={marked ?? t}
						type="button"
					>
						{t}
						{marked && marked !== "healthy" ? (
							<span className="text-[9px] leading-none">●</span>
						) : null}
					</button>
				);
			})}
		</div>
	);
}

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [marks, setMarks] = useState<Record<string, string>>({});
	const [surfaces, setSurfaces] = useState<Record<string, string>>({});
	const [activeCondition, setActiveCondition] = useState("caries");
	const [activeSurface, setActiveSurface] = useState("occlusal");
	const [procedure, setProcedure] = useState("");
	const [price, setPrice] = useState("");
	const [consentProc, setConsentProc] = useState("");
	const [planId, setPlanId] = useState("");
	const [quote, setQuote] = useState({
		discount: "",
		gst: "",
		validDays: "30",
	});
	const [quoteResult, setQuoteResult] = useState<string | null>(null);
	const [chair, setChair] = useState({
		bufferMin: "10",
		chairId: "chair-1",
		date: "",
		durationMin: "45",
		slot: "",
	});
	const [lab, setLab] = useState({
		dueDate: "",
		kind: "crown",
		labName: "",
		metal: "",
		qcNote: "",
		shade: "A2",
		status: "Raised",
		tooth: "",
	});
	const [labJobs, setLabJobs] = useState<Array<LabJobRow>>([]);
	const [stageClose, setStageClose] = useState({
		completed: false,
		nextAppointment: "",
		note: "",
		stageIndex: "0",
		to: "Done",
	});
	const [reschedule, setReschedule] = useState({
		newDate: "",
		newSlot: "",
		reason: "",
		stageIndex: "0",
	});
	const [implant, setImplant] = useState({
		healingNote: "",
		milestone: "placement",
		stageIndex: "0",
	});
	const [pkg, setPkg] = useState({ name: "", price: "" });
	const [image, setImage] = useState({
		filePath: "",
		fileType: "IOPA",
		label: "",
	});
	const [status, setStatus] = useState<string | null>(null);
	const encId = useId();
	const patId = useId();
	const procId = useId();
	const priceId = useId();
	const consentProcId = useId();

	function toggleTooth(tooth: string) {
		setMarks((prev) => {
			const next = { ...prev };
			if (next[tooth] === activeCondition) {
				delete next[tooth];
			} else {
				next[tooth] = activeCondition;
			}
			return next;
		});
		setSurfaces((prev) => ({ ...prev, [tooth]: activeSurface }));
	}

	async function saveChart(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const entries = Object.entries(marks).map(([tooth, condition]) => ({
				condition: condition as DentalCondition,
				surface: surfaces[tooth] as
					| "mesial"
					| "distal"
					| "buccal"
					| "lingual"
					| "occlusal"
					| "incisal"
					| undefined,
				tooth,
			}));
			const res = await api.dental.charts({
				branchId: "main",
				encounterId,
				entries,
				patientId,
			});
			setStatus(
				`Chart saved (${res?.id ?? "ok"}) with ${entries.length} teeth (surface-wise).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Chart save failed.");
		}
	}

	async function savePlan(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const stages = Object.entries(marks)
				.filter(([, c]) => c !== "healthy")
				.map(([tooth, c]) => ({
					price: Number(price) || 0,
					procedure: procedure || c,
					stage: "Planned" as const,
					tooth,
				}));
			const res = await api.dental.plans.build({
				branchId: "main",
				encounterId,
				patientId,
				stages,
				status: "Draft",
			});
			if (res?.id) setPlanId(res.id);
			setStatus(`Treatment plan saved (${res?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Plan save failed.");
		}
	}

	async function signConsent() {
		setStatus(null);
		try {
			const res = await api.dental.consents({
				branchId: "main",
				encounterId,
				patientId,
				procedureName: consentProc,
				status: "Signed",
			});
			setStatus(`Consent signed (${res?.id ?? "ok"}). Chair booking unlocked.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Consent failed.");
		}
	}

	async function attachImage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.records.docs.attach({
				branchId: "main",
				encounterId: encounterId || undefined,
				filePath: image.filePath,
				fileType: image.fileType,
				label: image.label || undefined,
				patientId,
				uploadedBy: patientId,
			});
			setStatus(
				`Image attached (${res?.id ?? "ok"}) — opens from tooth record.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Image attach failed.");
		}
	}

	async function makeQuote(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.quotes({
				branchId: "main",
				discountPct: quote.discount ? Number(quote.discount) : undefined,
				gstPct: quote.gst ? Number(quote.gst) : undefined,
				patientId,
				planId,
				validDays: quote.validDays ? Number(quote.validDays) : undefined,
			});
			const r = res as unknown as {
				id?: string;
				total?: number;
				subtotal?: number;
				validTill?: string;
			};
			setQuoteResult(
				`Quote ${r.id ?? ""}: subtotal ${r.subtotal ?? "?"} → total ${r.total ?? "?"} (valid till ${r.validTill ?? "?"}; expired quotes need re-issue before booking).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Quote failed.");
		}
	}

	async function bookChairSlot(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.chairs.book({
				branchId: "main",
				bufferMin: chair.bufferMin ? Number(chair.bufferMin) : undefined,
				chairId: chair.chairId,
				date: chair.date,
				durationMin: chair.durationMin ? Number(chair.durationMin) : undefined,
				encounterId,
				patientId,
				slot: chair.slot,
			});
			setStatus(
				`Chair booked (${res?.id ?? "ok"}). Overrun buffers respected; conflicts blocked.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Chair booking failed.");
		}
	}

	async function raiseLab(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.labJobs.raise({
				branchId: "main",
				dueDate: lab.dueDate || undefined,
				encounterId: encounterId || undefined,
				kind: lab.kind as
					| "crown"
					| "bridge"
					| "denture"
					| "implant"
					| "aligner"
					| "other",
				labName: lab.labName,
				metal: lab.metal || undefined,
				patientId,
				planId: planId || undefined,
				qcNote: lab.qcNote || undefined,
				shade: lab.shade || undefined,
				status: lab.status as
					| "Raised"
					| "InLab"
					| "Trial"
					| "Delivered"
					| "Remake",
				tooth: lab.tooth || undefined,
			});
			setStatus(
				`Lab job raised (${res?.id ?? "ok"}) with vendor + due + spec.`,
			);
			await refreshJobs();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Lab job failed.");
		}
	}

	async function refreshJobs() {
		try {
			const rows = (await api.dental.labJobs.pending({
				branchId: "main",
				patientId: patientId || undefined,
				planId: planId || undefined,
			})) as Array<LabJobRow>;
			setLabJobs(rows);
		} catch {
			setLabJobs([]);
		}
	}

	async function closeStage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.stages.close({
				completed: stageClose.completed || undefined,
				nextAppointment: stageClose.nextAppointment || undefined,
				note: stageClose.note || undefined,
				planId,
				stageIndex: Number(stageClose.stageIndex) || 0,
				to: stageClose.to as "Planned" | "Scheduled" | "InChair" | "Done",
			});
			const r = res as unknown as {
				openStages?: number;
				planClosable?: boolean;
			};
			setStatus(
				`Stage moved. Open stages: ${r.openStages ?? "?"} — ${r.planClosable ? "plan can close." : "open stage blocks plan closure."}`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Stage close failed.");
		}
	}

	async function rescheduleStage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.stages.reschedule({
				newDate: reschedule.newDate,
				newSlot: reschedule.newSlot || undefined,
				planId,
				reason: reschedule.reason || undefined,
				stageIndex: Number(reschedule.stageIndex) || 0,
			});
			setStatus(
				`Stage rescheduled (${res?.id ?? res?.stageId ?? "ok"}) — sequence preserved.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Reschedule failed.");
		}
	}

	async function recordMilestone(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.implants.milestone({
				healingNote: implant.healingNote || undefined,
				milestone: implant.milestone as "placement" | "healing" | "loading",
				planId,
				stageIndex: Number(implant.stageIndex) || 0,
			});
			setStatus(`Implant milestone recorded (${res?.milestone ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Milestone failed.");
		}
	}

	async function sellPackage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.dental.packages.sell({
				branchId: "main",
				name: pkg.name,
				patientId,
				planId,
				price: Number(pkg.price) || 0,
			});
			const r = res as unknown as { stageCount?: number };
			setStatus(
				`Package linked (${res?.id ?? "ok"}) covering ${r.stageCount ?? "?"} stages.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Package sale failed.");
		}
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="FDI charting (permanent + deciduous), treatment plans, consent-gated chair booking, and lab jobs."
					title="Dental Chart"
				/>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">Context</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-3 sm:grid-cols-3">
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
							<Label htmlFor={procId}>Plan ID (quote / stages)</Label>
							<Input
								id={procId}
								onChange={(e) => setPlanId(e.target.value)}
								value={planId}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							FDI touch chart (tooth + surface)
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="grid gap-1.5">
								<Label>Marking condition</Label>
								<Select
									onValueChange={(v) => setActiveCondition(v ?? "caries")}
									value={activeCondition}
								>
									<SelectTrigger className="max-w-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CONDITIONS.map((c) => (
											<SelectItem key={c} value={c}>
												{c}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-1.5">
								<Label>Surface</Label>
								<Select
									onValueChange={(v) => setActiveSurface(v ?? "occlusal")}
									value={activeSurface}
								>
									<SelectTrigger className="max-w-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SURFACES.map((s) => (
											<SelectItem key={s} value={s}>
												{s}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-xs font-medium text-muted-foreground">
								Permanent upper
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={UPPER_PERM}
							/>
							<p className="text-xs font-medium text-muted-foreground">
								Deciduous upper
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={UPPER_DEC}
							/>
							<p className="text-xs font-medium text-muted-foreground">
								Deciduous lower
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={LOWER_DEC}
							/>
							<p className="text-xs font-medium text-muted-foreground">
								Permanent lower
							</p>
							<ToothRow
								marks={marks}
								onToggle={toggleTooth}
								teeth={LOWER_PERM}
							/>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="secondary">
								{Object.keys(marks).length} marked
							</Badge>
							<Button onClick={saveChart} type="button">
								Save chart
							</Button>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Treatment plan from chart
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={savePlan}>
								<div className="grid gap-1.5">
									<Label htmlFor={priceId}>Procedure label</Label>
									<Input
										id={priceId}
										onChange={(e) => setProcedure(e.target.value)}
										placeholder="e.g. Composite restoration"
										value={procedure}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Price per stage</Label>
									<Input
										onChange={(e) => setPrice(e.target.value)}
										value={price}
									/>
								</div>
								<Button type="submit">Build plan (Draft)</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Consent (required before first sitting)
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<div className="grid gap-1.5">
								<Label htmlFor={consentProcId}>Procedure</Label>
								<Input
									id={consentProcId}
									onChange={(e) => setConsentProc(e.target.value)}
									value={consentProc}
								/>
							</div>
							<Button onClick={signConsent} type="button">
								Sign consent
							</Button>
							<p className="text-xs text-muted-foreground">
								Stages cannot move to InChair/Done without signed per-procedure
								consent — enforced server-side.
							</p>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Image attach (IOPA / OPG / CBCT)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={attachImage}>
								<div className="grid gap-1.5">
									<Label>File path</Label>
									<Input
										onChange={(e) =>
											setImage({ ...image, filePath: e.target.value })
										}
										placeholder="storage path / URL"
										value={image.filePath}
									/>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Type</Label>
										<Select
											onValueChange={(v) =>
												setImage({ ...image, fileType: v ?? "IOPA" })
											}
											value={image.fileType}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["IOPA", "OPG", "CBCT"].map((t) => (
													<SelectItem key={t} value={t}>
														{t}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-1.5">
										<Label>Label (tooth)</Label>
										<Input
											onChange={(e) =>
												setImage({ ...image, label: e.target.value })
											}
											placeholder="e.g. 36"
											value={image.label}
										/>
									</div>
								</div>
								<Button type="submit">Attach image</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Quote / estimate (with validity)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={makeQuote}>
								<div className="grid grid-cols-3 gap-3">
									<div className="grid gap-1.5">
										<Label>Discount %</Label>
										<Input
											onChange={(e) =>
												setQuote({ ...quote, discount: e.target.value })
											}
											value={quote.discount}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>GST %</Label>
										<Input
											onChange={(e) =>
												setQuote({ ...quote, gst: e.target.value })
											}
											value={quote.gst}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Valid days</Label>
										<Input
											onChange={(e) =>
												setQuote({ ...quote, validDays: e.target.value })
											}
											value={quote.validDays}
										/>
									</div>
								</div>
								<Button type="submit">Generate quote</Button>
								{quoteResult ? (
									<p className="text-sm text-muted-foreground">{quoteResult}</p>
								) : null}
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Chair slot (duration + buffer)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={bookChairSlot}>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Chair</Label>
										<Input
											onChange={(e) =>
												setChair({ ...chair, chairId: e.target.value })
											}
											value={chair.chairId}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Date</Label>
										<Input
											onChange={(e) =>
												setChair({ ...chair, date: e.target.value })
											}
											placeholder="YYYY-MM-DD"
											value={chair.date}
										/>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-3">
									<div className="grid gap-1.5">
										<Label>Slot</Label>
										<Input
											onChange={(e) =>
												setChair({ ...chair, slot: e.target.value })
											}
											placeholder="10:00-10:45"
											value={chair.slot}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Duration min</Label>
										<Input
											onChange={(e) =>
												setChair({ ...chair, durationMin: e.target.value })
											}
											value={chair.durationMin}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Buffer min</Label>
										<Input
											onChange={(e) =>
												setChair({ ...chair, bufferMin: e.target.value })
											}
											value={chair.bufferMin}
										/>
									</div>
								</div>
								<Button type="submit">Book chair</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Lab job (vendor / due / shade / QC)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={raiseLab}>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Lab</Label>
										<Input
											onChange={(e) =>
												setLab({ ...lab, labName: e.target.value })
											}
											value={lab.labName}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Kind</Label>
										<Select
											onValueChange={(v) =>
												setLab({ ...lab, kind: v ?? "crown" })
											}
											value={lab.kind}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[
													"crown",
													"bridge",
													"denture",
													"implant",
													"aligner",
													"other",
												].map((k) => (
													<SelectItem key={k} value={k}>
														{k}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-3">
									<div className="grid gap-1.5">
										<Label>Tooth</Label>
										<Input
											onChange={(e) =>
												setLab({ ...lab, tooth: e.target.value })
											}
											value={lab.tooth}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Due date</Label>
										<Input
											onChange={(e) =>
												setLab({ ...lab, dueDate: e.target.value })
											}
											placeholder="YYYY-MM-DD"
											value={lab.dueDate}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Shade</Label>
										<Input
											onChange={(e) =>
												setLab({ ...lab, shade: e.target.value })
											}
											value={lab.shade}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Metal</Label>
										<Input
											onChange={(e) =>
												setLab({ ...lab, metal: e.target.value })
											}
											placeholder="e.g. metal-free"
											value={lab.metal}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Status</Label>
										<Select
											onValueChange={(v) =>
												setLab({ ...lab, status: v ?? "Raised" })
											}
											value={lab.status}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[
													"Raised",
													"InLab",
													"Trial",
													"Delivered",
													"Remake",
												].map((s) => (
													<SelectItem key={s} value={s}>
														{s}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>QC note</Label>
									<Input
										onChange={(e) => setLab({ ...lab, qcNote: e.target.value })}
										value={lab.qcNote}
									/>
								</div>
								<div className="flex gap-2">
									<Button type="submit">Raise lab job</Button>
									<Button onClick={refreshJobs} type="button" variant="outline">
										Pending jobs
									</Button>
								</div>
							</form>
							{labJobs.length > 0 ? (
								<ul className="mt-3 grid gap-2 text-sm">
									{labJobs.map((j) => (
										<li className="rounded-md border p-2" key={j.id}>
											{j.kind} · {j.labName} · {j.status}
											{j.tooth ? ` · tooth ${j.tooth}` : ""}
											{j.shade ? ` · shade ${j.shade}` : ""}
											{j.dueDate ? ` · due ${j.dueDate}` : ""}
											{j.overdue ? (
												<Badge className="ml-2" variant="destructive">
													delayed
												</Badge>
											) : null}
										</li>
									))}
								</ul>
							) : null}
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Close stage (note + next action required)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={closeStage}>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Stage index</Label>
										<Input
											onChange={(e) =>
												setStageClose({
													...stageClose,
													stageIndex: e.target.value,
												})
											}
											value={stageClose.stageIndex}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Move to</Label>
										<Select
											onValueChange={(v) =>
												setStageClose({ ...stageClose, to: v ?? "Done" })
											}
											value={stageClose.to}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["Planned", "Scheduled", "InChair", "Done"].map(
													(s) => (
														<SelectItem key={s} value={s}>
															{s}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Clinical note</Label>
									<Input
										onChange={(e) =>
											setStageClose({ ...stageClose, note: e.target.value })
										}
										value={stageClose.note}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Next appointment (or completion flag)</Label>
									<Input
										onChange={(e) =>
											setStageClose({
												...stageClose,
												nextAppointment: e.target.value,
											})
										}
										value={stageClose.nextAppointment}
									/>
								</div>
								<label className="flex items-center gap-2 text-sm">
									<input
										checked={stageClose.completed}
										onChange={(e) =>
											setStageClose({
												...stageClose,
												completed: e.target.checked,
											})
										}
										type="checkbox"
									/>
									Mark completed
								</label>
								<Button type="submit">Close stage</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Reschedule sitting (sequence-aware)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={rescheduleStage}>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Stage index</Label>
										<Input
											onChange={(e) =>
												setReschedule({
													...reschedule,
													stageIndex: e.target.value,
												})
											}
											value={reschedule.stageIndex}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>New date</Label>
										<Input
											onChange={(e) =>
												setReschedule({
													...reschedule,
													newDate: e.target.value,
												})
											}
											placeholder="YYYY-MM-DD"
											value={reschedule.newDate}
										/>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Reason</Label>
									<Input
										onChange={(e) =>
											setReschedule({ ...reschedule, reason: e.target.value })
										}
										value={reschedule.reason}
									/>
								</div>
								<Button type="submit">Reschedule</Button>
								<p className="text-xs text-muted-foreground">
									Ortho review order never reorders — earlier open stages block
									the move.
								</p>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Implant milestones
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={recordMilestone}>
								<div className="grid grid-cols-2 gap-3">
									<div className="grid gap-1.5">
										<Label>Stage index</Label>
										<Input
											onChange={(e) =>
												setImplant({ ...implant, stageIndex: e.target.value })
											}
											value={implant.stageIndex}
										/>
									</div>
									<div className="grid gap-1.5">
										<Label>Milestone</Label>
										<Select
											onValueChange={(v) =>
												setImplant({ ...implant, milestone: v ?? "placement" })
											}
											value={implant.milestone}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["placement", "healing", "loading"].map((m) => (
													<SelectItem key={m} value={m}>
														{m}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-1.5">
									<Label>Healing note</Label>
									<Input
										onChange={(e) =>
											setImplant({ ...implant, healingNote: e.target.value })
										}
										value={implant.healingNote}
									/>
								</div>
								<Button type="submit">Record milestone</Button>
								<p className="text-xs text-muted-foreground">
									Loading is blocked before the healing note exists.
								</p>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Package (e.g. RCT + crown)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={sellPackage}>
								<div className="grid gap-1.5">
									<Label>Package name</Label>
									<Input
										onChange={(e) => setPkg({ ...pkg, name: e.target.value })}
										value={pkg.name}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label>Price</Label>
									<Input
										onChange={(e) => setPkg({ ...pkg, price: e.target.value })}
										value={pkg.price}
									/>
								</div>
								<Button type="submit">Sell package</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				{status ? (
					<p className="text-sm text-muted-foreground">{status}</p>
				) : null}
			</div>
		</main>
	);
}
