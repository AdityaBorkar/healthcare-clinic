import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/records/timeline")({
	component: RouteComponent,
});

function RouteComponent() {
	const [patientId, setPatientId] = useState("");
	const [items, setItems] = useState<
		Awaited<ReturnType<typeof orpc.records.timeline>>["items"]
	>([]);

	async function load() {
		const result = await orpc.records.timeline({ branchId: "main", patientId });
		setItems(result.items);
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Single patient timeline across encounters, labs, pharmacy, and billing."
					title="Records timeline"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<div className="flex gap-3">
							<div className="flex-1 space-y-1">
								<Label>Patient ID</Label>
								<Input
									onChange={(e) => setPatientId(e.target.value)}
									value={patientId}
								/>
							</div>
							<Button className="self-end" onClick={() => void load()}>
								Load timeline
							</Button>
						</div>
						<ul className="divide-y text-sm">
							{items.map((item: (typeof items)[number]) => (
								<li className="py-2" key={item.id}>
									<span className="font-medium">{item.at}</span>
									<span className="text-muted-foreground">
										{" "}
										· {item.kind} — {item.summary}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="text-base font-semibold">Privacy</CardTitle>
						<p className="text-sm text-muted-foreground">
							Psychiatry notes stay masked. Records are addendum-only — never
							edited in place.
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
