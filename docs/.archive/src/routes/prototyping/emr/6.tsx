import {
	IconArrowLeft,
	IconBandage,
	IconCalendar,
	IconChevronDown,
	IconClipboardHeart,
	IconDental,
	IconHeartbeat,
	IconHistory,
	IconNotes,
	IconPill,
	IconPlus,
	IconStethoscope,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

export const Route = createFileRoute("/prototyping/emr/6")({
	component: EHRv6,
});

// ── Mock Data ──────────────────────────────────────────────────────────

const patient = {
	activeTreatments: 2,
	age: 42,
	allergies: ["Aspirin"],
	bloodGroup: "O+",
	conditions: ["Hypertension", "Type 2 Diabetes"],
	doctor: "Dr. Rakesh N.",
	email: "arjun.mehta@email.com",
	gender: "Male",
	lastVisit: "2025-06-25",
	mrn: "MRN-2024-06391",
	name: "Arjun Mehta",
	nextAppointment: "2025-07-08",
	phone: "+91 87654 32109",
	totalVisits: 14,
};

type ToothStatus =
	| "healthy"
	| "treated"
	| "cavity"
	| "missing"
	| "crown"
	| "root-canal"
	| "implant";

const teeth: Record<string, ToothStatus> = {
	"11": "healthy",
	"12": "treated",
	"13": "healthy",
	"14": "healthy",
	"15": "cavity",
	"16": "crown",
	"17": "healthy",
	"18": "missing",
	"21": "healthy",
	"22": "healthy",
	"23": "cavity",
	"24": "treated",
	"25": "healthy",
	"26": "root-canal",
	"27": "crown",
	"28": "missing",
	"31": "healthy",
	"32": "healthy",
	"33": "healthy",
	"34": "treated",
	"35": "healthy",
	"36": "implant",
	"37": "healthy",
	"38": "missing",
	"41": "healthy",
	"42": "healthy",
	"43": "treated",
	"44": "healthy",
	"45": "cavity",
	"46": "crown",
	"47": "healthy",
	"48": "missing",
};

const prescriptions = [
	{
		date: "2025-06-25",
		dosage: "500mg",
		drug: "Metformin",
		frequency: "2×/day",
		id: 1,
		reason: "Diabetes mgmt",
		status: "Active",
	},
	{
		date: "2025-06-20",
		dosage: "500mg",
		drug: "Amoxicillin",
		frequency: "3×/day",
		id: 2,
		reason: "Post-procedure",
		status: "Active",
	},
	{
		date: "2025-06-20",
		dosage: "400mg",
		drug: "Ibuprofen",
		frequency: "2×/day",
		id: 3,
		reason: "Pain mgmt",
		status: "Completed",
	},
	{
		date: "2025-01-10",
		dosage: "5mg",
		drug: "Amlodipine",
		frequency: "1×/day",
		id: 4,
		reason: "Hypertension",
		status: "Active",
	},
];

const treatments = [
	{
		cost: "₹35,000",
		date: "2025-05-20",
		doctor: "Dr. Rakesh N.",
		id: 1,
		procedure: "Implant Placement",
		status: "In Progress",
		tooth: "#36",
	},
	{
		cost: "₹12,000",
		date: "2025-06-20",
		doctor: "Dr. Sunita P.",
		id: 2,
		procedure: "Crown Preparation",
		status: "In Progress",
		tooth: "#27",
	},
	{
		cost: "₹8,000",
		date: "2025-04-10",
		doctor: "Dr. Rakesh N.",
		id: 3,
		procedure: "Root Canal",
		status: "Completed",
		tooth: "#26",
	},
	{
		cost: "₹2,500",
		date: "2025-03-15",
		doctor: "Dr. Rakesh N.",
		id: 4,
		procedure: "Composite Filling",
		status: "Completed",
		tooth: "#15",
	},
	{
		cost: "₹2,000",
		date: "2025-02-28",
		doctor: "Dr. Rakesh N.",
		id: 5,
		procedure: "Extraction",
		status: "Completed",
		tooth: "#28",
	},
];

const diagnoses = [
	{
		category: "Dental",
		code: "K02.1",
		date: "2025-03-15",
		id: 1,
		name: "Caries of dentin — #15",
		severity: "Moderate",
		status: "Treated",
	},
	{
		category: "Dental",
		code: "K04.0",
		date: "2025-04-10",
		id: 2,
		name: "Pulpitis — #26",
		severity: "Severe",
		status: "Treated",
	},
	{
		category: "Dental",
		code: "K08.1",
		date: "2025-02-28",
		id: 3,
		name: "Loss of teeth — #28",
		severity: "—",
		status: "Resolved",
	},
	{
		category: "Dental",
		code: "K05.3",
		date: "2025-06-20",
		id: 4,
		name: "Chronic periodontitis — #23",
		severity: "Mild",
		status: "Active",
	},
	{
		category: "Systemic",
		code: "E11",
		date: "2024-01-10",
		id: 5,
		name: "Type 2 Diabetes Mellitus",
		severity: "Moderate",
		status: "Active",
	},
	{
		category: "Systemic",
		code: "I10",
		date: "2024-01-10",
		id: 6,
		name: "Essential Hypertension",
		severity: "Mild",
		status: "Active",
	},
];

const visits = [
	{
		date: "2025-06-25",
		doctor: "Dr. Sunita P.",
		id: 1,
		reason: "Crown impression",
		summary: "Impression taken for #27. Temporary crown placed.",
		type: "Follow-up",
		vitals: { bp: "130/85", pulse: "72", temp: "98.4°F" },
	},
	{
		date: "2025-06-20",
		doctor: "Dr. Sunita P.",
		id: 2,
		reason: "Crown prep — #27",
		summary: "Tooth prepared for PFM crown. Shade matched.",
		type: "Procedure",
		vitals: null,
	},
	{
		date: "2025-05-20",
		doctor: "Dr. Rakesh N.",
		id: 3,
		reason: "Implant placement — #36",
		summary: "4.0 × 10mm Nobel Biocare implant placed.",
		type: "Surgery",
		vitals: { bp: "128/82", pulse: "68", temp: "98.2°F" },
	},
	{
		date: "2025-04-10",
		doctor: "Dr. Rakesh N.",
		id: 4,
		reason: "Root canal — #26",
		summary: "3 canal RCT completed. Post-op X-ray satisfactory.",
		type: "Procedure",
		vitals: null,
	},
	{
		date: "2025-03-15",
		doctor: "Dr. Rakesh N.",
		id: 5,
		reason: "Filling — #15",
		summary: "MOD composite restoration. Adjusted occlusion.",
		type: "Procedure",
		vitals: null,
	},
];

// ── Tooth Chart ────────────────────────────────────────────────────────

const statusColors: Record<ToothStatus, { bg: string; stroke: string }> = {
	cavity: { bg: "#fef3c7", stroke: "#fbbf24" },
	crown: { bg: "#ede9fe", stroke: "#a78bfa" },
	healthy: { bg: "#dcfce7", stroke: "#4ade80" },
	implant: { bg: "#e0f2fe", stroke: "#38bdf8" },
	missing: { bg: "#f4f4f5", stroke: "#a1a1aa" },
	"root-canal": { bg: "#ffe4e6", stroke: "#fb7185" },
	treated: { bg: "#dbeafe", stroke: "#60a5fa" },
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

	function Tooth({ id, x, y }: { id: string; x: number; y: number }) {
		const s = teeth[id] ?? "healthy";
		const c = statusColors[s];
		const active = selected === id;
		return (
			<g
				className="cursor-pointer"
				onClick={() => setSelected(selected === id ? null : id)}
				style={{
					transform: active ? "scale(1.08)" : "scale(1)",
					transformOrigin: `${x + 16}px ${y + 18}px`,
				}}
			>
				<path
					d={`M${x + 4},${y + 1} Q${x + 16},${y - 3} ${x + 28},${y + 1} L${x + 30},${y + 12} Q${x + 28},${y + 28} ${x + 20},${y + 32} Q${x + 16},${y + 34} ${x + 12},${y + 32} Q${x + 4},${y + 28} ${x + 2},${y + 12} Z`}
					fill={c.bg}
					opacity={s === "missing" ? 0.35 : 1}
					stroke={c.stroke}
					strokeWidth={active ? 2.5 : 1.2}
				/>
				<text
					className="font-semibold text-[10px]"
					fill="currentColor"
					opacity={s === "missing" ? 0.4 : 0.8}
					textAnchor="middle"
					x={x + 16}
					y={y + 20}
				>
					{id}
				</text>
				{s === "missing" && (
					<line
						stroke="#a1a1aa"
						strokeWidth={1.5}
						x1={x + 6}
						x2={x + 26}
						y1={y + 6}
						y2={y + 28}
					/>
				)}
			</g>
		);
	}

	return (
		<svg className="w-full" viewBox="0 0 540 120">
			<text
				className="font-medium text-[9px] tracking-widest"
				fill="#a1a1aa"
				textAnchor="middle"
				x={270}
				y={12}
			>
				UPPER
			</text>
			{upperTeeth.map((id, i) => (
				<Tooth id={id} key={id} x={14 + i * 32} y={16} />
			))}
			<line
				stroke="#e4e4e7"
				strokeDasharray="3 3"
				strokeWidth={0.5}
				x1={14}
				x2={526}
				y1={56}
				y2={56}
			/>
			{lowerTeeth.map((id, i) => (
				<Tooth id={id} key={id} x={14 + i * 32} y={62} />
			))}
			<text
				className="font-medium text-[9px] tracking-widest"
				fill="#a1a1aa"
				textAnchor="middle"
				x={270}
				y={110}
			>
				LOWER
			</text>
		</svg>
	);
}

// ── Accordion Section ──────────────────────────────────────────────────

function Panel({
	title,
	icon: Icon,
	count,
	color,
	defaultOpen = false,
	children,
}: {
	title: string;
	icon: typeof IconPill;
	count: number;
	color: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<button
				className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-muted/30"
				onClick={() => setOpen(!open)}
				type="button"
			>
				<div className="flex items-center gap-3">
					<div
						className={`flex size-9 items-center justify-center rounded-lg ${color}`}
					>
						<Icon className="size-4" />
					</div>
					<span className="font-semibold text-sm">{title}</span>
					<Badge className="text-[10px]" variant="secondary">
						{count}
					</Badge>
				</div>
				<IconChevronDown
					className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && <div className="border-t px-5 py-4">{children}</div>}
		</div>
	);
}

