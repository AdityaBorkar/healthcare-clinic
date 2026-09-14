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
const inputCls = "grid gap-1.5";
const rowCls = "grid gap-3 sm:grid-cols-2";

type PlanLine = { arm: "shodhana" | "shamana"; detail: string };
type GridRow = {
	at: string | null;
	improvement: string;
	notes: string;
	visitNo: number;
};

function RouteComponent() {
	const [encounterId, setEncounterId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [pathy, setPathy] = useState("ayurveda");
	const [prakriti, setPrakriti] = useState("vata-pitta");
	const [nadi, setNadi] = useState("");
	const [dosha, setDosha] = useState("");
	const [complaints, setComplaints] = useState("");
	const [agni, setAgni] = useState("");
	const [mala, setMala] = useState("");
	const [koshtha, setKoshtha] = useState("madhya");
	const [planLines, setPlanLines] = useState<Array<PlanLine>>([
		{ arm: "shamana", detail: "" },
	]);
	const [caseId, setCaseId] = useState("");
	const [namaste, setNamaste] = useState("");
	const [tm2, setTm2] = useState("");
	const [nadiBooking, setNadiBooking] = useState({
		date: "",
		facilityId: "nadi-room",
		findings: "",
		serviceId: "nadi-exam",
		slot: "",
	});
	const [repert, setRepert] = useState({
		dose: "",
		miasm: "psora",
		potency: "",
		remedy: "",
		rubrics: "",
	});
	const [grid, setGrid] = useState({
		improvement: "better",
		notes: "",
		visitNo: "1",
	});
	const [gridRows, setGridRows] = useState<Array<GridRow>>([]);
	const [therapyPkg, setTherapyPkg] = useState({
		name: "abhyanga",
		packageId: "",
		procedures: "",
		totalSittings: "10",
		validDays: "30",
	});
	const [pkgInfo, setPkgInfo] = useState<string | null>(null);
	const [pause, setPause] = useState({
		action: "pause",
		extendDays: "",
		outcomeNote: "",
		reason: "",
	});
	const [sitting, setSitting] = useState({
		consumables: "",
		date: "",
		equipmentId: "",
		notes: "",
		roomId: "",
		status: "Booked",
		therapistId: "",
	});
	const [diet, setDiet] = useState({
		chart: "",
		language: "en",
		pathyVariant: "ayurveda",
		validFrom: "",
		validTo: "",
	});
	const [yoga, setYoga] = useState({
		batchId: "",
		capacity: "20",
		date: "",
		name: "",
		schedule: "",
	});
	const [ayushRx, setAyushRx] = useState({ anupana: "", items: "" });
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
			const res = await api.ayush.caseSheets.save({
				agni: agni || undefined,
				branchId: "main",
				complaints,
				dosha,
				encounterId,
				koshtha: koshtha as "mrudu" | "madhya" | "krura",
				mala: mala || undefined,
				nadi,
				pathy: pathy as "ayurveda" | "yoga" | "unani" | "siddha" | "homeopathy",
				patientId,
				planLines: planLines.filter((l) => l.detail.trim().length > 0),
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
			setStatus(
				`Case sheet saved (${res?.id ?? "ok"}) with shodhana/shamana arms.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Case sheet failed.");
		}
	}

	async function saveDualCode(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.diagnoses.dualCode({
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

	async function bookNadiSlot(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.nadi.book({
				branchId: "main",
				caseId: caseId || undefined,
				date: nadiBooking.date,
				encounterId: encounterId || undefined,
				facilityId: nadiBooking.facilityId,
				findings: nadiBooking.findings || undefined,
				patientId,
				serviceId: nadiBooking.serviceId,
				slot: nadiBooking.slot,
			});
			setStatus(
				`Nadi slot booked (${res?.serviceId ?? "service"} → ${res?.facilityId ?? "facility"}); findings land on the case sheet.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Nadi booking failed.");
		}
	}

	async function saveRepert(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.repertory.query({
				branchId: "main",
				caseId,
				dose: repert.dose || undefined,
				miasm: repert.miasm as
					| "psora"
					| "sycosis"
					| "syphilis"
					| "tubercular"
					| "mixed",
				patientId,
				potency: repert.potency,
				remedy: repert.remedy,
				rubrics: repert.rubrics
					.split(",")
					.map((r) => r.trim())
					.filter(Boolean),
			});
			setStatus(
				`Repertorization saved (${res?.id ?? "ok"}) — remedy traceable to rubrics.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Repertorization failed.");
		}
	}

	async function saveGrid(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.followUps.save({
				branchId: "main",
				caseId,
				improvement: grid.improvement as
					| "worse"
					| "same"
					| "better"
					| "resolved",
				notes: grid.notes,
				patientId,
				visitNo: Number(grid.visitNo) || 1,
			});
			setStatus(`Follow-up grid row saved (visit ${res?.visitNo ?? "?"}).`);
			await refreshGrid();
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Grid save failed.");
		}
	}

	async function refreshGrid() {
		try {
			const rows = (await api.ayush.followUps.list({
				branchId: "main",
				caseId,
			})) as Array<GridRow>;
			setGridRows(rows ?? []);
		} catch {
			setGridRows([]);
		}
	}

	async function sellPackage(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.packages.sell({
				branchId: "main",
				caseId: caseId || undefined,
				name: therapyPkg.name as
					| "panchakarma"
					| "abhyanga"
					| "shirodhara"
					| "nasya"
					| "basti"
					| "other",
				patientId,
				procedures: therapyPkg.procedures
					.split(",")
					.map((p) => p.trim())
					.filter(Boolean),
				status: "Active",
				totalSittings: Number(therapyPkg.totalSittings) || 1,
				validDays: therapyPkg.validDays
					? Number(therapyPkg.validDays)
					: undefined,
			});
			const r = res as unknown as {
				id?: string;
				attended?: number;
				remaining?: number;
				validTill?: string | null;
			};
			if (r?.id) setTherapyPkg({ ...therapyPkg, packageId: r.id });
			setPkgInfo(
				`Package ${r?.id ?? ""}: attended ${r?.attended ?? 0}, remaining ${r?.remaining ?? "?"}, expiry ${r?.validTill ?? "?"} — expired packages block new sittings.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Package sale failed.");
		}
	}

	async function pauseExtend(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.packages.pauseExtend({
				action: pause.action as "pause" | "resume" | "extend" | "complete",
				extendDays: pause.extendDays ? Number(pause.extendDays) : undefined,
				outcomeNote: pause.outcomeNote || undefined,
				packageId: therapyPkg.packageId,
				reason: pause.reason || undefined,
			});
			setStatus(`Package ${pause.action}d (${res?.status ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Package update failed.");
		}
	}

	async function scheduleSitting(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.therapy.schedule({
				branchId: "main",
				date: sitting.date,
				equipmentId: sitting.equipmentId || undefined,
				notes: sitting.notes || undefined,
				packageId: therapyPkg.packageId,
				patientId,
				postVitals: { bpDys: 0, bpSys: 0, pulse: 0 },
				preVitals: { bpDys: 0, bpSys: 0, pulse: 0 },
				roomId: sitting.roomId || undefined,
				status: "Booked",
				therapistId: sitting.therapistId || undefined,
			});
			setStatus(
				`Sitting scheduled (${res?.id ?? "ok"}) — therapist/room/equipment conflicts blocked.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Schedule failed.");
		}
	}

	async function recordSitting(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.sittings.record({
				branchId: "main",
				chargeLines: undefined,
				consumables: sitting.consumables
					.split(",")
					.map((c) => c.trim())
					.filter(Boolean)
					.map((item) => ({ item, qty: 1 })),
				date: sitting.date,
				equipmentId: sitting.equipmentId || undefined,
				notes: sitting.notes || undefined,
				packageId: therapyPkg.packageId,
				patientId,
				postVitals: { bpDys: 0, bpSys: 0, pulse: 0 },
				preVitals: { bpDys: 0, bpSys: 0, pulse: 0 },
				roomId: sitting.roomId || undefined,
				status: sitting.status as "Booked" | "Attended" | "Missed",
				therapistId: sitting.therapistId || undefined,
			});
			setStatus(
				`Sitting recorded (${res?.id ?? "ok"}) with consumables + charge lines (billing hook).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Sitting record failed.");
		}
	}

	async function recordOutcome(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.packages.outcomes.record({
				branchId: "main",
				outcomeNote: pause.outcomeNote,
				packageId: therapyPkg.packageId,
			});
			const r = res as unknown as { attended?: number; remaining?: number };
			setStatus(
				`Outcome recorded — attended ${r?.attended ?? "?"}, remaining ${r?.remaining ?? "?"} (package completed).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Outcome failed.");
		}
	}

	async function issueDietPlan(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.diet.issue({
				branchId: "main",
				caseId: caseId || undefined,
				chart: diet.chart,
				language: diet.language || undefined,
				pathyVariant: diet.pathyVariant as
					| "ayurveda"
					| "homeopathy"
					| "allopathy"
					| "dental",
				patientId,
				validFrom: diet.validFrom,
				validTo: diet.validTo,
			});
			setStatus(
				`Diet issued (${res?.id ?? "ok"}) — print/WhatsApp in ${diet.language}.`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Diet failed.");
		}
	}

	async function createBatch(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await api.ayush.yoga.batches.create({
				branchId: "main",
				capacity: Number(yoga.capacity) || 1,
				name: yoga.name,
				schedule: yoga.schedule,
			});
			const r = res as unknown as { id?: string };
			if (r?.id) setYoga({ ...yoga, batchId: r.id });
			setStatus(`Yoga batch created (${r?.id ?? "ok"}).`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Batch failed.");
		}
	}

	async function enrollAndAttend(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.ayush.yoga.enroll({
				batchId: yoga.batchId,
				branchId: "main",
				patientId,
			});
			const res = await api.ayush.yoga.attendance.mark({
				attended: true,
				batchId: yoga.batchId,
				branchId: "main",
				date: yoga.date,
				patientId,
			});
			const r = res as unknown as { sessionsAttended?: number };
			setStatus(
				`Enrolled + attendance marked (sessions: ${r?.sessionsAttended ?? "?"}).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Yoga enroll failed.");
		}
	}

	async function prescribeAyush(e: FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const items = ayushRx.items
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean)
				.map((line) => {
					const [drug, dose, kind] = line.split("|").map((s) => s.trim());
					return {
						dose: dose ?? "",
						drug: drug ?? line,
						kind: (kind === "proprietary" ? "proprietary" : "classical") as
							| "classical"
							| "proprietary",
					};
				});
			const res = await api.ayush.prescriptions.create({
				anupana: ayushRx.anupana || undefined,
				branchId: "main",
				caseId: caseId || undefined,
				encounterId,
				items,
				patientId,
			});
			const r = res as unknown as {
				classical?: Array<unknown>;
				proprietary?: Array<unknown>;
				anupana?: string | null;
			};
			setStatus(
				`AYUSH prescription: ${r?.classical?.length ?? 0} classical + ${r?.proprietary?.length ?? 0} proprietary, anupana ${r?.anupana ?? "—"} (prints on slip).`,
			);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "AYUSH prescribe failed.");
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
							Case sheet (agni / mala / koshtha + shodhana / shamana plan)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-3" onSubmit={saveCase}>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className={inputCls}>
									<Label htmlFor={encId}>Encounter ID</Label>
									<Input
										id={encId}
										onChange={(e) => setEncounterId(e.target.value)}
										value={encounterId}
									/>
								</div>
								<div className={inputCls}>
									<Label htmlFor={patId}>Patient ID</Label>
									<Input
										id={patId}
										onChange={(e) => setPatientId(e.target.value)}
										value={patientId}
									/>
								</div>
								<div className={inputCls}>
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
								<div className={inputCls}>
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
								<div className={inputCls}>
									<Label htmlFor={nadiId}>Nadi</Label>
									<Input
										id={nadiId}
										onChange={(e) => setNadi(e.target.value)}
										value={nadi}
									/>
								</div>
								<div className={inputCls}>
									<Label htmlFor={doshaId}>Dosha</Label>
									<Input
										id={doshaId}
										onChange={(e) => setDosha(e.target.value)}
										value={dosha}
									/>
								</div>
								<div className={inputCls}>
									<Label>Agni</Label>
									<Input
										onChange={(e) => setAgni(e.target.value)}
										placeholder="e.g. mandagni"
										value={agni}
									/>
								</div>
								<div className={inputCls}>
									<Label>Mala</Label>
									<Input
										onChange={(e) => setMala(e.target.value)}
										value={mala}
									/>
								</div>
								<div className={inputCls}>
									<Label>Koshtha</Label>
									<Select
										onValueChange={(v) => setKoshtha(v ?? "madhya")}
										value={koshtha}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["mrudu", "madhya", "krura"].map((k) => (
												<SelectItem key={k} value={k}>
													{k}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className={inputCls}>
								<Label htmlFor={complaintsId}>Complaints</Label>
								<Input
									id={complaintsId}
									onChange={(e) => setComplaints(e.target.value)}
									value={complaints}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Plan lines (shodhana / shamana)</Label>
								{planLines.map((line, idx) => (
									<div
										className="flex gap-2"
										// biome-ignore lint/suspicious/noArrayIndexKey: plan lines are append-only drafts without ids
										key={`${line.arm}-${line.detail}-${idx}`}
									>
										<Select
											onValueChange={(v) => {
												const next = [...planLines];
												next[idx] = {
													arm: (v ?? "shamana") as "shodhana" | "shamana",
													detail: line.detail,
												};
												setPlanLines(next);
											}}
											value={line.arm}
										>
											<SelectTrigger className="w-36">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="shodhana">Shodhana</SelectItem>
												<SelectItem value="shamana">Shamana</SelectItem>
											</SelectContent>
										</Select>
										<Input
											onChange={(e) => {
												const next = [...planLines];
												next[idx] = { arm: line.arm, detail: e.target.value };
												setPlanLines(next);
											}}
											placeholder="e.g. Virechana × 1"
											value={line.detail}
										/>
									</div>
								))}
								<Button
									onClick={() =>
										setPlanLines([...planLines, { arm: "shamana", detail: "" }])
									}
									type="button"
									variant="outline"
								>
									Add plan line
								</Button>
							</div>
							<Button type="submit">Save case sheet</Button>
						</form>
					</CardContent>
				</Card>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Nadi booking (service → facility slot)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={bookNadiSlot}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Service</Label>
										<Input
											onChange={(e) =>
												setNadiBooking({
													...nadiBooking,
													serviceId: e.target.value,
												})
											}
											value={nadiBooking.serviceId}
										/>
									</div>
									<div className={inputCls}>
										<Label>Facility (Nadi room)</Label>
										<Input
											onChange={(e) =>
												setNadiBooking({
													...nadiBooking,
													facilityId: e.target.value,
												})
											}
											value={nadiBooking.facilityId}
										/>
									</div>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Date</Label>
										<Input
											onChange={(e) =>
												setNadiBooking({ ...nadiBooking, date: e.target.value })
											}
											placeholder="YYYY-MM-DD"
											value={nadiBooking.date}
										/>
									</div>
									<div className={inputCls}>
										<Label>Slot</Label>
										<Input
											onChange={(e) =>
												setNadiBooking({ ...nadiBooking, slot: e.target.value })
											}
											value={nadiBooking.slot}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Findings → case sheet</Label>
									<Input
										onChange={(e) =>
											setNadiBooking({
												...nadiBooking,
												findings: e.target.value,
											})
										}
										value={nadiBooking.findings}
									/>
								</div>
								<Button type="submit">Book Nadi exam</Button>
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
								<div className={inputCls}>
									<Label htmlFor={caseSheetId}>Case sheet ID</Label>
									<Input
										id={caseSheetId}
										onChange={(e) => setCaseId(e.target.value)}
										value={caseId}
									/>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<div className={inputCls}>
										<Label htmlFor={namId}>NAMASTE code</Label>
										<Input
											id={namId}
											onChange={(e) => setNamaste(e.target.value)}
											value={namaste}
										/>
									</div>
									<div className={inputCls}>
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

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Repertorization (miasm + dose)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={saveRepert}>
								<div className={inputCls}>
									<Label>Rubrics (comma separated)</Label>
									<Input
										onChange={(e) =>
											setRepert({ ...repert, rubrics: e.target.value })
										}
										value={repert.rubrics}
									/>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Remedy</Label>
										<Input
											onChange={(e) =>
												setRepert({ ...repert, remedy: e.target.value })
											}
											value={repert.remedy}
										/>
									</div>
									<div className={inputCls}>
										<Label>Potency</Label>
										<Input
											onChange={(e) =>
												setRepert({ ...repert, potency: e.target.value })
											}
											value={repert.potency}
										/>
									</div>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Miasm</Label>
										<Select
											onValueChange={(v) =>
												setRepert({ ...repert, miasm: v ?? "psora" })
											}
											value={repert.miasm}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[
													"psora",
													"sycosis",
													"syphilis",
													"tubercular",
													"mixed",
												].map((m) => (
													<SelectItem key={m} value={m}>
														{m}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Dose</Label>
										<Input
											onChange={(e) =>
												setRepert({ ...repert, dose: e.target.value })
											}
											placeholder="e.g. 200C single dose"
											value={repert.dose}
										/>
									</div>
								</div>
								<Button type="submit">Save repertorization</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Follow-up grid
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={saveGrid}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Visit no</Label>
										<Input
											onChange={(e) =>
												setGrid({ ...grid, visitNo: e.target.value })
											}
											value={grid.visitNo}
										/>
									</div>
									<div className={inputCls}>
										<Label>Improvement</Label>
										<Select
											onValueChange={(v) =>
												setGrid({ ...grid, improvement: v ?? "better" })
											}
											value={grid.improvement}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["worse", "same", "better", "resolved"].map((i) => (
													<SelectItem key={i} value={i}>
														{i}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Notes</Label>
									<Input
										onChange={(e) =>
											setGrid({ ...grid, notes: e.target.value })
										}
										value={grid.notes}
									/>
								</div>
								<div className="flex gap-2">
									<Button type="submit">Save grid row</Button>
									<Button onClick={refreshGrid} type="button" variant="outline">
										Load grid
									</Button>
								</div>
							</form>
							{gridRows.length > 0 ? (
								<ul className="grid gap-2 text-sm">
									{gridRows.map((r) => (
										<li className="rounded-md border p-2" key={r.visitNo}>
											Visit {r.visitNo}: {r.improvement} — {r.notes}
										</li>
									))}
								</ul>
							) : null}
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Therapy package + sittings
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={sellPackage}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Package</Label>
										<Select
											onValueChange={(v) =>
												setTherapyPkg({ ...therapyPkg, name: v ?? "abhyanga" })
											}
											value={therapyPkg.name}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[
													"panchakarma",
													"abhyanga",
													"shirodhara",
													"nasya",
													"basti",
													"other",
												].map((n) => (
													<SelectItem key={n} value={n}>
														{n}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Total sittings</Label>
										<Input
											onChange={(e) =>
												setTherapyPkg({
													...therapyPkg,
													totalSittings: e.target.value,
												})
											}
											value={therapyPkg.totalSittings}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Mixed procedures (comma separated)</Label>
									<Input
										onChange={(e) =>
											setTherapyPkg({
												...therapyPkg,
												procedures: e.target.value,
											})
										}
										placeholder="e.g. abhyanga, nasya"
										value={therapyPkg.procedures}
									/>
								</div>
								<Button type="submit">Sell package</Button>
								{pkgInfo ? (
									<p className="text-sm text-muted-foreground">{pkgInfo}</p>
								) : null}
							</form>
							<form className="grid gap-3 border-t pt-3" onSubmit={pauseExtend}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Action</Label>
										<Select
											onValueChange={(v) =>
												setPause({ ...pause, action: v ?? "pause" })
											}
											value={pause.action}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["pause", "resume", "extend", "complete"].map((a) => (
													<SelectItem key={a} value={a}>
														{a}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Extend days / reason</Label>
										<Input
											onChange={(e) =>
												setPause({ ...pause, extendDays: e.target.value })
											}
											value={pause.extendDays}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Outcome note (required on completion)</Label>
									<Input
										onChange={(e) =>
											setPause({ ...pause, outcomeNote: e.target.value })
										}
										value={pause.outcomeNote}
									/>
								</div>
								<div className="flex gap-2">
									<Button type="submit" variant="outline">
										Apply
									</Button>
									<Button
										onClick={recordOutcome}
										type="button"
										variant="outline"
									>
										Record outcome
									</Button>
								</div>
							</form>
							<form
								className="grid gap-3 border-t pt-3"
								onSubmit={scheduleSitting}
							>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Date</Label>
										<Input
											onChange={(e) =>
												setSitting({ ...sitting, date: e.target.value })
											}
											placeholder="YYYY-MM-DD"
											value={sitting.date}
										/>
									</div>
									<div className={inputCls}>
										<Label>Therapist</Label>
										<Input
											onChange={(e) =>
												setSitting({ ...sitting, therapistId: e.target.value })
											}
											value={sitting.therapistId}
										/>
									</div>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Room</Label>
										<Input
											onChange={(e) =>
												setSitting({ ...sitting, roomId: e.target.value })
											}
											value={sitting.roomId}
										/>
									</div>
									<div className={inputCls}>
										<Label>Equipment</Label>
										<Input
											onChange={(e) =>
												setSitting({ ...sitting, equipmentId: e.target.value })
											}
											value={sitting.equipmentId}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>
										Consumables (comma separated, for sitting record)
									</Label>
									<Input
										onChange={(e) =>
											setSitting({ ...sitting, consumables: e.target.value })
										}
										value={sitting.consumables}
									/>
								</div>
								<div className="flex gap-2">
									<Button type="submit">Schedule sitting</Button>
									<Button
										onClick={recordSitting}
										type="button"
										variant="outline"
									>
										Record sitting
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								Diet (per-pathy) + yoga roster
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							<form className="grid gap-3" onSubmit={issueDietPlan}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Pathy variant</Label>
										<Select
											onValueChange={(v) =>
												setDiet({ ...diet, pathyVariant: v ?? "ayurveda" })
											}
											value={diet.pathyVariant}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["ayurveda", "homeopathy", "allopathy", "dental"].map(
													(p) => (
														<SelectItem key={p} value={p}>
															{p}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</div>
									<div className={inputCls}>
										<Label>Language</Label>
										<Input
											onChange={(e) =>
												setDiet({ ...diet, language: e.target.value })
											}
											placeholder="en / hi / …"
											value={diet.language}
										/>
									</div>
								</div>
								<div className={inputCls}>
									<Label>Diet chart</Label>
									<Input
										onChange={(e) =>
											setDiet({ ...diet, chart: e.target.value })
										}
										value={diet.chart}
									/>
								</div>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Valid from</Label>
										<Input
											onChange={(e) =>
												setDiet({ ...diet, validFrom: e.target.value })
											}
											value={diet.validFrom}
										/>
									</div>
									<div className={inputCls}>
										<Label>Valid to</Label>
										<Input
											onChange={(e) =>
												setDiet({ ...diet, validTo: e.target.value })
											}
											value={diet.validTo}
										/>
									</div>
								</div>
								<Button type="submit">Issue diet</Button>
							</form>
							<form className="grid gap-3 border-t pt-3" onSubmit={createBatch}>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Batch name</Label>
										<Input
											onChange={(e) =>
												setYoga({ ...yoga, name: e.target.value })
											}
											value={yoga.name}
										/>
									</div>
									<div className={inputCls}>
										<Label>Schedule</Label>
										<Input
											onChange={(e) =>
												setYoga({ ...yoga, schedule: e.target.value })
											}
											placeholder="e.g. 6am daily"
											value={yoga.schedule}
										/>
									</div>
								</div>
								<Button type="submit" variant="outline">
									Create yoga batch
								</Button>
							</form>
							<form
								className="grid gap-3 border-t pt-3"
								onSubmit={enrollAndAttend}
							>
								<div className={rowCls}>
									<div className={inputCls}>
										<Label>Batch ID</Label>
										<Input
											onChange={(e) =>
												setYoga({ ...yoga, batchId: e.target.value })
											}
											value={yoga.batchId}
										/>
									</div>
									<div className={inputCls}>
										<Label>Attendance date</Label>
										<Input
											onChange={(e) =>
												setYoga({ ...yoga, date: e.target.value })
											}
											value={yoga.date}
										/>
									</div>
								</div>
								<Button type="submit" variant="outline">
									Enroll + mark attendance
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								AYUSH prescription (anupana + classical/proprietary)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="grid gap-3" onSubmit={prescribeAyush}>
								<div className={inputCls}>
									<Label>Anupana</Label>
									<Input
										onChange={(e) =>
											setAyushRx({ ...ayushRx, anupana: e.target.value })
										}
										placeholder="e.g. with warm water"
										value={ayushRx.anupana}
									/>
								</div>
								<div className={inputCls}>
									<Label>
										Items (one per line: drug | dose | classical/proprietary)
									</Label>
									<Input
										onChange={(e) =>
											setAyushRx({ ...ayushRx, items: e.target.value })
										}
										value={ayushRx.items}
									/>
								</div>
								<Button type="submit">Prescribe</Button>
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
