import { IconPlus, IconUsers } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { client } from "#/lib/rpc";

export const Route = createFileRoute("/(app)/(erp)/patients/")({
	component: PatientsList,
	head: () => ({
		meta: [{ title: "Patient List (Shaun)" }],
	}),
});

function PatientsList() {
	const [search, setSearch] = useState("");
	const { data: patients, isLoading } = useQuery({
		queryFn: async () => await client.patients.list({ activeOnly: true }),
		queryKey: ["patients"],
	});

	const filteredPatients = patients?.filter(
		(p) =>
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.mrn?.toLowerCase().includes(search.toLowerCase()) ||
			p.phone?.includes(search),
	);

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Patients</h1>
					<p className="text-muted-foreground">
						Manage patient records and demographics
					</p>
				</div>
				<Link to="/patients/new">
					<Button>
						<IconPlus className="mr-2 h-4 w-4" />
						Create Patient
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Patient Records</CardTitle>
					<CardDescription>
						{filteredPatients?.length ?? 0} patients found
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<Input
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name, MRN, or phone..."
							value={search}
						/>
					</div>

					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Loading patients...
						</div>
					) : filteredPatients && filteredPatients.length > 0 ? (
						<div className="space-y-2">
							{filteredPatients.map((patient) => (
								<div
									className="flex items-center justify-between rounded-lg border p-4"
									key={patient.id}
								>
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
											<IconUsers className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium">{patient.name}</p>
											<p className="text-muted-foreground text-sm">
												MRN: {patient.mrn}
												{patient.phone ? ` | ${patient.phone}` : null}
												{patient.gender ? ` | ${patient.gender}` : null}
												{patient.birthDate
													? ` | DOB: ${patient.birthDate}`
													: null}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="py-8 text-center text-muted-foreground">
							No patients found. Click "Create Patient" to add a new patient.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