// ── Main Page ──────────────────────────────────────────────────────────

function EHRv6() {
	const [activeDx, setActiveDx] = useState<"all" | "dental" | "systemic">(
		"all",
	);
	const filteredDx =
		activeDx === "all"
			? diagnoses
			: diagnoses.filter((d) => d.category.toLowerCase() === activeDx);

	return (
		<div className="min-h-screen bg-background">
			{/* ── Header ──────────────────────────────────────────────────── */}
			<header className="relative overflow-hidden border-b">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02]" />
				<div className="relative mx-auto max-w-7xl px-6 py-6">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-5">
							<Button size="icon" variant="outline">
								<IconArrowLeft />
							</Button>
							<Avatar className="size-14 border-2 border-primary/20">
								<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-primary">
									AM
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex items-center gap-3">
									<h1 className="font-bold text-xl tracking-tight">
										{patient.name}
									</h1>
									<Badge variant="outline">{patient.bloodGroup}</Badge>
									{patient.allergies.map((a) => (
										<Badge
											className="text-[10px]"
											key={a}
											variant="destructive"
										>
											⚠ {a}
										</Badge>
									))}
								</div>
								<p className="text-muted-foreground text-sm">
									{patient.mrn} &middot; {patient.gender}, {patient.age} yrs
									&middot; {patient.doctor}
								</p>
								<div className="mt-1.5 flex items-center gap-4 text-muted-foreground text-xs">
									<span className="flex items-center gap-1">
										<IconCalendar /> Next: {patient.nextAppointment}
									</span>
									<span className="flex items-center gap-1">
										<IconHistory /> Last: {patient.lastVisit}
									</span>
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<Button className="gap-1.5" variant="outline">
								<IconNotes /> Export
							</Button>
							<Button className="gap-1.5">
								<IconPlus /> New Entry
							</Button>
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-6 py-6">
				<div className="grid grid-cols-12 gap-6">
					{/* ── Left: Timeline (Hx) ────────────────────────────────────── */}
					<div className="col-span-5">
						<div className="sticky top-6">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
									<IconHistory /> Visit Timeline
								</h2>
								<Button className="gap-1" size="xs" variant="ghost">
									<IconPlus /> Log
								</Button>
							</div>

							<div className="relative">
								<div className="absolute top-0 bottom-0 left-[19px] w-px bg-border" />
								<div className="space-y-1">
									{visits.map((v) => (
										<div
											className="relative flex gap-4 rounded-lg p-3 transition-colors hover:bg-muted/30"
											key={v.id}
										>
											<div className="relative z-10 mt-0.5">
												<div
													className={`flex size-10 items-center justify-center rounded-full border-2 font-bold text-xs ${v.type === "Surgery" ? "border-rose-400 bg-rose-50 text-rose-600" : v.type === "Follow-up" ? "border-amber-400 bg-amber-50 text-amber-600" : "border-primary/40 bg-primary/5 text-primary"}`}
												>
													{v.date.split("-")[2]}
												</div>
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<div>
														<div className="flex items-center gap-2">
															<p className="font-semibold text-sm">
																{v.reason}
															</p>
															<Badge className="text-[10px]" variant="outline">
																{v.type}
															</Badge>
														</div>
														<p className="text-muted-foreground text-xs">
															{v.doctor} &middot; {v.date}
														</p>
													</div>
												</div>
												<p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
													{v.summary}
												</p>
												{v.vitals && (
													<div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
														<span>
															BP:{" "}
															<span className="font-medium text-foreground">
																{v.vitals.bp}
															</span>
														</span>
														<span>
															Temp:{" "}
															<span className="font-medium text-foreground">
																{v.vitals.temp}
															</span>
														</span>
														<span>
															Pulse:{" "}
															<span className="font-medium text-foreground">
																{v.vitals.pulse}
															</span>
														</span>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* ── Right: Rx / Tx / Dx Panels ────────────────────────────── */}
					<div className="col-span-7 space-y-4">
						{/* Ongoing Treatment Banner */}
						{treatments.filter((t) => t.status === "In Progress").length >
							0 && (
							<Card className="border-primary/30">
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-base">
										<IconHeartbeat className="text-primary" /> Active Treatments
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									{treatments
										.filter((t) => t.status === "In Progress")
										.map((tx) => (
											<div
												className="flex items-center justify-between rounded-lg border p-3"
												key={tx.id}
											>
												<div className="flex items-center gap-3">
													<div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
														<IconBandage className="size-4 text-primary" />
													</div>
													<div>
														<p className="font-medium text-sm">
															{tx.procedure}
														</p>
														<p className="text-muted-foreground text-xs">
															{tx.tooth} &middot; {tx.doctor}
														</p>
													</div>
												</div>
												<Badge className="text-[10px]">{tx.status}</Badge>
											</div>
										))}
								</CardContent>
							</Card>
						)}

						{/* Tooth Chart */}
						<Card>
							<CardHeader className="pb-2">
								<div className="flex items-center gap-2">
									<IconDental className="size-4" />
									<CardTitle className="text-sm">Dental Chart</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<ToothChart />
							</CardContent>
						</Card>

						{/* Rx Panel */}
						<Panel
							color="bg-emerald-50 text-emerald-600"
							count={prescriptions.length}
							defaultOpen
							icon={IconPill}
							title="Rx — Prescriptions"
						>
							<div className="space-y-2">
								{prescriptions.map((rx) => (
									<div
										className="flex items-center justify-between rounded-lg border p-3"
										key={rx.id}
									>
										<div className="flex items-center gap-3">
											<div className="flex size-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
												<IconPill className="size-3.5" />
											</div>
											<div>
												<p className="font-medium text-sm">
													{rx.drug} {rx.dosage}
												</p>
												<p className="text-muted-foreground text-xs">
													{rx.frequency} &middot; {rx.reason}
												</p>
											</div>
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
								))}
							</div>
						</Panel>

						{/* Tx Panel */}
						<Panel
							color="bg-blue-50 text-blue-600"
							count={treatments.length}
							icon={IconStethoscope}
							title="Tx — Treatments"
						>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Procedure</TableHead>
										<TableHead>Tooth</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">Cost</TableHead>
										<TableHead>Status</TableHead>
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
											<TableCell className="text-right font-medium">
												{t.cost}
											</TableCell>
											<TableCell>
												<Badge
													className="text-[10px]"
													variant={
														t.status === "Completed" ? "secondary" : "default"
													}
												>
													{t.status}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Panel>

						{/* Dx Panel */}
						<Panel
							color="bg-amber-50 text-amber-600"
							count={diagnoses.length}
							icon={IconClipboardHeart}
							title="Dx — Diagnoses"
						>
							{/* Filter */}
							<div className="mb-3 flex gap-1">
								{(["all", "dental", "systemic"] as const).map((f) => (
									<button
										className={`rounded-md px-3 py-1 font-medium text-xs transition-colors ${activeDx === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
										key={f}
										onClick={() => setActiveDx(f)}
										type="button"
									>
										{f === "all"
											? "All"
											: f === "dental"
												? "Dental"
												: "Systemic"}
									</button>
								))}
							</div>
							<div className="space-y-2">
								{filteredDx.map((d) => (
									<div
										className="flex items-center justify-between rounded-lg border p-3"
										key={d.id}
									>
										<div>
											<p className="font-medium text-sm">{d.name}</p>
											<p className="text-muted-foreground text-xs">
												{d.code} &middot; {d.date}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge
												className="text-[10px]"
												variant={
													d.severity === "Severe" ? "destructive" : "secondary"
												}
											>
												{d.severity}
											</Badge>
											<Badge
												className="text-[10px]"
												variant={
													d.status === "Active" ? "default" : "secondary"
												}
											>
												{d.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</Panel>
					</div>
				</div>
			</div>
		</div>
	);
}
