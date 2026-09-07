import {
	IconActivity,
	IconArrowLeft,
	IconCalendar,
	IconCamera,
	IconCheck,
	IconChevronDown,
	IconClipboardHeart,
	IconDental,
	IconDownload,
	IconFileText,
	IconHeartbeat,
	IconMicroscope,
	IconPill,
	IconPlus,
	IconStethoscope,
	IconX,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

export const Route = createFileRoute("/prototyping/emr/4")({
	component: MedicalRecordsV4,
});

// ── Mock Data ──────────────────────────────────────────────────────────

const patient = {
	age: 28,
	allergies: [] as string[],
	bloodGroup: "A+",
	conditions: [] as string[],
	doctor: "Dr. Deepa M.",
	email: "kavitha.r@email.com",
	gender: "Female",
	lastVisit: "2025-06-30",
	memberSince: "Mar 2023",
	mrn: "MRN-2024-11205",
	name: "Kavitha Reddy",
	nextAppointment: "2025-07-10",
	phone: "+91 76543 21098",
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
	"13": "treated",
	"14": "healthy",
	"15": "healthy",
	"16": "crown",
	"17": "healthy",
	"18": "healthy",
	"21": "healthy",
	"22": "healthy",
	"23": "healthy",
	"24": "healthy",
	"25": "cavity",
	"26": "healthy",
	"27": "healthy",
	"28": "healthy",
	"31": "healthy",
	"32": "healthy",
	"33": "treated",
	"34": "healthy",
	"35": "healthy",
	"36": "root-canal",
	"37": "healthy",
	"38": "healthy",
	"41": "healthy",
	"42": "healthy",
	"43": "healthy",
	"44": "healthy",
	"45": "healthy",
	"46": "crown",
	"47": "cavity",
	"48": "healthy",
};

const ongoingTreatments = [
	{
		description:
			"Lower right first molar presenting with irreversible pulpitis. Access cavity prepared, canals located (MB, DB, ML, DL). Working length established with apex locator. Cleaning and shaping completed using ProTaper rotary system.",
		doctor: "Dr. Deepa M.",
		id: 1,
		nextSession: "Jul 10, 2025",
		procedures: [
			{ date: "Jun 18", done: true, name: "Access opening & pulp removal" },
			{ date: "Jun 25", done: true, name: "Cleaning & shaping (all 4 canals)" },
			{
				date: "Jul 10",
				done: false,
				name: "Obturation & temporary restoration",
			},
			{ date: "Jul 25", done: false, name: "Post & core + Crown preparation" },
		],
		startDate: "Jun 18, 2025",
		status: "Session 2 of 3",
		title: "Root Canal Therapy — #36",
	},
];

const prescriptions = [
	{
		date: "Jun 25, 2025",
		drug: "Amoxicillin 500mg",
		duration: "5 days",
		frequency: "1 capsule, 3 times daily",
		id: 1,
		reason: "Post-RCT prophylaxis",
		status: "Active",
	},
	{
		date: "Jun 25, 2025",
		drug: "Ibuprofen 400mg",
		duration: "3 days",
		frequency: "1 tablet, 2 times daily (after food)",
		id: 2,
		reason: "Pain management",
		status: "Active",
	},
	{
		date: "Jun 25, 2025",
		drug: "Chlorhexidine 0.12% Mouthwash",
		duration: "7 days",
		frequency: "Rinse for 30 seconds, 2 times daily",
		id: 3,
		reason: "Post-procedure oral hygiene",
		status: "Active",
	},
	{
		date: "Jun 18, 2025",
		drug: "Paracetamol 650mg",
		duration: "As needed",
		frequency: "1 tablet as needed",
		id: 4,
		reason: "Supplemental analgesia",
		status: "Completed",
	},
];

const treatments = [
	{
		cost: "₹7,500",
		date: "Jun 18–25, 2025",
		doctor: "Dr. Deepa M.",
		id: 1,
		procedure: "Root Canal (Session 1 & 2)",
		status: "In Progress",
		tooth: "#36",
	},
	{
		cost: "₹2,000",
		date: "May 5, 2025",
		doctor: "Dr. Deepa M.",
		id: 2,
		procedure: "Composite Filling",
		status: "Completed",
		tooth: "#13",
	},
	{
		cost: "₹8,000",
		date: "Feb 12, 2025",
		doctor: "Dr. Deepa M.",
		id: 3,
		procedure: "Crown (PFM)",
		status: "Completed",
		tooth: "#16",
	},
	{
		cost: "₹2,500",
		date: "Jan 8, 2025",
		doctor: "Dr. Arvind S.",
		id: 4,
		procedure: "Scaling & Prophylaxis",
		status: "Completed",
		tooth: "Full mouth",
	},
	{
		cost: "₹12,000",
		date: "Nov 20, 2024",
		doctor: "Dr. Deepa M.",
		id: 5,
		procedure: "Crown (Zirconia)",
		status: "Completed",
		tooth: "#46",
	},
	{
		cost: "₹1,800",
		date: "Sep 15, 2024",
		doctor: "Dr. Arvind S.",
		id: 6,
		procedure: "Composite Filling",
		status: "Completed",
		tooth: "#33",
	},
];

const scans = [
	{
		date: "Jun 18, 2025",
		doctor: "Dr. Deepa M.",
		finding: "Periapical radiolucency at mesial root. Caries approaching pulp.",
		id: 1,
		region: "#36",
		type: "RVG — Periapical",
	},
	{
		date: "Jan 8, 2025",
		doctor: "Dr. Arvind S.",
		finding: "Generalized mild horizontal bone loss. #25 — caries visible.",
		id: 2,
		region: "Full mouth",
		type: "OPG — Panoramic",
	},
	{
		date: "Sep 15, 2024",
		doctor: "Dr. Arvind S.",
		finding: "No interproximal caries. Existing restoration #16 — intact.",
		id: 3,
		region: "Upper right quadrant",
		type: "Bitewing",
	},
];

const investigations = [
	{
		date: "Jun 16, 2025",
		id: 1,
		result: "WBC 7,200/μL, Hb 12.8 g/dL",
		status: "Normal",
		test: "Complete Blood Count",
	},
	{
		date: "Jun 16, 2025",
		id: 2,
		result: "105 mg/dL",
		status: "Normal",
		test: "Random Blood Sugar",
	},
	{
		date: "Jun 16, 2025",
		id: 3,
		result: "BT 2.5 min, CT 5 min",
		status: "Normal",
		test: "Bleeding Time / Clotting Time",
	},
];

const visits = [
	{
		chief: "Mild sensitivity on #36 (cold)",
		date: "Jun 30, 2025",
		doctor: "Dr. Deepa M.",
		id: 1,
		notes:
			"Expected post-instrumentation sensitivity. No swelling or tenderness to percussion. Advised to continue medication and return for obturation on Jul 10.",
		type: "Review",
		vitals: { bp: "118/76", pulse: "72 bpm", temp: "98.4°F" },
	},
	{
		chief: "Root canal — Session 2",
		date: "Jun 25, 2025",
		doctor: "Dr. Deepa M.",
		id: 2,
		notes:
			"Cleaning and shaping completed on MB, DB, ML, DL canals. Ca(OH)₂ dressing placed. Temporary cement seal. Patient tolerated well.",
		type: "Procedure",
		vitals: { bp: "120/78", pulse: "68 bpm", temp: "98.2°F" },
	},
	{
		chief: "Severe pain, lower right jaw — 3 days",
		date: "Jun 18, 2025",
		doctor: "Dr. Deepa M.",
		id: 3,
		notes:
			"Patient presents with spontaneous, throbbing pain in #36. Irreversible pulpitis diagnosed. Emergency access opening done. Cotton pellet with Cresophene placed. Patient relieved.",
		type: "Emergency",
		vitals: { bp: "128/82", pulse: "80 bpm", temp: "98.8°F" },
	},
	{
		chief: "Routine filling — #13",
		date: "May 5, 2025",
		doctor: "Dr. Deepa M.",
		id: 4,
		notes:
			"Disto-occlusal caries on #13. Caries removed, GIC liner placed, composite restoration built up. Occlusion checked.",
		type: "Procedure",
		vitals: { bp: "116/74", pulse: "70 bpm", temp: "98.6°F" },
	},
	{
		chief: "Annual cleaning",
		date: "Jan 8, 2025",
		doctor: "Dr. Arvind S.",
		id: 5,
		notes:
			"Full mouth supragingival and subgingival scaling done. Polished with prophylaxis paste. OPG taken — generalized mild bone loss noted. Advised electric toothbrush.",
		type: "Preventive",
		vitals: { bp: "114/72", pulse: "66 bpm", temp: "98.4°F" },
	},
];

// ── Tooth Chart ────────────────────────────────────────────────────────

const statusFill: Record<ToothStatus, string> = {
	cavity: "#fef9c3",
	crown: "#f3e8ff",
	healthy: "#dcfce7",
	missing: "#f4f4f5",
	"root-canal": "#ffe4e6",
	treated: "#dbeafe",
};

const statusStroke: Record<ToothStatus, string> = {
	cavity: "#facc15",
	crown: "#c084fc",
	healthy: "#4ade80",
	missing: "#a1a1aa",
	"root-canal": "#fb7185",
	treated: "#60a5fa",
};

const statusDot: Record<ToothStatus, string> = {
	cavity: "#eab308",
	crown: "#a855f7",
	healthy: "#22c55e",
	missing: "#a1a1aa",
	"root-canal": "#f43f5e",
	treated: "#3b82f6",
};

const statusName: Record<ToothStatus, string> = {
	cavity: "Caries",
	crown: "Crowned",
	healthy: "Healthy",
	missing: "Missing",
	"root-canal": "RCT",
	treated: "Restored",
};

function ToothChart() {
	const [selected, setSelected] = useState<string | null>(null);

	const upper = [
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
	const lower = [
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

	function Tooth({ id, x, y }: { id: string; x: number; y: number }) {
		const status = teeth[id] ?? "healthy";
		const sel = selected === id;

		return (
			<g
				className="cursor-pointer"
				onClick={() => setSelected(sel ? null : id)}
			>
				{/* Tooth shape — rounded molar-like */}
				<rect
					fill={statusFill[status]}
					height={30}
					opacity={status === "missing" ? 0.3 : 1}
					rx={5}
					stroke={sel ? statusStroke[status] : statusStroke[status]}
					strokeWidth={sel ? 2 : 0.8}
					width={26}
					x={x}
					y={y}
				/>
				{/* Root hints */}
				<line
					opacity={0.4}
					stroke={statusStroke[status]}
					strokeWidth={0.6}
					x1={x + 8}
					x2={x + 6}
					y1={y + 30}
					y2={y + 35}
				/>
				<line
					opacity={0.4}
					stroke={statusStroke[status]}
					strokeWidth={0.6}
					x1={x + 18}
					x2={x + 20}
					y1={y + 30}
					y2={y + 35}
				/>
				{/* Number */}
				<text
					className="font-medium text-[9px]"
					fill="currentColor"
					opacity={status === "missing" ? 0.35 : 0.75}
					textAnchor="middle"
					x={x + 13}
					y={y + 19}
				>
					{id}
				</text>
				{/* Status dot */}
				{status !== "healthy" && (
					<circle cx={x + 22} cy={y + 4} fill={statusDot[status]} r={2.5} />
				)}
			</g>
		);
	}

	const selectedStatus = selected ? (teeth[selected] ?? "healthy") : null;
	const stats = Object.values(teeth).reduce<Record<string, number>>(
		(acc, s) => {
			acc[s] = (acc[s] ?? 0) + 1;
			return acc;
		},
		{},
	);

	return (
		<div>
			{/* SVG Chart */}
			<div className="rounded-xl border bg-card p-4">
				<svg className="w-full" viewBox="0 0 455 100">
					<text
						className="font-semibold text-[8px] uppercase tracking-widest"
						fill="#a1a1aa"
						textAnchor="middle"
						x={227}
						y={10}
					>
						Upper Arch
					</text>
					{upper.map((id, i) => (
						<Tooth id={id} key={id} x={10 + i * 27.5} y={14} />
					))}
					<line
						stroke="#e4e4e7"
						strokeWidth={0.5}
						x1={10}
						x2={445}
						y1={52}
						y2={52}
					/>
					{lower.map((id, i) => (
						<Tooth id={id} key={id} x={10 + i * 27.5} y={55} />
					))}
					<text
						className="font-semibold text-[8px] uppercase tracking-widest"
						fill="#a1a1aa"
						textAnchor="middle"
						x={227}
						y={98}
					>
						Lower Arch
					</text>
				</svg>
			</div>

			{/* Summary pills */}
			<div className="mt-3 flex flex-wrap gap-2">
				{(Object.keys(statusFill) as ToothStatus[]).map((s) => (
					<div
						className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
						key={s}
						style={{
							backgroundColor: `${statusFill[s]}60`,
							borderColor: `${statusStroke[s]}40`,
						}}
					>
						<span
							className="inline-block size-2 rounded-full"
							style={{ backgroundColor: statusDot[s] }}
						/>
						<span className="font-medium">{stats[s] ?? 0}</span>
						<span className="text-muted-foreground">{statusName[s]}</span>
					</div>
				))}
			</div>

			{/* Selected tooth detail */}
			{selected && (
				<div
					className="mt-3 rounded-lg border-2 p-3 text-sm"
					style={{
						borderColor: `${statusStroke[selectedStatus ?? "healthy"]}60`,
					}}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span
								className="inline-block size-3 rounded-full"
								style={{
									backgroundColor: statusDot[selectedStatus ?? "healthy"],
								}}
							/>
							<span className="font-bold">Tooth #{selected}</span>
							<span className="text-muted-foreground">&middot;</span>
							<span
								className="capitalize"
								style={{ color: statusDot[selectedStatus ?? "healthy"] }}
							>
								{statusName[selectedStatus ?? "healthy"]}
							</span>
						</div>
						<Button
							onClick={() => setSelected(null)}
							size="icon-xs"
							variant="ghost"
						>
							<IconX />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

// ── Accordion ──────────────────────────────────────────────────────────

function AccordionSection({
	title,
	icon: Icon,
	count,
	defaultOpen = false,
	children,
}: {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	count?: number;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div className="border-b last:border-b-0">
			<button
				className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-foreground"
				onClick={() => setOpen(!open)}
				type="button"
			>
				<div className="flex items-center gap-2.5">
					<Icon className="text-primary" />
					<span className="font-semibold text-sm">{title}</span>
					{count !== undefined && (
						<Badge className="text-[10px]" variant="secondary">
							{count}
						</Badge>
					)}
				</div>
				<div className={`transition-transform ${open ? "rotate-180" : ""}`}>
					<IconChevronDown />
				</div>
			</button>
			{open && <div className="pb-5">{children}</div>}
		</div>
	);
}

// ── Main Page ──────────────────────────────────────────────────────────

function MedicalRecordsV4() {
	return (
		<div className="min-h-screen bg-background">
			{/* ── Hero Header ─────────────────────────────────────────────── */}
			<header className="relative overflow-hidden border-b">
				{/* Background pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02]" />
				<div
					className="absolute inset-0 opacity-[0.015]"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>

				<div className="relative mx-auto max-w-5xl px-6 py-8">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-5">
							<Button size="icon" variant="outline">
								<IconArrowLeft />
							</Button>
							<Avatar className="size-16 border-2 border-primary/20">
								<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-lg text-primary">
									KR
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex items-center gap-3">
									<h1 className="font-bold text-2xl tracking-tight">
										{patient.name}
									</h1>
									<Badge variant="outline">{patient.bloodGroup}</Badge>
								</div>
								<p className="mt-0.5 text-muted-foreground text-sm">
									{patient.mrn} &middot; {patient.gender}, {patient.age} yrs
									&middot; Member since {patient.memberSince}
								</p>
								<div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
									<span className="flex items-center gap-1">
										<IconStethoscope /> {patient.doctor}
									</span>
									<span className="flex items-center gap-1">
										<IconPhone /> {patient.phone}
									</span>
									<span className="flex items-center gap-1">
										<IconCalendar /> Next: {patient.nextAppointment}
									</span>
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<Button className="gap-1.5" variant="outline">
								<IconDownload />
								Export
							</Button>
							<Button className="gap-1.5">
								<IconPlus />
								New Record
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* ── Main Content ────────────────────────────────────────────── */}
			<main className="mx-auto max-w-5xl px-6 py-8">
				<div className="grid grid-cols-12 gap-8">
					{/* Left Column — Tooth Chart + Stats */}
					<div className="col-span-4">
						<div className="sticky top-8 space-y-6">
							{/* Tooth Chart */}
							<div>
								<h2 className="mb-3 flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
									<IconDental />
									Dental Chart
								</h2>
								<ToothChart />
							</div>

							{/* Quick summary cards */}
							<div className="space-y-3">
								<h2 className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
									<IconActivity />
									Quick Summary
								</h2>
								<div className="grid grid-cols-2 gap-2">
									<div className="rounded-lg border bg-card p-3 text-center">
										<p className="font-bold text-2xl text-primary">
											{visits.length}
										</p>
										<p className="text-muted-foreground text-xs">Visits</p>
									</div>
									<div className="rounded-lg border bg-card p-3 text-center">
										<p className="font-bold text-2xl text-emerald-600">
											{treatments.length}
										</p>
										<p className="text-muted-foreground text-xs">Procedures</p>
									</div>
									<div className="rounded-lg border bg-card p-3 text-center">
										<p className="font-bold text-2xl text-amber-600">
											{scans.length}
										</p>
										<p className="text-muted-foreground text-xs">Scans</p>
									</div>
									<div className="rounded-lg border bg-card p-3 text-center">
										<p className="font-bold text-2xl text-violet-600">
											{prescriptions.length}
										</p>
										<p className="text-muted-foreground text-xs">Rx</p>
									</div>
								</div>
							</div>

							{/* Allergies */}
							{patient.allergies.length > 0 && (
								<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
									<p className="mb-2 flex items-center gap-1.5 font-semibold text-destructive text-xs">
										⚠ ALLERGIES
									</p>
									<div className="flex flex-wrap gap-1">
										{patient.allergies.map((a) => (
											<Badge key={a} variant="destructive">
												{a}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Right Column — Accordion sections */}
					<div className="col-span-8">
						{/* Ongoing Treatment — always visible */}
						{ongoingTreatments.length > 0 && (
							<div className="mb-8">
								<h2 className="mb-4 flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
									<IconHeartbeat />
									Ongoing Treatment
								</h2>
								{ongoingTreatments.map((tx) => (
									<Card className="overflow-hidden" key={tx.id}>
										<div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
										<CardContent className="p-5">
											<div className="mb-3 flex items-start justify-between">
												<div>
													<h3 className="font-bold text-base">{tx.title}</h3>
													<p className="text-muted-foreground text-sm">
														{tx.doctor} &middot; Started {tx.startDate}
													</p>
												</div>
												<Badge>{tx.status}</Badge>
											</div>
											<p className="mb-4 text-muted-foreground text-sm leading-relaxed">
												{tx.description}
											</p>

											{/* Procedure steps */}
											<div className="space-y-0">
												{tx.procedures.map((proc, i) => (
													<div className="flex items-start gap-3" key={i}>
														<div className="flex flex-col items-center pt-0.5">
															{proc.done ? (
																<div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
																	<IconCheck className="size-3" />
																</div>
															) : (
																<div className="size-5 rounded-full border-2 border-muted-foreground/20 bg-background" />
															)}
															{i < tx.procedures.length - 1 && (
																<div
																	className={`min-h-5 w-px flex-1 ${proc.done ? "bg-primary" : "bg-muted-foreground/15"}`}
																/>
															)}
														</div>
														<div className="pb-2">
															<p
																className={`text-sm ${proc.done ? "text-foreground" : "text-muted-foreground"}`}
															>
																{proc.name}
															</p>
															<p className="text-muted-foreground text-xs">
																{proc.date}
															</p>
														</div>
													</div>
												))}
											</div>

											<div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
												<IconCalendar className="text-primary" />
												<span className="text-muted-foreground">
													Next session:
												</span>
												<span className="font-semibold">{tx.nextSession}</span>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}

						{/* Medical History Accordion */}
						<h2 className="mb-4 flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
							<IconFileText />
							Medical History
						</h2>

						<div className="rounded-xl border bg-card">
							<div className="px-5">
								{/* Prescriptions */}
								<AccordionSection
									count={prescriptions.length}
									defaultOpen
									icon={IconPill}
									title="Prescriptions"
								>
									<div className="space-y-2">
										{prescriptions.map((rx) => (
											<div className="rounded-lg border p-3" key={rx.id}>
												<div className="flex items-start justify-between">
													<div>
														<p className="font-semibold text-sm">{rx.drug}</p>
														<p className="text-muted-foreground text-xs">
															{rx.frequency}
														</p>
														<p className="mt-0.5 text-muted-foreground text-xs">
															Duration: {rx.duration} &middot; {rx.reason}
														</p>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-muted-foreground text-xs">
															{rx.date}
														</span>
														<Badge
															className="text-[10px]"
															variant={
																rx.status === "Active" ? "default" : "secondary"
															}
														>
															{rx.status}
														</Badge>
													</div>
												</div>
											</div>
										))}
									</div>
								</AccordionSection>

								<Separator />

								{/* Treatments */}
								<AccordionSection
									count={treatments.length}
									icon={IconStethoscope}
									title="Treatments &amp; Procedures"
								>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Procedure</TableHead>
												<TableHead>Tooth</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Doctor</TableHead>
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
													<TableCell className="text-muted-foreground text-xs">
														{t.date}
													</TableCell>
													<TableCell className="text-xs">{t.doctor}</TableCell>
													<TableCell className="text-right font-medium">
														{t.cost}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</AccordionSection>

								<Separator />

								{/* Scans */}
								<AccordionSection
									count={scans.length}
									icon={IconCamera}
									title="Scans &amp; Imaging"
								>
									<div className="space-y-3">
										{scans.map((scan) => (
											<div className="rounded-lg border p-4" key={scan.id}>
												<div className="flex items-start gap-4">
													<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
														<IconCamera className="text-muted-foreground" />
													</div>
													<div className="min-w-0 flex-1">
														<div className="flex items-start justify-between">
															<div>
																<p className="font-semibold text-sm">
																	{scan.type}
																</p>
																<p className="text-muted-foreground text-xs">
																	{scan.region} &middot; {scan.doctor}
																</p>
															</div>
															<span className="shrink-0 text-muted-foreground text-xs">
																{scan.date}
															</span>
														</div>
														<p className="mt-2 rounded bg-muted/50 px-2.5 py-1.5 text-muted-foreground text-xs">
															<span className="font-medium text-foreground">
																Finding:
															</span>{" "}
															{scan.finding}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</AccordionSection>

								<Separator />

								{/* Investigations */}
								<AccordionSection
									count={investigations.length}
									icon={IconMicroscope}
									title="Investigations"
								>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Test</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Result</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{investigations.map((inv) => (
												<TableRow key={inv.id}>
													<TableCell className="font-medium">
														{inv.test}
													</TableCell>
													<TableCell className="text-muted-foreground text-xs">
														{inv.date}
													</TableCell>
													<TableCell className="font-medium text-sm">
														{inv.result}
													</TableCell>
													<TableCell>
														<Badge
															className="text-[10px]"
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
								</AccordionSection>

								<Separator />

								{/* Visits */}
								<AccordionSection
									count={visits.length}
									defaultOpen
									icon={IconClipboardHeart}
									title="Visit History"
								>
									<div className="relative">
										{/* Timeline vertical line */}
										<div className="absolute top-2 bottom-2 left-[19px] w-px bg-border" />

										<div className="space-y-1">
											{visits.map((visit) => (
												<div
													className="relative flex gap-4 rounded-lg p-3 transition-colors hover:bg-muted/30"
													key={visit.id}
												>
													{/* Timeline dot */}
													<div className="relative z-10 mt-0.5">
														<div
															className={`flex size-10 items-center justify-center rounded-full border-2 font-bold text-xs ${
																visit.type === "Emergency"
																	? "border-destructive bg-destructive/10 text-destructive"
																	: visit.type === "Procedure"
																		? "border-primary bg-primary/10 text-primary"
																		: "border-muted-foreground/20 bg-muted text-muted-foreground"
															}`}
														>
															{visit.date.split(" ")[1].replace(",", "")}
														</div>
													</div>

													{/* Content */}
													<div className="min-w-0 flex-1">
														<div className="flex items-start justify-between gap-2">
															<div>
																<div className="flex items-center gap-2">
																	<p className="font-semibold text-sm">
																		{visit.chief}
																	</p>
																	<Badge
																		className="text-[10px]"
																		variant={
																			visit.type === "Emergency"
																				? "destructive"
																				: "outline"
																		}
																	>
																		{visit.type}
																	</Badge>
																</div>
																<p className="text-muted-foreground text-xs">
																	{visit.doctor} &middot; {visit.date}
																</p>
															</div>
														</div>
														<p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
															{visit.notes}
														</p>
														{visit.vitals && (
															<div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
																<span>
																	BP:{" "}
																	<span className="font-medium text-foreground">
																		{visit.vitals.bp}
																	</span>
																</span>
																<span>
																	Temp:{" "}
																	<span className="font-medium text-foreground">
																		{visit.vitals.temp}
																	</span>
																</span>
																<span>
																	Pulse:{" "}
																	<span className="font-medium text-foreground">
																		{visit.vitals.pulse}
																	</span>
																</span>
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								</AccordionSection>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

function IconPhone({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
		</svg>
	);
}
