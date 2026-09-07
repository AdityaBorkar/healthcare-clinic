import {
	IconArrowLeft,
	IconBandage,
	IconCheck,
	IconChevronRight,
	IconClipboardHeart,
	IconDental,
	IconDownload,
	IconHistory,
	IconNotes,
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
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

export const Route = createFileRoute("/prototyping/emr/7")({
	component: EHRv7,
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
			<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
				{(Object.keys(statusColors) as ToothStatus[]).map((s) => (
					<div className="flex items-center gap-1 text-[10px]" key={s}>
						<span
							className={`inline-block size-1.5 rounded-full ${statusDotClass[s]}`}
						/>
						<span className="text-muted-foreground">{statusLabels[s]}</span>
					</div>
				))}
			</div>
			{selected && (
				<div className="mt-2 flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
					<div className="flex items-center gap-2">
						<span
							className={`inline-block size-2.5 rounded-full ${statusDotClass[sel ?? "healthy"]}`}
						/>
						<span className="font-semibold">#{selected}</span>
						<Badge className="text-[10px] capitalize" variant="outline">
							{(sel ?? "healthy").replace("-", " ")}
						</Badge>
					</div>
					<Button
						className="size-5"
						onClick={() => setSelected(null)}
						size="xs"
						variant="ghost"
					>
						<IconX className="size-3" />
					</Button>
				</div>
			)}
		</div>
	);
}

// ── Section Card Header ────────────────────────────────────────────────

function SectionHead({
	icon: Icon,
	label,
	abbr,
	count,
	color,
	onExpand,
}: {
	icon: typeof IconPill;
	label: string;
	abbr: string;
	count: number;
	color: string;
	onExpand?: () => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2.5">
				<div
					className={`flex size-8 items-center justify-center rounded-lg ${color}`}
				>
					<Icon className="size-4" />
				</div>
				<div>
					<p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
						{abbr}
					</p>
					<p className="font-semibold text-sm">{label}</p>
				</div>
				<Badge className="ml-1 text-[10px]" variant="secondary">
					{count}
				</Badge>
			</div>
			{onExpand && (
				<Button
					className="gap-0.5 text-muted-foreground"
					onClick={onExpand}
					size="xs"
					variant="ghost"
				>
					View all <IconChevronRight className="size-3" />
				</Button>
			)}
		</div>
	);
}

// ── Expanded Modal Overlay ─────────────────────────────────────────────

function ExpandedView({
	title,
	onClose,
	children,
}: {
	title: string;
	onClose: () => void;
	children: React.ReactNode;
}) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8"
			onClick={onClose}
		>
			<div
				className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl border bg-background shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
					<h2 className="font-bold text-lg">{title}</h2>
					<Button onClick={onClose} size="icon-sm" variant="outline">
						<IconX />
					</Button>
				</div>
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}

// ── Main Page ──────────────────────────────────────────────────────────

