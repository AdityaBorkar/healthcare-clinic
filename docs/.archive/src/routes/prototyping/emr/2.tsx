import {
	IconArrowLeft,
	IconCalendar,
	IconCamera,
	IconClipboardHeart,
	IconClock,
	IconDental,
	IconHeartbeat,
	IconMicroscope,
	IconPill,
	IconSearch,
	IconStethoscope,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export const Route = createFileRoute("/prototyping/emr/2")({
	component: MedicalRecordsV2,
});

// ── Mock Data ──────────────────────────────────────────────────────────

const patient = {
	age: 34,
	allergies: ["Penicillin", "Latex"],
	bloodGroup: "B+",
	gender: "Female",
	lastVisit: "2025-06-28",
	mrn: "MRN-2024-08712",
	name: "Priya Sharma",
	nextAppointment: "2025-07-15",
	phone: "+91 98765 43210",
};

type ToothStatus =
	| "healthy"
	| "treated"
	| "cavity"
	| "missing"
	| "crown"
	| "root-canal";

const teeth: Record<string, ToothStatus> = {
	"11": "healthy",
	"12": "healthy",
	"13": "cavity",
	"14": "treated",
	"15": "healthy",
	"16": "crown",
	"17": "healthy",
	"18": "missing",
	"21": "healthy",
	"22": "healthy",
	"23": "healthy",
	"24": "treated",
	"25": "cavity",
	"26": "root-canal",
	"27": "healthy",
	"28": "healthy",
	"31": "healthy",
	"32": "healthy",
	"33": "cavity",
	"34": "healthy",
	"35": "treated",
	"36": "crown",
	"37": "healthy",
	"38": "missing",
	"41": "healthy",
	"42": "healthy",
	"43": "healthy",
	"44": "treated",
	"45": "healthy",
	"46": "crown",
	"47": "cavity",
	"48": "healthy",
};

const ongoingTreatments = [
	{
		doctor: "Dr. Anand K.",
		id: 1,
		nextSession: "2025-07-05",
		progress: 66,
		startDate: "2025-06-15",
		status: "In Progress",
		steps: [
			{ date: "Jun 15", done: true, label: "Access opening" },
			{ date: "Jun 22", done: true, label: "Cleaning & shaping" },
			{ date: "Jul 05", done: false, label: "Obturation" },
			{ date: "Jul 20", done: false, label: "Crown placement" },
		],
		title: "Root Canal — #26",
	},
	{
		doctor: "Dr. Meera S.",
		id: 2,
		nextSession: "2025-07-12",
		progress: 40,
		startDate: "2025-03-10",
		status: "Active",
		steps: [
			{ date: "Mar 10", done: true, label: "Initial assessment" },
			{ date: "Mar 20", done: true, label: "Brackets placed" },
			{ date: "Apr 15", done: true, label: "Monthly adjustment #1" },
			{ date: "May 12", done: true, label: "Monthly adjustment #2" },
			{ date: "Jul 12", done: false, label: "Progress X-ray" },
			{ date: "Dec 2025", done: false, label: "Final removal" },
		],
		title: "Orthodontic Alignment",
	},
];

const prescriptions = [
	{
		date: "2025-06-22",
		dosage: "1 cap × 3/day",
		drug: "Amoxicillin 500mg",
		duration: "5 days",
		id: 1,
		prescribedBy: "Dr. Anand K.",
		status: "Active",
	},
	{
		date: "2025-06-22",
		dosage: "1 tab × 2/day",
		drug: "Ibuprofen 400mg",
		duration: "3 days",
		id: 2,
		prescribedBy: "Dr. Anand K.",
		status: "Active",
	},
	{
		date: "2025-05-12",
		dosage: "Rinse × 2/day",
		drug: "Chlorhexidine Mouthwash",
		duration: "7 days",
		id: 3,
		prescribedBy: "Dr. Meera S.",
		status: "Completed",
	},
	{
		date: "2025-04-05",
		dosage: "1 cap × 2/day",
		drug: "Clindamycin 300mg",
		duration: "5 days",
		id: 4,
		prescribedBy: "Dr. Anand K.",
		status: "Completed",
	},
];

const treatments = [
	{
		cost: "₹2,500",
		date: "2025-06-10",
		doctor: "Dr. Anand K.",
		id: 1,
		procedure: "Composite Filling",
		status: "Completed",
		tooth: "#13",
	},
	{
		cost: "₹3,000",
		date: "2025-05-20",
		doctor: "Dr. Priya R.",
		id: 2,
		procedure: "Scaling & Polishing",
		status: "Completed",
		tooth: "Full mouth",
	},
	{
		cost: "₹1,500",
		date: "2025-04-15",
		doctor: "Dr. Anand K.",
		id: 3,
		procedure: "Extraction",
		status: "Completed",
		tooth: "#18",
	},
	{
		cost: "₹8,000",
		date: "2025-03-28",
		doctor: "Dr. Anand K.",
		id: 4,
		procedure: "Crown Preparation",
		status: "Completed",
		tooth: "#16",
	},
	{
		cost: "₹6,000",
		date: "2025-02-10",
		doctor: "Dr. Anand K.",
		id: 5,
		procedure: "Root Canal",
		status: "Completed",
		tooth: "#24",
	},
];

const scans = [
	{
		date: "2025-06-15",
		doctor: "Dr. Anand K.",
		id: 1,
		region: "Full mouth",
		status: "Reviewed",
		type: "OPG X-Ray",
	},
	{
		date: "2025-06-15",
		doctor: "Dr. Anand K.",
		id: 2,
		region: "#26",
		status: "Reviewed",
		type: "RVG",
	},
	{
		date: "2025-03-10",
		doctor: "Dr. Meera S.",
		id: 3,
		region: "Upper jaw",
		status: "Reviewed",
		type: "CBCT Scan",
	},
];

const investigations = [
	{
		date: "2025-06-14",
		doctor: "Dr. Anand K.",
		id: 1,
		result: "Normal",
		status: "Normal",
		test: "Complete Blood Count",
	},
	{
		date: "2025-06-14",
		doctor: "Dr. Anand K.",
		id: 2,
		result: "92 mg/dL",
		status: "Normal",
		test: "Blood Sugar (Fasting)",
	},
	{
		date: "2025-03-08",
		doctor: "Dr. Meera S.",
		id: 3,
		result: "1.0",
		status: "Normal",
		test: "PT/INR",
	},
];

const visits = [
	{
		date: "2025-06-28",
		doctor: "Dr. Anand K.",
		id: 1,
		notes: "Cleaning and shaping completed. Temporary filling placed.",
		reason: "Root Canal Session 2",
	},
	{
		date: "2025-06-15",
		doctor: "Dr. Anand K.",
		id: 2,
		notes:
			"Access opening done. Pulp exposure found. Interim medication placed.",
		reason: "Root Canal Session 1",
	},
	{
		date: "2025-06-10",
		doctor: "Dr. Anand K.",
		id: 3,
		notes: "Composite restoration on disto-occlusal cavity.",
		reason: "Filling — #13",
	},
	{
		date: "2025-05-20",
		doctor: "Dr. Priya R.",
		id: 4,
		notes: "Full mouth scaling done. Advised mouthwash for 7 days.",
		reason: "Scaling & Polishing",
	},
	{
		date: "2025-05-12",
		doctor: "Dr. Meera S.",
		id: 5,
		notes: "Wire changed to 0.018 NiTi. Mild discomfort expected.",
		reason: "Orthodontic Adjustment",
	},
	{
		date: "2025-04-15",
		doctor: "Dr. Anand K.",
		id: 6,
		notes: "Surgical extraction of impacted wisdom tooth. Sutures placed.",
		reason: "Extraction — #18",
	},
];

// ── Tooth Chart Component ──────────────────────────────────────────────

const statusColors: Record<ToothStatus, string> = {
	cavity: "fill-amber-100 stroke-amber-400",
	crown: "fill-violet-100 stroke-violet-400",
	healthy: "fill-emerald-100 stroke-emerald-400",
	missing: "fill-zinc-200 stroke-zinc-400 opacity-40",
	"root-canal": "fill-rose-100 stroke-rose-400",
	treated: "fill-sky-100 stroke-sky-400",
};

const statusDot: Record<ToothStatus, string> = {
	cavity: "bg-amber-400",
	crown: "bg-violet-400",
	healthy: "bg-emerald-400",
	missing: "bg-zinc-400",
	"root-canal": "bg-rose-400",
	treated: "bg-sky-400",
};

function ToothChart() {
	const [selected, setSelected] = useState<string | null>(null);

	const upperTeeth = [
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
	const lowerTeeth = [
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

	function ToothSVG({ id, x, y }: { id: string; x: number; y: number }) {
		const status = teeth[id] ?? "healthy";
		const isSelected = selected === id;
		return (
			<g
				className="cursor-pointer"
				onClick={() => setSelected(isSelected ? null : id)}
			>
				<rect
					className={`${statusColors[status]} ${isSelected ? "stroke-2" : "stroke-1"} transition-all`}
					height={32}
					rx={6}
					width={28}
					x={x}
					y={y}
				/>
				<text
					className="fill-foreground font-medium text-[10px]"
					textAnchor="middle"
					x={x + 14}
					y={y + 18}
				>
					{id}
				</text>
				{status !== "healthy" && (
					<circle
						className={`${statusDot[status]} fill-current`}
						cx={x + 24}
						cy={y + 4}
						r={3}
					/>
				)}
			</g>
		);
	}

	return (
		<div className="space-y-3">
			<svg className="w-full" viewBox="0 0 500 140">
				{/* Upper arch */}
				<text
					className="fill-muted-foreground text-[9px]"
					textAnchor="middle"
					x={250}
					y={12}
				>
					UPPER
				</text>
				{upperTeeth.map((id, i) => (
					<ToothSVG id={id} key={id} x={20 + i * 29} y={18} />
				))}
				{/* Divider */}
				<line
					className="stroke-border"
					strokeDasharray="4 4"
					x1={20}
					x2={480}
					y1={60}
					y2={60}
				/>
				{/* Lower arch */}
				{lowerTeeth.map((id, i) => (
					<ToothSVG id={id} key={id} x={20 + i * 29} y={70} />
				))}
				<text
					className="fill-muted-foreground text-[9px]"
					textAnchor="middle"
					x={250}
					y={118}
				>
					LOWER
				</text>
			</svg>

			{/* Legend */}
			<div className="flex flex-wrap gap-2">
				{(
					[
						"healthy",
						"treated",
						"cavity",
						"missing",
						"crown",
						"root-canal",
					] as ToothStatus[]
				).map((s) => (
					<div className="flex items-center gap-1.5 text-xs" key={s}>
						<span
							className={`inline-block size-2 rounded-full ${statusDot[s]}`}
						/>
						<span className="text-muted-foreground capitalize">
							{s.replace("-", " ")}
						</span>
					</div>
				))}
			</div>

			{selected && (
				<div className="rounded-lg border bg-muted/50 p-3 text-sm">
					<span className="font-medium">Tooth #{selected}</span>
					<span className="text-muted-foreground"> — </span>
					<span className="capitalize">
						{(teeth[selected] ?? "healthy").replace("-", " ")}
					</span>
				</div>
			)}
		</div>
	);
}

// ── Status Legend ──────────────────────────────────────────────────────

const toothStats = Object.values(teeth).reduce<Record<string, number>>(
	(acc, s) => {
		acc[s] = (acc[s] ?? 0) + 1;
		return acc;
	},
	{},
);

// ── Main Page ──────────────────────────────────────────────────────────

function MedicalRecordsV2() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex h-screen bg-background">
			{/* ── Left Sidebar ────────────────────────────────────────────── */}
			<aside className="flex w-72 flex-col border-r bg-muted/30">
				{/* Header */}
				<div className="flex items-center gap-2 border-b p-4">
					<Button size="icon-sm" variant="ghost">
						<IconArrowLeft />
					</Button>
					<span className="font-semibold text-sm">Patient Overview</span>
				</div>

				{/* Patient Card */}
				<div className="border-b p-4">
					<div className="flex items-center gap-3">
						<Avatar className="size-12">
							<AvatarFallback className="bg-primary/10 text-primary">
								PS
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold">{patient.name}</p>
							<p className="text-muted-foreground text-xs">{patient.mrn}</p>
						</div>
					</div>
					<div className="mt-3 grid grid-cols-2 gap-2 text-xs">
						<div>
							<span className="text-muted-foreground">Age</span>
							<p className="font-medium">{patient.age} yrs</p>
						</div>
						<div>
							<span className="text-muted-foreground">Gender</span>
							<p className="font-medium">{patient.gender}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Blood</span>
							<p className="font-medium">{patient.bloodGroup}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Phone</span>
							<p className="font-medium">{patient.phone}</p>
						</div>
					</div>
					{patient.allergies.length > 0 && (
						<div className="mt-3">
							<span className="text-muted-foreground text-xs">Allergies</span>
							<div className="mt-1 flex flex-wrap gap-1">
								{patient.allergies.map((a) => (
									<Badge key={a} variant="destructive">
										{a}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Tooth Chart */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="mb-2 flex items-center gap-2">
						<IconDental className="text-muted-foreground" />
						<span className="font-semibold text-sm">Tooth Chart</span>
					</div>
					<ToothChart />

					{/* Stats */}
					<div className="mt-4 grid grid-cols-3 gap-2">
						{(["healthy", "treated", "cavity"] as const).map((s) => (
							<div
								className="rounded-lg border bg-card p-2 text-center"
								key={s}
							>
								<p className="font-bold text-lg">{toothStats[s] ?? 0}</p>
								<p className="text-muted-foreground text-xs capitalize">{s}</p>
							</div>
						))}
					</div>
				</div>

				{/* Next Appointment */}
				<div className="border-t p-4">
					<div className="flex items-center gap-2 text-xs">
						<IconCalendar className="text-primary" />
						<span className="text-muted-foreground">Next visit:</span>
						<span className="font-medium">{patient.nextAppointment}</span>
					</div>
				</div>
			</aside>

			{/* ── Main Content ────────────────────────────────────────────── */}
			<main className="flex-1 overflow-y-auto">
				{/* Top Bar */}
				<div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background/95 px-6 py-3 backdrop-blur">
					<div className="relative max-w-md flex-1">
						<IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="pl-9"
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search records, prescriptions, visits..."
							value={searchQuery}
						/>
					</div>
					<Badge className="gap-1" variant="outline">
						<IconClock />
						Last visit: {patient.lastVisit}
					</Badge>
				</div>

				<div className="p-6">
					<Tabs defaultValue="ongoing">
						<TabsList variant="line">
							<TabsTrigger className="gap-1.5" value="ongoing">
								<IconHeartbeat />
								Ongoing Treatment
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="prescriptions">
								<IconPill />
								Prescriptions
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="treatments">
								<IconStethoscope />
								Treatments
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="scans">
								<IconCamera />
								Scans
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="investigations">
								<IconMicroscope />
								Investigations
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="visits">
								<IconClipboardHeart />
								Visits
							</TabsTrigger>
						</TabsList>

						{/* ── Ongoing Treatment ──────────────────────────────────── */}
						<TabsContent className="mt-4" value="ongoing">
							<div className="grid gap-4">
								{ongoingTreatments.map((treatment) => (
									<Card key={treatment.id}>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between">
												<div>
													<CardTitle className="text-base">
														{treatment.title}
													</CardTitle>
													<CardDescription>
														Started {treatment.startDate} &middot; Dr.{" "}
														{treatment.doctor}
													</CardDescription>
												</div>
												<Badge
													variant={
														treatment.status === "In Progress"
															? "default"
															: "secondary"
													}
												>
													{treatment.status}
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											{/* Progress bar */}
											<div className="mb-4">
												<div className="mb-1 flex justify-between text-xs">
													<span className="text-muted-foreground">
														Progress
													</span>
													<span className="font-medium">
														{treatment.progress}%
													</span>
												</div>
												<div className="h-1.5 w-full rounded-full bg-muted">
													<div
														className="h-full rounded-full bg-primary transition-all"
														style={{ width: `${treatment.progress}%` }}
													/>
												</div>
											</div>

											{/* Timeline steps */}
											<div className="space-y-0">
												{treatment.steps.map((step, i) => (
													<div className="flex items-start gap-3" key={i}>
														<div className="flex flex-col items-center">
															<div
																className={`size-3 rounded-full border-2 ${
																	step.done
																		? "border-primary bg-primary"
																		: "border-muted-foreground/30 bg-background"
																}`}
															/>
															{i < treatment.steps.length - 1 && (
																<div
																	className={`min-h-6 w-px flex-1 ${
																		step.done
																			? "bg-primary"
																			: "bg-muted-foreground/20"
																	}`}
																/>
															)}
														</div>
														<div className="-mt-0.5 pb-3">
															<p
																className={`text-sm ${step.done ? "text-foreground" : "text-muted-foreground"}`}
															>
																{step.label}
															</p>
															<p className="text-muted-foreground text-xs">
																{step.date}
															</p>
														</div>
													</div>
												))}
											</div>

											{treatment.nextSession && (
												<div className="mt-3 flex items-center gap-2 rounded-lg border bg-muted/50 p-2.5 text-sm">
													<IconCalendar className="text-primary" />
													<span className="text-muted-foreground">
														Next session:
													</span>
													<span className="font-medium">
														{treatment.nextSession}
													</span>
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* ── Prescriptions ──────────────────────────────────────── */}
						<TabsContent className="mt-4" value="prescriptions">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Prescriptions</CardTitle>
									<CardDescription>
										Medications prescribed across all visits
									</CardDescription>
								</CardHeader>
								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Medication</TableHead>
												<TableHead>Dosage</TableHead>
												<TableHead>Duration</TableHead>
												<TableHead>Prescribed By</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{prescriptions.map((rx) => (
												<TableRow key={rx.id}>
													<TableCell className="font-medium">
														{rx.drug}
													</TableCell>
													<TableCell>{rx.dosage}</TableCell>
													<TableCell>{rx.duration}</TableCell>
													<TableCell>{rx.prescribedBy}</TableCell>
													<TableCell className="text-muted-foreground">
														{rx.date}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																rx.status === "Active" ? "default" : "secondary"
															}
														>
															{rx.status}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						{/* ── Treatments ─────────────────────────────────────────── */}
						<TabsContent className="mt-4" value="treatments">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Treatment History</CardTitle>
									<CardDescription>
										All completed dental procedures
									</CardDescription>
								</CardHeader>
								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Procedure</TableHead>
												<TableHead>Tooth</TableHead>
												<TableHead>Doctor</TableHead>
												<TableHead>Date</TableHead>
												<TableHead className="text-right">Cost</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{treatments.map((t) => (
												<TableRow key={t.id}>
													<TableCell className="font-medium">
														{t.procedure}
													</TableCell>
													<TableCell>{t.tooth}</TableCell>
													<TableCell>{t.doctor}</TableCell>
													<TableCell className="text-muted-foreground">
														{t.date}
													</TableCell>
													<TableCell className="text-right font-medium">
														{t.cost}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						{/* ── Scans ──────────────────────────────────────────────── */}
						<TabsContent className="mt-4" value="scans">
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{scans.map((scan) => (
									<Card key={scan.id}>
										<CardContent className="p-4">
											<div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-primary/10">
												<IconCamera className="text-primary" />
											</div>
											<p className="font-semibold text-sm">{scan.type}</p>
											<p className="text-muted-foreground text-xs">
												{scan.region}
											</p>
											<Separator className="my-3" />
											<div className="flex justify-between text-xs">
												<span className="text-muted-foreground">
													{scan.date}
												</span>
												<Badge variant="outline">{scan.status}</Badge>
											</div>
											<p className="mt-1 text-muted-foreground text-xs">
												{scan.doctor}
											</p>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* ── Investigations ─────────────────────────────────────── */}
						<TabsContent className="mt-4" value="investigations">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Lab Investigations
									</CardTitle>
									<CardDescription>
										Pre-procedure and routine lab work
									</CardDescription>
								</CardHeader>
								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Test</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Result</TableHead>
												<TableHead>Ordered By</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{investigations.map((inv) => (
												<TableRow key={inv.id}>
													<TableCell className="font-medium">
														{inv.test}
													</TableCell>
													<TableCell className="text-muted-foreground">
														{inv.date}
													</TableCell>
													<TableCell>{inv.result}</TableCell>
													<TableCell>{inv.doctor}</TableCell>
													<TableCell>
														<Badge
															variant={
																inv.status === "Normal"
																	? "secondary"
																	: "destructive"
															}
														>
															{inv.status}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						{/* ── Visits ─────────────────────────────────────────────── */}
						<TabsContent className="mt-4" value="visits">
							<div className="space-y-3">
								{visits.map((visit) => (
									<Card key={visit.id}>
										<CardContent className="p-4">
											<div className="flex items-start gap-4">
												<div className="flex flex-col items-center">
													<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
														{visit.date.split("-")[2]}
													</div>
													<p className="mt-1 text-[10px] text-muted-foreground uppercase">
														{new Date(visit.date).toLocaleString("en", {
															month: "short",
														})}
													</p>
												</div>
												<div className="flex-1">
													<div className="flex items-start justify-between">
														<div>
															<p className="font-semibold text-sm">
																{visit.reason}
															</p>
															<p className="text-muted-foreground text-xs">
																{visit.doctor}
															</p>
														</div>
														<span className="text-muted-foreground text-xs">
															{visit.date}
														</span>
													</div>
													<p className="mt-2 text-muted-foreground text-sm">
														{visit.notes}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	);
}
