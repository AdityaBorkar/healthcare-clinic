import {
	IconActivity,
	IconArrowLeft,
	IconBandage,
	IconCalendar,
	IconCamera,
	IconChevronRight,
	IconClipboardHeart,
	IconDental,
	IconMicroscope,
	IconNotes,
	IconPill,
	IconPlus,
	IconSearch,
	IconStethoscope,
	IconX,
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

export const Route = createFileRoute("/prototyping/emr/3")({
	component: MedicalRecordsV3,
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

const ongoingTreatments = [
	{
		daysRemaining: 17,
		doctor: "Dr. Rakesh N.",
		id: 1,
		nextAction: "Impression — Jul 15",
		phase: "Osseointegration",
		startDate: "2025-05-20",
		title: "Implant Restoration — #36",
	},
	{
		daysRemaining: 5,
		doctor: "Dr. Sunita P.",
		id: 2,
		nextAction: "Crown fitting — Jul 08",
		phase: "Impression Taken",
		startDate: "2025-06-20",
		title: "Crown Replacement — #27",
	},
];

const prescriptions = [
	{
		date: "2025-06-25",
		dosage: "1 tab × 2/day",
		drug: "Metformin 500mg",
		duration: "Ongoing",
		id: 1,
		status: "Active",
	},
	{
		date: "2025-06-20",
		dosage: "1 cap × 3/day",
		drug: "Amoxicillin 500mg",
		duration: "5 days",
		id: 2,
		status: "Active",
	},
	{
		date: "2025-06-20",
		dosage: "1 tab × 2/day",
		drug: "Ibuprofen 400mg",
		duration: "3 days",
		id: 3,
		status: "Active",
	},
	{
		date: "2025-01-10",
		dosage: "1 tab × 1/day",
		drug: "Amlodipine 5mg",
		duration: "Ongoing",
		id: 4,
		status: "Active",
	},
];

const treatments = [
	{
		cost: "₹35,000",
		date: "2025-05-20",
		id: 1,
		procedure: "Implant Placement",
		status: "In Progress",
		tooth: "#36",
	},
	{
		cost: "₹12,000",
		date: "2025-06-20",
		id: 2,
		procedure: "Crown Preparation",
		status: "In Progress",
		tooth: "#27",
	},
	{
		cost: "₹8,000",
		date: "2025-04-10",
		id: 3,
		procedure: "Root Canal",
		status: "Completed",
		tooth: "#26",
	},
	{
		cost: "₹2,500",
		date: "2025-03-15",
		id: 4,
		procedure: "Composite Filling",
		status: "Completed",
		tooth: "#15",
	},
	{
		cost: "₹2,000",
		date: "2025-02-28",
		id: 5,
		procedure: "Extraction",
		status: "Completed",
		tooth: "#28",
	},
];

const scans = [
	{
		date: "2025-05-18",
		id: 1,
		region: "Full mouth",
		status: "Reviewed",
		type: "OPG",
	},
	{
		date: "2025-05-18",
		id: 2,
		region: "Lower right quadrant",
		status: "Reviewed",
		type: "CBCT",
	},
	{
		date: "2025-04-10",
		id: 3,
		region: "#26",
		status: "Reviewed",
		type: "Periapical X-Ray",
	},
	{
		date: "2025-03-15",
		id: 4,
		region: "Upper left",
		status: "Reviewed",
		type: "Bitewing",
	},
];

const investigations = [
	{
		date: "2025-05-15",
		id: 1,
		result: "6.8%",
		status: "Borderline",
		test: "HbA1c",
	},
	{
		date: "2025-05-15",
		id: 2,
		result: "118 mg/dL",
		status: "High",
		test: "Fasting Glucose",
	},
	{
		date: "2025-06-25",
		id: 3,
		result: "130/85 mmHg",
		status: "Controlled",
		test: "BP Reading",
	},
	{
		date: "2025-05-15",
		id: 4,
		result: "Normal",
		status: "Normal",
		test: "CBC",
	},
	{
		date: "2025-05-15",
		id: 5,
		result: "1.1",
		status: "Normal",
		test: "PT/INR",
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
	},
	{
		date: "2025-06-20",
		doctor: "Dr. Sunita P.",
		id: 2,
		reason: "Crown prep — #27",
		summary: "Tooth prepared for PFM crown. Shade matched.",
		type: "Procedure",
	},
	{
		date: "2025-05-20",
		doctor: "Dr. Rakesh N.",
		id: 3,
		reason: "Implant placement — #36",
		summary: "4.0 × 10mm Nobel Biocare implant placed. Uneventful surgery.",
		type: "Surgery",
	},
	{
		date: "2025-04-10",
		doctor: "Dr. Rakesh N.",
		id: 4,
		reason: "Root canal — #26",
		summary: "3 canal RCT completed. Post-op X-ray satisfactory.",
		type: "Procedure",
	},
	{
		date: "2025-03-15",
		doctor: "Dr. Rakesh N.",
		id: 5,
		reason: "Filling — #15",
		summary: "MOD composite restoration. Adjusted occlusion.",
		type: "Procedure",
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

const statusLabels: Record<ToothStatus, string> = {
	cavity: "Cavity",
	crown: "Crown",
	healthy: "Healthy",
	implant: "Implant",
	missing: "Missing",
	"root-canal": "Root Canal",
	treated: "Treated",
};

const statusDotClass: Record<ToothStatus, string> = {
	cavity: "bg-amber-500",
	crown: "bg-violet-500",
	healthy: "bg-emerald-500",
	implant: "bg-sky-500",
	missing: "bg-zinc-400",
	"root-canal": "bg-rose-500",
	treated: "bg-blue-500",
};

function ToothChart() {
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);

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

	function ToothShape({ id, x, y }: { id: string; x: number; y: number }) {
		const status = teeth[id] ?? "healthy";
		const colors = statusColors[status];
		const isActive = selected === id || hovered === id;

		return (
			<g
				className="cursor-pointer transition-transform"
				onClick={() => setSelected(selected === id ? null : id)}
				onMouseEnter={() => setHovered(id)}
				onMouseLeave={() => setHovered(null)}
				style={{
					transform: isActive ? "scale(1.08)" : "scale(1)",
					transformOrigin: `${x + 16}px ${y + 18}px`,
				}}
			>
				<path
					d={`M${x + 4},${y + 1} Q${x + 16},${y - 3} ${x + 28},${y + 1} L${x + 30},${y + 12} Q${x + 28},${y + 28} ${x + 20},${y + 32} Q${x + 16},${y + 34} ${x + 12},${y + 32} Q${x + 4},${y + 28} ${x + 2},${y + 12} Z`}
					fill={colors.bg}
					opacity={status === "missing" ? 0.35 : 1}
					stroke={isActive ? colors.stroke : colors.stroke}
					strokeWidth={isActive ? 2.5 : 1.2}
				/>
				<text
					className="font-semibold text-[10px]"
					fill="currentColor"
					opacity={status === "missing" ? 0.4 : 0.8}
					textAnchor="middle"
					x={x + 16}
					y={y + 20}
				>
					{id}
				</text>
				{status === "missing" && (
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

	const selectedStatus = selected ? (teeth[selected] ?? "healthy") : null;

	return (
		<div>
			<svg className="w-full" viewBox="0 0 540 120">
				{/* Upper */}
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
					<ToothShape id={id} key={id} x={14 + i * 32} y={16} />
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
				{/* Lower */}
				{lowerTeeth.map((id, i) => (
					<ToothShape id={id} key={id} x={14 + i * 32} y={62} />
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

			{/* Legend */}
			<div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
				{(Object.keys(statusColors) as ToothStatus[]).map((s) => (
					<div className="flex items-center gap-1 text-[11px]" key={s}>
						<span
							className={`inline-block size-2 rounded-full ${statusDotClass[s]}`}
						/>
						<span className="text-muted-foreground">{statusLabels[s]}</span>
					</div>
				))}
			</div>

			{/* Selected tooth info */}
			{selected && (
				<div className="mt-3 flex items-center justify-between rounded-lg border bg-card p-3">
					<div className="flex items-center gap-2">
						<span
							className={`inline-block size-3 rounded-full ${statusDotClass[selectedStatus ?? "healthy"]}`}
						/>
						<span className="font-semibold text-sm">Tooth #{selected}</span>
						<Badge className="capitalize" variant="outline">
							{(selectedStatus ?? "healthy").replace("-", " ")}
						</Badge>
					</div>
					<Button onClick={() => setSelected(null)} size="xs" variant="ghost">
						<IconX />
					</Button>
				</div>
			)}
		</div>
	);
}

// ── Main Page ──────────────────────────────────────────────────────────

function MedicalRecordsV3() {
	const [activeView, setActiveView] = useState<
		| "overview"
		| "prescriptions"
		| "treatments"
		| "scans"
		| "investigations"
		| "visits"
	>("overview");

	const navItems = [
		{ icon: IconActivity, id: "overview" as const, label: "Overview" },
		{ icon: IconPill, id: "prescriptions" as const, label: "Prescriptions" },
		{ icon: IconStethoscope, id: "treatments" as const, label: "Treatments" },
		{ icon: IconCamera, id: "scans" as const, label: "Scans & Imaging" },
		{
			icon: IconMicroscope,
			id: "investigations" as const,
			label: "Investigations",
		},
		{ icon: IconClipboardHeart, id: "visits" as const, label: "Visit History" },
	];

	return (
		<div className="min-h-screen bg-zinc-50">
			{/* ── Header ──────────────────────────────────────────────────── */}
			<header className="border-b bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-4">
						<Button size="icon-sm" variant="outline">
							<IconArrowLeft />
						</Button>
						<div>
							<h1 className="font-bold text-xl tracking-tight">
								Medical Records
							</h1>
							<p className="text-muted-foreground text-sm">{patient.mrn}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="relative">
							<IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								className="w-64 pl-9"
								placeholder="Search all records..."
							/>
						</div>
						<Button className="gap-1.5" variant="outline">
							<IconPlus />
							New Entry
						</Button>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-6 py-6">
				{/* ── Patient Banner ────────────────────────────────────────── */}
				<Card className="mb-6 overflow-hidden">
					<CardContent className="p-0">
						<div className="flex">
							{/* Patient info */}
							<div className="flex flex-1 items-center gap-5 p-5">
								<Avatar className="size-16">
									<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-lg text-primary">
										AM
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<h2 className="font-bold text-lg">{patient.name}</h2>
										<Badge variant="outline">
											{patient.gender}, {patient.age}y
										</Badge>
										<Badge variant="outline">{patient.bloodGroup}</Badge>
									</div>
									<p className="mt-0.5 text-muted-foreground text-sm">
										{patient.email} &middot; {patient.phone}
									</p>
									<div className="mt-2 flex items-center gap-3 text-muted-foreground text-xs">
										<span className="flex items-center gap-1">
											<IconStethoscope /> Dr. {patient.doctor}
										</span>
										<span className="flex items-center gap-1">
											<IconCalendar /> Next: {patient.nextAppointment}
										</span>
									</div>
								</div>
							</div>

							{/* Quick stats */}
							<div className="flex divide-x border-l">
								<div className="flex flex-col items-center justify-center px-6 py-4">
									<span className="font-bold text-2xl text-primary">
										{patient.totalVisits}
									</span>
									<span className="text-muted-foreground text-xs">
										Total Visits
									</span>
								</div>
								<div className="flex flex-col items-center justify-center px-6 py-4">
									<span className="font-bold text-2xl text-amber-600">
										{patient.activeTreatments}
									</span>
									<span className="text-muted-foreground text-xs">
										Active Tx
									</span>
								</div>
								<div className="flex flex-col items-center justify-center px-6 py-4">
									<span className="font-bold text-2xl text-emerald-600">
										{patient.allergies.length}
									</span>
									<span className="text-muted-foreground text-xs">
										Allergies
									</span>
								</div>
							</div>
						</div>

						{/* Allergies & conditions bar */}
						{(patient.allergies.length > 0 ||
							patient.conditions.length > 0) && (
							<div className="flex items-center gap-4 border-t bg-muted/30 px-5 py-2 text-xs">
								{patient.allergies.length > 0 && (
									<div className="flex items-center gap-1.5">
										<span className="font-medium text-destructive">
											Allergies:
										</span>
										{patient.allergies.map((a) => (
											<Badge
												className="text-[10px]"
												key={a}
												variant="destructive"
											>
												{a}
											</Badge>
										))}
									</div>
								)}
								<Separator className="h-4" orientation="vertical" />
								{patient.conditions.length > 0 && (
									<div className="flex items-center gap-1.5">
										<span className="font-medium text-amber-700">
											Conditions:
										</span>
										{patient.conditions.map((c) => (
											<Badge
												className="text-[10px]"
												key={c}
												variant="secondary"
											>
												{c}
											</Badge>
										))}
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				<div className="flex gap-6">
					{/* ── Side Navigation ─────────────────────────────────────── */}
					<nav className="w-48 shrink-0">
						<div className="sticky top-6 space-y-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = activeView === item.id;
								return (
									<button
										className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors ${
											isActive
												? "bg-primary text-primary-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground"
										}`}
										key={item.id}
										onClick={() => setActiveView(item.id)}
										type="button"
									>
										<Icon />
										{item.label}
									</button>
								);
							})}
						</div>
					</nav>

					{/* ── Content Area ────────────────────────────────────────── */}
					<div className="min-w-0 flex-1">
						{activeView === "overview" && <OverviewView />}
						{activeView === "prescriptions" && <PrescriptionsView />}
						{activeView === "treatments" && <TreatmentsView />}
						{activeView === "scans" && <ScansView />}
						{activeView === "investigations" && <InvestigationsView />}
						{activeView === "visits" && <VisitsView />}
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Overview (Bento Grid) ──────────────────────────────────────────────

function OverviewView() {
	return (
		<div className="grid grid-cols-12 gap-4">
			{/* Tooth Chart — full width */}
			<Card className="col-span-12">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<IconDental />
							<CardTitle className="text-base">Tooth Chart</CardTitle>
						</div>
						<Button className="gap-1" size="xs" variant="outline">
							<IconNotes />
							Edit Chart
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ToothChart />
				</CardContent>
			</Card>

			{/* Ongoing Treatments — 8 cols */}
			<Card className="col-span-8">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-base">Ongoing Treatments</CardTitle>
							<CardDescription>
								{ongoingTreatments.length} active treatments
							</CardDescription>
						</div>
						<Badge variant="secondary">{ongoingTreatments.length}</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-3">
					{ongoingTreatments.map((tx) => (
						<div
							className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
							key={tx.id}
						>
							<div className="flex items-center gap-4">
								<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
									<IconBandage className="text-primary" />
								</div>
								<div>
									<p className="font-semibold text-sm">{tx.title}</p>
									<p className="text-muted-foreground text-xs">
										{tx.phase} &middot; {tx.doctor}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-right">
									<p className="text-muted-foreground text-xs">Next action</p>
									<p className="font-medium text-sm">{tx.nextAction}</p>
								</div>
								<div className="flex size-10 items-center justify-center rounded-full bg-amber-50 text-amber-700">
									<span className="font-bold text-sm">{tx.daysRemaining}d</span>
								</div>
								<IconChevronRight className="text-muted-foreground" />
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Recent Visits — 4 cols */}
			<Card className="col-span-4">
				<CardHeader>
					<CardTitle className="text-base">Recent Visits</CardTitle>
					<CardDescription>Last 3 visits</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{visits.slice(0, 3).map((v) => (
						<div className="rounded-lg border p-3" key={v.id}>
							<div className="flex items-center justify-between">
								<Badge className="text-[10px]" variant="outline">
									{v.type}
								</Badge>
								<span className="text-muted-foreground text-xs">{v.date}</span>
							</div>
							<p className="mt-1.5 font-medium text-sm">{v.reason}</p>
							<p className="line-clamp-2 text-muted-foreground text-xs">
								{v.summary}
							</p>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Prescriptions — 6 cols */}
			<Card className="col-span-6">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-base">Active Prescriptions</CardTitle>
							<CardDescription>Currently active medications</CardDescription>
						</div>
						<Badge variant="default">
							{prescriptions.filter((p) => p.status === "Active").length}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-2">
					{prescriptions
						.filter((p) => p.status === "Active")
						.map((rx) => (
							<div
								className="flex items-center gap-3 rounded-lg border p-3"
								key={rx.id}
							>
								<div className="flex size-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
									<IconPill />
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium text-sm">{rx.drug}</p>
									<p className="text-muted-foreground text-xs">
										{rx.dosage} &middot; {rx.duration}
									</p>
								</div>
							</div>
						))}
				</CardContent>
			</Card>

			{/* Lab Results — 6 cols */}
			<Card className="col-span-6">
				<CardHeader>
					<CardTitle className="text-base">Lab Results</CardTitle>
					<CardDescription>Recent investigations</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					{investigations.map((inv) => (
						<div
							className="flex items-center justify-between rounded-lg border p-3"
							key={inv.id}
						>
							<div>
								<p className="font-medium text-sm">{inv.test}</p>
								<p className="text-muted-foreground text-xs">{inv.date}</p>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-sm">{inv.result}</span>
								<Badge
									className="text-[10px]"
									variant={
										inv.status === "Normal"
											? "secondary"
											: inv.status === "High"
												? "destructive"
												: "outline"
									}
								>
									{inv.status}
								</Badge>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

// ── Prescriptions View ─────────────────────────────────────────────────

function PrescriptionsView() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>All Prescriptions</CardTitle>
						<CardDescription>Complete medication history</CardDescription>
					</div>
					<Button className="gap-1.5" variant="outline">
						<IconPlus />
						Add Prescription
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Medication</TableHead>
							<TableHead>Dosage</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Prescribed</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{prescriptions.map((rx) => (
							<TableRow key={rx.id}>
								<TableCell className="font-medium">{rx.drug}</TableCell>
								<TableCell>{rx.dosage}</TableCell>
								<TableCell>{rx.duration}</TableCell>
								<TableCell className="text-muted-foreground">
									{rx.date}
								</TableCell>
								<TableCell>
									<Badge
										variant={rx.status === "Active" ? "default" : "secondary"}
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
	);
}

// ── Treatments View ────────────────────────────────────────────────────

function TreatmentsView() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Treatment History</CardTitle>
						<CardDescription>All procedures and dental work</CardDescription>
					</div>
					<Button className="gap-1.5" variant="outline">
						<IconPlus />
						Record Treatment
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
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
								<TableCell className="font-medium">{t.procedure}</TableCell>
								<TableCell>{t.tooth}</TableCell>
								<TableCell className="text-muted-foreground">
									{t.date}
								</TableCell>
								<TableCell className="text-right font-medium">
									{t.cost}
								</TableCell>
								<TableCell>
									<Badge
										variant={t.status === "Completed" ? "secondary" : "default"}
									>
										{t.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// ── Scans View ─────────────────────────────────────────────────────────

function ScansView() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-lg">Scans &amp; Imaging</h3>
					<p className="text-muted-foreground text-sm">
						{scans.length} imaging studies
					</p>
				</div>
				<Button className="gap-1.5" variant="outline">
					<IconPlus />
					Upload Scan
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				{scans.map((scan) => (
					<Card
						className="group cursor-pointer transition-shadow hover:shadow-md"
						key={scan.id}
					>
						<CardContent className="p-0">
							{/* Placeholder scan preview */}
							<div className="flex h-40 items-center justify-center rounded-t-lg bg-gradient-to-br from-zinc-100 to-zinc-200">
								<IconCamera className="size-12 text-zinc-400" />
							</div>
							<div className="p-4">
								<div className="flex items-start justify-between">
									<div>
										<p className="font-semibold text-sm">{scan.type}</p>
										<p className="text-muted-foreground text-xs">
											{scan.region}
										</p>
									</div>
									<Badge className="text-[10px]" variant="outline">
										{scan.status}
									</Badge>
								</div>
								<Separator className="my-3" />
								<div className="flex items-center justify-between text-muted-foreground text-xs">
									<span>{scan.date}</span>
									<Button
										className="h-6 gap-1 opacity-0 transition-opacity group-hover:opacity-100"
										size="xs"
										variant="ghost"
									>
										View
										<IconChevronRight />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

// ── Investigations View ────────────────────────────────────────────────

function InvestigationsView() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Lab Investigations</CardTitle>
						<CardDescription>
							Pre-procedure and routine lab results
						</CardDescription>
					</div>
					<Button className="gap-1.5" variant="outline">
						<IconPlus />
						Order Test
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
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
								<TableCell className="font-medium">{inv.test}</TableCell>
								<TableCell className="text-muted-foreground">
									{inv.date}
								</TableCell>
								<TableCell className="font-medium">{inv.result}</TableCell>
								<TableCell>
									<Badge
										variant={
											inv.status === "Normal"
												? "secondary"
												: inv.status === "High"
													? "destructive"
													: "outline"
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
	);
}

// ── Visits View ────────────────────────────────────────────────────────

function VisitsView() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-lg">Visit History</h3>
					<p className="text-muted-foreground text-sm">
						{visits.length} visits recorded
					</p>
				</div>
				<Button className="gap-1.5" variant="outline">
					<IconPlus />
					Log Visit
				</Button>
			</div>

			<div className="relative space-y-0">
				{/* Timeline line */}
				<div className="absolute top-0 bottom-0 left-[23px] w-px bg-border" />

				{visits.map((visit) => (
					<div className="relative flex gap-4 pb-6" key={visit.id}>
						{/* Dot */}
						<div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-zinc-50 bg-card">
							<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
								{visit.date.split("-")[2]}
							</div>
						</div>

						{/* Content */}
						<Card className="flex-1">
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-2">
											<p className="font-semibold text-sm">{visit.reason}</p>
											<Badge className="text-[10px]" variant="outline">
												{visit.type}
											</Badge>
										</div>
										<p className="mt-0.5 text-muted-foreground text-xs">
											{visit.doctor}
										</p>
									</div>
									<span className="text-muted-foreground text-xs">
										{visit.date}
									</span>
								</div>
								<p className="mt-2 text-muted-foreground text-sm">
									{visit.summary}
								</p>
							</CardContent>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
}
