import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/admin/facilities-map")({
	component: RouteComponent,
});

const api: typeof orpc = orpc;

type Service = { code: string; id: string; name: string };
type Facility = { category: string; id: string; name: string; status: string };

function RouteComponent() {
	const [services, setServices] = useState<Array<Service>>([]);
	const [facilities, setFacilities] = useState<Array<Facility>>([]);
	const [serviceId, setServiceId] = useState("");
	const [facilityId, setFacilityId] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		let live = true;
		Promise.all([
			api.services.list({ branchId: "main" }),
			api.facilities.list({ branchId: "main" }),
		])
			.then(([s, f]) => {
				if (live) {
					setServices(s.items);
					setFacilities(f.items);
				}
			})
			.catch((err: unknown) => {
				if (live) setStatus(err instanceof Error ? err.message : "Load failed");
			});
		return () => {
			live = false;
		};
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			await api.services.mapFacilities({
				branchId: "main",
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

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<PageHeader
					actions={
						<Button onClick={() => window.print()} variant="outline">
							Print
						</Button>
					}
					description="Which services run in which facility units."
					title="Facilities map"
				/>
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
				<Card>
					<CardContent className="pt-6">
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
						{status ? <p className="mt-3 text-sm">{status}</p> : null}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