function EHRv7() {
	const [expanded, setExpanded] = useState<"rx" | "tx" | "dx" | "hx" | null>(
		null,
	);

	return (
		<div className="min-h-screen bg-zinc-50">
			{/* ── Header ──────────────────────────────────────────────────── */}
			<header className="border-b bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-4">
						<Button size="icon-sm" variant="outline">
							<IconArrowLeft />
						</Button>
						<Avatar className="size-12">
							<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-primary">
								AM
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="font-bold text-lg tracking-tight">
									{patient.name}
								</h1>
								<Badge className="text-[10px]" variant="outline">
									{patient.gender}, {patient.age}y
								</Badge>
								<Badge className="text-[10px]" variant="outline">
									{patient.bloodGroup}
								</Badge>
								{patient.allergies.map((a) => (
									<Badge className="text-[10px]" key={a} variant="destructive">
										⚠ {a}
									</Badge>
								))}
							</div>
							<p className="text-muted-foreground text-xs">
								{patient.mrn} &middot; {patient.doctor} &middot; Next:{" "}
								{patient.nextAppointment}
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button className="gap-1.5" size="sm" variant="outline">
							<IconDownload /> Export
						</Button>
						<Button className="gap-1.5" size="sm">
							<IconPlus /> New
						</Button>
					</div>
				</div>
			</header>

			{/* ── Bento Grid ──────────────────────────────────────────────── */}
			<main className="mx-auto max-w-7xl px-6 py-6">
				<div className="grid grid-cols-12 gap-4">
					{/* Row 1: Tooth Chart (full width) */}
					<Card className="col-span-12">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<IconDental className="size-4" />
									<CardTitle className="text-sm">Dental Chart</CardTitle>
								</div>
								<Button className="gap-1" size="xs" variant="outline">
									<IconNotes /> Edit
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<ToothChart />
						</CardContent>
					</Card>

					{/* Row 2: Rx (6 cols) + Dx (6 cols) */}
					<Card className="col-span-6">
						<CardHeader className="pb-3">
							<SectionHead
								abbr="Rx"
								color="bg-emerald-50 text-emerald-600"
								count={prescriptions.length}
								icon={IconPill}
								label="Prescriptions"
								onExpand={() => setExpanded("rx")}
							/>
						</CardHeader>
						<CardContent className="space-y-2">
							{prescriptions.slice(0, 3).map((rx) => (
								<div
									className="flex items-center justify-between rounded-lg border p-2.5"
									key={rx.id}
								>
									<div className="flex items-center gap-2.5">
										<div className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
											<IconPill className="size-3" />
										</div>
										<div>
											<p className="font-medium text-xs">
												{rx.drug} {rx.dosage}
											</p>
											<p className="text-[11px] text-muted-foreground">
												{rx.frequency}
											</p>
										</div>
									</div>
									<Badge
										className="text-[10px]"
										variant={rx.status === "Active" ? "default" : "secondary"}
									>
										{rx.status}
									</Badge>
								</div>
							))}
							{prescriptions.length > 3 && (
								<p className="text-center text-muted-foreground text-xs">
									+{prescriptions.length - 3} more
								</p>
							)}
						</CardContent>
					</Card>

					<Card className="col-span-6">
						<CardHeader className="pb-3">
							<SectionHead
								abbr="Dx"
								color="bg-amber-50 text-amber-600"
								count={diagnoses.length}
								icon={IconClipboardHeart}
								label="Diagnoses"
								onExpand={() => setExpanded("dx")}
							/>
						</CardHeader>
						<CardContent className="space-y-2">
							{diagnoses
								.filter((d) => d.status === "Active")
								.map((d) => (
									<div
										className="flex items-center justify-between rounded-lg border p-2.5"
										key={d.id}
									>
										<div>
											<p className="font-medium text-xs">{d.name}</p>
											<p className="text-[11px] text-muted-foreground">
												{d.code} &middot; {d.category}
											</p>
										</div>
										<div className="flex items-center gap-1.5">
											<Badge
												className="text-[10px]"
												variant={
													d.severity === "Severe" ? "destructive" : "secondary"
												}
											>
												{d.severity}
											</Badge>
											<Badge className="text-[10px]" variant="default">
												{d.status}
											</Badge>
										</div>
									</div>
								))}
							{diagnoses.filter((d) => d.status === "Active").length <
								diagnoses.length && (
								<p className="text-center text-muted-foreground text-xs">
									+
									{diagnoses.length -
										diagnoses.filter((d) => d.status === "Active").length}{" "}
									resolved/treated
								</p>
							)}
						</CardContent>
					</Card>

					{/* Row 3: Tx (8 cols) + Quick Stats (4 cols) */}
					<Card className="col-span-8">
						<CardHeader className="pb-3">
							<SectionHead
								abbr="Tx"
								color="bg-blue-50 text-blue-600"
								count={treatments.length}
								icon={IconStethoscope}
								label="Treatments"
								onExpand={() => setExpanded("tx")}
							/>
						</CardHeader>
						<CardContent className="space-y-2">
							{/* Active treatments */}
							{treatments
								.filter((t) => t.status === "In Progress")
								.map((tx) => (
									<div
										className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/[0.02] p-3"
										key={tx.id}
									>
										<div className="flex items-center gap-3">
											<div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
												<IconBandage className="size-4 text-primary" />
											</div>
											<div>
												<p className="font-semibold text-sm">{tx.procedure}</p>
												<p className="text-muted-foreground text-xs">
													{tx.tooth} &middot; {tx.doctor} &middot; {tx.date}
												</p>
											</div>
										</div>
										<Badge className="text-[10px]">{tx.status}</Badge>
									</div>
								))}
							{/* Recent completed */}
							{treatments
								.filter((t) => t.status === "Completed")
								.slice(0, 2)
								.map((t) => (
									<div
										className="flex items-center justify-between rounded-lg border p-3 opacity-70"
										key={t.id}
									>
										<div className="flex items-center gap-3">
											<div className="flex size-9 items-center justify-center rounded-lg bg-muted">
												<IconCheck className="size-4 text-muted-foreground" />
											</div>
											<div>
												<p className="font-medium text-sm">{t.procedure}</p>
												<p className="text-muted-foreground text-xs">
													{t.tooth} &middot; {t.date}
												</p>
											</div>
										</div>
										<span className="font-medium text-sm">{t.cost}</span>
									</div>
								))}
						</CardContent>
					</Card>

					<div className="col-span-4 space-y-4">
						{/* Quick stats */}
						<div className="grid grid-cols-2 gap-2">
							<div className="rounded-lg border bg-card p-3 text-center">
								<p className="font-bold text-2xl text-primary">
									{patient.totalVisits}
								</p>
								<p className="text-[11px] text-muted-foreground">Visits</p>
							</div>
							<div className="rounded-lg border bg-card p-3 text-center">
								<p className="font-bold text-2xl text-blue-600">
									{treatments.length}
								</p>
								<p className="text-[11px] text-muted-foreground">Procedures</p>
							</div>
							<div className="rounded-lg border bg-card p-3 text-center">
								<p className="font-bold text-2xl text-amber-600">
									{diagnoses.filter((d) => d.status === "Active").length}
								</p>
								<p className="text-[11px] text-muted-foreground">Active Dx</p>
							</div>
							<div className="rounded-lg border bg-card p-3 text-center">
								<p className="font-bold text-2xl text-emerald-600">
									{prescriptions.filter((r) => r.status === "Active").length}
								</p>
								<p className="text-[11px] text-muted-foreground">Active Rx</p>
							</div>
						</div>

						{/* Conditions */}
						{patient.conditions.length > 0 && (
							<div className="rounded-lg border bg-card p-3">
								<p className="mb-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
									Conditions
								</p>
								<div className="flex flex-wrap gap-1">
									{patient.conditions.map((c) => (
										<Badge className="text-[10px]" key={c} variant="secondary">
											{c}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Row 4: Hx (full width) */}
					<Card className="col-span-12">
						<CardHeader className="pb-3">
							<SectionHead
								abbr="Hx"
								color="bg-violet-50 text-violet-600"
								count={visits.length}
								icon={IconHistory}
								label="Visit History"
								onExpand={() => setExpanded("hx")}
							/>
						</CardHeader>
						<CardContent>
							<div className="relative">
								<div className="absolute top-0 bottom-0 left-[19px] w-px bg-border" />
								<div className="flex gap-0 overflow-x-auto pb-2">
									{visits.map((v) => (
										<div
											className="relative flex min-w-[240px] shrink-0 gap-3 p-3"
											key={v.id}
										>
											<div className="relative z-10 mt-0.5">
												<div
													className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-bold text-xs ${v.type === "Surgery" ? "border-rose-400 bg-rose-50 text-rose-600" : v.type === "Follow-up" ? "border-amber-400 bg-amber-50 text-amber-600" : "border-primary/40 bg-primary/5 text-primary"}`}
												>
													{v.date.split("-")[2]}
												</div>
											</div>
											<div className="min-w-0">
												<div className="flex items-center gap-1.5">
													<p className="truncate font-semibold text-xs">
														{v.reason}
													</p>
													<Badge
														className="shrink-0 text-[10px]"
														variant="outline"
													>
														{v.type}
													</Badge>
												</div>
												<p className="text-[11px] text-muted-foreground">
													{v.doctor} &middot; {v.date}
												</p>
												<p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
													{v.summary}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>

			{/* ── Expanded Views ──────────────────────────────────────────── */}
			{expanded === "rx" && (
				<ExpandedView
					onClose={() => setExpanded(null)}
					title="Rx — All Prescriptions"
				>
					<div className="space-y-2">
						{prescriptions.map((rx) => (
							<div
								className="flex items-center justify-between rounded-lg border p-4"
								key={rx.id}
							>
								<div className="flex items-center gap-3">
									<div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
										<IconPill />
									</div>
									<div>
										<p className="font-semibold text-sm">
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
										variant={rx.status === "Active" ? "default" : "secondary"}
									>
										{rx.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</ExpandedView>
			)}
			{expanded === "tx" && (
				<ExpandedView
					onClose={() => setExpanded(null)}
					title="Tx — All Treatments"
				>
					<div className="space-y-2">
						{treatments.map((t) => (
							<div
								className="flex items-center justify-between rounded-lg border p-4"
								key={t.id}
							>
								<div className="flex items-center gap-3">
									<div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
										<IconBandage />
									</div>
									<div>
										<p className="font-semibold text-sm">{t.procedure}</p>
										<p className="text-muted-foreground text-xs">
											{t.tooth} &middot; {t.doctor} &middot; {t.date}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm">{t.cost}</span>
									<Badge
										className="text-[10px]"
										variant={t.status === "Completed" ? "secondary" : "default"}
									>
										{t.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</ExpandedView>
			)}
			{expanded === "dx" && (
				<ExpandedView
					onClose={() => setExpanded(null)}
					title="Dx — All Diagnoses"
				>
					<div className="space-y-2">
						{diagnoses.map((d) => (
							<div
								className="flex items-center justify-between rounded-lg border p-4"
								key={d.id}
							>
								<div>
									<p className="font-semibold text-sm">{d.name}</p>
									<p className="text-muted-foreground text-xs">
										ICD-10: {d.code} &middot; {d.category} &middot; {d.date}
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
					</div>
				</ExpandedView>
			)}
			{expanded === "hx" && (
				<ExpandedView
					onClose={() => setExpanded(null)}
					title="Hx — Full Visit History"
				>
					<div className="relative">
						<div className="absolute top-0 bottom-0 left-[23px] w-px bg-border" />
						<div className="space-y-1">
							{visits.map((v) => (
								<div className="relative flex gap-4 p-3" key={v.id}>
									<div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-card">
										<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
											{v.date.split("-")[2]}
										</div>
									</div>
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
				</ExpandedView>
			)}
		</div>
	);
}
