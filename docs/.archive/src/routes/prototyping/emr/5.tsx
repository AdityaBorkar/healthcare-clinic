import {
	IconActivity,
	IconArrowLeft,
	IconBandage,
	IconClipboardHeart,
	IconDental,
	IconHeartbeat,
	IconHistory,
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

export const Route = createFileRoute("/prototyping/emr/5")({
	component: EHRv5,
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

// ── Rx: Prescriptions ──────────────────────────────────────────────────

const prescriptions = [
	{
		date: "2025-06-25",
		dosage: "500mg",
		drug: "Metformin",
		frequency: "2×/day",
		id: 1,
		reason: "Diabetes mgmt",
		route: "Oral",
		status: "Active",
	},
	{
		date: "2025-06-20",
		dosage: "500mg",
		drug: "Amoxicillin",
		frequency: "3×/day",
		id: 2,
		reason: "Post-procedure prophylaxis",
		route: "Oral",
		status: "Active",
	},
	{
		date: "2025-06-20",
		dosage: "400mg",
		drug: "Ibuprofen",
		frequency: "2×/day",
		id: 3,
		reason: "Pain management",
		route: "Oral",
		status: "Completed",
	},
	{
		date: "2025-01-10",
		dosage: "5mg",
		drug: "Amlodipine",
		frequency: "1×/day",
		id: 4,
		reason: "Hypertension",
		route: "Oral",
		status: "Active",
	},
];

// ── Tx: Treatments ─────────────────────────────────────────────────────

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

// ── Dx: Diagnoses ──────────────────────────────────────────────────────

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

// ── Hx: Visit History ──────────────────────────────────────────────────

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
		summary: "4.0 × 10mm Nobel Biocare implant placed.",
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

const statusDotClass: Record<ToothStatus, string> = {
	cavity: "bg-amber-500",
	crown: "bg-violet-500",
	healthy: "bg-emerald-500",
	implant: "bg-sky-500",
	missing: "bg-zinc-400",
	"root-canal": "bg-rose-500",
	treated: "bg-blue-500",
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
				className="cursor-pointer transition-transform"
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

	const sel = selected ? (teeth[selected] ?? "healthy") : null;

	return (
		<div>
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
			{selected && (
				<div className="mt-3 flex items-center justify-between rounded-lg border bg-card p-3">
					<div className="flex items-center gap-2">
						<span
							className={`inline-block size-3 rounded-full ${statusDotClass[sel ?? "healthy"]}`}
						/>
						<span className="font-semibold text-sm">Tooth #{selected}</span>
						<Badge className="capitalize" variant="outline">
							{(sel ?? "healthy").replace("-", " ")}
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

type TabId = "rx" | "tx" | "dx" | "hx";

function EHRv5() {
	const [activeTab, setActiveTab] = useState<TabId>("rx");

	const tabs: {
		id: TabId;
		label: string;
		full: string;
		icon: typeof IconPill;
		count: number;
		color: string;
	}[] = [
		{
			color: "text-emerald-600",
			count: prescriptions.length,
			full: "Prescriptions",
			icon: IconPill,
			id: "rx",
			label: "Rx",
		},
		{
			color: "text-blue-600",
			count: treatments.length,
			full: "Treatments",
			icon: IconStethoscope,
			id: "tx",
			label: "Tx",
		},
		{
			color: "text-amber-600",
			count: diagnoses.length,
			full: "Diagnoses",
			icon: IconClipboardHeart,
			id: "dx",
			label: "Dx",
		},
		{
			color: "text-violet-600",
			count: visits.length,
			full: "History",
			icon: IconHistory,
			id: "hx",
			label: "Hx",
		},
	];

	return (
		<div className="min-h-screen bg-zinc-50">
			{/* ── Top Bar ──────────────────────────────────────────────────── */}
			<header className="border-b bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
					<div className="flex items-center gap-4">
						<Button size="icon-sm" variant="outline">
							<IconArrowLeft />
						</Button>
						<div>
							<h1 className="font-bold text-lg tracking-tight">Patient EHR</h1>
							<p className="text-muted-foreground text-xs">{patient.mrn}</p>
						</div>
					</div>
					<div className="relative">
						<IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input className="w-64 pl-9" placeholder="Search records..." />
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-6 py-6">
				<div className="grid grid-cols-12 gap-6">
					{/* ── Left Sidebar ──────────────────────────────────────────── */}
					<aside className="col-span-3 space-y-5">
						{/* Patient Card */}
						<Card>
							<CardContent className="p-5 text-center">
								<Avatar className="mx-auto size-16">
									<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-lg text-primary">
										AM
									</AvatarFallback>
								</Avatar>
								<h2 className="mt-3 font-bold text-base">{patient.name}</h2>
								<p className="text-muted-foreground text-xs">
									{patient.gender}, {patient.age} yrs &middot;{" "}
									{patient.bloodGroup}
								</p>
								<div className="mt-3 flex flex-wrap justify-center gap-1">
									{patient.allergies.map((a) => (
										<Badge
											className="text-[10px]"
											key={a}
											variant="destructive"
										>
											⚠ {a}
										</Badge>
									))}
									{patient.conditions.map((c) => (
										<Badge className="text-[10px]" key={c} variant="secondary">
											{c}
										</Badge>
									))}
								</div>
								<Separator className="my-4" />
								<div className="space-y-1.5 text-left text-xs">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Doctor</span>
										<span className="font-medium">{patient.doctor}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Phone</span>
										<span className="font-medium">{patient.phone}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Last Visit</span>
										<span className="font-medium">{patient.lastVisit}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Next Appt</span>
										<span className="font-medium">
											{patient.nextAppointment}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 gap-2">
							{tabs.map((t) => {
								const Icon = t.icon;
								return (
									<button
										className={`rounded-lg border p-3 text-left transition-colors ${activeTab === t.id ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/50"}`}
										key={t.id}
										onClick={() => setActiveTab(t.id)}
										type="button"
									>
										<Icon className={`size-4 ${t.color}`} />
										<p className="mt-1 font-bold text-xl">{t.count}</p>
										<p className="text-[11px] text-muted-foreground">
											{t.full}
										</p>
									</button>
								);
							})}
						</div>

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
					</aside>

					{/* ── Main Content ──────────────────────────────────────────── */}
					<main className="col-span-9">
						{/* Tab Bar */}
						<div className="mb-5 flex gap-1 rounded-xl border bg-white p-1">
							{tabs.map((t) => {
								const Icon = t.icon;
								const active = activeTab === t.id;
								return (
									<button
										className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
										key={t.id}
										onClick={() => setActiveTab(t.id)}
										type="button"
									>
										<Icon className="size-4" />
										{t.label}
										<span className="text-xs opacity-70">({t.count})</span>
									</button>
								);
							})}
						</div>

						{/* Tab Content */}
						{activeTab === "rx" && <RxTab />}
						{activeTab === "tx" && <TxTab />}
						{activeTab === "dx" && <DxTab />}
						{activeTab === "hx" && <HxTab />}
					</main>
				</div>
			</div>
		</div>
	);
}

// ── Rx: Prescriptions Tab ──────────────────────────────────────────────

function RxTab() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<IconPill className="text-emerald-600" /> Prescriptions
						</CardTitle>
						<CardDescription>Active and past medications</CardDescription>
					</div>
					<Button className="gap-1.5" variant="outline">
						<IconPlus /> Prescribe
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Medication</TableHead>
							<TableHead>Dosage</TableHead>
							<TableHead>Frequency</TableHead>
							<TableHead>Route</TableHead>
							<TableHead>Indication</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{prescriptions.map((rx) => (
							<TableRow key={rx.id}>
								<TableCell className="font-medium">{rx.drug}</TableCell>
								<TableCell>{rx.dosage}</TableCell>
								<TableCell>{rx.frequency}</TableCell>
								<TableCell>{rx.route}</TableCell>
								<TableCell className="text-muted-foreground text-xs">
									{rx.reason}
								</TableCell>
								<TableCell className="text-muted-foreground text-xs">
									{rx.date}
								</TableCell>
								<TableCell>
									<Badge
										className="text-[10px]"
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

// ── Tx: Treatments Tab ─────────────────────────────────────────────────

function TxTab() {
	return (
		<div className="space-y-4">
			{/* Active treatments */}
			<Card className="border-primary/30">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<IconHeartbeat className="text-primary" /> Active Treatments
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{treatments
						.filter((t) => t.status === "In Progress")
						.map((tx) => (
							<div
								className="flex items-center justify-between rounded-xl border bg-card p-4"
								key={tx.id}
							>
								<div className="flex items-center gap-4">
									<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
										<IconBandage className="text-primary" />
									</div>
									<div>
										<p className="font-semibold text-sm">{tx.procedure}</p>
										<p className="text-muted-foreground text-xs">
											{tx.tooth} &middot; {tx.doctor} &middot; {tx.date}
										</p>
									</div>
								</div>
								<Badge>{tx.status}</Badge>
							</div>
						))}
				</CardContent>
			</Card>

			{/* All treatments */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">Treatment History</CardTitle>
						<Button className="gap-1.5" variant="outline">
							<IconPlus /> Record
						</Button>
					</div>
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
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{treatments.map((t) => (
								<TableRow key={t.id}>
									<TableCell className="font-medium">{t.procedure}</TableCell>
									<TableCell>{t.tooth}</TableCell>
									<TableCell className="text-xs">{t.doctor}</TableCell>
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
				</CardContent>
			</Card>
		</div>
	);
}

// ── Dx: Diagnoses Tab ──────────────────────────────────────────────────

function DxTab() {
	const dental = diagnoses.filter((d) => d.category === "Dental");
	const systemic = diagnoses.filter((d) => d.category === "Systemic");

	return (
		<div className="space-y-4">
			{/* Active diagnoses summary */}
			<div className="grid grid-cols-3 gap-3">
				<Card className="border-amber-200 bg-amber-50/50">
					<CardContent className="p-4 text-center">
						<p className="font-bold text-2xl text-amber-700">
							{diagnoses.filter((d) => d.status === "Active").length}
						</p>
						<p className="text-amber-600 text-xs">Active Diagnoses</p>
					</CardContent>
				</Card>
				<Card className="border-emerald-200 bg-emerald-50/50">
					<CardContent className="p-4 text-center">
						<p className="font-bold text-2xl text-emerald-700">
							{
								diagnoses.filter(
									(d) => d.status === "Treated" || d.status === "Resolved",
								).length
							}
						</p>
						<p className="text-emerald-600 text-xs">Treated / Resolved</p>
					</CardContent>
				</Card>
				<Card className="border-blue-200 bg-blue-50/50">
					<CardContent className="p-4 text-center">
						<p className="font-bold text-2xl text-blue-700">
							{diagnoses.length}
						</p>
						<p className="text-blue-600 text-xs">Total Diagnoses</p>
					</CardContent>
				</Card>
			</div>

			{/* Dental Diagnoses */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-base">
							<IconDental className="text-violet-600" /> Dental Diagnoses
						</CardTitle>
						<Button className="gap-1.5" variant="outline">
							<IconPlus /> Add
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Diagnosis</TableHead>
								<TableHead>ICD-10</TableHead>
								<TableHead>Severity</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{dental.map((d) => (
								<TableRow key={d.id}>
									<TableCell className="font-medium">{d.name}</TableCell>
									<TableCell className="font-mono text-xs">{d.code}</TableCell>
									<TableCell>
										<Badge
											className="text-[10px]"
											variant={
												d.severity === "Severe"
													? "destructive"
													: d.severity === "Moderate"
														? "secondary"
														: "outline"
											}
										>
											{d.severity}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground text-xs">
										{d.date}
									</TableCell>
									<TableCell>
										<Badge
											className="text-[10px]"
											variant={d.status === "Active" ? "default" : "secondary"}
										>
											{d.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Systemic Diagnoses */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base">
						<IconActivity className="text-rose-600" /> Systemic Conditions
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{systemic.map((d) => (
						<div
							className="flex items-center justify-between rounded-lg border p-3"
							key={d.id}
						>
							<div>
								<p className="font-semibold text-sm">{d.name}</p>
								<p className="text-muted-foreground text-xs">
									ICD-10: {d.code} &middot; Diagnosed {d.date}
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
									variant={d.status === "Active" ? "default" : "secondary"}
								>
									{d.status}
								</Badge>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

// ── Hx: Visit History Tab ──────────────────────────────────────────────

function HxTab() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="flex items-center gap-2 font-semibold text-lg">
						<IconHistory className="text-violet-600" /> Visit History
					</h3>
					<p className="text-muted-foreground text-sm">
						{visits.length} visits recorded
					</p>
				</div>
				<Button className="gap-1.5" variant="outline">
					<IconPlus /> Log Visit
				</Button>
			</div>

			<div className="relative">
				{/* Timeline line */}
				<div className="absolute top-0 bottom-0 left-[23px] w-px bg-border" />

				<div className="space-y-1">
					{visits.map((v) => (
						<div className="relative flex gap-4 pb-6" key={v.id}>
							{/* Dot */}
							<div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-zinc-50 bg-card">
								<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
									{v.date.split("-")[2]}
								</div>
							</div>
							{/* Content */}
							<Card className="flex-1">
								<CardContent className="p-4">
									<div className="flex items-start justify-between">
										<div>
											<div className="flex items-center gap-2">
												<p className="font-semibold text-sm">{v.reason}</p>
												<Badge className="text-[10px]" variant="outline">
													{v.type}
												</Badge>
											</div>
											<p className="text-muted-foreground text-xs">
												{v.doctor}
											</p>
										</div>
										<span className="text-muted-foreground text-xs">
											{v.date}
										</span>
									</div>
									<p className="mt-2 text-muted-foreground text-sm">
										{v.summary}
									</p>
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
