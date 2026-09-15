import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { BranchSelector } from "#/components/branch-selector";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useBranch } from "#/lib/branch-store";
import { printPage } from "#/lib/export";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/facilities-map")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Service = { code: string; id: string; name: string };
type Facility = { category: string; id: string; name: string; status: string };

type BackendCategory =
	| "consultation"
	| "diagnostics"
	| "pharmacy"
	| "procedure"
	| "support"
	| "tele"
	| "ward";

// Extended OPD/clinic categories map to the closest backend-supported bucket
// (the Aspen FacilityCategory picklist only accepts the 7 values above).
function toBackendCategory(category: string): BackendCategory {
	switch (category) {
		case "ot":
		case "chair":
		case "therapy":
			return "procedure";
		case "bed":
			return "ward";
		case "mri":
		case "ct":
		case "xray":
		case "usg":
			return "diagnostics";
		case "nadi":
		case "counselling":
			return "consultation";
		case "consultation":
		case "diagnostics":
		case "pharmacy":
		case "procedure":
		case "support":
		case "tele":
		case "ward":
			return category;
		default:
			return "support";
	}
}

function RouteComponent() {
	const [branchId] = useBranch();
	const [services, setServices] = useState<Array<Service>>([]);
	const [facilities, setFacilities] = useState<Array<Facility>>([]);
	const [serviceId, setServiceId] = useState("");
	const [facilityId, setFacilityId] = useState("");
	const [name, setName] = useState("");
	const [category, setCategory] = useState("consultation");
	const [view, setView] = useState<"list" | "map">("list");
	const [selected, setSelected] = useState<Facility | null>(null);
	const [status, setStatus] = useState<string | null>(null);

	const reload = useCallback(async () => {
		const f = (await api.facilities.list({ branchId })) as {
			items: Array<Facility>;
		};
		setFacilities(f.items);
	}, [branchId]);

	useEffect(() => {
		let live = true;
		Promise.all([
			api.services.list({ branchId }),
			api.facilities.list({ branchId }),
		])
			.then(([s, f]) => {
				if (live) {
					setServices((s as { items: Array<Service> }).items);
					setFacilities((f as { items: Array<Facility> }).items);
				}
			})
			.catch((err: unknown) => {
				if (live) setStatus(err instanceof Error ? err.message : "Load failed");
			});
		return () => {
			live = false;
		};
	}, [branchId]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.services.facilities.map({
				branchId,
				facilityId,
				serviceId,
			});
			setStatus(`Mapped ${serviceId} → ${facilityId}.`);
			setServiceId("");
			setFacilityId("");
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Mapping failed");
		}
	}

	async function onCreateFacility(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.facilities.create({
				branchId,
				category: toBackendCategory(category),
				name,
			});
			setName("");
			await reload();
			setStatus("Facility created.");
		} catch (err) {
			setStatus(
				err instanceof Error ? err.message : "Facility creation failed",
			);
		}
	}

	async function seedPreset(preset: string) {
		setStatus(null);
		try {
			await api.operations.presets.seed({
				branchId,
				preset: preset as
					| "pricelist"
					| "tests"
					| "masters"
					| "facilities"
					| "facility-mri"
					| "facility-ct"
					| "facility-xray"
					| "facility-usg"
					| "facility-therapy",
			});
			await reload();
			setStatus(`Facility preset ${preset} seeded — no code change needed.`);
		} catch (err) {
			setStatus(err instanceof Error ? err.message : "Preset seed failed");
		}
	}

	function statusColor(f: Facility): string {
		const s = f.status.toLowerCase();
		if (s.includes("occup") || s.includes("busy") || s === "blocked") {
			return "bg-red-200 text-red-900";
		}
		if (s.includes("clean") || s.includes("maint")) {
			return "bg-amber-200 text-amber-900";
		}
		return "bg-green-200 text-green-900";
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<div className="flex gap-2">
							<Button
								onClick={() => setView(view === "list" ? "map" : "list")}
								variant="outline"
							>
								{view === "list" ? "Floor-map view" : "List view"}
							</Button>
							<Button onClick={printPage} variant="outline">
								Print
							</Button>
						</div>
					}
					description="Which services run in which facility units."
					title="Facilities map"
				/>
				<BranchSelector />
				{view === "list" ? (
					<Card>
						<CardContent className="grid gap-4 pt-6 text-sm sm:grid-cols-2">
							<div>
								<p className="mb-2 font-medium">Services</p>
								<ul className="space-y-1">
									{services.map((s) => (
										<li key={s.id}>
											{s.code} · {s.name}
										</li>
									))}
									{services.length === 0 ? <li>No services.</li> : null}
								</ul>
							</div>
							<div>
								<p className="mb-2 font-medium">Facilities</p>
								<ul className="space-y-1">
									{facilities.map((f) => (
										<li key={f.id}>
											{f.name} ({f.category}) · {f.status}
										</li>
									))}
									{facilities.length === 0 ? <li>No facilities.</li> : null}
								</ul>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="pt-6">
							<p className="mb-3 text-sm text-muted-foreground">
								Floor plan — status colors, click a room to drill in.
							</p>
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
								{facilities.map((f) => (
									<button
										className={`rounded-lg border p-4 text-left ${statusColor(f)} ${selected?.id === f.id ? "ring-2 ring-primary" : ""}`}
										key={f.id}
										onClick={() => setSelected(f)}
										type="button"
									>
										<p className="truncate text-sm font-semibold">{f.name}</p>
										<p className="text-xs">{f.category}</p>
										<p className="mt-1 text-xs font-medium">{f.status}</p>
									</button>
								))}
								{facilities.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No facilities.
									</p>
								) : null}
							</div>
							{selected ? (
								<p className="mt-3 text-sm">
									{selected.name} · {selected.category} · {selected.status} · ID{" "}
									{selected.id}
								</p>
							) : null}
						</CardContent>
					</Card>
				)}
				<Card>
					<CardContent className="space-y-4 pt-6">
						<form className="flex flex-wrap gap-2" onSubmit={onCreateFacility}>
							<Input
								className="max-w-56"
								onChange={(e) => setName(e.target.value)}
								placeholder="New facility name"
								required
								value={name}
							/>
							<select
								aria-label="Facility category"
								className="h-9 rounded-md border border-border bg-background px-2 text-sm"
								onChange={(e) => setCategory(e.target.value)}
								value={category}
							>
								{[
									"consultation",
									"procedure",
									"diagnostics",
									"pharmacy",
									"ward",
									"tele",
									"support",
									"ot",
									"bed",
									"mri",
									"ct",
									"xray",
									"usg",
									"chair",
									"nadi",
									"therapy",
									"counselling",
								].map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
							<Button type="submit" variant="outline">
								Add facility
							</Button>
						</form>
						<form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
							<Input
								className="max-w-56"
								onChange={(e) => setServiceId(e.target.value)}
								placeholder="Service ID"
								required
								value={serviceId}
							/>
							<Input
								className="max-w-56"
								onChange={(e) => setFacilityId(e.target.value)}
								placeholder="Facility ID"
								required
								value={facilityId}
							/>
							<Button type="submit">Map service</Button>
						</form>
						<div className="flex flex-wrap gap-2">
							{[
								"facilities",
								"facility-mri",
								"facility-ct",
								"facility-xray",
								"facility-usg",
								"facility-therapy",
							].map((preset) => (
								<Button
									key={preset}
									onClick={() => void seedPreset(preset)}
									size="sm"
									variant="outline"
								>
									Seed {preset}
								</Button>
							))}
						</div>
						{status ? <p className="mt-3 text-sm">{status}</p> : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
