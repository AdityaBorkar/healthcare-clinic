import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/(tenant)/(app)/old-age-home/residents")({
	component: RouteComponent,
});

interface Resident {
	id: string;
	name: string;
	status: string;
	uhid: string;
}

function RouteComponent() {
	const [residents, setResidents] = useState<Resident[]>([]);
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [phone, setPhone] = useState("");
	const [stayType, setStayType] = useState("long-stay");
	const [payerName, setPayerName] = useState("");
	const [payerPhone, setPayerPhone] = useState("");
	const [idNumber, setIdNumber] = useState("");
	const [history, setHistory] = useState("");

	const refresh = useCallback(async () => {
		try {
			setResidents(await orpc.residents.listResidents({ branchId: "main" }));
		} catch {
			setResidents([]);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	async function admit() {
		await orpc.residents.admit({
			advance: 0,
			age: Number(age) || 0,
			branchId: "main",
			history: history || undefined,
			idNumber: idNumber || undefined,
			name,
			nokName: "-",
			nokPhone: "-",
			payerName: payerName || undefined,
			payerPhone: payerPhone || undefined,
			phone,
			sex: "other",
			stayType: stayType as "long-stay" | "short-stay",
		});
		setName("");
		setAge("");
		setPhone("");
		setPayerName("");
		setPayerPhone("");
		setIdNumber("");
		setHistory("");
		await refresh();
	}

	return (
		<main className="bg-background px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<PageHeader
					description="Admit residents, track geriatric care."
					title="Old-age home residents"
				/>
				<Card className="shadow-xs">
					<CardContent className="space-y-4 py-6">
						<CardTitle className="text-base font-semibold">
							Admit resident + advance
						</CardTitle>
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="space-y-1">
								<Label>Name</Label>
								<Input onChange={(e) => setName(e.target.value)} value={name} />
							</div>
							<div className="space-y-1">
								<Label>Age</Label>
								<Input onChange={(e) => setAge(e.target.value)} value={age} />
							</div>
							<div className="space-y-1">
								<Label>Phone</Label>
								<Input
									onChange={(e) => setPhone(e.target.value)}
									value={phone}
								/>
							</div>
							<div className="space-y-1">
								<Label>Stay type</Label>
								<Input
									onChange={(e) => setStayType(e.target.value)}
									placeholder="long-stay / short-stay"
									value={stayType}
								/>
							</div>
							<div className="space-y-1">
								<Label>Payer name</Label>
								<Input
									onChange={(e) => setPayerName(e.target.value)}
									value={payerName}
								/>
							</div>
							<div className="space-y-1">
								<Label>Payer phone</Label>
								<Input
									onChange={(e) => setPayerPhone(e.target.value)}
									value={payerPhone}
								/>
							</div>
							<div className="space-y-1">
								<Label>ID number</Label>
								<Input
									onChange={(e) => setIdNumber(e.target.value)}
									value={idNumber}
								/>
							</div>
							<div className="space-y-1 sm:col-span-2">
								<Label>Medical history</Label>
								<Input
									onChange={(e) => setHistory(e.target.value)}
									value={history}
								/>
							</div>
						</div>
						<Button onClick={() => void admit()}>Admit</Button>
					</CardContent>
				</Card>
				<Card className="shadow-xs">
					<CardContent className="py-6">
						<CardTitle className="mb-3 text-base font-semibold">
							Residents ({residents.length})
						</CardTitle>
						<ul className="divide-y text-sm">
							{residents.map((r) => (
								<li className="flex justify-between py-2" key={r.id}>
									<span>
										{r.name} · {r.uhid}
									</span>
									<span className="text-muted-foreground">{r.status}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
